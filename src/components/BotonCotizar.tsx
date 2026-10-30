"use client";

import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useCotizacion } from "@/lib/cotizacion";

// Adds the reference to the browser-side quote list. Once it is there the
// button turns into a link to the list, so a second tap never duplicates it
// by accident.
export default function BotonCotizar({ sku, nombre, grande = false }: { sku: string; nombre: string; grande?: boolean }) {
  const { tiene, agregar } = useCotizacion();
  const base = `inline-flex items-center justify-center gap-2 rounded font-semibold transition-colors ${
    grande ? "min-h-12 px-5 text-base" : "min-h-11 px-3 text-sm"
  }`;

  if (tiene(sku)) {
    return (
      <Link href="/cotizacion" className={`${base} border border-azul text-azul bg-azul-suave`}>
        <Check size={grande ? 20 : 16} aria-hidden /> {grande ? "En tu cotización" : "En cotización"}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={`Agregar ${nombre} a la cotización`} onClick={() => agregar(sku, nombre)} className={`${base} bg-azul text-white hover:bg-azul-hover`}>
      <Plus size={grande ? 20 : 16} aria-hidden />
      {/* Short label on cards: the long one wrapped to two lines on phones. */}
      {grande ? "Agregar a cotización" : <span>Agregar<span className="sr-only"> a cotización</span></span>}
    </button>
  );
}
