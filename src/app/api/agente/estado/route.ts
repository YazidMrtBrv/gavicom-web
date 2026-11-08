import { iaDisponible } from "@/lib/agente/ia";

// What is connected, so the simulator says it plainly instead of faking it.
export async function GET() {
  return Response.json({
    ia: iaDisponible(),
    correo: Boolean(process.env.CORREO_IMAP_HOST && process.env.CORREO_USUARIO),
  });
}
