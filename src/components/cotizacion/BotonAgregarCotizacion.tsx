"use client";

import { cn } from "@/lib/cn";
import type { LineaNegocio } from "@/lib/cotizacion";
import { useCotizacion } from "./CotizacionProvider";

interface BotonAgregarCotizacionProps {
  sku: string;
  nombre: string;
  linea: LineaNegocio;
  className?: string;
  variante?: "compacto" | "normal";
}

export default function BotonAgregarCotizacion({
  sku,
  nombre,
  linea,
  className,
  variante = "normal",
}: BotonAgregarCotizacionProps) {
  const { contiene, agregar, quitar } = useCotizacion();
  const enLista = contiene(sku);

  return (
    <button
      type="button"
      aria-pressed={enLista}
      onClick={() => (enLista ? quitar(sku) : agregar({ sku, nombre, linea }))}
      className={cn(
        "boton inline-flex min-h-11 items-center justify-center gap-2 rounded-[4px] border border-brand font-semibold uppercase",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        variante === "compacto"
          ? "px-3 text-[11px] tracking-[0.14em]"
          : "px-5 text-xs tracking-[0.18em]",
        enLista ? "bg-brand text-white" : "bg-white text-brand hover:bg-brand hover:text-white",
        className
      )}
    >
      {enLista ? (
        <>
          En cotización
          <span aria-hidden="true" className="text-accent">
            ✓
          </span>
        </>
      ) : (
        <>
          <span aria-hidden="true" className="text-[1.15em] leading-none">
            +
          </span>
          Agregar a cotización
        </>
      )}
      {/* Con varias tarjetas en pantalla, el lector necesita saber de qué ítem es el botón. */}
      <span className="sr-only">: {nombre}</span>
    </button>
  );
}
