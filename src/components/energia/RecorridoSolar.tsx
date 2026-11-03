"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Box, Building2, Cable, SolarPanel, Sun, Zap, type LucideIcon } from "lucide-react";
import BotonCotizar from "@/components/BotonCotizar";

/*
 * How a solar system works, as the path the energy follows from the sun to
 * the load. It is a tab list: each stop is a tab and the panel below says
 * what happens there and what GAVICOM does at that stop, with the quote
 * button of the matching service.
 *
 * Two labelled tracks join the stops: DC (long dashes) from the panels to the
 * inverter and AC (short dashes) from the inverter to the load. Each fills up
 * to the active stop, so the reader sees where the current changes type.
 * Dash length, not only color, tells them apart.
 */
interface Parada {
  id: string;
  nombre: string;
  icono: LucideIcon;
  corriente: "" | "DC" | "AC";
  que: string;
  gavicom?: string;
  servicio?: { sku: string; nombre: string };
}

export const PARADAS: Parada[] = [
  {
    id: "sol",
    nombre: "Sol",
    icono: Sun,
    corriente: "",
    que: "La radiación solar llega a los módulos. En la Costa Caribe hay sol fuerte casi todo el año.",
  },
  {
    id: "paneles",
    nombre: "Paneles",
    icono: SolarPanel,
    corriente: "DC",
    que: "Los módulos fotovoltaicos convierten la luz en corriente continua (DC).",
    gavicom: "Montamos e instalamos el sistema solar en proyectos residenciales, comerciales e industriales.",
    servicio: { sku: "GVC-ENR-02", nombre: "Montaje e instalación" },
  },
  {
    id: "cofre",
    nombre: "Cofre fotovoltaico",
    icono: Box,
    corriente: "DC",
    que: "Los circuitos de los paneles llegan a un cofre metálico con sus protecciones de corriente continua.",
    gavicom: "Fabricamos y suministramos cofres fotovoltaicos metálicos rígidos, con cumplimiento de los requisitos aplicables del RETIE.",
    servicio: { sku: "GVC-ENR-01", nombre: "Cofres fotovoltaicos" },
  },
  {
    id: "inversor",
    nombre: "Inversor",
    icono: Zap,
    corriente: "AC",
    que: "El inversor transforma la corriente continua en alterna (AC), la que usan los equipos y la red.",
    gavicom: "Instalamos las protecciones eléctricas de los dos lados del inversor, en DC y en AC.",
    servicio: { sku: "GVC-ENR-03", nombre: "Protecciones AC y DC" },
  },
  {
    id: "gabinete",
    nombre: "Gabinete AC",
    icono: Cable,
    corriente: "AC",
    que: "El gabinete reúne las protecciones y la conexión de corriente alterna antes de llegar a la carga.",
    gavicom: "Ensamblamos e integramos los gabinetes y sus protecciones.",
    servicio: { sku: "GVC-ENR-04", nombre: "Ensamble e integración" },
  },
  {
    id: "carga",
    nombre: "Tu operación",
    icono: Building2,
    corriente: "AC",
    que: "La energía llega a la casa, el comercio o la planta, y baja lo que se compra a la red.",
    // Only what the four services cover: no commissioning or hand-over promise.
    gavicom: "Montamos, protegemos e integramos los componentes del sistema.",
  },
];

// Indexes where each track starts and ends (panels to inverter, inverter to load).
const DC = [1, 3] as const;
const AC = [3, 5] as const;
const avance = (activa: number, [a, b]: readonly [number, number]) => Math.min(1, Math.max(0, (activa - a) / (b - a)));

