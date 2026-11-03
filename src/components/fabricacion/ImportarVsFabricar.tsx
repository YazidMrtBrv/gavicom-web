"use client";

import { useState } from "react";
import "./fabricacion.css";
import { DraftingCompass, Factory, FileText, FlaskConical, Landmark, MapPin, Ship, Truck } from "lucide-react";

/*
 * "Importar o fabricar en Colombia": a two-way toggle that redraws the route
 * a part travels. Qualitative only, from what the site already states: an
 * imported part adds maritime transit and customs clearance; a part made here
 * goes from the buyer's drawing or sample through reverse engineering, own
 * drawings, the industrial partner's foundry and five checks per batch. No
 * weeks, costs or percentages: GAVICOM has not published any.
 */

const RUTAS = {
  importar: {
    etiqueta: "Importar",
    pasos: [
      { icono: Factory, titulo: "Fábrica en el exterior", texto: "La pieza se pide a un fabricante fuera del país." },
      { icono: Ship, titulo: "Tránsito marítimo", texto: "La carga cruza el mar hasta un puerto colombiano." },
      { icono: Landmark, titulo: "Nacionalización", texto: "Trámite de aduana antes de liberar la carga." },
      { icono: Truck, titulo: "Llega a tu proyecto", texto: "Después del puerto y la aduana." },
    ],
    nota: "Para volúmenes mayores también gestionamos importaciones de sistemas de sujeción.",
  },
  colombia: {
    etiqueta: "Fabricar en Colombia",
    pasos: [
      { icono: FileText, titulo: "Tu plano, foto o muestra", texto: "Con cualquiera de los tres empezamos." },
      { icono: DraftingCompass, titulo: "Ingeniería inversa y planos", texto: "Planos propios, bajo acuerdo de confidencialidad." },
      { icono: Factory, titulo: "Fundición nacional", texto: "Con nuestro aliado industrial, en hierro nodular ASTM A536." },
      { icono: FlaskConical, titulo: "Cinco controles por lote", texto: "Composición química, metalografía, dureza, control dimensional y ensayos no destructivos." },
      { icono: MapPin, titulo: "Entrega dentro del país", texto: "Sin tránsito marítimo ni nacionalización." },
    ],
    nota: "Así fabricamos y entregamos 400 eclisas angulares de 75 lb a un operador ferroviario nacional.",
  },
} as const;
type Ruta = keyof typeof RUTAS;

export default function ImportarVsFabricar() {
  const [ruta, setRuta] = useState<Ruta>("colombia");
  const r = RUTAS[ruta];
  return (
    <div>
      <div role="group" aria-label="Comparar la ruta de la pieza" className="inline-flex rounded border border-linea bg-gris p-1">
        {(Object.keys(RUTAS) as Ruta[]).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={ruta === k}
            onClick={() => setRuta(k)}
            className={`min-h-11 px-4 sm:px-5 rounded-sm text-sm sm:text-base font-semibold transition-colors ${ruta === k ? "bg-azul text-white shadow" : "text-tinta hover:text-azul"}`}
          >
            {RUTAS[k].etiqueta}
          </button>
        ))}
      </div>

      {/* Keyed by route so the steps re-enter one after another. */}
      <ol key={ruta} aria-live="polite" className="ruta-comparada mt-8 grid gap-3 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
        {r.pasos.map(({ icono: Icono, titulo, texto }, i) => (
          <li
            key={titulo}
            className={`ruta-paso relative flex gap-3 lg:flex-col rounded border p-4 ${ruta === "colombia" ? "border-azul/30 bg-azul-suave" : "border-linea bg-white"}`}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span className={`grid place-items-center size-10 shrink-0 rounded ${ruta === "colombia" ? "bg-azul text-white" : "bg-gris text-tenue"}`}>
              <Icono size={20} aria-hidden />
            </span>
            <span>
              <span className="block font-mono text-xs text-tenue tabular-nums">0{i + 1}</span>
              <span className="block font-semibold text-tinta">{titulo}</span>
              <span className="block mt-0.5 text-sm text-tenue">{texto}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-tenue">
        {r.pasos.length} pasos. {r.nota}
      </p>
    </div>
  );
}
