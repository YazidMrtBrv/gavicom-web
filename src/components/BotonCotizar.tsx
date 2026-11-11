"use client";

import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useCotizacion } from "@/lib/cotizacion";
import { abrirLista } from "@/components/catalogo/CajonLista";

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
  chip = false,
}: {
  sku: string;
  nombre: string;
  grande?: boolean;
  cantidad?: number;
  variante?: string;
  // Overrides the visible label, e.g. "Agregar esta variante".
  etiqueta?: string;
  // Small outline chip for cards: an add is an interaction, not a shout, so
  // it never competes with the page's one primary button.
  chip?: boolean;
}) {
  const { tiene, agregar } = useCotizacion();
  const base = `inline-flex items-center justify-center gap-2 rounded font-semibold transition-colors ${
    grande ? "min-h-12 px-5 text-base" : "min-h-11 px-3 text-sm"
  }`;
  const completo = variante ? `${nombre} · ${variante}` : nombre;

  if (chip) {
    const en = tiene(sku, variante);
    return (
      <button
        type="button"
        onClick={() => (en ? abrirLista() : agregar(sku, nombre, cantidad, variante))}
        aria-label={en ? `${completo} ya está en tu lista. Abrir la lista` : `Agregar ${completo} a tu lista`}
        className={`chip-agregar inline-flex items-center gap-1 min-h-11 px-3 rounded-full border text-sm font-semibold transition-colors ${
          en ? "border-azul bg-azul-suave text-azul" : "border-linea text-tinta hover:border-azul hover:text-azul"
        }`}
      >
        {en ? <Check size={16} aria-hidden /> : <Plus size={16} aria-hidden />}
        <span aria-hidden>{en ? "En tu lista" : "Agregar"}</span>
      </button>
    );
  }
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
      // The accessible name starts with the words on the button (WCAG 2.5.3),
      // so someone using voice control can say what they see.
      aria-label={`${etiqueta ?? "Agregar a cotización"}: ${cantidad > 1 ? `${cantidad} de ` : ""}${completo}`}
      onClick={() => agregar(sku, nombre, cantidad, variante)}
      className={`${base} bg-azul text-white hover:bg-azul-hover`}
    >
      <Plus size={grande ? 20 : 16} aria-hidden />
      {/* Short label on cards: the long one wrapped to two lines on phones. */}
      {etiqueta ?? (grande ? "Agregar a cotización" : <span>Agregar<span className="sr-only"> a cotización</span></span>)}
    </button>
  );
}