export default function RecorridoSolar() {
  const [activa, setActiva] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = PARADAS[activa];
  const Icono = p.icono;

  // The hero drawing links to each stop as #paso-<id>: the browser scrolls to
  // the tab and this selects it, also when the page is opened with that hash.
  useEffect(() => {
    const leer = () => {
      const m = window.location.hash.match(/^#paso-(.+)$/);
      const i = m ? PARADAS.findIndex((x) => x.id === m[1]) : -1;
      if (i >= 0) setActiva(i);
    };
    leer();
    window.addEventListener("hashchange", leer);
    return () => window.removeEventListener("hashchange", leer);
  }, []);

  const ir = (i: number) => {
    const n = (i + PARADAS.length) % PARADAS.length;
    setActiva(n);
    tabs.current[n]?.focus();
  };

  // WAI-ARIA tabs pattern with automatic activation. Both arrow pairs work
  // because the list is horizontal on wide screens and vertical on phones.
  const teclas = (e: KeyboardEvent<HTMLDivElement>) => {
    const mapa: Record<string, () => void> = {
      ArrowRight: () => ir(activa + 1),
      ArrowDown: () => ir(activa + 1),
      ArrowLeft: () => ir(activa - 1),
      ArrowUp: () => ir(activa - 1),
      Home: () => ir(0),
      End: () => ir(PARADAS.length - 1),
    };
    const accion = mapa[e.key];
    if (accion) {
      e.preventDefault();
      accion();
    }
  };

  return (
    <div className="grid gap-6 md:gap-8">
      <div className="recorrido relative" style={{ "--dc": avance(activa, DC), "--ac": avance(activa, AC) } as CSSProperties}>
        {/* Tracks sit behind the stop buttons; purely visual. */}
        <div aria-hidden className="recorrido-base" />
        <div aria-hidden className="recorrido-tramo recorrido-dc">
          <span className="recorrido-relleno" />
          <span className="recorrido-rotulo">
            <span>DC</span>
            <span className="recorrido-rotulo-sep"> · </span>
            <span>corriente continua</span>
          </span>
        </div>
        <div aria-hidden className="recorrido-tramo recorrido-ac">
          <span className="recorrido-relleno" />
          <span className="recorrido-rotulo">
            <span>AC</span>
            <span className="recorrido-rotulo-sep"> · </span>
            <span>corriente alterna</span>
          </span>
        </div>

        <div role="tablist" aria-label="Recorrido de la energía" onKeyDown={teclas} className="recorrido-lista relative">
          {PARADAS.map((x, i) => {
            const I = x.icono;
            const on = i === activa;
            return (
              <button
                key={x.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`paso-${x.id}`}
                style={{ "--i": i } as CSSProperties}
                aria-selected={on}
                aria-controls="panel-recorrido"
                tabIndex={on ? 0 : -1}
                onClick={() => setActiva(i)}
                className="recorrido-parada group"
              >
                <span
                  className={`recorrido-punto grid place-items-center rounded-full border-2 ${
                    on ? "bg-white border-white text-azul" : "bg-azul border-white/40 text-white group-hover:border-white"
                  }`}
                >
                  <I size={24} aria-hidden />
                </span>
                <span className="recorrido-nombre">
                  <span className={`block leading-tight ${on ? "font-semibold text-white" : "text-white/80"}`}>{x.nombre}</span>
                  {x.corriente && <span className="block font-mono text-xs text-white/70">{x.corriente}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="panel-recorrido"
        role="tabpanel"
        aria-labelledby={`paso-${p.id}`}
        tabIndex={0}
        className="rounded-sm bg-white text-tinta p-5 md:p-6 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center"
      >
        <span key={p.id} className="aparecer-rapido grid place-items-center size-14 rounded-sm bg-azul-suave text-azul">
          <Icono size={28} aria-hidden />
        </span>
        <div key={`t-${p.id}`} className="aparecer-rapido flex flex-col gap-2">
          <p className="font-titulo text-xl font-bold text-azul">
            {activa + 1}. {p.nombre}
          </p>
          <p>{p.que}</p>
          {p.gavicom && (
            <p className="text-tenue">
              <span className="font-semibold text-azul">GAVICOM: </span>
              {p.gavicom}
            </p>
          )}
        </div>
        {p.servicio && (
          <div className="md:pl-4">
            <BotonCotizar sku={p.servicio.sku} nombre={p.servicio.nombre} />
          </div>
        )}
      </div>
    </div>
  );
}
