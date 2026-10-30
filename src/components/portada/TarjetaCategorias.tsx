"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type FocusEvent } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import TechFrame from "@/components/motion/TechFrame";
import Boton from "@/components/ui/Boton";
import { cn } from "@/lib/cn";
import estilos from "./portada.module.css";

export interface CategoriaResumen {
  nombre: string;
  total: number;
  subcategorias: string[];
}

interface TarjetaCategoriasProps {
  categorias: CategoriaResumen[];
  /** Índice de categoría de cada referencia visible, en el orden del catálogo. */
  mapa: number[];
  intervaloMs?: number;
}

const CONSULTA_REDUCIDO = "(prefers-reduced-motion: reduce)";

function suscribirMovimiento(avisar: () => void) {
  const consulta = window.matchMedia(CONSULTA_REDUCIDO);
  consulta.addEventListener("change", avisar);
  return () => consulta.removeEventListener("change", avisar);
}
const leerMovimientoReducido = () => window.matchMedia(CONSULTA_REDUCIDO).matches;
// En el servidor no se rota: el HTML llega quieto en la primera categoría.
const movimientoReducidoEnServidor = () => true;

function dosCifras(n: number): string {
  return String(n).padStart(2, "0");
}

const BOTON_CONTROL =
  "flex size-11 items-center justify-center rounded-[4px] border border-zinc-300 text-brand transition-colors hover:border-brand hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/*
 * Tarjeta que recorre las categorías del catálogo (01/0N). Avanza sola cada
 * ~4 s y se detiene con el cursor encima, con el foco dentro, fuera de
 * pantalla, con el botón de pausa o si el visitante pidió menos movimiento.
 * El temporizador es la propia barra de progreso (animación CSS): al pausarla,
 * el tiempo queda congelado donde iba.
 */
