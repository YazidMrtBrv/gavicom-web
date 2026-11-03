"use client";

import { Check } from "lucide-react";

// What GAVICOM asks for to quote a solar project. Ticking items sends
// nothing: it only builds the WhatsApp message, so the first reply can get
// straight to numbers. State lives in CotizadorEnergia, which also owns the
// calculator, so the consumption line can be filled from the estimate.
export const DATOS = [
  { id: "consumo", titulo: "Consumo o factura de energía", detalle: "Una factura reciente o el dato de consumo.", enMensaje: "consumo o factura de energía" },
  { id: "sitio", titulo: "Plano o fotos del sitio", detalle: "Del lugar donde iría la instalación.", enMensaje: "plano o fotos del sitio" },
  { id: "plazo", titulo: "Plazo deseado", detalle: "Para cuándo necesita el sistema.", enMensaje: "plazo deseado" },
] as const;
export const TIPOS = ["Residencial", "Comercial", "Industrial"] as const;
export type Tipo = (typeof TIPOS)[number];

interface Props {
  tipo: Tipo | null;
  onTipo: (t: Tipo | null) => void;
  tengo: ReadonlySet<string>;
  onAlternar: (id: string) => void;
  municipio: string;
  onMunicipio: (s: string) => void;
  empresa: string;
  onEmpresa: (s: string) => void;
  /** Filled-in consumption line once the visitor used the calculator. */
  consumoCalculado: string | null;
}

export default function DatosParaCotizar(p: Props) {
  return (
    <div className="flex flex-col gap-3 text-tinta">
      <fieldset className="rounded-sm bg-white p-4">
        <legend className="sr-only">Tipo de instalación</legend>
        <p aria-hidden className="font-semibold mb-2">
          Tipo de instalación
        </p>
        <div className="grid grid-cols-3 gap-2">
          {TIPOS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={p.tipo === t}
              onClick={() => p.onTipo(p.tipo === t ? null : t)}
              className={`min-h-11 px-1 rounded-sm border text-sm font-semibold transition-colors ${
                p.tipo === t ? "bg-azul text-white border-azul" : "border-linea hover:border-azul"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="rounded-sm bg-white p-4 grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="municipio" className="font-semibold">
            Municipio
          </label>
          <input
            id="municipio"
            type="text"
            autoComplete="address-level2"
            placeholder="Municipio y departamento"
            value={p.municipio}
            onChange={(e) => p.onMunicipio(e.target.value)}
            className="min-h-12 px-3 rounded-sm border border-linea focus:border-azul"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="empresa" className="font-semibold">
            Empresa <span className="font-normal text-tenue">(opcional)</span>
          </label>
          <input
            id="empresa"
            type="text"
            autoComplete="organization"
            value={p.empresa}
            onChange={(e) => p.onEmpresa(e.target.value)}
            className="min-h-12 px-3 rounded-sm border border-linea focus:border-azul"
          />
        </div>
      </div>

      {DATOS.map((d) => {
        const marcado = p.tengo.has(d.id);
        const detalle = d.id === "consumo" && marcado && p.consumoCalculado ? p.consumoCalculado : d.detalle;
        return (
          <button
            key={d.id}
            type="button"
            aria-pressed={marcado}
            onClick={() => p.onAlternar(d.id)}
            className={`group flex items-start gap-4 min-h-11 text-left border rounded-sm p-4 transition-colors ${
              marcado ? "border-white bg-azul-suave" : "border-transparent bg-white hover:border-azul/50"
            }`}
          >
            <span
              className={`mt-0.5 grid place-items-center w-6 h-6 shrink-0 rounded-sm border-2 transition-colors ${
                marcado ? "bg-azul border-azul text-white" : "border-tenue/60"
              }`}
            >
              {marcado && <Check size={16} strokeWidth={3} aria-hidden />}
            </span>
            <span>
              <span className="block font-semibold">{d.titulo}</span>
              <span className="block text-sm text-tenue mt-0.5">{detalle}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
