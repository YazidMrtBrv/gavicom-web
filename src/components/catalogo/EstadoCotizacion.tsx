"use client";

import Boton from "@/components/ui/Boton";
import { useCotizacion } from "@/components/cotizacion/CotizacionProvider";
import { cn } from "@/lib/cn";

/*
 * Lo que lleva el visitante en su lista, al lado del índice. Mientras no hidrata
 * (servidor) muestra la frase genérica, que también es cierta con la lista llena.
 */
export default function EstadoCotizacion({ className }: { className?: string }) {
  const { items, hidratado } = useCotizacion();
  const deRailway = items.filter((item) => item.linea === "railway").length;
  const deEnergy = items.length - deRailway;
  const conItems = hidratado && items.length > 0;

  return (
    <div className={cn("rounded-[4px] border border-zinc-200 bg-surface p-5", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">Su cotización</p>
      <p aria-live="polite" className="mt-3 text-sm leading-relaxed text-zinc-700">
        {conItems ? (
          <>
            <span className="font-titulo text-2xl font-semibold text-brand tabular-nums">{items.length}</span>{" "}
            {items.length === 1 ? "referencia" : "referencias"} en su lista
            {deRailway > 0 && deEnergy > 0 && ` (${deRailway} de Railway y ${deEnergy} de Energy)`}.
          </>
        ) : (
          "Agregue las referencias que necesite y envíelas en una sola solicitud."
        )}
      </p>
      <Boton href="/cotizar" variante="enlace" icono="flecha" className="mt-2">
        {conItems ? "Revisar y enviar" : "Ir al cotizador"}
      </Boton>
    </div>
  );
}