export default function TarjetaCategorias({ categorias, mapa, intervaloMs = 4000 }: TarjetaCategoriasProps) {
  const total = categorias.length;
  const totalReferencias = mapa.length;
  const raizRef = useRef<HTMLDivElement>(null);

  const [indice, setIndice] = useState(0);
  const [haCambiado, setHaCambiado] = useState(false);
  const [pausadaPorUsuario, setPausadaPorUsuario] = useState(false);
  const [cursorEncima, setCursorEncima] = useState(false);
  const [focoDentro, setFocoDentro] = useState(false);
  const [enPantalla, setEnPantalla] = useState(false);
  const movimientoReducido = useSyncExternalStore(
    suscribirMovimiento,
    leerMovimientoReducido,
    movimientoReducidoEnServidor
  );

  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return;
    const observador = new IntersectionObserver(([entrada]) => setEnPantalla(Boolean(entrada?.isIntersecting)), {
      threshold: 0.35,
    });
    observador.observe(raiz);
    return () => observador.disconnect();
  }, []);

  const ir = useCallback(
    (destino: number) => {
      setIndice(((destino % total) + total) % total);
      setHaCambiado(true);
    },
    [total]
  );

  const rota = total > 1 && !movimientoReducido && !pausadaPorUsuario;
  const avanza = rota && !cursorEncima && !focoDentro && enPantalla;
  const actual = categorias[indice];

  const alSalirFoco = (evento: FocusEvent<HTMLDivElement>) => {
    if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) setFocoDentro(false);
  };

  if (!actual) return null;

  return (
    <TechFrame className="neon-chase rounded-[4px] bg-white">
      <div
        ref={raizRef}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Categorías del catálogo Railway"
        onPointerEnter={(e) => e.pointerType === "mouse" && setCursorEncima(true)}
        onPointerLeave={() => setCursorEncima(false)}
        onFocus={() => setFocoDentro(true)}
        onBlur={alSalirFoco}
        className="p-6 sm:p-8 lg:p-10"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="font-titulo leading-none text-brand tabular-nums">
            <span className="text-5xl font-semibold tracking-tight sm:text-6xl">{dosCifras(indice + 1)}</span>
            <span className="ml-2 text-lg font-medium text-zinc-500">/ {dosCifras(total)}</span>
            <span className="sr-only"> categorías</span>
          </p>

          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => ir(indice - 1)} aria-label="Categoría anterior" className={BOTON_CONTROL}>
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            {total > 1 && !movimientoReducido && (
              <button
                type="button"
                onClick={() => setPausadaPorUsuario((pausada) => !pausada)}
                aria-label={pausadaPorUsuario ? "Reanudar el recorrido automático" : "Pausar el recorrido automático"}
                className={BOTON_CONTROL}
              >
                {pausadaPorUsuario ? (
                  <Play aria-hidden="true" className="size-4" />
                ) : (
                  <Pause aria-hidden="true" className="size-4" />
                )}
              </button>
            )}
            <button type="button" onClick={() => ir(indice + 1)} aria-label="Categoría siguiente" className={BOTON_CONTROL}>
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>

        {/* Progreso segmentado: las pasadas en azul, la actual se llena con el tiempo. */}
        <div className="mt-6 flex gap-1.5">
          {categorias.map((categoria, i) => (
            <button
              key={categoria.nombre}
              type="button"
              onClick={() => ir(i)}
              aria-label={`Ver la categoría ${i + 1} de ${total}: ${categoria.nombre}`}
              aria-current={i === indice ? "true" : undefined}
              className="group/segmento flex h-6 flex-1 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="relative block h-0.5 w-full overflow-clip bg-zinc-200 transition-colors group-hover/segmento:bg-zinc-300">
                {i < indice && <span className="absolute inset-0 bg-brand" />}
                {i === indice &&
                  (rota ? (
                    <span
                      key={`progreso-${indice}`}
                      className={cn(estilos.progresoRotacion, "absolute inset-0 bg-accent")}
                      style={{ animationDuration: `${intervaloMs}ms`, animationPlayState: avanza ? "running" : "paused" }}
                      onAnimationEnd={() => ir(indice + 1)}
                    />
                  ) : (
                    <span className="absolute inset-0 bg-accent" />
                  ))}
              </span>
            </button>
          ))}
        </div>

        <div aria-live={avanza ? "off" : "polite"} aria-atomic="true">
          <div key={indice} className={cn("mt-8 min-h-48 sm:min-h-40", haCambiado && estilos.entradaCategoria)}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600">Categoría</p>
            <p className="mt-3 font-titulo text-3xl font-semibold leading-[1.08] tracking-tight text-brand text-balance sm:text-4xl">
              {actual.nombre}
            </p>
            <p className="mt-3 text-sm text-zinc-600">
              <span className="font-semibold text-brand tabular-nums">{actual.total}</span>{" "}
              {actual.total === 1 ? "referencia" : "referencias"}
              {actual.subcategorias.length > 0 && " en:"}
            </p>
            {actual.subcategorias.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {actual.subcategorias.map((sub) => (
                  <li
                    key={sub}
                    className="rounded-[2px] border border-zinc-200 bg-surface px-2.5 py-1 text-xs text-zinc-700"
                  >
                    {sub}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* El catálogo entero en una tira: cada marca es una referencia y se
            resaltan las de la categoría actual, en el orden en que aparecen. */}
        <div className="mt-8 border-t border-zinc-100 pt-6">
          <div aria-hidden="true" className="flex h-8 gap-px">
            {mapa.map((categoriaDeLaReferencia, i) => (
              <span
                key={i}
                className={cn(
                  "flex-1 transition-colors duration-500",
                  categoriaDeLaReferencia === indice ? "bg-brand" : "bg-zinc-200"
                )}
                style={{ transitionDelay: `${i * 6}ms` }}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p className="text-xs text-zinc-600 tabular-nums">
              {actual.total} de {totalReferencias} referencias del catálogo
            </p>
            <Boton href="/catalogo" variante="enlace" icono="flecha">
              Ver en el catálogo
            </Boton>
          </div>
        </div>
      </div>
    </TechFrame>
  );
}
