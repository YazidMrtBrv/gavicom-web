"use client";

import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";

// Misma escala que la regla kilométrica del borde (PKRuler): 1 px = 0,1 m,
// redondeado a 10 m. Al final de la página las dos lecturas coinciden.
function formatearPK(metros: number): string {
  const kilometros = Math.floor(metros / 1000);
  const resto = String(metros % 1000).padStart(3, "0");
  return `PK ${kilometros}+${resto}`;
}

/*
 * Cierre del pie de página: el largo total de la página leído como punto
 * kilométrico ("fin de vía", solo donde se ve la regla) y el botón para volver
 * al PK 0+000. Al volver, el foco pasa al logotipo del menú para que quien usa
 * teclado no se quede abajo.
 */
export default function FinDeVia() {
  const lecturaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const lectura = lecturaRef.current;
    if (!lectura) return;

    let frame = 0;
    const medir = () => {
      frame = 0;
      const alto = document.documentElement.scrollHeight;
      lectura.textContent = formatearPK(Math.round(alto / 100) * 10);
    };
    const pedirFotograma = () => {
      frame ||= requestAnimationFrame(medir);
    };

    pedirFotograma();
    // El largo cambia al cargar imágenes, al filtrar el catálogo o al navegar.
    const observador = new ResizeObserver(pedirFotograma);
    observador.observe(document.body);
    return () => {
      observador.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const volverArriba = () => {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducido ? "auto" : "smooth" });
    document.querySelector<HTMLElement>("[data-inicio-sitio]")?.focus({ preventScroll: true });
  };

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <p
        aria-hidden="true"
        className="hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600 lg:flex"
      >
        <span className="h-px w-8 bg-zinc-400" />
        Fin de vía
        <span ref={lecturaRef} className="text-brand tabular-nums">
          PK —
        </span>
      </p>
      <button
        type="button"
        onClick={volverArriba}
        className="group inline-flex min-h-11 items-center gap-3 rounded-[4px] border border-zinc-300 bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <ArrowUp
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none"
        />
        Volver arriba
        <span aria-hidden="true" className="hidden border-l border-zinc-300 pl-3 text-zinc-600 tabular-nums lg:inline">
          PK 0+000
        </span>
      </button>
    </div>
  );
}
