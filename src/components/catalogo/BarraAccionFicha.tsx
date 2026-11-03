"use client";

import "@/app/catalogo/transiciones.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useCotizacion } from "@/lib/cotizacion";
import { enlaceWhatsApp, mensajeProducto, nombreConVariante } from "@/lib/whatsapp";
import { useFicha } from "./ContextoFicha";
import { ID_ACCIONES } from "./FichaAcciones";

// Phone-only bar on product pages: once the main buttons scroll out of
// view, adding or asking stays one thumb away. data-barra-ficha/data-visible
// let the add confirmation sit above it (see catalogo/transiciones.css).
export default function BarraAccionFicha() {
  const { sku, nombre, variante, cantidad } = useFicha();
  const { tiene, agregar } = useCotizacion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const objetivo = document.getElementById(ID_ACCIONES);
    if (!objetivo) return;
    const obs = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { threshold: 0 });
    obs.observe(objetivo);
    return () => obs.disconnect();
  }, []);

  const completo = nombreConVariante(nombre, variante);
  const enLista = tiene(sku, variante);

  return (
    <div
      data-barra-ficha
      data-visible={visible}
      // inert keeps the hidden bar out of the tab order and screen readers.
      inert={!visible}
      className={`barra-ficha md:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-linea shadow-[0_-6px_20px_-12px_rgba(0,0,0,0.25)] ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center gap-2 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs text-azul truncate">{sku}</p>
          {variante && <p className="text-xs text-tenue truncate">{variante}</p>}
        </div>
        {enLista ? (
          <Link href="/cotizacion" className="inline-flex items-center justify-center min-h-11 px-4 rounded border border-azul text-azul bg-azul-suave text-sm font-semibold whitespace-nowrap">
            En tu cotización →
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => agregar(sku, nombre, cantidad, variante)}
            aria-label={`Agregar ${cantidad > 1 ? `${cantidad} de ` : ""}${completo} a la cotización`}
            className="inline-flex items-center justify-center gap-1.5 min-h-11 px-4 rounded bg-azul text-white text-sm font-semibold whitespace-nowrap hover:bg-azul-hover"
          >
            <Plus size={16} aria-hidden /> Agregar
          </button>
        )}
        <a
          href={enlaceWhatsApp(mensajeProducto(completo, sku))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Preguntar por ${completo} en WhatsApp (abre WhatsApp)`}
          className="grid place-items-center w-11 h-11 shrink-0 rounded bg-whatsapp text-white"
        >
          <svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor" aria-hidden>
            <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.9-3.9-1.9-6 0-5.9 4.9-10.6 11-10.6s11 4.8 11 10.6-4.9 10.9-10.9 10.9zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
