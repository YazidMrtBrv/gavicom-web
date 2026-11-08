import { iaDisponible, leerItemsConIA } from "@/lib/agente/ia";
import { superaLimite } from "@/lib/agente/limite";

// Only called when the rules found no items in a request email.
export async function POST(request: Request) {
  if (!iaDisponible()) return Response.json({ error: "sin-ia" }, { status: 503 });
  if (superaLimite(request, 20)) return Response.json({ error: "limite" }, { status: 429 });
  const cuerpo = (await request.json().catch(() => null)) as { texto?: unknown } | null;
  const texto = typeof cuerpo?.texto === "string" ? cuerpo.texto.trim() : "";
  if (!texto) return Response.json({ error: "texto-vacio" }, { status: 400 });
  try {
    return Response.json({ items: await leerItemsConIA(texto) });
  } catch (e) {
    console.error("leer", e);
    return Response.json({ error: "fallo-ia" }, { status: 502 });
  }
}
