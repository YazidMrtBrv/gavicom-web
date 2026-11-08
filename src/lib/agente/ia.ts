import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { CATALOGO, catalogoParaIA } from "./catalogo.ts";

// The two jobs that need a model: reading a photo of a piece, and turning a
// messy message into a plain one the engine (motor.ts) understands. The
// model never answers the client and never sees a price: it only returns
// catalogue codes or a rewritten sentence, and code checks both.
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
const SISTEMA_FOTO = `Eres el ojo técnico de GAVICOM, proveedor ferroviario en Barranquilla. Te mandan la foto de una pieza de vía férrea por WhatsApp. Di qué referencias del catálogo pueden ser, de la más probable a la menos, solo con códigos de esta lista. Si la foto no muestra una pieza ferroviaria o no se reconoce, devuelve la lista vacía. No inventes códigos ni precios.

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

const SISTEMA_TEXTO = `Reescribes mensajes de clientes de un proveedor ferroviario colombiano (GAVICOM) para que un sistema de reglas los entienda. Devuelve UNA frase corta en español con el vocabulario de abajo, conservando cifras, unidades y nombres. No respondas al cliente, no inventes datos, no pongas precios.

Vocabulario que el sistema entiende:
- Pedido por longitud: "necesito material para 300 metros de vía, riel de 115 lb, durmiente de concreto"
- Piezas: eclisas, pernos, clips, tirafondos, clavos, placa de asiento, anclas, almohadillas, garlanchín, pala de drenaje, troley, disco de corte, saca clip
- Fallas: "polvillo blanco" (bombeo), "durmientes bailando" (efecto hamaca), "eclisa rota", "se salen los clips", "tirafondo flojo"
- Respuestas: "sí", "no", "la apruebo", "no por ahora", "precio", "tiempo de entrega", "ya le compré a otro proveedor", "proyecto aplazado"
- Saludo: "hola"`;

const RespuestaTexto = z.object({ frase: z.string() });

export async function reescribir(texto: string): Promise<string | null> {
  const res = await claude().beta.messages.parse({
    model: MODELO,
    max_tokens: 1000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low", format: betaZodOutputFormat(RespuestaTexto) },
    system: [{ type: "text", text: SISTEMA_TEXTO, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: texto.slice(0, 2000) }],
  });
  if (res.stop_reason === "refusal") return null;
  return res.parsed_output?.frase ?? null;
}
