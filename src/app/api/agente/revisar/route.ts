import { procesarCorreo } from "@/lib/agente/bandeja";
import { nombreDe } from "@/lib/agente/catalogo";
import { iaDisponible, leerItemsConIA } from "@/lib/agente/ia";
import { Buzon, credencialesDelEntorno } from "@/lib/agente/microsoft";
import { esSolicitud } from "@/lib/agente/solicitud";

// Scheduled job: reads gerencia@'s new emails on Microsoft 365, tags the
// quote requests in Outlook and leaves a draft asking for whatever a request
// leaves open. It never sends. Inactive until the MS_* variables and
// CRON_SECRET exist in Vercel.
//
// Quotes waiting for Geimar's prices need somewhere to live between runs (a
// Supabase table, Yazid's call); until then this job only does the steps
// that need no prices.
export async function GET(request: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || request.headers.get("authorization") !== `Bearer ${secreto}`) return new Response("No autorizado", { status: 401 });
  const credenciales = credencialesDelEntorno();
  if (!credenciales) return Response.json({ error: "El buzón de Microsoft no está conectado." }, { status: 503 });

  const buzon = new Buzon(credenciales);
  const desde = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const ctx = { ahora: new Date(), numeroCotizacion: () => "", ejemplo: false };
  const resumen = { leidos: 0, solicitudes: 0, borradores: 0, errores: 0 };

  for (const correo of await buzon.nuevos(desde)) {
    resumen.leidos++;
    if (!esSolicitud(correo)) continue;
    try {
      let p = procesarCorreo(correo, [], ctx);
      // Rules found nothing: the model reads it (only catalogue codes come back).
      if (!p.solicitud.items.length && !p.solicitud.pedidoPorMetros && iaDisponible()) {
        const items = await leerItemsConIA(`${correo.asunto}\n\n${correo.cuerpo}`);
        const lista = items.map((i) => `${i.sku ? nombreDe(i.sku) : i.texto}${i.cantidad ? `: ${i.cantidad} und` : ""}`).join("\n");
        if (lista) p = procesarCorreo({ ...correo, cuerpo: `${correo.cuerpo}\n\n${lista}` }, [], ctx);
      }
      for (const b of p.borradores) {
        await buzon.borradorRespuesta({ ...b, enRespuestaA: correo.id });
        resumen.borradores++;
      }
      await buzon.marcar(correo.id, [p.solicitud.faltantes.length ? "Cotización: faltan datos" : "Cotización: por precios"]);
      resumen.solicitudes++;
    } catch (e) {
      resumen.errores++;
      console.error("revisar", correo.id, e);
    }
  }
  return Response.json(resumen);
}
