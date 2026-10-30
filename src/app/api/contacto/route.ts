import { NextResponse } from "next/server";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import {
  TIPOS_SOLICITUD,
  construirMensajeContacto,
  nombreParaCorreo,
  type TipoSolicitud,
} from "@/components/contacto/datos";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const DESTINATARIO = "gerencia@gavicom.com";
const MAX_LEN = 2000;
// A quote from /cotizar lists every reference on its own line, so the message
// needs far more room than a name or a phone number.
const MAX_LEN_MENSAJE = 12000;

interface Solicitud {
  nombre: string;
  telefono: string;
  email: string;
  mensaje: string;
  tipo: string;
}

type ResultadoCorreo = { enviado: true } | { enviado: false; motivo: "sin-configurar" | "fallo" };

function limpiar(valor: unknown, max = MAX_LEN): string {
  return typeof valor === "string" ? valor.trim().slice(0, max) : "";
}

function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function enviarCorreo({ nombre, telefono, email, mensaje, tipo }: Solicitud): Promise<ResultadoCorreo> {
  const apiKey = process.env.BREVO_API_KEY;
  const remitente = process.env.BREVO_SENDER;

  // Without credentials the lead cannot be emailed, but the request must not
  // fail: the visitor is still handed over to WhatsApp.
  if (!apiKey || !remitente) {
    console.warn("[contacto] BREVO_API_KEY o BREVO_SENDER sin configurar");
    return { enviado: false, motivo: "sin-configurar" };
  }

  const filas = [
    ["Nombre / Empresa", nombre],
    ["Teléfono", telefono],
    ["Correo", email],
    ["Departamento", tipo],
    ["Requerimiento", mensaje],
  ]
    .filter(([, valor]) => valor)
    .map(
      ([etiqueta, valor]) =>
        `<tr><td style="padding:6px 12px;font-weight:bold">${etiqueta}</td><td style="padding:6px 12px;white-space:pre-wrap">${escaparHtml(valor)}</td></tr>`
    )
    .join("");

  try {
    const respuesta = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Web GAVICOM", email: remitente },
        to: [{ email: DESTINATARIO }],
        replyTo: email ? { email } : undefined,
        subject: `${tipo === "Cotización" ? "Nueva cotización" : "Nueva solicitud"} desde la web${nombre ? ` — ${nombre}` : ""}`,
        htmlContent: `<h2>Solicitud recibida desde gavicomferroviario.com</h2><table>${filas}</table>`,
      }),
    });

    if (!respuesta.ok) {
      console.error("[contacto] Brevo respondió", respuesta.status);
      return { enviado: false, motivo: "fallo" };
    }
    return { enviado: true };
  } catch (error) {
    console.error("[contacto] fallo al enviar", error);
    return { enviado: false, motivo: "fallo" };
  }
}

// The contact form posts here natively when its JavaScript has not loaded yet.
// Without a method the browser would have sent a GET and put the visitor's name,
// phone and email in the URL; this path keeps the same outcome as the scripted
// form: an email copy when possible, then WhatsApp with the message filled in.
async function atenderFormulario(request: Request) {
  const formulario = await request.formData();
  const campo = (clave: string, max = MAX_LEN) => limpiar(formulario.get(clave), max);

  // Ley 1581: without the visitor's authorisation the data is not processed.
  if (!formulario.get("autoriza")) {
    return NextResponse.redirect(new URL("/contacto#formulario", request.url), 303);
  }

  const claveTipo = campo("tipo");
  const tipo: TipoSolicitud = claveTipo in TIPOS_SOLICITUD ? (claveTipo as TipoSolicitud) : "SUMINISTROS";
  const datos = {
    nombre: campo("nombre"),
    empresa: campo("empresa"),
    telefono: campo("telefono"),
    correo: campo("correo"),
    mensaje: campo("mensaje", MAX_LEN_MENSAJE),
  };

  await enviarCorreo({
    nombre: nombreParaCorreo(datos),
    telefono: datos.telefono,
    email: datos.correo,
    mensaje: datos.mensaje,
    tipo: TIPOS_SOLICITUD[tipo].titulo,
  });

  return NextResponse.redirect(construirUrlWhatsApp(construirMensajeContacto(tipo, datos)), 303);
}

export async function POST(request: Request) {
  const tipoContenido = request.headers.get("content-type") ?? "";
  if (tipoContenido.includes("application/x-www-form-urlencoded") || tipoContenido.includes("multipart/form-data")) {
    return atenderFormulario(request);
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const datos = cuerpo as Record<string, unknown>;
  const solicitud: Solicitud = {
    nombre: limpiar(datos.nombre),
    telefono: limpiar(datos.telefono),
    email: limpiar(datos.email),
    mensaje: limpiar(datos.mensaje, MAX_LEN_MENSAJE),
    tipo: limpiar(datos.tipo),
  };

  if (!solicitud.nombre && !solicitud.telefono && !solicitud.email && !solicitud.mensaje) {
    return NextResponse.json({ error: "Solicitud vacía" }, { status: 400 });
  }

  const resultado = await enviarCorreo(solicitud);
  if (resultado.enviado) return NextResponse.json({ enviado: true });
  if (resultado.motivo === "sin-configurar") return NextResponse.json({ enviado: false, motivo: "sin-configurar" });
  return NextResponse.json({ enviado: false }, { status: 502 });
}
