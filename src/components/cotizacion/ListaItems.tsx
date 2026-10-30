"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, PencilLine, Plus, SolarPanel, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  CANTIDAD_MAXIMA,
  LARGO_MAXIMO_NOTA,
  NOMBRE_LINEA,
  normalizarCantidad,
  type ItemCotizacion,
  type LineaNegocio,
} from "@/lib/cotizacion";
import type { ReferenciaCotizable } from "./referencias";
import estilos from "./cotizador.module.css";

const LINEAS: LineaNegocio[] = ["railway", "energy"];

/** Foto del producto sobre surface o, para servicios sin foto, una placa con pictograma. */
export function Miniatura({
  referencia,
  linea,
  className,
}: {
  referencia?: ReferenciaCotizable;
  linea: LineaNegocio;
  className?: string;
}) {
  if (referencia?.imagen) {
    return (
      <span className={cn("relative block shrink-0 overflow-hidden rounded-[3px] border border-zinc-200 bg-surface", className)}>
        <Image src={referencia.imagen} alt="" fill sizes="64px" className="object-contain p-1" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[3px]",
        linea === "energy" ? "bg-brand-deep text-accent" : "border border-zinc-200 bg-surface text-brand",
        className
      )}
    >
      {linea === "energy" ? (
        <SolarPanel className="size-5" strokeWidth={1.5} />
      ) : (
        <span className="text-[9px] font-semibold tracking-[0.18em]">GVC</span>
      )}
    </span>
  );
}

