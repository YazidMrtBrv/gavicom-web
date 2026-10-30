"use client";

import { cn } from "@/lib/cn";
import Boton from "@/components/ui/Boton";
import { useCotizacion } from "@/components/cotizacion/CotizacionProvider";

/*
 * Cierra la sección de servicios con el estado real de la lista del visitante.
 * Mientras no hidrata (servidor) muestra la frase genérica, que también es
 * cierta con la lista llena.
 */
export default function ResumenCotizacionEnergy({ className }: { className?: string }) {
  const { items, hidratado } = useCotizacion();
  const deEnergy = items.filter((item) => item.linea === "energy").length;
  const deRailway = items.length - deEnergy;
  const conServicios = hidratado && deEnergy > 0;

  return (
    <div className={cn("flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between", className)}>
      <p aria-live="polite" className="text-sm leading-relaxed text-zinc-600">
        {conServicios ? (
          <>
            <span className="font-semibold text-brand tabular-nums">{deEnergy}</span>{" "}
            {deEnergy === 1 ? "servicio de Energy" : "servicios de Energy"} en su cotización
            {deRailway > 0 &&
              `, junto con ${deRailway} ${deRailway === 1 ? "referencia" : "referencias"} de Railway`}
            .
          </>
        ) : (
          "Agregue los servicios que necesite y envíelos en una sola solicitud."
        )}
      </p>
      <Boton href="/cotizar" variante="secundario" icono="flecha" className="shrink-0">
        {conServicios ? "Revisar y enviar" : "Ir al cotizador"}
      </Boton>
    </div>
  );
}
