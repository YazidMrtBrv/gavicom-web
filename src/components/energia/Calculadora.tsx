"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/*
 * Rough sizing from the monthly consumption on the electricity bill. It is an
 * estimate, said so on screen: the real design depends on the roof, shade,
 * orientation and the equipment chosen after the visit.
 *   kWp = kWh/mes ÷ (30 días × HSP × rendimiento)
 *
 * Peak sun hours per region are rounded working assumptions, labelled as such
 * on screen. They are NOT cited to the IDEAM/UPME solar atlas because nobody
 * has checked them against its tables yet; once someone does, add the table
 * or page here and only then name the source in the UI.
 * 0.8 covers losses (temperature, wiring, inverter).
 */
export const REGIONES = [
  { id: "caribe", nombre: "Costa Caribe", hsp: 5.0 },
  { id: "orinoquia", nombre: "Orinoquía", hsp: 4.5 },
  { id: "andina", nombre: "Andina", hsp: 4.2 },
  { id: "pacifico", nombre: "Pacífico", hsp: 3.5 },
] as const;
export type Region = (typeof REGIONES)[number];

const RENDIMIENTO = 0.8;
const PANEL_W = 550;
const AREA_PANEL = 2.6; // m² of a 550 W module
// Assumption: aisles for maintenance and spacing between rows.
const FACTOR_TECHO = 1.4;
export const KWH_MIN = 50;
export const KWH_MAX = 20000;

export const fmt = (n: number, d = 0) => n.toLocaleString("es-CO", { maximumFractionDigits: d, minimumFractionDigits: d });

export interface Estimado {
  kwp: number;
  paneles: number;
  areaModulos: number;
  areaTecho: number;
  generacion: number;
  cobertura: number;
}

export function estimar(kwh: number, region: Region): Estimado | null {
  if (!Number.isFinite(kwh) || kwh < KWH_MIN || kwh > KWH_MAX) return null;
  const necesario = kwh / (30 * region.hsp * RENDIMIENTO);
  const paneles = Math.max(1, Math.ceil((necesario * 1000) / PANEL_W));
  const kwp = (paneles * PANEL_W) / 1000;
  const generacion = kwp * 30 * region.hsp * RENDIMIENTO;
  return {
    kwp,
    paneles,
    areaModulos: paneles * AREA_PANEL,
    areaTecho: paneles * AREA_PANEL * FACTOR_TECHO,
    generacion,
    cobertura: (generacion / kwh) * 100,
  };
}

function Cifra({ etiqueta, valor, unidad, nota }: { etiqueta: string; valor: string; unidad?: string; nota?: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-white/75 text-sm">{etiqueta}</dt>
      <dd className="mt-1 font-titulo font-bold text-3xl sm:text-4xl tabular-nums leading-none">
        {valor}
        {unidad && <span className="ml-1 text-lg font-semibold whitespace-nowrap">{unidad}</span>}
      </dd>
      {nota && <dd className="mt-1 text-xs text-white/70">{nota}</dd>}
    </div>
  );
}

interface Props {
  kwh: number;
  region: Region;
  onKwh: (n: number) => void;
  onRegion: (r: Region) => void;
}

