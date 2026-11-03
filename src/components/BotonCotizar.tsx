"use client";

import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useCotizacion } from "@/lib/cotizacion";

// Adds the reference to the browser-side quote list. Once it is there the
// button turns into a link to the list, so a second tap never duplicates it
// by accident. The add itself fires "gavicom:agregado" (see lib/cotizacion),
// which the confirmation toast listens to.
export default function BotonCotizar({
  sku,
  nombre,
  grande = false,
  cantidad = 1,
  variante,
  etiqueta,
}: {
  sku: string;
  nombre: string;
  grande?: boolean;
  cantidad?: number;
  variante?: string;
  // Overrides the visible label, e.g. "Agregar esta variante".
  etiqueta?: string;
}) {
  const { tiene, agregar } = useCotizacion();
  const base = `inline-flex items-center justify-center gap-2 rounded font-semibold transition-colors ${
    grande ? "min-h-12 px-5 text-base" : "min-h-11 px-3 text-sm"
  }`;
  const completo = variante ? `${nombre} · ${variante}` : nombre;

  if (tiene(sku, variante)) {
    return (
      <Link href="/cotizacion" className={`${base} border border-azul text-azul bg-azul-suave`} aria-label={`${completo} ya está en tu cotización. Ver cotización`}>
        <Check size={grande ? 20 : 16} aria-hidden /> {grande ? "En tu cotización" : "En cotización"}
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-label={`Agregar ${cantidad > 1 ? `${cantidad} de ` : ""}${completo} a la cotización`}
      onClick={() => agregar(sku, nombre, cantidad, variante)}
      className={`${base} bg-azul text-white hover:bg-azul-hover`}
    >
      <Plus size={grande ? 20 : 16} aria-hidden />
      {/* Short label on cards: the long one wrapped to two lines on phones. */}
      {etiqueta ?? (grande ? "Agregar a cotización" : <span>Agregar<span className="sr-only"> a cotización</span></span>)}
    </button>
  );
}
