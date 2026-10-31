"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { enlaceWhatsApp } from "@/lib/whatsapp";

// What GAVICOM asks for to quote a solar project. Ticking items sends
// nothing: it only builds the WhatsApp message, so the first reply can get
// straight to numbers.
const DATOS = [
  { id: "ubicacion", titulo: "Ubicación del proyecto", detalle: "Municipio y departamento.", enMensaje: "ubicación del proyecto" },
  { id: "consumo", titulo: "Consumo o factura de energía", detalle: "Una factura reciente o el dato de consumo.", enMensaje: "consumo o factura de energía" },
  { id: "sitio", titulo: "Plano o fotos del sitio", detalle: "Del lugar donde iría la instalación.", enMensaje: "plano o fotos del sitio" },
  { id: "plazo", titulo: "Plazo deseado", detalle: "Para cuándo necesita el sistema.", enMensaje: "plazo deseado" },
] as const;
const TIPOS = ["Residencial", "Comercial", "Industrial"] as const;

export default function DatosParaCotizar() {
  const [tipo, setTipo] = useState<(typeof TIPOS)[number] | null>(null);
  const [tengo, setTengo] = useState<Set<string>>(new Set());
  const listos = tengo.size + (tipo ? 1 : 0);
  const total = DATOS.length + 1;

  const mensaje = [
    "Hola GAVICOM, quiero cotizar un proyecto de energía solar con GAVICOM Energy.",
    tipo ? `Tipo de instalación: ${tipo}.` : "",
    tengo.size ? `Puedo enviar: ${DATOS.filter((d) => tengo.has(d.id)).map((d) => d.enMensaje).join(", ")}.` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-start">
      <div className="flex flex-col gap-3">
        <fieldset className="border border-linea rounded p-4">
          <legend className="px-1 font-semibold">Tipo de instalación</legend>
          <div className="flex flex-wrap gap-2 mt-1">
            {TIPOS.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tipo === t}
                onClick={() => setTipo(tipo === t ? null : t)}
                className={`min-h-11 px-4 rounded border text-sm font-semibold transition-colors ${tipo === t ? "bg-azul text-white border-azul" : "border-linea hover:border-azul"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>
        {DATOS.map((d) => {
          const marcado = tengo.has(d.id);
          return (
            <button
              key={d.id}
              type="button"
              role="checkbox"
              aria-checked={marcado}
              onClick={() =>
                setTengo((prev) => {
                  const n = new Set(prev);
                  if (n.has(d.id)) n.delete(d.id);
                  else n.add(d.id);
                  return n;
                })
              }
              className={`group flex items-start gap-4 text-left border rounded p-4 transition-colors ${marcado ? "border-azul bg-azul-suave" : "border-linea hover:border-azul/50"}`}
            >
              <span className={`mt-0.5 grid place-items-center w-6 h-6 shrink-0 rounded border-2 transition-colors ${marcado ? "bg-azul border-azul text-white" : "border-tenue/50"}`}>
                {marcado && <Check size={16} strokeWidth={3} aria-hidden />}
              </span>
              <span>
                <span className="block font-semibold">{d.titulo}</span>
                <span className="block text-sm text-tenue mt-0.5">{d.detalle}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="lg:sticky lg:top-24 bg-azul text-white rounded p-6 flex flex-col gap-4">
        <p className="text-sm text-white/70">Lo que ya tienes</p>
        <p className="font-titulo text-5xl font-bold tabular-nums">
          {listos}
          <span className="text-white/40 text-3xl">/{total}</span>
        </p>
        <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
          <div className="h-full bg-white transition-[width] duration-300" style={{ width: `${(listos / total) * 100}%` }} />
        </div>
        <p className="text-sm text-white/75">No necesitas tenerlo todo para escribirnos: lo que marques va incluido en el mensaje.</p>
        <a href={enlaceWhatsApp(mensaje)} className="inline-flex items-center justify-center min-h-12 px-5 rounded bg-white text-azul font-semibold hover:bg-azul-suave">
          Cotizar por WhatsApp
        </a>
      </div>
    </div>
  );
}
