"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, Maximize2, X } from "lucide-react";
import TechnicalTable from "./TechnicalTable";
import Boton from "./Boton";
import Reveal, { type PasoReveal } from "@/components/motion/Reveal";
import TechFrame from "@/components/motion/TechFrame";
import BotonAgregarCotizacion from "@/components/cotizacion/BotonAgregarCotizacion";
import { useCierreAlPulsarFuera } from "@/components/catalogo/dialogo";
import estilos from "@/components/catalogo/catalogo.module.css";
import { generarEnlaceWhatsApp } from "@/constants/productos";
import type { Producto, ProductoVariante } from "@/constants/productos";
import { cn } from "@/lib/cn";

// Ancho real de la foto: una columna en móvil, dos desde md; en escritorio la
// tarjeta no pasa de ~440 px (contenedor de 80 rem menos el índice lateral).
const CARD_SIZES = "(max-width: 767px) 92vw, (max-width: 1279px) 45vw, 440px";

const BOTON_VISOR =
  "flex size-11 items-center justify-center rounded-[4px] text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

interface ProductCardProps {
  producto: Producto;
  /** Carga la foto de inmediato (las primeras tarjetas del listado). */
  eager?: boolean;
  /** Posición en el listado: escalona la entrada al hacer scroll. */
  indice?: number;
  /** La eligió el buscador rápido: anillo accent y marcas reforzadas un instante. */
  resaltado?: boolean;
}

function etiquetaVariante(variante: ProductoVariante | undefined, i: number, total: number): string {
  return variante?.nombre ?? `Modelo ${String(i + 1).padStart(2, "0")} de ${String(total).padStart(2, "0")}`;
}

