"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export interface ItemIndice {
  sku: string;
  nombre: string;
  ancla: string;
}

const dosCifras = (n: number) => String(n).padStart(2, "0");

/*
 * Índice lateral dibujado como un diagrama de línea: cada servicio es una
 * estación y el tramo de riel se llena al dejarla atrás. La estación actual es
 * la ficha que cruza la franja central de la pantalla. En el HTML del servidor
 * no hay ninguna marcada (no se sabe dónde está el visitante) y los enlaces
 * funcionan igual sin JS.
 */
export default function IndiceServicios({ items, className }: { items: ItemIndice[]; className?: string }) {
  const [activo, setActivo] = useState(-1);

  useEffect(() => {
    const objetivos = items
      .map((item) => document.getElementById(item.ancla))
      .filter((nodo): nodo is HTMLElement => nodo !== null);
    if (objetivos.length === 0) return;

    const enFranja = new Set<string>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) enFranja.add(entrada.target.id);
          else enFranja.delete(entrada.target.id);
        }
        const indice = items.findIndex((item) => enFranja.has(item.ancla));
        if (indice !== -1) {
          setActivo(indice);
          return;
        }
        // Entre dos fichas se conserva la última; por encima de la primera,
        // ninguna (el visitante volvió a la cabecera de la página).
        if (objetivos[0].getBoundingClientRect().top > window.innerHeight / 2) setActivo(-1);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    objetivos.forEach((objetivo) => observador.observe(objetivo));
    return () => observador.disconnect();
  }, [items]);

  return (
    <nav aria-labelledby="titulo-indice-servicios" className={className}>
      <div className="flex items-baseline justify-between gap-4 border-b border-zinc-300 pb-4">
        <p
          id="titulo-indice-servicios"
          className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand"
        >
          Índice de servicios
        </p>
        <p aria-hidden="true" className="text-[11px] font-semibold tracking-[0.2em] text-zinc-600 tabular-nums">
          {activo >= 0 ? dosCifras(activo + 1) : "00"}
          <span className="px-1 text-zinc-400">/</span>
          {dosCifras(items.length)}
        </p>
      </div>

      <ol className="mt-6">
        {items.map((item, i) => {
          const actual = i === activo;
          const pasada = i < activo;
          return (
            <li key={item.sku} className="relative pb-4 pl-9 last:pb-0">
              {i < items.length - 1 && (
                <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-5 w-0.5 bg-zinc-300">
                  <span
                    className={cn(
                      "absolute inset-0 origin-top bg-brand transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                      pasada ? "scale-y-100" : "scale-y-0"
                    )}
                  />
                </span>
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-1 size-4 rounded-full border-2 transition-[background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none",
                  actual
                    ? "border-brand-deep bg-accent shadow-[0_0_0_4px_rgb(232_146_12/0.22)]"
                    : pasada
                      ? "border-brand bg-brand"
                      : "border-zinc-300 bg-surface"
                )}
              />
              <a
                href={`#${item.ancla}`}
                aria-current={actual ? "true" : undefined}
                className="group/estacion block rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <span className="block text-[11px] font-semibold tracking-[0.2em] text-zinc-600 tabular-nums">
                  {dosCifras(i + 1)} · {item.sku}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-sm leading-snug transition-colors duration-300 group-hover/estacion:text-brand",
                    actual ? "font-semibold text-brand" : "font-medium text-zinc-600"
                  )}
                >
                  {item.nombre}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
