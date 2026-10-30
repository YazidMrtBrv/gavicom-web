"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface ContadorProps {
  hasta: number;
  sufijo?: string;
  /** Espera antes de arrancar (ms), para escalonar varios contadores. */
  retardo?: number;
  className?: string;
}

const DURACION_MS = 1600;

/*
 * Llega del servidor con la cifra final, que es lo que leen buscadores,
 * asistentes y quien tiene el movimiento reducido. Solo al entrar en pantalla
 * vuelve a cero y cuenta hasta el valor real.
 */
export default function Contador({ hasta, sufijo = "", retardo = 0, className }: ContadorProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(hasta);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let temporizador = 0;

    const contar = () => {
      const inicio = performance.now();
      const paso = (ahora: number) => {
        const t = Math.min((ahora - inicio) / DURACION_MS, 1);
        const suavizado = 1 - Math.pow(1 - t, 3);
        setValor(Math.round(suavizado * hasta));
        if (t < 1) frame = requestAnimationFrame(paso);
      };
      frame = requestAnimationFrame(paso);
    };

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return;
        observador.disconnect();
        temporizador = window.setTimeout(contar, retardo);
      },
      { threshold: 0.6 }
    );
    observador.observe(nodo);

    return () => {
      observador.disconnect();
      window.clearTimeout(temporizador);
      cancelAnimationFrame(frame);
    };
  }, [hasta, retardo]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <span className="sr-only">
        {hasta}
        {sufijo}
      </span>
      {/* El ancho mínimo en ch evita que el bloque salte al pasar de 1 a 2 cifras. */}
      <span aria-hidden="true" className="inline-block" style={{ minWidth: `${String(hasta).length + sufijo.length}ch` }}>
        {valor}
        {sufijo}
      </span>
    </span>
  );
}
