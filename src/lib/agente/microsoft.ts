import type { Borrador, Correo } from "./tipos.ts";

// GAVICOM's mail is on Microsoft 365, so the agent reaches gerencia@ through
// Microsoft Graph. It only READS the inbox and CREATES DRAFTS: the app is
// registered without Mail.Send, so it cannot send even by mistake.
//
// Setup (Yazid / GAVICOM's Microsoft 365 admin, never in the repo or chat):
//   1. Entra ID → App registration "Agente GAVICOM", with a client secret.
//   2. Grant Mail.ReadWrite to the app ONLY for gerencia@ through Exchange
//      Online "RBAC for Applications" (management scope on that mailbox), the
//      model Microsoft recommends instead of Application Access Policies.
//   3. Vercel variables: MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET,
//      MS_BUZON (gerencia@gavicom.com) and CRON_SECRET for the daily job.

const GRAPH = "https://graph.microsoft.com/v1.0";
// Outlook category the agent puts on every email it already read.
export const CATEGORIA = "Agente GAVICOM";

type Json = Record<string, unknown>;
export type Pedir = (url: string, init: RequestInit) => Promise<Response>;

export interface Credenciales {
  tenant: string;
  cliente: string;
  secreto: string;
  buzon: string;
}

export function credencialesDelEntorno(): Credenciales | null {
  const { MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET, MS_BUZON } = process.env;
  if (!MS_TENANT_ID || !MS_CLIENT_ID || !MS_CLIENT_SECRET || !MS_BUZON) return null;
  return { tenant: MS_TENANT_ID, cliente: MS_CLIENT_ID, secreto: MS_CLIENT_SECRET, buzon: MS_BUZON };
}

// ---- Pure pieces (tested without network) -------------------------------

// A Graph message (asked with Prefer: outlook.body-content-type="text") as
// the agent's Correo.
export function aCorreo(m: Json, buzon: string): Correo {
  const de = ((m.from as Json)?.emailAddress ?? {}) as Json;
  return {
    id: String(m.id),
    de: { nombre: String(de.name ?? de.address ?? ""), correo: String(de.address ?? "") },
    para: { nombre: "GAVICOM", correo: buzon },
    asunto: String(m.subject ?? ""),
    fecha: String(m.receivedDateTime ?? new Date().toISOString()),
    cuerpo: String((m.body as Json)?.content ?? "").replace(/\r\n/g, "\n").trim(),
    adjuntos: [],
    enRespuestaA: undefined,
    ejemplo: false,
  };
}

// Inbox messages from the last `dias` the agent has not read yet.
export function urlNuevos(buzon: string, desde: Date): string {
  const filtro = `receivedDateTime ge ${desde.toISOString()}`;
  const campos = "id,subject,from,receivedDateTime,body,categories,hasAttachments,conversationId";
  return `${GRAPH}/users/${encodeURIComponent(buzon)}/mailFolders/inbox/messages?$filter=${encodeURIComponent(filtro)}&$select=${campos}&$top=50`;
}

export function adjuntoPdf(nombre: string, pdf: Uint8Array): Json {
  let binario = "";
  for (let i = 0; i < pdf.length; i += 0x8000) binario += String.fromCharCode(...pdf.subarray(i, i + 0x8000));
  return { "@odata.type": "#microsoft.graph.fileAttachment", name: nombre, contentType: "application/pdf", contentBytes: btoa(binario) };
}

// ---- Graph calls ----------------------------------------------------------

export class Buzon {
  private token: { valor: string; vence: number } | null = null;
  private c: Credenciales;
  private pedir: Pedir;

  // Plain fields, not parameter properties: Node runs this file directly in tests.
  constructor(c: Credenciales, pedir: Pedir = (url, init) => fetch(url, init)) {
    this.c = c;
    this.pedir = pedir;
  }

  private async acceso(): Promise<string> {
    if (this.token && this.token.vence > Date.now() + 60_000) return this.token.valor;
    const res = await this.pedir(`https://login.microsoftonline.com/${this.c.tenant}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: this.c.cliente, client_secret: this.c.secreto, scope: "https://graph.microsoft.com/.default", grant_type: "client_credentials" }).toString(),
    });
    const j = (await res.json()) as Json;
    if (!res.ok) throw new Error(`Microsoft no dio acceso (${res.status}): ${j.error_description ?? j.error ?? ""}`);
    this.token = { valor: String(j.access_token), vence: Date.now() + Number(j.expires_in ?? 3600) * 1000 };
    return this.token.valor;
  }

  private async graph(url: string, init: RequestInit = {}): Promise<Json> {
    const res = await this.pedir(url.startsWith("http") ? url : `${GRAPH}${url}`, {
      ...init,
      headers: { Authorization: `Bearer ${await this.acceso()}`, "Content-Type": "application/json", Prefer: 'outlook.body-content-type="text"', ...(init.headers ?? {}) },
    });
    if (res.status === 204) return {};
    const j = (await res.json().catch(() => ({}))) as Json;
    if (!res.ok) throw new Error(`Microsoft Graph respondió ${res.status}: ${JSON.stringify(j.error ?? j)}`);
    return j;
  }

  private get usuario(): string {
    return `/users/${encodeURIComponent(this.c.buzon)}`;
  }

  // Emails the agent has not tagged yet.
  async nuevos(desde: Date): Promise<Correo[]> {
    const j = await this.graph(urlNuevos(this.c.buzon, desde));
    return ((j.value as Json[]) ?? []).filter((m) => !((m.categories as string[]) ?? []).includes(CATEGORIA)).map((m) => aCorreo(m, this.c.buzon));
  }

  async marcar(id: string, categorias: string[] = []): Promise<void> {
    await this.graph(`${this.usuario}/messages/${id}`, { method: "PATCH", body: JSON.stringify({ categories: [CATEGORIA, ...categorias] }) });
  }

  // Draft that answers a received email (stays in the thread, with the quote
  // below). Returns the draft's id.
  async borradorRespuesta(b: Borrador, pdf?: { nombre: string; bytes: Uint8Array }): Promise<string> {
    if (!b.enRespuestaA) throw new Error("El borrador no responde a ningún correo.");
    const d = await this.graph(`${this.usuario}/messages/${b.enRespuestaA}/createReply`, { method: "POST", body: JSON.stringify({ comment: b.cuerpo }) });
    if (pdf) await this.graph(`${this.usuario}/messages/${d.id}/attachments`, { method: "POST", body: JSON.stringify(adjuntoPdf(pdf.nombre, pdf.bytes)) });
    return String(d.id);
  }

  // New draft (follow-up, reorder) in the Drafts folder. Returns its id.
  async borradorNuevo(b: Borrador, pdf?: { nombre: string; bytes: Uint8Array }): Promise<string> {
    const d = await this.graph(`${this.usuario}/messages`, {
      method: "POST",
      body: JSON.stringify({
        subject: b.asunto,
        body: { contentType: "Text", content: b.cuerpo },
        toRecipients: [{ emailAddress: { name: b.para.nombre, address: b.para.correo } }],
        ...(pdf ? { attachments: [adjuntoPdf(pdf.nombre, pdf.bytes)] } : {}),
      }),
    });
    return String(d.id);
  }
}
