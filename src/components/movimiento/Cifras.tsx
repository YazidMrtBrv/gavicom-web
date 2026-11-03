"use client";

import { useEffect, useRef } from "react";

const formato = (n: number) => n.toLocaleString("es-CO");

export type Cifra = {
  valor: number;
  // Main label. A "\n" breaks it into lines, so short labels can be stacked
  // without the caller passing markup to a client component.
  texto: string;
  // Optional quieter line under the label (for example, where it was made).
  detalle?: string;
  // Text glued before and after the number, such as "+" or " t".
  antes?: string;
  despues?: string;
};

const columnas: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

// Real figures that count up the first time they show. With reduced motion
// the final value is printed by the server and never touched.
export default function Cifras({ cifras, claro = false }: { cifras: Cifra[]; claro?: boolean }) {
  const lista = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ul = lista.current;
    if (!ul) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const numeros = [...ul.querySelectorAll<HTMLElement>("[data-valor]")];
    numeros.forEach((n) => (n.textContent = "0"));
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1400;
      const paso = (ahora: number) => {
        const k = Math.min(1, (ahora - t0) / dur);
        const suave = 1 - Math.pow(1 - k, 3);
        numeros.forEach((n) => (n.textContent = formato(Math.round(Number(n.dataset.valor) * suave))));
        if (k < 1) raf = requestAnimationFrame(paso);
      };
      raf = requestAnimationFrame(paso);
    }, { threshold: 0.4 });
    io.observe(ul);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      // Leave the real numbers in place if the effect is torn down mid-count.
      numeros.forEach((n) => (n.textContent = formato(Number(n.dataset.valor))));
    };
  }, []);

  return (
    <ul ref={lista} className={`grid gap-4 sm:gap-8 ${columnas[cifras.length] ?? "grid-cols-2 lg:grid-cols-4"}`}>
      {cifras.map((c) => (
        <li key={`${c.antes ?? ""}${c.valor}${c.texto}`} className={`border-t-2 pt-3 ${claro ? "border-white/60" : "border-azul"}`}>
          {/* Screen readers get the final figure once, not the count. */}
          <span className={`block font-titulo font-bold text-4xl sm:text-6xl tabular-nums leading-none ${claro ? "text-white" : "text-azul"}`}>
            <span aria-hidden>
              {c.antes}
              <span data-valor={c.valor}>{formato(c.valor)}</span>
              {c.despues}
            </span>
            <span className="sr-only">{`${c.antes ?? ""}${formato(c.valor)}${c.despues ?? ""}`}</span>
          </span>
          <span className={`block mt-2 text-sm sm:text-base whitespace-pre-line ${claro ? "text-white/75" : "text-tenue"}`}>{c.texto}</span>
          {c.detalle && <span className={`block mt-1 font-mono text-xs uppercase tracking-wider ${claro ? "text-white/75" : "text-tenue"}`}>{c.detalle}</span>}
        </li>
      ))}
    </ul>
  );
}
