"use client";

import "@/app/catalogo/transiciones.css";
import { abrirLista } from "./CajonLista";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { EVENTO_AGREGADO, type DetalleAgregado } from "@/lib/cotizacion";

const DURACION = 4000;

// Confirms every add without moving focus: the live region is always in the
// DOM (screen readers ignore regions that appear with their text already
// inside) and only its content changes. Bottom-left on phones, clear of the
// WhatsApp pill: above it on phones; above the action bar on product pages.
export default function AvisoCotizacion() {
  const [aviso, setAviso] = useState<DetalleAgregado | null>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const alAgregar = (e: Event) => {
      const detalle = (e as CustomEvent<DetalleAgregado>).detail;
      if (!detalle) return;
      setAviso(detalle);
      clearTimeout(temporizador.current);
      temporizador.current = setTimeout(() => setAviso(null), DURACION);
    };
    window.addEventListener(EVENTO_AGREGADO, alAgregar);
    return () => {
      window.removeEventListener(EVENTO_AGREGADO, alAgregar);
      clearTimeout(temporizador.current);
    };
  }, []);

  return (
    <div role="status" className="aviso-cotizacion fixed z-50 left-4 right-4 bottom-[5.5rem] sm:right-auto sm:left-6 sm:bottom-6 sm:max-w-sm pointer-events-none">
      {aviso && (
        <div className="aviso-entrar pointer-events-auto flex items-center gap-3 rounded bg-azul text-white pl-4 pr-2 py-2 shadow-lg">
          <CheckCircle2 size={20} aria-hidden className="shrink-0" />
          <p className="flex-1 min-w-0 text-sm leading-snug">
            Se agregó <span className="font-semibold">{aviso.nombre}</span>
          </p>
          <button type="button" onClick={abrirLista} className="inline-flex items-center min-h-11 px-3 rounded text-sm font-semibold underline underline-offset-4 whitespace-nowrap hover:bg-white/10">
            Ver mi lista ({aviso.total})
          </button>
        </div>
      )}
    </div>
  );
}