export default function Calculadora({ kwh, region, onKwh, onRegion }: Props) {
  const est = estimar(kwh, region);
  const muyAlto = Number.isFinite(kwh) && kwh > KWH_MAX;
  const radios = useRef<(HTMLButtonElement | null)[]>([]);

  // Screen readers get one summary line, and only after the slider settles:
  // announcing every 50 kWh step would talk over the user.
  const resumen = est
    ? `Estimado: ${fmt(est.kwp, 1)} kWp, ${est.paneles} paneles, región ${region.nombre}.`
    : muyAlto
      ? "Más de 20.000 kWh: lo calculamos con tu factura."
      : `Escribe un consumo de al menos ${KWH_MIN} kWh al mes.`;
  const [anuncio, setAnuncio] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setAnuncio(resumen), 500);
    return () => clearTimeout(t);
  }, [resumen]);

  // Radio group keyboard pattern: arrows move and select.
  const teclasRegion = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = REGIONES.findIndex((r) => r.id === region.id);
    let n = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % REGIONES.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + REGIONES.length) % REGIONES.length;
    if (n < 0) return;
    e.preventDefault();
    onRegion(REGIONES[n]);
    radios.current[n]?.focus();
  };

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-stretch">
      <div className="rounded-sm bg-white text-tinta p-5 md:p-6 flex flex-col gap-4">
        <label htmlFor="kwh" className="font-semibold">
          ¿Cuánto consumes al mes?
        </label>
        <p className="text-sm text-tenue -mt-2">Sale en tu recibo de luz, en kWh.</p>
        <div className="flex items-center gap-3">
          <input
            id="kwh"
            type="number"
            inputMode="numeric"
            min={KWH_MIN}
            step={10}
            value={Number.isFinite(kwh) ? kwh : ""}
            onChange={(e) => onKwh(e.target.valueAsNumber)}
            className="w-36 min-h-12 px-3 rounded-sm border border-linea font-mono text-lg tabular-nums focus:border-azul"
          />
          <span className="text-tenue whitespace-nowrap">kWh/mes</span>
        </div>
        <input
          type="range"
          aria-label="Consumo mensual en kWh"
          min={KWH_MIN}
          max={KWH_MAX}
          step={50}
          value={Math.min(KWH_MAX, Math.max(KWH_MIN, Number.isFinite(kwh) ? kwh : KWH_MIN))}
          onChange={(e) => onKwh(e.target.valueAsNumber)}
          className="energia-rango w-full min-h-11"
        />
        <div className="flex flex-wrap gap-2 text-sm">
          {(
            [
              ["Casa", 300],
              ["Comercio", 2000],
              ["Bodega o planta", 10000],
            ] as const
          ).map(([t, v]) => (
            <button
              key={t}
              type="button"
              onClick={() => onKwh(v)}
              className="min-h-11 px-3 rounded-sm border border-linea bg-gris hover:border-azul hover:text-azul"
            >
              {t} · {fmt(v)} kWh
            </button>
          ))}
        </div>

        <div className="mt-2 border-t border-linea pt-4">
          <p id="region-etq" className="font-semibold">
            ¿En qué región está el proyecto?
          </p>
          <div role="radiogroup" aria-labelledby="region-etq" onKeyDown={teclasRegion} className="mt-2 grid grid-cols-2 gap-2">
            {REGIONES.map((r, i) => {
              const on = r.id === region.id;
              return (
                <button
                  key={r.id}
                  ref={(el) => {
                    radios.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => onRegion(r)}
                  className={`min-h-11 px-3 rounded-sm border text-sm text-left transition-colors ${
                    on ? "bg-azul border-azul text-white" : "border-linea hover:border-azul"
                  }`}
                >
                  <span className="font-semibold">{r.nombre}</span>{" "}
                  <span className={`font-mono text-xs whitespace-nowrap ${on ? "text-white/80" : "text-tenue"}`}>{fmt(r.hsp, 1)} h</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-tenue">
            Horas de sol pico al día: supuesto aproximado por región. El valor de tu sitio lo confirmamos en la visita.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-white/25 bg-white/[0.06] text-white p-5 md:p-6 flex flex-col gap-5">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-white/75">Estimado aproximado</p>
        {est ? (
          <>
            <p className="font-titulo font-bold text-2xl sm:text-3xl leading-tight">
              Cubre aprox. <span className="tabular-nums whitespace-nowrap">{fmt(Math.min(100, est.cobertura))} %</span> de tu consumo
            </p>
            <div aria-hidden className="h-1.5 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${Math.min(100, est.cobertura)}%` }} />
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
              <Cifra etiqueta="Potencia del sistema" valor={fmt(est.kwp, 1)} unidad="kWp" />
              <Cifra etiqueta={`Paneles de ${PANEL_W} W`} valor={fmt(est.paneles)} />
              <Cifra etiqueta="Área de módulos" valor={fmt(est.areaModulos)} unidad="m²" />
              <Cifra
                etiqueta="Área de techo o lote estimada"
                valor={fmt(est.areaTecho)}
                unidad="m²"
                nota="Incluye pasillos de mantenimiento y separación (supuesto ×1,4)."
              />
            </dl>
            <p className="text-sm text-white/75">
              Generaría unos <span className="font-mono whitespace-nowrap">{fmt(est.generacion)} kWh/mes</span>.
            </p>
            <p className="text-xs text-white/70 font-mono">
              Supuestos: {PANEL_W} W por panel, {fmt(region.hsp, 1)} h de sol pico, 20 % de pérdidas.
            </p>
            <p className="text-sm text-white/75">
              Es una cifra de referencia. El diseño real depende del techo, las sombras, la orientación y los equipos; lo definimos después de visitar el sitio.
            </p>
          </>
        ) : (
          <p className="text-white/85 text-lg">
            {muyAlto ? "Más de 20.000 kWh: lo calculamos con tu factura." : `Escribe un consumo de al menos ${KWH_MIN} kWh al mes para ver el estimado.`}
          </p>
        )}
        <p aria-live="polite" className="sr-only">
          {anuncio}
        </p>
      </div>
    </div>
  );
}
