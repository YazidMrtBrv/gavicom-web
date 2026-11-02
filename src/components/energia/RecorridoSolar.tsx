"use client";

import { useState } from "react";
import { Box, Building2, Cable, SolarPanel, Sun, Zap, type LucideIcon } from "lucide-react";
import BotonCotizar from "@/components/BotonCotizar";

/*
 * How a solar system works, as the path the energy follows from the sun to
 * the load. Each stop says what happens there and what GAVICOM does at that
 * stop, with the quote button of the matching service. The dashed line moves
 * in the direction the energy flows.
 */
interface Parada {
  id: string;
  nombre: string;
  icono: LucideIcon;
  corriente: "" | "DC" | "AC";
  que: string;
  gavicom: string;
  servicio?: { sku: string; nombre: string };
}

const PARADAS: Parada[] = [
  {
    id: "sol",
    nombre: "Sol",
    icono: Sun,
    corriente: "",
    que: "La radiación solar llega a los módulos. En la Costa Caribe hay sol fuerte casi todo el año.",
    gavicom: "Revisamos el sitio: orientación, sombras y el espacio disponible para los módulos.",
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
    gavicom: "Entregamos el sistema funcionando y listo para su operación.",
  },
];

export default function RecorridoSolar() {
  const [activa, setActiva] = useState(1);
  const p = PARADAS[activa];
  const Icono = p.icono;

  return (
    <div className="grid gap-6">
      <ol className="recorrido grid grid-cols-3 sm:grid-cols-6 gap-y-6" aria-label="Recorrido de la energía">
        {PARADAS.map((x, i) => {
          const I = x.icono;
          const on = i === activa;
          return (
            <li key={x.id} className="relative flex flex-col items-center">
              {/* Flow line to the next stop (hidden after the last one and at
                  the end of each row of three on phones). */}
              {i < PARADAS.length - 1 && (
                <span aria-hidden className={`flujo absolute top-8 left-1/2 w-full h-[3px] ${i === 2 ? "hidden sm:block" : ""}`} />
              )}
              <button
                type="button"
                onClick={() => setActiva(i)}
                aria-pressed={on}
                className={`relative z-10 grid place-items-center size-16 rounded-full border-2 transition-all duration-300 ${
                  on ? "bg-azul border-azul text-white scale-110 shadow-[0_10px_30px_-10px_rgba(12,38,66,0.7)]" : "bg-white border-linea text-azul hover:border-azul"
                }`}
              >
                <I size={28} aria-hidden />
                <span className="sr-only">{x.nombre}</span>
              </button>
              <span className={`mt-2 text-center text-sm leading-tight ${on ? "font-semibold text-azul" : "text-tenue"}`}>{x.nombre}</span>
              {x.corriente && <span className="mt-0.5 font-mono text-[11px] text-tenue">{x.corriente}</span>}
            </li>
          );
        })}
      </ol>

      <div key={p.id} className="aparecer-rapido rounded border border-linea bg-white p-5 md:p-6 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
        <span className="grid place-items-center size-14 rounded bg-azul-suave text-azul">
          <Icono size={28} aria-hidden />
        </span>
        <div className="flex flex-col gap-2">
          <p className="font-titulo text-xl font-bold text-azul">
            {activa + 1}. {p.nombre}
          </p>
          <p className="text-tinta">{p.que}</p>
          <p className="text-tenue">
            <span className="font-semibold text-azul">GAVICOM: </span>
            {p.gavicom}
          </p>
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
