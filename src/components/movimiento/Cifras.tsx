"use client";

import { useEffect, useRef } from "react";

// Real figures from the catalogue that count up the first time they show.
export default function Cifras({ cifras }: { cifras: { valor: number; texto: string }[] }) {
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
        numeros.forEach((n) => (n.textContent = String(Math.round(Number(n.dataset.valor) * suave))));
        if (k < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    }, { threshold: 0.4 });
    io.observe(ul);
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={lista} className="grid grid-cols-3 gap-4 sm:gap-8">
      {cifras.map((c) => (
        <li key={c.texto} className="border-t-2 border-azul pt-3">
          <span data-valor={c.valor} className="block font-titulo font-bold text-4xl sm:text-6xl text-azul tabular-nums leading-none">
            {c.valor}
          </span>
          <span className="block mt-2 text-sm sm:text-base text-tenue">{c.texto}</span>
        </li>
      ))}
    </ul>
  );
}
