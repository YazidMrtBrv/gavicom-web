"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import { NOTA_LEY_1715, SEGMENTOS, type Segmento } from "@/constants/energy";
import IconoEnergia from "./IconosEnergia";

/*
 * Why solar, told for the visitor's own case. A home, a shop and a plant buy
 * for different reasons, so the three share one place and the visitor picks
 * theirs; the benefits swap underneath. The call to action carries the choice
 * to the calculator ("gavicom:segmento"), which presets a typical consumption
 * and the installation type, so the next number they see is about them.
 */

export const EVENTO_SEGMENTO = "gavicom:segmento";

// Small drawings for the three tabs, in the hero's line style.
const DIBUJO: Record<Segmento["id"], ReactNode> = {
  hogar: <path d="M4 26 V13 L14 5 L24 13 V26 Z M11 26 V18 H17 V26 M8 12.5 L14 8 L20 12.5" />,
  comercio: <path d="M3 26 H25 M5 26 V13 H23 V26 M3 13 H25 L23 7 H5 Z M9 26 V19 H15 V26 M18 17 H21 V21 H18 Z" />,
  industria: <path d="M3 26 V12 L9 8 V12 L15 8 V12 L21 8 V26 Z M3 26 H25 M21 26 V4 H25 V26 M8 18 H11 M14 18 H17" />,
};

const DESTINO: Record<Segmento["id"], string> = {
  hogar: "tu casa",
  comercio: "tu comercio",
  industria: "tu planta",
};

export default function PorQueSolar() {
  const [activa, setActiva] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = SEGMENTOS[activa];

  const ir = (i: number) => {
    const n = (i + SEGMENTOS.length) % SEGMENTOS.length;
    setActiva(n);
    tabs.current[n]?.focus();
  };
  const teclas = (e: KeyboardEvent<HTMLDivElement>) => {
    const mapa: Record<string, () => void> = {
      ArrowRight: () => ir(activa + 1),
      ArrowLeft: () => ir(activa - 1),
      Home: () => ir(0),
      End: () => ir(SEGMENTOS.length - 1),
    };
    const accion = mapa[e.key];
    if (accion) {
      e.preventDefault();
      accion();
    }
  };

  return (
    <div className="grid gap-8">
      <div
        role="tablist"
        aria-label="Tipo de proyecto"
        onKeyDown={teclas}
        className="grid grid-cols-3 border border-linea rounded-sm p-1 gap-1 max-w-xl bg-gris"
      >
        {SEGMENTOS.map((x, i) => {
          const on = i === activa;
          return (
            <button
              key={x.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`seg-${x.id}`}
              aria-selected={on}
              aria-controls="panel-segmento"
              tabIndex={on ? 0 : -1}
              onClick={() => setActiva(i)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 min-h-14 px-2 rounded-sm text-sm sm:text-base font-semibold transition-colors duration-200 ${
                on ? "bg-azul text-white" : "text-tinta hover:bg-white hover:text-azul"
              }`}
            >
              <svg aria-hidden width={26} height={26} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round">
                {DIBUJO[x.id]}
              </svg>
              {x.nombre}
            </button>
          );
        })}
      </div>

      <div id="panel-segmento" role="tabpanel" aria-labelledby={`seg-${s.id}`} className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        <div key={`e-${s.id}`} className="aparecer-rapido flex flex-col gap-6">
          <p className="font-titulo text-2xl md:text-[28px] leading-snug font-semibold text-azul">{s.entrada}</p>
          {/* Shops and plants get the incentive as a benefit card; homes get
              the same careful note here, so it is never said twice. */}
          {!s.beneficios.some((b) => b.icono === "ley") && (
            <p className="border-l-2 border-azul pl-4 text-sm text-tenue">{NOTA_LEY_1715}</p>
          )}
          <a
            href="#cotizar"
            onClick={() => window.dispatchEvent(new CustomEvent(EVENTO_SEGMENTO, { detail: s.id }))}
            className="boton-iman self-start inline-flex items-center gap-2 min-h-12 px-5 rounded-sm bg-azul text-white font-semibold hover:bg-azul-hover"
          >
            Calcular para {DESTINO[s.id]}
            <ArrowDown size={18} aria-hidden />
          </a>
        </div>

        <ul key={`b-${s.id}`} className="grid gap-px bg-linea border border-linea sm:grid-cols-2">
          {s.beneficios.map((b, i) => (
            <li
              key={b.titulo}
              className="aparecer-rapido bg-white p-5 md:p-6 flex flex-col gap-3"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
            >
              <span className="text-azul">
                <IconoEnergia nombre={b.icono} />
              </span>
              <h3 className="font-titulo text-lg font-bold text-azul leading-snug">{b.titulo}</h3>
              <p className="text-tinta/85">{b.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