function CantidadEditable({
  id,
  item,
  onCambiar,
}: {
  id: string;
  item: ItemCotizacion;
  onCambiar: (cantidad: number) => void;
}) {
  // Mientras se escribe se permite el campo vacío; al salir vuelve a la cantidad guardada.
  const [texto, setTexto] = useState<string | null>(null);
  const valor = texto ?? String(item.cantidad);
  const botonPaso =
    "flex size-11 items-center justify-center text-brand transition-colors duration-200 hover:bg-surface disabled:cursor-not-allowed disabled:text-zinc-300 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent";

  return (
    <div className="inline-flex items-stretch rounded-[3px] border border-zinc-300 bg-white">
      <button
        type="button"
        onClick={() => onCambiar(item.cantidad - 1)}
        disabled={item.cantidad <= 1}
        aria-label={`Disminuir la cantidad de ${item.nombre}`}
        className={botonPaso}
      >
        <Minus aria-hidden="true" className="size-4" />
      </button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        enterKeyHint="done"
        maxLength={String(CANTIDAD_MAXIMA).length}
        aria-label={`Cantidad de ${item.nombre}`}
        value={valor}
        onChange={(evento) => {
          const limpio = evento.target.value.replace(/\D/g, "");
          setTexto(limpio);
          if (limpio) onCambiar(normalizarCantidad(Number(limpio)));
        }}
        onBlur={() => setTexto(null)}
        onKeyDown={(evento) => {
          if (evento.key === "Enter") {
            evento.preventDefault();
            evento.currentTarget.blur();
          }
        }}
        className="w-16 border-x border-zinc-300 bg-transparent text-center text-base font-semibold text-brand tabular-nums focus:outline-2 focus:-outline-offset-2 focus:outline-accent"
      />
      <button
        type="button"
        onClick={() => onCambiar(item.cantidad + 1)}
        disabled={item.cantidad >= CANTIDAD_MAXIMA}
        aria-label={`Aumentar la cantidad de ${item.nombre}`}
        className={botonPaso}
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

function NotaItem({ item, onCambiar }: { item: ItemCotizacion; onCambiar: (nota: string) => void }) {
  const id = useId();
  const campoRef = useRef<HTMLInputElement>(null);
  const [abierta, setAbierta] = useState(Boolean(item.nota));
  const [texto, setTexto] = useState(item.nota ?? "");

  if (!abierta) {
    return (
      <button
        type="button"
        onClick={() => {
          setAbierta(true);
          // El visitante acaba de pedir la nota: el foco va directo al campo.
          requestAnimationFrame(() => campoRef.current?.focus());
        }}
        className="boton mt-1 inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <PencilLine aria-hidden="true" className="size-3.5" />
        <span className="boton-enlace-texto">Añadir nota técnica</span>
        <span className="sr-only"> a {item.nombre}</span>
      </button>
    );
  }

  return (
    <div className="mt-3">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
        Nota técnica
        <span className="sr-only"> de {item.nombre}</span>
      </label>
      <input
        ref={campoRef}
        id={id}
        type="text"
        value={texto}
        maxLength={LARGO_MAXIMO_NOTA}
        placeholder="Medida, norma, presentación…"
        onChange={(evento) => {
          setTexto(evento.target.value);
          onCambiar(evento.target.value);
        }}
        onBlur={() => {
          if (!texto.trim()) setAbierta(false);
        }}
        onKeyDown={(evento) => {
          // Enter no debe enviar el paso desde una nota.
          if (evento.key === "Enter") evento.preventDefault();
        }}
        className="mt-1.5 block w-full border-0 border-b border-zinc-300 bg-transparent px-0 py-2 text-base text-ink placeholder:text-zinc-500 focus:border-brand focus:outline-none"
      />
    </div>
  );
}

/** id del campo de cantidad de un ítem: el buscador lo enfoca si se elige algo que ya está. */
export const idCantidad = (base: string, sku: string) => `${base}-cantidad-${sku}`;

interface ListaItemsProps {
  base: string;
  items: ItemCotizacion[];
  referencias: ReadonlyMap<string, ReferenciaCotizable>;
  /** sku recién agregado desde el buscador: entra con animación y se resalta. */
  recienAgregado: string | null;
  onCantidad: (sku: string, cantidad: number) => void;
  onNota: (sku: string, nota: string) => void;
  onQuitar: (item: ItemCotizacion) => void;
}

export default function ListaItems({
  base,
  items,
  referencias,
  recienAgregado,
  onCantidad,
  onNota,
  onQuitar,
}: ListaItemsProps) {
  const reducido = useReducedMotion();

  return (
    <div className="flex flex-col gap-8">
      {LINEAS.map((linea) => {
        const deLaLinea = items.filter((item) => item.linea === linea);
        if (deLaLinea.length === 0) return null;
        return (
          <div key={linea}>
            <h4 className="flex items-center justify-between gap-4 border-b border-brand pb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
              <span>{NOMBRE_LINEA[linea]}</span>
              <span className="text-zinc-600 tabular-nums">
                {String(deLaLinea.length).padStart(2, "0")}
              </span>
            </h4>
            <ul>
              <AnimatePresence initial={false}>
                {deLaLinea.map((item) => {
                  const referencia = referencias.get(item.sku);
                  const nueva = item.sku === recienAgregado;
                  return (
                    <motion.li
                      key={item.sku}
                      layout={reducido ? false : "position"}
                      initial={nueva && !reducido ? { opacity: 0, y: -8 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reducido ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: 24, transition: { duration: 0.25 } }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className={cn("spec-row relative border-b border-zinc-200", nueva && estilos.filaNueva)}
                    >
                      <div className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-4 py-5 pl-4 sm:grid-cols-[4rem_1fr_auto] sm:items-start sm:pl-5">
                        <Miniatura referencia={referencia} linea={item.linea} className="size-12 sm:size-16" />

                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold tracking-[0.18em] text-zinc-600 tabular-nums">
                            {item.sku}
                            {referencia && (
                              <span className="font-medium tracking-[0.08em]"> · {referencia.categoria}</span>
                            )}
                          </p>
                          <p className="mt-1 text-[15px] font-medium leading-snug text-brand sm:text-base">{item.nombre}</p>
                          <NotaItem item={item} onCambiar={(nota) => onNota(item.sku, nota)} />
                        </div>

                        <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:col-start-3 sm:justify-end">
                          <CantidadEditable id={idCantidad(base, item.sku)} item={item} onCambiar={(cantidad) => onCantidad(item.sku, cantidad)} />
                          <button
                            type="button"
                            onClick={() => onQuitar(item)}
                            aria-label={`Quitar ${item.nombre} de la cotización`}
                            className="flex size-11 items-center justify-center rounded-[3px] text-zinc-600 transition-colors duration-200 hover:bg-surface hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                          >
                            <Trash2 aria-hidden="true" className="size-4" />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        );
      })}
    </div>
  );
}
