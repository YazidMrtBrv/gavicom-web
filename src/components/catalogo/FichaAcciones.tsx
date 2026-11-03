"use client";

import BotonCotizar from "@/components/BotonCotizar";
import { enlaceWhatsApp, mensajeProducto, nombreConVariante } from "@/lib/whatsapp";
import SelectorCantidad from "./SelectorCantidad";
import { useFicha } from "./ContextoFicha";

// Main actions of a product page. Its id is what the phone action bar
// watches: the bar shows up only while this block is off screen.
export const ID_ACCIONES = "acciones-ficha";

export default function FichaAcciones() {
  const { sku, nombre, variante, cantidad, setCantidad } = useFicha();
  return (
    <div id={ID_ACCIONES} className="flex flex-col gap-3">
      {variante && (
        <p className="text-sm">
          <span className="text-tenue">Modelo elegido: </span>
          <span className="font-semibold">{variante}</span>
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <SelectorCantidad id="cantidad-ficha" valor={cantidad} cambiar={setCantidad} etiqueta={`Cantidad de ${nombre}`} />
        <BotonCotizar sku={sku} nombre={nombre} variante={variante} cantidad={cantidad} grande />
      </div>
      <a
        href={enlaceWhatsApp(mensajeProducto(nombreConVariante(nombre, variante), sku))}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center self-start min-h-12 px-5 rounded border border-linea font-semibold text-tinta hover:border-azul hover:text-azul"
      >
        Preguntar por WhatsApp
      </a>
    </div>
  );
}
