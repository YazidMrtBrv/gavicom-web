"use client";

import BotonCotizar from "@/components/BotonCotizar";
import { useCotizacion } from "@/lib/cotizacion";
import { enlaceWhatsApp, mensajeProducto, nombreConVariante } from "@/lib/whatsapp";
import SelectorCantidad from "./SelectorCantidad";
import { IconoWhatsApp } from "@/components/venta/Venta";
import { useFicha } from "./ContextoFicha";

// Main actions of a product page. Its id is what the phone action bar
// watches: the bar shows up only while this block is off screen.
export const ID_ACCIONES = "acciones-ficha";

export default function FichaAcciones() {
  const { sku, nombre, variante, cantidad, setCantidad } = useFicha();
  const { lineas, tiene, cambiarCantidad } = useCotizacion();
  // Once the reference is in the list the add button becomes a link, so the
  // selector edits the saved line itself; otherwise it would silently show a
  // number that is not the one that gets sent.
  const enLista = tiene(sku, variante);
  const guardada = enLista ? lineas.find((l) => l.sku === sku && (l.variante ?? "") === (variante ?? ""))?.cantidad : undefined;
  return (
    <div id={ID_ACCIONES} className="flex flex-col gap-3">
      {variante && (
        <p className="text-sm">
          <span className="text-tenue">Modelo elegido: </span>
          <span className="font-semibold">{variante}</span>
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <SelectorCantidad
          id="cantidad-ficha"
          valor={guardada ?? cantidad}
          cambiar={(n) => {
            setCantidad(n);
            if (enLista) cambiarCantidad(sku, n, variante);
          }}
          etiqueta={enLista ? `Cantidad de ${nombre} en tu cotización` : `Cantidad de ${nombre}`}
        />
        <BotonCotizar sku={sku} nombre={nombre} variante={variante} cantidad={cantidad} grande />
      </div>
      {enLista && <p className="text-sm text-tenue">Si cambias la cantidad, se actualiza en tu cotización.</p>}
      <a
        href={enlaceWhatsApp(mensajeProducto(nombreConVariante(nombre, variante), sku))}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded bg-whatsapp text-white font-semibold hover:brightness-110 w-full sm:w-auto sm:self-start"
      >
        <IconoWhatsApp size={20} />
        Cotizar ya por WhatsApp
        <span className="sr-only"> (abre WhatsApp)</span>
      </a>
    </div>
  );
}
