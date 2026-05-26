"use client";

import { useState } from "react";
import TechnicalTable from "./TechnicalTable";
import { generarEnlaceWhatsApp } from "@/constants/productos";
import type { Producto } from "@/constants/productos";

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  if (!producto) return null;

  const { sku, nombre, categoria, subcategoria, origen, descripcion, imagen, especificaciones } = producto;
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/productos/${imagen}`}
            alt={nombre}
            className="max-w-full max-h-full object-contain cursor-zoom-out"
            onClick={() => setZoomOpen(false)}
          />
        </div>
      )}

      <div className="flex flex-col bg-white rounded-lg border border-[#e8edf2] overflow-hidden card-hover group shadow-sm">
        <div
          className="relative w-full h-48 bg-[#f8f9fa] flex items-center justify-center overflow-hidden border-b border-[#e8edf2] cursor-zoom-in"
          onClick={() => !imgError && setZoomOpen(true)}
        >
          {!imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={`/images/productos/${imagen}`}
              alt={nombre}
              className="w-full h-full object-contain p-4 pointer-events-none"
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
          <span className="absolute top-3 left-3 z-10 bg-[#0a2a44]/90 text-[#d4a017] text-[10px] font-mono font-bold tracking-widest px-2 py-1 border border-[#d4a017]/30">
            {sku}
          </span>
        </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1a6ba8]">
            {categoria}
          </span>
          <span className="text-zinc-300 text-xs">•</span>
          <span className="text-[10px] font-semibold text-zinc-500 bg-[#f8f9fa] px-2 py-0.5 rounded">
            {subcategoria}
          </span>
        </div>

        <h3 className="text-base font-bold text-[#0a2a44] group-hover:text-[#1a6ba8] transition-colors duration-300 mb-2 leading-snug">
          {nombre}
        </h3>

        <p className="text-xs text-zinc-500 leading-relaxed mb-4 flex-grow">
          {descripcion}
        </p>

        <div className="mb-4">
          <TechnicalTable especificaciones={especificaciones} />
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
            className="btn-glow inline-flex items-center text-[#0a2a44] text-xs font-bold px-4 py-2.5 rounded shadow-sm tracking-wide transition-all duration-200 active:scale-95 bg-[#d4a017] hover:bg-[#e0b02a]"
          >
            Cotizar
          </a>
        </div>
      </div>
      </div>
    </>
  );
}
