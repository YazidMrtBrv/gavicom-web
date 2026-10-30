"use client";

import { useState, type ReactNode } from "react";
import TechFrame from "@/components/motion/TechFrame";
import ColombiaMap, { LEYENDA_ALTITUD } from "@/components/ui/ColombiaMap";
import { COMPANIA_INFO } from "@/constants/productos";
import { cn } from "@/lib/cn";
import { ZONAS_COBERTURA, type ClaveZona } from "./zonasCobertura";

const TOTAL_DEPARTAMENTOS = ZONAS_COBERTURA.reduce((suma, zona) => suma + zona.departamentos.length, 0);

function dosCifras(n: number): string {
  return String(n).padStart(2, "0");
}

function FlechaNorte() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 22" className="h-5 w-auto" fill="none">
      <path d="M8 1L14 19L8 15L2 19Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M8 1L8 15L2 19Z" fill="currentColor" />
    </svg>
  );
}

/*
 * Mapa y lista de zonas comparten la zona activa. El cursor (o el foco) da una
 * vista previa; el clic o el toque la deja fijada hasta volver a pulsarla.
 */
export default function MapaCobertura({ encabezado }: { encabezado: ReactNode }) {
  const [previa, setPrevia] = useState<ClaveZona | null>(null);
  const [fijada, setFijada] = useState<ClaveZona | null>(null);
  const activa = previa ?? fijada;
  const zonaActiva = ZONAS_COBERTURA.find((zona) => zona.clave === activa);

  const alternar = (zona: ClaveZona | null) =>
    setFijada((actual) => (zona === null || actual === zona ? null : zona));

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-10 xl:gap-x-16">
      <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1">{encabezado}</div>

      <div className="lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1">
        <TechFrame className="rounded-[4px] border border-zinc-200 bg-white p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600 sm:tracking-[0.25em]">
            <span>Fig. 01 — Cobertura operativa</span>
            <span className="flex items-center gap-1.5 text-brand">
              <FlechaNorte />N
            </span>
          </div>

          <div className="relative mx-auto mt-4 max-w-[34rem]">
            <ColombiaMap activa={activa} alPrevisualizar={setPrevia} alFijar={alternar} />

            {/* Cajetín de plano: repite lo que dice la lista (por eso aria-hidden),
                pegado a la esquina del mapa donde no hay territorio. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 hidden w-40 rounded-[2px] border border-zinc-200 bg-white/90 p-3 text-[11px] leading-snug backdrop-blur-sm sm:block"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 whitespace-nowrap border-b border-zinc-100 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em]">
                <span className="text-brand">{zonaActiva ? zonaActiva.zona : "Sede"}</span>
                <span className="text-zinc-600 tabular-nums">
                  {zonaActiva ? `${dosCifras(zonaActiva.departamentos.length)} dptos.` : "GAVICOM"}
                </span>
              </div>
              {zonaActiva ? (
                <>
                  <ul className="mt-2 space-y-1 text-brand">
                    {zonaActiva.departamentos.map((departamento) => (
                      <li key={departamento} className="flex items-center gap-2">
                        <span className="size-1 shrink-0 bg-brand" />
                        {departamento}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 border-t border-zinc-100 pt-2 text-zinc-600">{zonaActiva.desc}</p>
                </>
              ) : (
                <>
                  <p className="mt-2 font-semibold text-brand">
                    {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento}
                  </p>
                  <p className="mt-1 text-zinc-600 tabular-nums">
                    {ZONAS_COBERTURA.length} zonas · {TOTAL_DEPARTAMENTOS} departamentos
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-zinc-100 pt-5 text-[11px] text-zinc-600">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">Altitud</span>
              {LEYENDA_ALTITUD.map((nivel) => (
                <span key={nivel.banda} className="flex items-center gap-1.5 tabular-nums">
                  <span className="size-3 border border-zinc-300" style={{ backgroundColor: nivel.relleno }} />
                  {nivel.rotulo}
                </span>
              ))}
            </span>
            <span className="flex items-center gap-1.5">
              <svg aria-hidden="true" viewBox="0 0 28 10" className="h-2.5 w-7" fill="none">
                <path d="M3 5H25" stroke="#0C2642" strokeWidth="1.5" />
                <circle cx="4" cy="5" r="2.6" fill="#fff" stroke="#0C2642" strokeWidth="1.2" />
                <circle cx="24" cy="5" r="2.6" fill="#fff" stroke="#0C2642" strokeWidth="1.2" />
              </svg>
              Corredor de zona (esquemático)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 border-[1.5px] border-white bg-brand-deep outline outline-1 outline-accent" />
              Sede
            </span>
          </div>
        </TechFrame>
      </div>

      <div className="lg:col-span-5 lg:col-start-8 lg:row-start-2">
        <p id="ayuda-zonas" className="text-xs text-zinc-600">
          Seleccione una zona para resaltarla en el mapa.
        </p>
        <ol className="mt-4 border-t border-zinc-300">
          {ZONAS_COBERTURA.map((zona, i) => {
            const resaltada = activa === zona.clave;
            return (
              <li key={zona.clave}>
                <button
                  type="button"
                  aria-pressed={fijada === zona.clave}
                  aria-describedby="ayuda-zonas"
                  onClick={() => alternar(zona.clave)}
                  onPointerEnter={(evento) => evento.pointerType === "mouse" && setPrevia(zona.clave)}
                  onPointerLeave={(evento) => evento.pointerType === "mouse" && setPrevia(null)}
                  // Solo el foco de teclado da vista previa: en móvil el toque
                  // también enfoca y dejaría la zona encendida tras soltarla.
                  onFocus={(evento) => evento.currentTarget.matches(":focus-visible") && setPrevia(zona.clave)}
                  onBlur={() => setPrevia(null)}
                  className={cn(
                    "relative flex w-full items-start gap-4 border-b border-zinc-300 py-4 pl-4 pr-2 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                    resaltada ? "bg-white" : "hover:bg-white/60"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-y-0 left-0 w-0.5 origin-top bg-accent transition-transform duration-300",
                      resaltada ? "scale-y-100" : "scale-y-0"
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[2px] border text-[11px] font-semibold tabular-nums transition-colors duration-300",
                      resaltada ? "border-brand bg-brand text-white" : "border-zinc-300 bg-white text-brand"
                    )}
                  >
                    {dosCifras(i + 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-base font-semibold text-brand">{zona.zona}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 tabular-nums">
                        {zona.departamentos.length} dptos.
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-zinc-600">{zona.desc}</span>
                    <span className="mt-1.5 block text-xs text-zinc-600">{zona.departamentos.join(" · ")}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <dl className="mt-8 grid grid-cols-2 gap-px border border-zinc-300 bg-zinc-300">
          <div className="bg-surface p-4">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Sede</dt>
            <dd className="mt-1.5 text-sm font-semibold text-brand">
              {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento}
            </dd>
          </div>
          <div className="bg-surface p-4">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Cobertura operativa</dt>
            <dd className="mt-1.5 text-sm font-semibold text-brand">Nacional</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
