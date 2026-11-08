import { iaDisponible, identificarPieza, type MediaImagen } from "@/lib/agente/ia";
import { superaLimite } from "@/lib/agente/limite";

const TIPOS: MediaImagen[] = ["image/jpeg", "image/png", "image/webp", "image/gif"];
// About 4 MB of image once decoded; WhatsApp photos are well under it.
const MAX_BASE64 = 5_500_000;

export async function POST(request: Request) {
  if (!iaDisponible()) return Response.json({ error: "sin-ia" }, { status: 503 });
  if (superaLimite(request, 12)) return Response.json({ error: "limite" }, { status: 429 });
  const cuerpo = (await request.json().catch(() => null)) as { imagen?: unknown; tipo?: unknown } | null;
  const imagen = typeof cuerpo?.imagen === "string" ? cuerpo.imagen : "";
  const tipo = TIPOS.find((t) => t === cuerpo?.tipo);
  if (!imagen || !tipo || imagen.length > MAX_BASE64) return Response.json({ error: "imagen-invalida" }, { status: 400 });
  try {
    return Response.json(await identificarPieza(imagen, tipo));
  } catch (e) {
    console.error("foto", e);
    return Response.json({ error: "fallo-ia" }, { status: 502 });
  }
}
