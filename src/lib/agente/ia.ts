import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { CATALOGO, catalogoParaIA } from "./catalogo.ts";

// The two jobs that need a model: reading a photo of a piece attached to an
// email, and reading request emails the rules could not (solicitud.ts). The
// model never writes to the client and never sees a price: it only returns
// catalogue codes and quantities, and code checks every code.
//
// Server only. Needs ANTHROPIC_API_KEY in Vercel; without it, iaDisponible()
// is false and the app says so instead of pretending.

const MODELO = "claude-opus-5-5";

export function iaDisponible(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let cliente: Anthropic | null = null;
function claude(): Anthropic {
  cliente ??= new Anthropic();
  return cliente;
}

// Stable prefix (catalogue) first, so repeated calls reuse the prompt cache.
const SISTEMA_FOTO = `Eres el ojo técnico de GAVICOM, proveedor ferroviario en Barranquilla. Un cliente adjuntó la foto de una pieza de vía férrea a un correo. Di qué referencias del catálogo pueden ser, de la más probable a la menos, solo con códigos de esta lista. Si la foto no muestra una pieza ferroviaria o no se reconoce, devuelve la lista vacía. No inventes códigos ni precios.

Catálogo (código | nombre | línea | especificación):
${catalogoParaIA()}`;

const RespuestaFoto = z.object({
  skus: z.array(z.string()).describe("Códigos del catálogo, máximo 3, del más probable al menos probable"),
  pieza: z.string().describe("Qué se ve en la foto, en pocas palabras y en español"),
});

export type MediaImagen = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

export async function identificarPieza(base64: string, tipo: MediaImagen): Promise<{ skus: string[]; pieza: string }> {
  const res = await claude().beta.messages.parse({
    model: MODELO,
    max_tokens: 2000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low", format: betaZodOutputFormat(RespuestaFoto) },
    system: [{ type: "text", text: SISTEMA_FOTO, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: tipo, data: base64 } },
          { type: "text", text: "¿Qué pieza es?" },
        ],
      },
    ],
  });
  if (res.stop_reason === "refusal" || !res.parsed_output) return { skus: [], pieza: "" };
  const validos = new Set(CATALOGO.map((p) => p.sku));
  return { skus: res.parsed_output.skus.filter((s) => validos.has(s)).slice(0, 3), pieza: res.parsed_output.pieza };
}

// For request emails the rules could not read (free prose, odd layouts, the
// text of an attached PDF): the model lists what is asked, only with real
// catalogue codes; code then validates every code before using it.
const SISTEMA_CORREO = `Lees solicitudes de cotización que recibe GAVICOM, proveedor ferroviario colombiano. Devuelve los ítems que el cliente pide, cada uno con el código del catálogo que corresponde (solo de la lista) y la cantidad si el correo la dice. Si un ítem no está en el catálogo, déjalo con código vacío. No inventes cantidades ni precios.

Catálogo (código | nombre | línea | especificación):
${catalogoParaIA()}`;

const RespuestaCorreo = z.object({
  items: z.array(
    z.object({
      texto: z.string().describe("Cómo lo escribió el cliente"),
      sku: z.string().describe("Código del catálogo, o vacío si no está"),
      cantidad: z.number().nullable(),
    }),
  ),
});

export async function leerItemsConIA(texto: string): Promise<{ texto: string; sku: string | null; cantidad: number | null }[]> {
  const res = await claude().beta.messages.parse({
    model: MODELO,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low", format: betaZodOutputFormat(RespuestaCorreo) },
    system: [{ type: "text", text: SISTEMA_CORREO, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: texto.slice(0, 20_000) }],
  });
  if (res.stop_reason === "refusal" || !res.parsed_output) return [];
  const validos = new Set(CATALOGO.map((p) => p.sku));
  return res.parsed_output.items.map((i) => ({ texto: i.texto, sku: validos.has(i.sku) ? i.sku : null, cantidad: i.cantidad && i.cantidad > 0 ? i.cantidad : null }));
}
