"use client";

import "@/app/catalogo/transiciones.css";
import Image from "next/image";
import { useEffect, useRef, useState, ViewTransition } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { VistaFicha } from "@/constants/catalogoExtra";
import BotonCotizar from "@/components/BotonCotizar";
import { useFicha } from "./ContextoFicha";

const LEYENDA_REFERENCIA = "Referencia de modelo (fabricación bajo pedido)";

// Product page photos. Each model is a real button (aria-pressed) so it can be
// chosen by keyboard; the choice is shared with the add buttons through
// ContextoFicha, so the quote says which model was picked.
export default function GaleriaFicha({ vistas, alt }: { vistas: VistaFicha[]; alt: string }) {
  const { sku, nombre, setVariante, cantidad } = useFicha();
  const [indice, setIndice] = useState(0);
  const visor = useRef<HTMLDialogElement>(null);
  const [visorAbierto, setVisorAbierto] = useState(false);
  const varias = vistas.length > 1;
  const actual = vistas[indice];

  const elegir = (i: number) => {
    const n = (i + vistas.length) % vistas.length;
    setIndice(n);
    if (varias) setVariante(vistas[n].nombre);
  };

  const abrir = () => {
    setVisorAbierto(true);
    visor.current?.showModal();
  };

  // <dialog> closes itself on Escape and returns focus to the opener; this
  // only keeps React's state in step so the big image unmounts.
  useEffect(() => {
    const d = visor.current;
    if (!d) return;
    const cerrar = () => setVisorAbierto(false);
    d.addEventListener("close", cerrar);
    return () => d.removeEventListener("close", cerrar);
  }, []);

  if (!actual) return null;

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={abrir}
        className="group relative block w-full aspect-square border border-linea rounded bg-white cursor-zoom-in"
        aria-label={`Ampliar foto: ${varias ? `${actual.nombre} de ` : ""}${alt}`}
      >
        {/* Inner box is absolute so max-h-full has a definite height: small
            scans stay at their native size, centred, never blown up. */}
        <span className="absolute inset-4 sm:inset-6 flex items-center justify-center">
          <ViewTransition name={`foto-${sku}`} share="morph-foto" default="none">
            <Image
              key={actual.src}
              src={actual.src}
              alt={varias ? `${alt}, ${actual.nombre}` : alt}
              width={actual.ancho}
              height={actual.alto}
              sizes="(min-width:768px) 520px, 100vw"
              className="galeria-fundido max-w-full max-h-full w-auto h-auto object-contain"
              priority={indice === 0}
            />
          </ViewTransition>
        </span>
        <span className="absolute right-2 bottom-2 grid place-items-center w-11 h-11 rounded bg-white/90 border border-linea text-tenue group-hover:text-azul" aria-hidden>
          <Maximize2 size={18} />
        </span>
      </button>

      {varias && (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="text-sm font-semibold" aria-live="polite">
              {actual.nombre} <span className="text-tenue font-normal tabular-nums">· {indice + 1} de {vistas.length}</span>
            </p>
            {actual.referencia && <p className="text-xs text-tenue">{LEYENDA_REFERENCIA}</p>}
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="Modelos">
            {vistas.map((v, i) => (
              <li key={v.src}>
                <button
                  type="button"
                  onClick={() => elegir(i)}
                  aria-pressed={i === indice}
                  aria-label={v.nombre}
                  className={`relative block w-16 h-16 rounded border bg-white p-1 transition-colors ${
                    i === indice ? "border-azul ring-2 ring-azul" : "border-linea hover:border-azul"
                  }`}
                >
                  <Image src={v.src} alt="" width={v.ancho} height={v.alto} sizes="64px" className="w-full h-full object-contain" />
                </button>
              </li>
            ))}
          </ul>
          <div>
            <BotonCotizar sku={sku} nombre={nombre} variante={actual.nombre} cantidad={cantidad} etiqueta="Agregar esta variante" />
          </div>
        </>
      )}

      <dialog
        ref={visor}
        aria-label={`Foto ampliada: ${alt}`}
        onKeyDown={(e) => {
          if (!varias) return;
          if (e.key === "ArrowRight") elegir(indice + 1);
          if (e.key === "ArrowLeft") elegir(indice - 1);
        }}
        onClick={(e) => {
          // A tap on the backdrop (the dialog itself, not its content) closes.
          if (e.target === e.currentTarget) visor.current?.close();
        }}
        className="visor-ficha m-auto p-0 w-[min(96vw,64rem)] max-h-[92vh] rounded bg-white backdrop:bg-black/70"
      >
        <div className="flex items-center justify-between gap-3 border-b border-linea px-3 py-1">
          <p className="text-sm font-semibold truncate">
            {varias ? `${actual.nombre} · ${indice + 1} de ${vistas.length}` : alt}
          </p>
          <button type="button" onClick={() => visor.current?.close()} className="grid place-items-center w-11 h-11 text-tenue hover:text-azul" aria-label="Cerrar foto ampliada">
            <X size={20} aria-hidden />
          </button>
        </div>
        <div className="relative h-[min(78vh,48rem)] bg-white">
          {visorAbierto && (
            <span className="absolute inset-4 flex items-center justify-center">
              <Image
                key={actual.src}
                src={actual.src}
                alt={varias ? `${alt}, ${actual.nombre}` : alt}
                width={actual.ancho}
                height={actual.alto}
                sizes="96vw"
                className="galeria-fundido max-w-full max-h-full w-auto h-auto object-contain"
              />
            </span>
          )}
          {varias && (
            <>
              <button type="button" onClick={() => elegir(indice - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded bg-white border border-linea hover:border-azul" aria-label="Foto anterior">
                <ChevronLeft size={20} aria-hidden />
              </button>
              <button type="button" onClick={() => elegir(indice + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded bg-white border border-linea hover:border-azul" aria-label="Foto siguiente">
                <ChevronRight size={20} aria-hidden />
              </button>
            </>
          )}
        </div>
        {actual.referencia && <p className="px-3 py-2 text-xs text-tenue border-t border-linea">{LEYENDA_REFERENCIA}</p>}
      </dialog>
    </div>
  );
}