function VariantStrip({
  variantes,
  selected,
  onSelect,
  nombre,
}: {
  variantes: ProductoVariante[];
  selected: number;
  onSelect: (i: number) => void;
  nombre: string;
}) {
  const stripRef = useRef<HTMLDivElement>(null);

  // Mantiene la miniatura elegida centrada en la tira (también al pasar de modelo en el visor).
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const el = strip.querySelector<HTMLElement>(`[data-idx="${selected}"]`);
    if (el) strip.scrollLeft = el.offsetLeft - strip.clientWidth / 2 + el.offsetWidth / 2;
  }, [selected]);

  return (
    <div
      ref={stripRef}
      role="group"
      aria-label={`Modelos de ${nombre}`}
      className="relative flex gap-1.5 overflow-x-auto border-b border-zinc-200 bg-surface px-4 py-3 [scrollbar-width:thin]"
    >
      {variantes.map((v, i) => (
        <button
          key={v.imagen}
          type="button"
          data-idx={i}
          onClick={() => onSelect(i)}
          aria-pressed={i === selected}
          aria-label={etiquetaVariante(v, i, variantes.length)}
          className={cn(
            "relative h-11 w-14 shrink-0 overflow-clip rounded-[2px] border-2 bg-white transition-[border-color,opacity] duration-200",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
            i === selected ? "border-accent opacity-100" : "border-transparent opacity-60 hover:opacity-90"
          )}
        >
          <Image
            src={`/images/productos/${v.imagen}`}
            alt=""
            width={56}
            height={44}
            sizes="56px"
            className="pointer-events-none size-full object-contain"
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductCard({ producto, eager = false, indice = 0, resaltado = false }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [varianteIdx, setVarianteIdx] = useState(0);
  const visorRef = useRef<HTMLDialogElement>(null);
  const cierreFuera = useCierreAlPulsarFuera();
  const idTitulo = useId();

  // El estado manda; el <dialog> nativo pone el foco atrapado, el Esc y la
  // devolución del foco a la foto al cerrar.
  useEffect(() => {
    const visor = visorRef.current;
    if (!visor) return;
    if (zoomOpen && !visor.open) visor.showModal();
    else if (!zoomOpen && visor.open) visor.close();
  }, [zoomOpen]);

  if (!producto) return null;

  const { sku, nombre, subcategoria, origen, descripcion, especificaciones, variantes } = producto;
  const todasLasVariantes: ProductoVariante[] = variantes ?? (producto.imagen ? [{ imagen: producto.imagen }] : []);
  const totalVariantes = todasLasVariantes.length;
  const varianteActual = todasLasVariantes[varianteIdx] ?? todasLasVariantes[0];
  const specsActual = varianteActual?.especificaciones ?? especificaciones;
  const enlaceCotizacion = generarEnlaceWhatsApp(nombre, sku);
  const conImagen = Boolean(varianteActual) && !imgError;
  const textoAlternativo =
    totalVariantes > 1 ? `${nombre} — ${etiquetaVariante(varianteActual, varianteIdx, totalVariantes)}` : nombre;

  const elegirVariante = (i: number) => {
    setVarianteIdx(((i % totalVariantes) + totalVariantes) % totalVariantes);
    setImgError(false);
  };

  const alTeclearEnVisor = (evento: KeyboardEvent<HTMLDialogElement>) => {
    if (totalVariantes < 2) return;
    if (evento.key === "ArrowRight") elegirVariante(varianteIdx + 1);
    else if (evento.key === "ArrowLeft") elegirVariante(varianteIdx - 1);
  };

  return (
    <Reveal
      as="article"
      id={sku}
      tabIndex={-1}
      aria-labelledby={idTitulo}
      data-resaltado={resaltado ? "true" : undefined}
      delay={(indice % 2) as PasoReveal}
      className={cn(
        estilos.tarjeta,
        "card-hover group relative flex flex-col rounded-[4px] border border-zinc-200 bg-white hover:border-brand/30 focus:outline-none"
      )}
    >
      <span aria-hidden="true" className={estilos.anillo} />

      <TechFrame always={resaltado} className="rounded-t-[3px] bg-surface">
        <div className="relative aspect-[4/3] overflow-clip rounded-t-[3px] border-b border-zinc-200">
          {conImagen && varianteActual ? (
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              aria-haspopup="dialog"
              className="group/foto absolute inset-0 block cursor-zoom-in p-6 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent sm:p-8"
            >
              <span className="relative block size-full">
                <Image
                  src={`/images/productos/${varianteActual.imagen}`}
                  alt={textoAlternativo}
                  fill
                  sizes={CARD_SIZES}
                  loading={eager ? "eager" : "lazy"}
                  onError={() => setImgError(true)}
                  className="pointer-events-none object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </span>
              <span className="sr-only">Ampliar la imagen</span>
              {/* Pista visual (el texto accesible ya va arriba): espera bajo el borde
                  de la foto, recortada, y sube con el cursor o el foco; en pantallas
                  táctiles, sin cursor, queda siempre a la vista. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 translate-y-[calc(100%+1.5rem)] items-center gap-1.5 rounded-full bg-brand-deep/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible/foto:translate-y-0 pointer-coarse:translate-y-0 motion-reduce:transition-none"
              >
                <Maximize2 className="size-3" />
                Ampliar
              </span>
            </button>
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 p-6 text-center">
              <ImageOff aria-hidden="true" className="size-8 text-zinc-400" strokeWidth={1.25} />
              <span className="text-xs font-medium text-zinc-600">Imagen no disponible</span>
            </div>
          )}
          {/* Regla graduada: el mismo lenguaje de la regla kilométrica del borde. */}
          <span aria-hidden="true" className={cn(estilos.regla, "pointer-events-none absolute inset-x-0 bottom-0 h-2")} />
        </div>
      </TechFrame>

      {totalVariantes > 1 && (
        <VariantStrip variantes={todasLasVariantes} selected={varianteIdx} onSelect={elegirVariante} nombre={nombre} />
      )}

      {/* .tech-corners: las dos marcas que asoman al pasar el cursor por la tarjeta. */}
      <div className="tech-corners relative flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="rounded-[2px] bg-brand-deep px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-accent tabular-nums">
            {sku}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-600">{subcategoria}</span>
          {totalVariantes > 1 && (
            <span className="ml-auto text-[11px] font-medium text-zinc-600 tabular-nums" aria-live="polite">
              {String(varianteIdx + 1).padStart(2, "0")}/{String(totalVariantes).padStart(2, "0")}
              <span className="sr-only"> modelos</span>
            </span>
          )}
        </div>

        <h3
          id={idTitulo}
          className="mt-4 font-titulo text-lg leading-snug font-semibold tracking-tight text-balance text-brand sm:text-xl"
        >
          {nombre}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-zinc-600">{descripcion}</p>

        <TechnicalTable especificaciones={specsActual} titulo="Especificaciones" className="mt-6" />

        <div className="mt-auto pt-6">
          <p className="text-xs leading-relaxed text-zinc-500">
            <span className="font-semibold uppercase tracking-[0.14em] text-zinc-600">Origen</span>
            <span aria-hidden="true" className="mx-2 inline-block size-1 bg-accent align-middle" />
            {origen}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <BotonAgregarCotizacion sku={sku} nombre={nombre} linea="railway" variante="compacto" className="grow" />
            <Boton
              href={enlaceCotizacion}
              externo
              icono="whatsapp"
              variante="secundario"
              aria-label={`Cotizar ${nombre} por WhatsApp (se abre en una pestaña nueva)`}
              className="spotlight grow border-accent px-4 text-[11px] tracking-[0.14em] hover:bg-accent hover:text-brand-deep"
            >
              Cotizar
            </Boton>
          </div>
        </div>
      </div>

      <dialog
        ref={visorRef}
        aria-label={`Imagen ampliada: ${nombre}`}
        closedby="any"
        data-lenis-prevent=""
        onClose={() => setZoomOpen(false)}
        onKeyDown={alTeclearEnVisor}
        {...cierreFuera}
        className={cn(
          estilos.visor,
          "m-auto h-[min(90svh,60rem)] max-h-none w-[min(72rem,calc(100%-1.5rem))] max-w-none overflow-visible bg-transparent p-0 text-white",
          "open:flex open:flex-col"
        )}
      >
        {zoomOpen && varianteActual && (
          <>
            <div className="flex items-center justify-between gap-4 pb-3">
              <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                <span className="text-accent">{sku}</span> — {nombre}
              </p>
              <button
                type="button"
                onClick={() => visorRef.current?.close()}
                aria-label="Cerrar la imagen"
                className={BOTON_VISOR}
              >
                <X aria-hidden="true" className="size-6" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <Image
                src={`/images/productos/${varianteActual.imagen}`}
                alt={textoAlternativo}
                fill
                sizes="(max-width: 1200px) 96vw, 1152px"
                quality={90}
                className="object-contain"
              />
            </div>

            {totalVariantes > 1 && (
              <div className="flex items-center justify-center gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => elegirVariante(varianteIdx - 1)}
                  aria-label="Modelo anterior"
                  className={BOTON_VISOR}
                >
                  <ChevronLeft aria-hidden="true" className="size-5" />
                </button>
                <p aria-live="polite" className="min-w-24 text-center text-xs font-semibold tracking-[0.16em] tabular-nums">
                  {etiquetaVariante(varianteActual, varianteIdx, totalVariantes)}
                </p>
                <button
                  type="button"
                  onClick={() => elegirVariante(varianteIdx + 1)}
                  aria-label="Modelo siguiente"
                  className={BOTON_VISOR}
                >
                  <ChevronRight aria-hidden="true" className="size-5" />
                </button>
              </div>
            )}
          </>
        )}
      </dialog>
    </Reveal>
  );
}
