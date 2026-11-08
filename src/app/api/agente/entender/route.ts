import { iaDisponible, reescribir } from "@/lib/agente/ia";
import { superaLimite } from "@/lib/agente/limite";

// Only called when the rules did not understand a message.
export async function POST(request: Request) {
  if (!iaDisponible()) return Response.json({ error: "sin-ia" }, { status: 503 });
  if (superaLimite(request, 30)) return Response.json({ error: "limite" }, { status: 429 });
  const cuerpo = (await request.json().catch(() => null)) as { texto?: unknown } | null;
  const texto = typeof cuerpo?.texto === "string" ? cuerpo.texto.trim() : "";
  if (!texto) return Response.json({ error: "texto-vacio" }, { status: 400 });
  try {
    return Response.json({ frase: await reescribir(texto) });
  } catch (e) {
    console.error("entender", e);
    return Response.json({ error: "fallo-ia" }, { status: 502 });
  }
}
