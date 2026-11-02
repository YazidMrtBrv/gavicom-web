"use client";

import { useEffect, useRef } from "react";

const formato = (n: number) => n.toLocaleString("es-CO");

// Real figures from the catalogue that count up the first time they show.
export default function Cifras({ cifras, claro = false }: { cifras: { valor: number; texto: string; antes?: string; despues?: string }[]; claro?: boolean }) {
  const lista = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ul = lista.current;
    if (!ul) return;
    const numeros = [...ul.querySelectorAll<HTMLElement>("[data-valor]")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    numeros.forEach((n) => (n.textContent = "0"));
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1400;
      const paso = (ahora: number) => {
        const k = Math.min(1, (ahora - t0) / dur);
        const suave = 1 - Math.pow(1 - k, 3);
        numeros.forEach((n) => (n.textContent = formato(Math.round(Number(n.dataset.valor) * suave))));
        if (k < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    }, { threshold: 0.4 });
    io.observe(ul);
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={lista} className={`grid gap-4 sm:gap-8 ${cifras.length === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-3"}`}>
      {cifras.map((c) => (
        <li key={c.texto} className={`border-t-2 pt-3 ${claro ? "border-white/60" : "border-azul"}`}>
          <span className={`block font-titulo font-bold text-4xl sm:text-6xl tabular-nums leading-none ${claro ? "text-white" : "text-azul"}`}>
            {c.antes}
            <span data-valor={c.valor}>{formato(c.valor)}</span>
            {c.despues}
          </span>
          <span className={`block mt-2 text-sm sm:text-base ${claro ? "text-white/75" : "text-tenue"}`}>{c.texto}</span>
        </li>
      ))}
    </ul>
  );
}
