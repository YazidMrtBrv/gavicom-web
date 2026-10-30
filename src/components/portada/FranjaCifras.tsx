import type { ReactNode } from "react";
import Reveal, { type PasoReveal } from "@/components/motion/Reveal";
import ColombiaProud from "@/components/ui/ColombiaProud";
import { COMPANIA_INFO } from "@/constants/productos";
import Contador from "./Contador";

interface FranjaCifrasProps {
  totalReferencias: number;
  totalLineas: number;
}

// Mismas clases en las cuatro celdas para que glifo, cifra y rótulos queden alineados.
const VALOR = "mt-6 flex h-12 items-end font-titulo font-semibold leading-none tracking-tight text-brand sm:h-15";
const ROTULO = "mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand";
const DETALLE = "mt-1.5 text-sm text-zinc-600";

function Celda({ indice, unidad, children }: { indice: number; unidad: string; children: ReactNode }) {
  return (
    <Reveal delay={indice as PasoReveal} className="group relative bg-white py-10 sm:px-8 lg:py-12">
      <div className="mb-6 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600">
        <span className="tabular-nums">{String(indice + 1).padStart(2, "0")}</span>
        <span>{unidad}</span>
      </div>
      {children}
      {/* Riel inferior que se completa al pasar el cursor. */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100 sm:left-8 sm:w-[calc(100%-4rem)]"
      />
    </Reveal>
  );
}

export default function FranjaCifras({ totalReferencias, totalLineas }: FranjaCifrasProps) {
  return (
    <section aria-labelledby="titulo-cifras" className="bg-white pb-16 pt-10 lg:pb-24 lg:pt-16">
      <h2 id="titulo-cifras" className="sr-only">
        GAVICOM en cifras
      </h2>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-px border-y border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
          <Celda indice={0} unidad="Ref.">
            {/* Una marca por referencia visible del catálogo. */}
            <div aria-hidden="true" className="flex h-9 max-w-56 items-end justify-between overflow-clip">
              {Array.from({ length: totalReferencias }, (_, i) => (
                <span key={i} className={i % 10 === 0 ? "h-full w-px bg-brand" : "h-2/3 w-px bg-brand/45"} />
              ))}
            </div>
            <p className={`${VALOR} text-5xl sm:text-6xl`}>
              <Contador hasta={totalReferencias} />
            </p>
            <p className={ROTULO}>Referencias en catálogo</p>
            <p className={DETALLE}>Componentes, herramientas, señalización y servicios técnicos</p>
          </Celda>

          <Celda indice={1} unidad="Líneas">
            <div aria-hidden="true" className="flex h-9 items-stretch gap-1.5">
              <span className="w-9 rounded-[2px] bg-brand" />
              <span className="relative w-9 rounded-[2px] bg-brand-deep">
                <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-accent" />
              </span>
            </div>
            <p className={`${VALOR} text-5xl sm:text-6xl`}>
              <Contador hasta={totalLineas} retardo={120} />
            </p>
            <p className={ROTULO}>Líneas de negocio</p>
            <p className={DETALLE}>Railway Solutions &amp; Supply · Energy</p>
          </Celda>

          <Celda indice={2} unidad="Sede">
            <svg aria-hidden="true" viewBox="0 0 36 36" className="size-9 text-brand" fill="none" stroke="currentColor">
              <circle cx="18" cy="18" r="11" strokeWidth="1.25" />
              <circle cx="18" cy="18" r="2.5" fill="currentColor" stroke="none" />
              <path d="M18 2v9M18 25v9M2 18h9M25 18h9" strokeWidth="1.25" />
            </svg>
            <p className={`${VALOR} text-3xl sm:text-4xl lg:text-[2rem] xl:text-4xl`}>{COMPANIA_INFO.ciudad}</p>
            <p className={ROTULO}>Sede · cobertura nacional</p>
            <p className={DETALLE}>
              {COMPANIA_INFO.departamento}, {COMPANIA_INFO.pais}
            </p>
          </Celda>

          <Celda indice={3} unidad="CO">
            <ColombiaProud />
          </Celda>
        </div>
      </div>
    </section>
  );
}
