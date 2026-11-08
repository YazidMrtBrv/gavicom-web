import { after } from "next/server";
import { iaDisponible, identificarPieza, reescribir, type MediaImagen } from "@/lib/agente/ia";
import { aprobar, deCliente, deGeimar, nuevaConversacion, referenciasIdentificadas, type Conversacion, type Contexto, type Resultado } from "@/lib/agente/motor";
import { generarPdf, RUTAS_RECURSOS, type Recursos } from "@/lib/agente/pdf";
import { descargarMedia, enviarPdf, enviarTexto, firmaValida, leerEntrantes, type Entrante } from "@/lib/agente/whatsapp-cloud";
import type { Salida } from "@/lib/agente/tipos";

// WhatsApp Cloud API webhook. Inactive until the WHATSAPP_* variables exist
// in Vercel (see src/lib/agente/whatsapp-cloud.ts).
//
// BEFORE GOING LIVE: conversations below live in this server instance's
// memory, which Vercel recycles. They must move to a database table
// (Supabase, like MINACONTROL) so a quote survives between messages. That
// table is a decision for Yazid, so it is not created here.
const conversaciones = new Map<string, Conversacion>();
let consecutivo = 1000;

function contexto(): Contexto {
  return { ahora: new Date(), numeroCotizacion: () => `C-${++consecutivo}`, ejemplo: false };
}

const soloDigitos = (s: string) => s.replace(/\D/g, "");

// Meta calls GET once when the webhook is subscribed.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const esperado = process.env.WHATSAPP_VERIFY_TOKEN;
  if (esperado && url.searchParams.get("hub.mode") === "subscribe" && url.searchParams.get("hub.verify_token") === esperado) {
    return new Response(url.searchParams.get("hub.challenge") ?? "", { status: 200 });
  }
  return new Response("No autorizado", { status: 403 });
}

async function recursos(origen: string): Promise<Recursos> {
  const leer = async (ruta: string) => (await fetch(new URL(ruta, origen))).arrayBuffer();
  const [poppins, montserrat, montserratSemi, logoBlanco] = await Promise.all([
    leer(RUTAS_RECURSOS.poppins),
    leer(RUTAS_RECURSOS.montserrat),
    leer(RUTAS_RECURSOS.montserratSemi),
    leer(RUTAS_RECURSOS.logoBlanco),
  ]);
  return { poppins, montserrat, montserratSemi, logoBlanco };
}

async function entregar(salidas: Salida[], cliente: string, conv: Conversacion, origen: string) {
  const gerencia = soloDigitos(process.env.WHATSAPP_GERENCIA ?? "");
  for (const s of salidas) {
    const para = s.para === "geimar" ? gerencia : cliente;
    if (!para) continue;
    const m = s.mensaje;
    if (m.tipo === "documento" && conv.cotizacion) {
      const pdf = await generarPdf(conv.cotizacion, await recursos(origen));
      await enviarPdf(para, pdf, `Cotizacion-${conv.cotizacion.numero}-GAVICOM.pdf`, m.texto);
    } else {
      await enviarTexto(para, m.texto, "botones" in m ? m.botones : undefined);
    }
  }
}

async function atender(e: Entrante, origen: string) {
  const gerencia = soloDigitos(process.env.WHATSAPP_GERENCIA ?? "");

  // Geimar answering prices or approving: applies to the oldest quote waiting on him.
  if (gerencia && e.de === gerencia) {
    const [cliente, conv] = [...conversaciones.entries()].find(([, c]) => c.cotizacion && ["esperando-precios", "por-aprobar"].includes(c.cotizacion.estado)) ?? [];
    if (!cliente || !conv) return enviarTexto(gerencia, "No tengo cotizaciones esperando precios ahora mismo.");
    const r: Resultado = /aprobar/i.test(e.texto ?? "") ? aprobar(conv, contexto()) : deGeimar(conv, e.texto ?? "");
    conversaciones.set(cliente, r.conversacion);
    return entregar(r.salidas, cliente, r.conversacion, origen);
  }

  const previa = conversaciones.get(e.de) ?? nuevaConversacion({ telefono: e.de, nombre: "", empresa: "", ciudad: "", compras: [], ejemplo: false });
  let r: Resultado;
  if (e.tipo === "imagen" && e.mediaId && iaDisponible()) {
    const { bytes, tipo } = await descargarMedia(e.mediaId);
    const { skus } = await identificarPieza(Buffer.from(bytes).toString("base64"), (tipo || "image/jpeg") as MediaImagen);
    r = referenciasIdentificadas(previa, skus, "La pieza de la foto");
  } else if (e.tipo === "audio") {
    // Voice notes need a speech-to-text service; still to be chosen.
    r = { conversacion: previa, salidas: [{ para: "cliente", mensaje: { tipo: "texto", texto: "Por ahora no puedo escuchar notas de voz. ¿Me lo escribes o me mandas una foto de la pieza?" } }] };
  } else {
    r = deCliente(previa, e.texto ?? "", contexto());
    // Rules did not understand: ask the model to rewrite the message, then retry.
    const noEntendio = r.salidas.some((s) => s.mensaje.texto.startsWith("No te entendí"));
    if (noEntendio && e.texto && iaDisponible()) {
      const frase = await reescribir(e.texto).catch(() => null);
      if (frase) r = deCliente(previa, frase, contexto());
    }
  }
  conversaciones.set(e.de, r.conversacion);
  await entregar(r.salidas, e.de, r.conversacion, origen);
}

export async function POST(request: Request) {
  const cuerpo = await request.text();
  const secreto = process.env.WHATSAPP_APP_SECRET ?? "";
  if (!(await firmaValida(cuerpo, request.headers.get("x-hub-signature-256"), secreto))) {
    return new Response("Firma inválida", { status: 401 });
  }
  const entrantes = leerEntrantes(JSON.parse(cuerpo));
  const origen = new URL(request.url).origin;
  // Meta wants a 200 fast; the answers go out after the response.
  after(async () => {
    for (const e of entrantes) {
      try {
        await atender(e, origen);
      } catch (err) {
        console.error("whatsapp", err);
      }
    }
  });
  return new Response("ok", { status: 200 });
}
