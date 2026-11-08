import { iaDisponible } from "@/lib/agente/ia";

// What is connected, so the simulator says it plainly instead of faking it.
export async function GET() {
  return Response.json({
    ia: iaDisponible(),
    whatsapp: Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
  });
}
