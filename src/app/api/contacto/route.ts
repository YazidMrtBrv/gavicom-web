import { NextResponse } from "next/server";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const DESTINATARIO = "gerencia@gavicom.com";
const MAX_LEN = 2000;

function limpiar(valor: unknown): string {
  return typeof valor === "string" ? valor.trim().slice(0, MAX_LEN) : "";
}

function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const apiKey = process.env.BREVO_API_KEY;
  const remitente = process.env.BREVO_SENDER;

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const datos = cuerpo as Record<string, unknown>;
  const nombre = limpiar(datos.nombre);
  const telefono = limpiar(datos.telefono);
  const email = limpiar(datos.email);
  const mensaje = limpiar(datos.mensaje);
  const tipo = limpiar(datos.tipo);

  if (!nombre && !telefono && !email && !mensaje) {
    return NextResponse.json({ error: "Solicitud vacía" }, { status: 400 });
  }

  // Without credentials the lead cannot be emailed, but the form must not fail:
  // the browser still hands the visitor over to WhatsApp.
  if (!apiKey || !remitente) {
    console.warn("[contacto] BREVO_API_KEY o BREVO_SENDER sin configurar");
    return NextResponse.json({ enviado: false, motivo: "sin-configurar" });
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
        `<tr><td style="padding:6px 12px;font-weight:bold">${etiqueta}</td><td style="padding:6px 12px">${escaparHtml(valor)}</td></tr>`
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
        subject: `Nueva solicitud desde la web${nombre ? ` — ${nombre}` : ""}`,
        htmlContent: `<h2>Solicitud recibida desde gavicomferroviario.com</h2><table>${filas}</table>`,
      }),
    });

    if (!respuesta.ok) {
      console.error("[contacto] Brevo respondió", respuesta.status);
      return NextResponse.json({ enviado: false }, { status: 502 });
    }

    return NextResponse.json({ enviado: true });
  } catch (error) {
    console.error("[contacto] fallo al enviar", error);
    return NextResponse.json({ enviado: false }, { status: 502 });
  }
}
