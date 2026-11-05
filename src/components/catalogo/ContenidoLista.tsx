"use client";

import Link from "next/link";
import { useState } from "react";
import { ClipboardList, Trash2, X } from "lucide-react";
import { useCotizacion } from "@/lib/cotizacion";
import { enlaceWhatsApp, mensajeCotizacion, nombreConVariante } from "@/lib/whatsapp";
import { IconoWhatsApp } from "@/components/venta/Venta";
import SelectorCantidad from "./SelectorCantidad";

// The drawer's contents, loaded only the first time the list is opened (see
// CajonLista): the shell that listens for the open event stays tiny in the
// bundle every page loads.
export default function ContenidoLista({ cerrar }: { cerrar: () => void }) {
  const [ciudad, setCiudad] = useState("");
  const { lineas, total, cambiarCantidad, quitar } = useCotizacion();
  const mensaje = mensajeCotizacion(lineas, { nombre: "", empresa: "", ciudad: ciudad.trim(), nota: "" });
  return (
    <div className="flex flex-col h-full max-h-[inherit]">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-linea">
        <h2 id="h-cajon" className="flex items-center gap-2 t-subtitulo">
          <ClipboardList size={22} aria-hidden className="text-azul" />
          Tu lista
          <span className="font-mono text-sm font-normal text-tenue tabular-nums">
            {total} {total === 1 ? "unidad" : "unidades"}
          </span>
        </h2>
        <button type="button" onClick={() => cerrar()} aria-label="Cerrar la lista" className="grid place-items-center size-11 rounded hover:bg-gris">
          <X size={22} aria-hidden />
        </button>
      </div>

      {lineas.length === 0 ? (
        <div className="flex-1 flex flex-col items-start gap-3 px-5 py-8">
          <p className="text-tenue">Tu lista está vacía. Agrega piezas desde el catálogo o desde la ficha de cada una.</p>
          <Link href="/catalogo" onClick={() => cerrar()} className="inline-flex items-center min-h-11 font-semibold text-azul underline underline-offset-4">
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 overflow-y-auto divide-y divide-linea px-5">
            {lineas.map((l) => {
              const nombre = nombreConVariante(l.nombre, l.variante);
              return (
                <li key={`${l.sku}-${l.variante ?? ""}`} className="cajon-linea py-3 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug">{nombre}</p>
                      <p className="font-mono text-xs text-azul">{l.sku}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => quitar(l.sku, l.variante)}
                      aria-label={`Quitar ${nombre} de la lista`}
                      className="grid place-items-center size-11 shrink-0 rounded text-tenue hover:text-tinta hover:bg-gris"
                    >
                      <Trash2 size={18} aria-hidden />
                    </button>
                  </div>
                  <SelectorCantidad
                    id={`cajon-${l.sku}-${l.variante ?? ""}`}
                    valor={l.cantidad}
                    cambiar={(n) => cambiarCantidad(l.sku, n, l.variante)}
                    etiqueta={`Cantidad de ${nombre}`}
                  />
                </li>
              );
            })}
          </ul>
          <div className="border-t border-linea px-5 py-4 flex flex-col gap-3 bg-gris">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold">
                Ciudad de entrega <span className="font-normal text-tenue">(opcional)</span>
              </span>
              <input
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                autoComplete="address-level2"
                className="min-h-11 px-3 rounded border border-linea bg-white text-base"
              />
            </label>
            <a
              href={enlaceWhatsApp(mensaje)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded bg-whatsapp text-white font-semibold hover:brightness-110"
            >
              <IconoWhatsApp size={20} />
              Enviar mi lista por WhatsApp
              <span className="sr-only"> (abre WhatsApp)</span>
            </a>
            <Link href="/cotizacion" onClick={() => cerrar()} className="inline-flex items-center justify-center min-h-11 text-sm font-semibold text-azul underline underline-offset-4">
              Agregar datos de empresa o enviar por correo
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
