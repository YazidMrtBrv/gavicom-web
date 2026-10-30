"use client";

import { useCotizacion } from "@/components/cotizacion/CotizacionProvider";
import Boton from "@/components/ui/Boton";

/*
 * Lo que el visitante ya lleva en su lista de cotización. Hasta hidratar se
 * muestra la frase general, que también es cierta con la lista llena: así el
 * HTML del servidor y el primer render del cliente coinciden.
 */
export default function AccesoCotizador() {
  const { total, hidratado } = useCotizacion();
  const conItems = hidratado && total > 0;

  return (
    <div className="flex flex-col gap-6">
      <p aria-live="polite" className="max-w-md text-sm leading-relaxed text-zinc-300">
        {conItems ? (
          <>
            Ya tiene{" "}
            <span className="font-titulo text-lg font-semibold text-accent tabular-nums">{total}</span>{" "}
            {total === 1 ? "referencia" : "referencias"} en su lista de cotización.
          </>
        ) : (
          "Agregue referencias desde el catálogo o los servicios de Energy y envíelas en una sola solicitud."
        )}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Boton href="/cotizar" icono="flecha">
          {conItems ? "Revisar mi cotización" : "Ir al cotizador"}
        </Boton>
        <Boton href="/catalogo" variante="claro">
          Ver catálogo Railway
        </Boton>
      </div>
    </div>
  );
}
