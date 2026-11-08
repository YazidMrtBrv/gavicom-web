import { iaDisponible } from "@/lib/agente/ia";
import { credencialesDelEntorno } from "@/lib/agente/microsoft";

// What is connected, so the demo says it plainly instead of faking it.
export async function GET() {
  return Response.json({ ia: iaDisponible(), correo: Boolean(credencialesDelEntorno()) });
}
