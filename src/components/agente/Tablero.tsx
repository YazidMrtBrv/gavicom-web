"use client";

import { useEffect, useRef, useState } from "react";
import { calcularTablero } from "@/lib/agente/tablero";
import { plataCorta } from "@/lib/agente/precios";
import type { Cotizacion } from "@/lib/agente/tipos";

// Money first: what was quoted, what came in, what got away and why. The
// numbers move while the demo runs, because the session's quotes count too.

function useCifra(objetivo: number): number {
  const [valor, setValor] = useState(objetivo);
  const desde = useRef(objetivo);
  useEffect(() => {
    const inicio = desde.current;
    if (inicio === objetivo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      desde.current = objetivo;
      setValor(objetivo);
      return;
    }
    const t0 = performance.now();
    let id = 0;
    const paso = (t: number) => {
      const k = Math.min(1, (t - t0) / 700);
      const v = inicio + (objetivo - inicio) * (1 - Math.pow(1 - k, 3));
      setValor(v);
      if (k < 1) id = requestAnimationFrame(paso);
      else desde.current = objetivo;
    };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
  }, [objetivo]);
  return valor;
}

function Ficha({ etiqueta, valor, detalle, fuerte }: { etiqueta: string; valor: number; detalle: string; fuerte?: boolean }) {
  const v = useCifra(valor);
  // "$438 millones": the number carries the weight, the unit stays small.
  const [numero, ...resto] = plataCorta(v).split(" ");
  const unidad = resto.join(" ");
  return (
    <div className={`rounded-2xl p-5 ${fuerte ? "bg-azul text-white" : "bg-white border border-linea"}`}>
      <p className={`t-nombre ${fuerte ? "text-white/80" : "text-tenue"}`}>{etiqueta}</p>
      <p className={`mt-2 flex flex-wrap items-baseline gap-x-2 ${fuerte ? "text-white" : "text-azul"}`}>
        <span className="t-cifra">{numero}</span>
        {unidad && <span className="t-nombre">{unidad}</span>}
      </p>
      <p className={`mt-2 text-sm ${fuerte ? "text-white/75" : "text-tenue"}`}>{detalle}</p>
    </div>
  );
}

export default function Tablero({ cotizaciones }: { cotizaciones: Cotizacion[] }) {
  const t = calcularTablero(cotizaciones);
  const maxMotivo = Math.max(1, ...t.motivos.map((m) => m.plata));
  const n = t.cantidad;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Ficha fuerte etiqueta="Cotizado (60 días)" valor={t.cotizado} detalle={`${n.total} cotizaciones con precio de Geimar`} />
        <Ficha etiqueta="Ganado" valor={t.ganado} detalle={`${n.ganadas} aprobadas${t.tasaCierre != null ? ` · ${Math.round(t.tasaCierre * 100)}% de las cerradas` : ""}`} />
        <Ficha etiqueta="Perdido" valor={t.perdido} detalle={`${n.perdidas} que no se dieron`} />
        <Ficha etiqueta="En juego" valor={t.abierto} detalle={`${n.abiertas} esperando respuesta del cliente`} />
      </div>

      <div className="mt-4 rounded-2xl border border-linea bg-white p-5">
        <h3 className="t-tarjeta text-azul">Por qué se perdió la plata</h3>
        <p className="mt-1 text-sm text-tenue">El agente le pregunta el motivo al cliente cuando dice que no, y lo anota solo.</p>
        <ul className="mt-4 grid gap-3">
          {t.motivos.map((m) => (
            <li key={m.motivo} className="grid grid-cols-[minmax(0,11rem)_1fr_auto] items-center gap-3" title={`${m.nombre}: ${plataCorta(m.plata)} en ${m.veces} ${m.veces === 1 ? "cotización" : "cotizaciones"}`}>
              <span className="text-sm text-tinta truncate">{m.nombre}</span>
              <span className="h-3 rounded-full bg-gris overflow-hidden" aria-hidden="true">
                <span className="agente-barra-motivo block h-full rounded-full bg-azul" style={{ width: `${(m.plata / maxMotivo) * 100}%` }} />
              </span>
              <span className="t-dato text-tinta">
                {plataCorta(m.plata)} · {m.veces}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
