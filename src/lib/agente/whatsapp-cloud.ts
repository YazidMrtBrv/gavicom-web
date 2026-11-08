// Thin adapter to Meta's WhatsApp Cloud API: read what arrives at the
// webhook, check it really comes from Meta, and send messages back. No
// business logic here: motor.ts decides what to say.
//
// Needs, in Vercel's environment variables (never in the repo or the chat):
//   WHATSAPP_TOKEN            permanent token of a System User in Meta Business
//   WHATSAPP_PHONE_NUMBER_ID  id of GAVICOM's number in the WhatsApp app
//   WHATSAPP_APP_SECRET       to verify that each webhook call comes from Meta
//   WHATSAPP_VERIFY_TOKEN     any long random text, typed in Meta when subscribing
//   WHATSAPP_GERENCIA         Geimar's own number (gets prices and approvals)

const VERSION = process.env.WHATSAPP_GRAPH_VERSION ?? "v23.0";

export interface Entrante {
  de: string;
  id: string;
  nombre?: string;
  tipo: "texto" | "imagen" | "audio" | "otro";
  texto?: string;
  mediaId?: string;
}

type Json = Record<string, unknown>;

// Meta signs each call with HMAC-SHA256 of the raw body using the app secret.
export async function firmaValida(cuerpo: string, firma: string | null, secreto: string): Promise<boolean> {
  if (!firma?.startsWith("sha256=") || !secreto) return false;
  const clave = await crypto.subtle.importKey("raw", new TextEncoder().encode(secreto), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", clave, new TextEncoder().encode(cuerpo)));
  const esperado = [...mac].map((b) => b.toString(16).padStart(2, "0")).join("");
  const recibido = firma.slice(7);
  if (recibido.length !== esperado.length) return false;
  let diferencia = 0;
  for (let i = 0; i < esperado.length; i++) diferencia |= esperado.charCodeAt(i) ^ recibido.charCodeAt(i);
  return diferencia === 0;
}

export function leerEntrantes(payload: Json): Entrante[] {
  const salida: Entrante[] = [];
  for (const entry of (payload.entry as Json[]) ?? []) {
    for (const change of (entry.changes as Json[]) ?? []) {
      const value = (change.value ?? {}) as Json;
      const contactos = (value.contacts as Json[]) ?? [];
      for (const m of (value.messages as Json[]) ?? []) {
        const de = String(m.from);
        const nombre = (contactos.find((c) => c.wa_id === de)?.profile as Json | undefined)?.name as string | undefined;
        const base = { de, id: String(m.id), nombre };
        if (m.type === "text") salida.push({ ...base, tipo: "texto", texto: (m.text as Json).body as string });
        else if (m.type === "interactive") {
          const i = m.interactive as Json;
          const r = (i.button_reply ?? i.list_reply) as Json | undefined;
          salida.push({ ...base, tipo: "texto", texto: r?.title as string });
        } else if (m.type === "button") salida.push({ ...base, tipo: "texto", texto: (m.button as Json).text as string });
        else if (m.type === "image") salida.push({ ...base, tipo: "imagen", mediaId: (m.image as Json).id as string, texto: (m.image as Json).caption as string | undefined });
        else if (m.type === "audio") salida.push({ ...base, tipo: "audio", mediaId: (m.audio as Json).id as string });
        else salida.push({ ...base, tipo: "otro" });
      }
    }
  }
  return salida;
}

function credenciales() {
  const token = process.env.WHATSAPP_TOKEN;
  const telefono = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !telefono) throw new Error("WhatsApp no está conectado: faltan WHATSAPP_TOKEN y WHATSAPP_PHONE_NUMBER_ID.");
  return { token, telefono };
}

async function graph(ruta: string, init: RequestInit): Promise<Json> {
  const { token } = credenciales();
  const res = await fetch(`https://graph.facebook.com/${VERSION}/${ruta}`, { ...init, headers: { Authorization: `Bearer ${token}`, ...(init.headers ?? {}) } });
  const json = (await res.json().catch(() => ({}))) as Json;
  if (!res.ok) throw new Error(`WhatsApp respondió ${res.status}: ${JSON.stringify(json.error ?? json)}`);
  return json;
}

function enviar(para: string, cuerpo: Json) {
  const { telefono } = credenciales();
  return graph(`${telefono}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: para, ...cuerpo }),
  });
}

export function enviarTexto(para: string, texto: string, botones?: string[]) {
  if (!botones?.length) return enviar(para, { type: "text", text: { body: texto, preview_url: false } });
  // WhatsApp allows up to 3 reply buttons of 20 characters each.
  return enviar(para, {
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: texto.slice(0, 1024) },
      action: { buttons: botones.slice(0, 3).map((b, i) => ({ type: "reply", reply: { id: `b${i}`, title: b.slice(0, 20) } })) },
    },
  });
}

export function enviarPlantilla(para: string, nombre: string, variables: string[]) {
  return enviar(para, {
    type: "template",
    template: { name: nombre, language: { code: "es" }, components: [{ type: "body", parameters: variables.map((text) => ({ type: "text", text })) }] },
  });
}

export async function enviarPdf(para: string, pdf: Uint8Array, archivo: string, texto: string) {
  const { telefono } = credenciales();
  const form = new FormData();
  form.append("messaging_product", "whatsapp");
  form.append("type", "application/pdf");
  form.append("file", new Blob([pdf as BlobPart], { type: "application/pdf" }), archivo);
  const subido = await graph(`${telefono}/media`, { method: "POST", body: form });
  return enviar(para, { type: "document", document: { id: subido.id, filename: archivo, caption: texto } });
}

// Downloads a photo or voice note the client sent (two steps: URL, then bytes).
export async function descargarMedia(mediaId: string): Promise<{ bytes: ArrayBuffer; tipo: string }> {
  const { token } = credenciales();
  const meta = await graph(mediaId, { method: "GET" });
  const res = await fetch(String(meta.url), { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`No se pudo descargar el archivo (${res.status}).`);
  return { bytes: await res.arrayBuffer(), tipo: String(meta.mime_type ?? res.headers.get("content-type") ?? "") };
}
