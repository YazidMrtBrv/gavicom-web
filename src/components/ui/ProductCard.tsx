"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import TechnicalTable from "./TechnicalTable";
import { generarEnlaceWhatsApp } from "@/constants/productos";
import type { Producto } from "@/constants/productos";

interface ProductCardProps {
  producto: Producto;
}

function VariantStrip({
  variantes,
  selected,
  onSelect,
}: {
  variantes: { imagen: string }[];
  selected: number;
  onSelect: (i: number) => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const el = strip.querySelector(`[data-idx="${selected}"]`) as HTMLElement | null;
    if (el) {
      const containerWidth = strip.clientWidth;
      const elLeft = el.offsetLeft;
      const elWidth = el.offsetWidth;
      strip.scrollLeft = elLeft - containerWidth / 2 + elWidth / 2;
    }
  }, [selected]);

  return (
    <div
      ref={stripRef}
      className="flex gap-1.5 px-4 py-3 bg-[#f5f5f7] border-b border-[#e8edf2] overflow-x-auto"
    >
      {variantes.map((v, i) => (
        <button
          key={v.imagen}
          data-idx={i}
          onClick={() => onSelect(i)}
          className={`shrink-0 w-14 h-10 border-2 transition-all overflow-hidden rounded-lg relative bg-white ${
            i === selected
              ? "border-[#D35400] opacity-100"
              : "border-transparent opacity-50 hover:opacity-80"
          }`}
        >
          <Image
            src={`/images/productos/${v.imagen}`}
            alt=""
            fill
            className="object-contain pointer-events-none"
            sizes="56px"
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductCard({ producto }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [varianteIdx, setVarianteIdx] = useState(0);

  if (!producto) return null;

  const { sku, nombre, categoria, subcategoria, origen, descripcion, especificaciones, variantes } = producto;
  const todasLasVariantes = variantes ?? (producto.imagen ? [{ imagen: producto.imagen }] : []);
  const varianteActual = todasLasVariantes[varianteIdx] ?? todasLasVariantes[0];
  const specsActual = varianteActual?.especificaciones ?? especificaciones;
  const enlaceCotizacion = generarEnlaceWhatsApp(nombre, sku);

  return (
    <>
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          onClick={() => setZoomOpen(false)}
        >
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-bold z-10"
          >
            &times;
          </button>
          <div className="relative w-full h-full">
            <Image
              src={`/images/productos/${varianteActual.imagen}`}
              alt={nombre}
              fill
              className="object-contain cursor-zoom-out"
              onClick={() => setZoomOpen(false)}
              sizes="90vw"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col bg-white rounded-2xl border border-[#e8edf2] overflow-hidden card-hover group shadow-sm">
        <div
          className="relative w-full h-48 bg-[#f5f5f7] overflow-hidden border-b border-[#e8edf2] cursor-zoom-in p-4"
          onClick={() => !imgError && setZoomOpen(true)}
        >
          {!imgError ? (
            <Image
              src={`/images/productos/${varianteActual.imagen}`}
              alt={nombre}
              fill
              className="object-contain pointer-events-none"
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 p-4 text-center">
              <svg
                className="w-10 h-10 text-zinc-300 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-[10px] font-mono text-zinc-400">{sku}</span>
            </div>
          )}
          <span className="absolute top-3 left-3 z-10 bg-[#2a2a2a]/90 text-[#D35400] text-[10px] font-mono font-bold tracking-widest px-2 py-1 border border-[#D35400]/30">
            {sku}
          </span>
        </div>

        {todasLasVariantes.length > 1 && (
          <VariantStrip
            variantes={todasLasVariantes}
            selected={varianteIdx}
            onSelect={(i) => { setVarianteIdx(i); setImgError(false); }}
          />
        )}

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D35400]">
            {categoria}
          </span>
          <span className="text-zinc-300 text-xs">•</span>
          <span className="text-[10px] font-semibold text-zinc-500 bg-[#f8f9fa] px-2 py-0.5 rounded">
            {subcategoria}
          </span>
          {todasLasVariantes.length > 1 && (
            <span className="text-[10px] text-zinc-400 ml-auto">
              {varianteIdx + 1}/{todasLasVariantes.length}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-[#2a2a2a] group-hover:text-[#D35400] transition-colors duration-300 mb-2 leading-snug">
          {nombre}
        </h3>

        <p className="text-xs text-zinc-500 leading-relaxed mb-4 flex-grow">
          {descripcion}
        </p>

        <div className="mb-4">
          <TechnicalTable especificaciones={specsActual} />
        </div>

        <div className="mt-auto pt-4 border-t border-[#e8edf2] flex items-center justify-between gap-4">
          <span
            className="text-[10px] font-mono text-zinc-400 tracking-tight block max-w-[140px] truncate"
            title={origen}
          >
            {origen}
          </span>

          <a
            href={enlaceCotizacion}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow inline-flex items-center text-[#2a2a2a] text-xs font-bold px-4 py-2.5 rounded shadow-sm tracking-wide transition-all duration-200 active:scale-95 bg-[#D35400] hover:bg-[#E67E22]"
          >
            Cotizar
          </a>
        </div>
      </div>
      </div>
    </>
  );
}
