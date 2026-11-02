"use client";

import { useState } from "react";
import { enlaceWhatsApp } from "@/lib/whatsapp";

/*
 * Rough sizing from the monthly consumption on the electricity bill. It is an
 * estimate, said so on screen: the real design depends on the roof, shade,
 * orientation and the equipment chosen after the visit.
 *   kWp = kWh/mes ÷ (30 días × HSP × rendimiento)
 * HSP 5 h/día is a conservative yearly figure for the Caribbean coast;
 * 0.8 covers losses (temperature, wiring, inverter).
 */
const HSP = 5;
const RENDIMIENTO = 0.8;
const PANEL_W = 550;
const AREA_PANEL = 2.6; // m², module plus spacing

const fmt = (n: number, d = 0) => n.toLocaleString("es-CO", { maximumFractionDigits: d, minimumFractionDigits: d });

export default function Calculadora() {
  const [kwh, setKwh] = useState(600);
  const valido = Number.isFinite(kwh) && kwh >= 50;
  const kwp = valido ? kwh / (30 * HSP * RENDIMIENTO) : 0;
  const paneles = Math.max(1, Math.ceil((kwp * 1000) / PANEL_W));
  const area = paneles * AREA_PANEL;
  const potenciaReal = (paneles * PANEL_W) / 1000;

  const mensaje =
    `Hola GAVICOM Energy, quiero cotizar un sistema solar. Mi consumo es de ${fmt(kwh)} kWh al mes. ` +
    `En la calculadora de la web me salió un estimado de ${fmt(potenciaReal, 1)} kWp (unos ${paneles} paneles de ${PANEL_W} W, ${fmt(area)} m²).`;

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-stretch">
      <div className="rounded border border-linea bg-white p-5 md:p-6 flex flex-col gap-4">
        <label htmlFor="kwh" className="font-semibold text-tinta">
          ¿Cuánto consumes al mes?
        </label>
        <p className="text-sm text-tenue -mt-2">Sale en tu recibo de luz, en kWh.</p>
        <div className="flex items-center gap-3">
          <input
            id="kwh"
            type="number"
            inputMode="numeric"
            min={50}
            max={200000}
            step={10}
            value={Number.isFinite(kwh) ? kwh : ""}
            onChange={(e) => setKwh(e.target.valueAsNumber)}
            className="w-40 min-h-12 px-3 rounded border border-linea font-mono text-lg tabular-nums focus:border-azul"
          />
          <span className="text-tenue">kWh/mes</span>
        </div>
        <input
          type="range"
          aria-label="Consumo mensual en kWh"
          min={100}
          max={20000}
          step={50}
          value={Math.min(20000, Math.max(100, Number.isFinite(kwh) ? kwh : 100))}
          onChange={(e) => setKwh(e.target.valueAsNumber)}
          className="w-full accent-[var(--azul)] min-h-11"
        />
        <div className="flex flex-wrap gap-2 text-sm">
          {[
            ["Casa", 300],
            ["Comercio", 2000],
            ["Bodega o planta", 10000],
          ].map(([t, v]) => (
            <button key={t} type="button" onClick={() => setKwh(v as number)} className="min-h-10 px-3 rounded border border-linea bg-gris hover:border-azul hover:text-azul">
              {t} · {fmt(v as number)} kWh
            </button>
          ))}
        </div>
      </div>

      <div className="rounded bg-azul text-white p-5 md:p-6 flex flex-col gap-5" aria-live="polite">
        {valido ? (
          <>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-white/60">Estimado aproximado</p>
            <dl className="grid grid-cols-2 gap-5">
              <div>
                <dt className="text-white/70 text-sm">Potencia del sistema</dt>
                <dd className="font-titulo font-bold text-4xl tabular-nums">{fmt(potenciaReal, 1)} kWp</dd>
              </div>
              <div>
                <dt className="text-white/70 text-sm">Paneles de {PANEL_W} W</dt>
                <dd className="font-titulo font-bold text-4xl tabular-nums">{fmt(paneles)}</dd>
              </div>
              <div>
                <dt className="text-white/70 text-sm">Área aproximada</dt>
                <dd className="font-titulo font-bold text-4xl tabular-nums">{fmt(area)} m²</dd>
              </div>
              <div>
                <dt className="text-white/70 text-sm">Generación al mes</dt>
                <dd className="font-titulo font-bold text-4xl tabular-nums">~{fmt(potenciaReal * 30 * HSP * RENDIMIENTO)} kWh</dd>
              </div>
            </dl>
            <p className="text-sm text-white/70">
              Es una cifra de referencia con la radiación solar promedio de la Costa Caribe. El diseño real depende del techo, las sombras, la orientación y los equipos; lo definimos después de visitar el sitio.
            </p>
            <a
              href={enlaceWhatsApp(mensaje)}
              target="_blank"
              rel="noopener noreferrer"
              className="boton-iman self-start inline-flex items-center min-h-12 px-6 rounded bg-white text-azul font-semibold hover:bg-azul-suave"
            >
              Cotizar con estos datos
            </a>
          </>
        ) : (
          <p className="text-white/80">Escribe un consumo de al menos 50 kWh al mes para ver el estimado.</p>
        )}
      </div>
    </div>
  );
}
