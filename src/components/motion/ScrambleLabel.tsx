"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface ScrambleLabelProps {
  /** Texto final, p. ej. "S.01 — RAILWAY". Es el que llega en el HTML. */
  text: string;
  className?: string;
  as?: "p" | "span" | "div";
}

const GLIFOS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·—";
const DURACION_MS = 700;
const CAMBIO_GLIFO_MS = 45;

function glifoAleatorio(): string {
  return GLIFOS[Math.floor(Math.random() * GLIFOS.length)];
}

/*
 * Ola de izquierda a derecha: cada carácter empieza a cambiar un poco después
 * que el anterior y se fija también en orden, hasta quedar el texto final.
 * Devuelve el texto para el instante t (0..1).
 */
function fotograma(texto: string, t: number, glifos: string[]): string {
  const largo = texto.length;
  let salida = "";
  for (let i = 0; i < largo; i++) {
    const caracter = texto[i];
    const posicion = largo > 1 ? i / (largo - 1) : 0;
    const empieza = posicion * 0.35;
    const termina = 0.3 + posicion * 0.7;
    salida += caracter.trim() && t >= empieza && t < termina ? glifos[i] : caracter;
  }
  return salida;
}

export default function ScrambleLabel({ text, className, as: Etiqueta = "p" }: ScrambleLabelProps) {
  const raizRef = useRef<HTMLElement | null>(null);
  const animadoRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    const animado = animadoRef.current;
    if (!raiz || !animado) return;
    animado.textContent = text;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let inicio = 0;
    let ultimoCambio = -Infinity;
    const glifos = Array.from(text, glifoAleatorio);

    const paso = (ahora: number) => {
      inicio ||= ahora;
      const transcurrido = ahora - inicio;
      const t = Math.min(1, transcurrido / DURACION_MS);
      // Los glifos se renuevan cada ~45 ms: a 60 fps el parpadeo sería ilegible.
      if (transcurrido - ultimoCambio >= CAMBIO_GLIFO_MS) {
        for (let i = 0; i < glifos.length; i++) glifos[i] = glifoAleatorio();
        ultimoCambio = transcurrido;
      }
      animado.textContent = fotograma(text, t, glifos);
      if (t < 1) frame = requestAnimationFrame(paso);
      else animado.textContent = text;
    };

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return;
        observador.disconnect();
        frame = requestAnimationFrame(paso);
      },
      { threshold: 0.6 }
    );
    observador.observe(raiz);

    return () => {
      observador.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [text]);

  return (
    <Etiqueta
      ref={(nodo: HTMLElement | null) => {
        raizRef.current = nodo;
      }}
      className={cn(
        "inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase leading-none tracking-[0.25em] text-brand tabular-nums",
        className
      )}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
      <span className="sr-only">{text}</span>
      {/* La copia invisible reserva el ancho del texto final: los glifos
          aleatorios se pintan encima sin mover nada alrededor. select-none
          evita que al copiar salga el texto dos veces (este y el sr-only). */}
      <span aria-hidden="true" className="relative inline-block select-none whitespace-nowrap">
        <span className="invisible">{text}</span>
        <span ref={animadoRef} className="absolute inset-0">
          {text}
        </span>
      </span>
    </Etiqueta>
  );
}
