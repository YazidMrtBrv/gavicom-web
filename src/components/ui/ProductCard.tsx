"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import TechnicalTable from "./TechnicalTable";
import { generarEnlaceWhatsApp } from "@/constants/productos";
import type { Producto } from "@/constants/productos";

const CARD_SIZES = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 37vw";

interface ProductCardProps {
  producto: Producto;
  eager?: boolean;
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
      className="flex gap-1.5 px-4 py-3 bg-[#f8f9fa] border-b border-zinc-200 overflow-x-auto"
    >
      {variantes.map((v, i) => (
        <button
          key={v.imagen}
          data-idx={i}
          onClick={() => onSelect(i)}
          className={`shrink-0 w-14 h-10 border-2 transition-all overflow-hidden rounded-none relative bg-white ${
            i === selected
              ? "border-[#D35400] opacity-100"
              : "border-transparent opacity-50 hover:opacity-80"
          }`}
        >
          <Image
            src={`/images/productos/${v.imagen}`}
            alt=""
            width={56}
            height={40}
            sizes="56px"
            className="w-full h-full object-contain pointer-events-none"
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductCard({ producto, eager = false }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [varianteIdx, setVarianteIdx] = useState(0);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoomOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen]);

  if (!producto) return null;

  const { sku, nombre, categoria, subcategoria, origen, descripcion, especificaciones, variantes } = producto;
  const todasLasVariantes = variantes ?? (producto.imagen ? [{ imagen: producto.imagen }] : []);
  const varianteActual = todasLasVariantes[varianteIdx] ?? todasLasVariantes[0];
  const specsActual = varianteActual?.especificaciones ?? especificaciones;
  const enlaceCotizacion = generarEnlaceWhatsApp(nombre, sku);

  return (
    <>
      {zoomOpen &&
        varianteActual &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-[fade-in_200ms_ease-out]"
            onClick={() => setZoomOpen(false)}
          >
            <button
              onClick={() => setZoomOpen(false)}
              aria-label="Cerrar"
              className="absolute top-5 right-6 text-white/60 hover:text-white text-4xl font-light leading-none transition-colors z-10"
            >
              &times;
            </button>
            <div
              className="relative w-[90vw] h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={`/images/productos/${varianteActual.imagen}`}
                alt={nombre}
                fill
                sizes="(max-width: 1024px) 90vw, 1024px"
                quality={90}
                className="object-contain"
              />
            </div>
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-[10px] font-mono tracking-[0.2em] uppercase">
              {sku} — {nombre}
            </span>
          </div>,
          document.body
        )}

      <div className="reveal-on-scroll flex flex-col bg-white rounded-none border border-zinc-200 overflow-hidden card-hover group transition-all duration-300 hover:border-[#D35400]/50">
        <div
          className={`tech-corners relative w-full h-48 bg-[#f8f9fa] overflow-hidden border-b border-zinc-200 p-4 ${
            varianteActual && !imgError ? "cursor-zoom-in" : ""
          }`}
          onClick={() => varianteActual && !imgError && setZoomOpen(true)}
        >
          {varianteActual && !imgError ? (
            <div className="relative w-full h-full">
              {!imgLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-100 via-zinc-200/60 to-zinc-100" />
              )}
              <Image
                src={`/images/productos/${varianteActual.imagen}`}
                alt={nombre}
                fill
                sizes={CARD_SIZES}
                loading={eager ? "eager" : "lazy"}
                fetchPriority={eager ? "high" : "auto"}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`object-contain pointer-events-none transition-all duration-500 ease-out group-hover:scale-[1.03] ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
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
            onSelect={(i) => { setVarianteIdx(i); setImgError(false); setImgLoaded(false); }}
          />
        )}

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D35400]">
            {categoria}
          </span>
          <span className="text-zinc-300 text-xs">•</span>
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 border border-zinc-200 px-2 py-0.5">
            {subcategoria}
          </span>
          {todasLasVariantes.length > 1 && (
            <span className="text-[10px] font-mono text-zinc-400 ml-auto border border-zinc-200 px-1.5">
              {varianteIdx + 1}/{todasLasVariantes.length}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-[#1a1a2e] group-hover:text-[#D35400] transition-colors duration-300 mb-2 leading-snug">
          {nombre}
        </h3>

        <p className="text-xs text-zinc-500 leading-relaxed mb-4 flex-grow">
          {descripcion}
        </p>

        <div className="mb-4">
          <TechnicalTable especificaciones={specsActual} />
        </div>

        <div className="mt-auto pt-4 border-t border-zinc-200 flex items-center justify-between gap-4">
          <span
            className="text-[9px] font-mono text-zinc-400 tracking-widest uppercase block max-w-[140px] truncate"
            title={origen}
          >
            {origen}
          </span>

          <a
            href={enlaceCotizacion}
            target="_blank"
            rel="noopener noreferrer"
            className="spotlight inline-flex items-center justify-center text-[#D35400] text-[10px] font-bold uppercase tracking-[0.2em] border border-[#D35400] px-4 py-2 hover:bg-[#D35400] hover:text-white transition-all active:scale-[0.97]"
          >
            Cotizar →
          </a>
        </div>
      </div>
      </div>
    </>
  );
}
