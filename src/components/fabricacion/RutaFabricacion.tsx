"use client";

import Image from "next/image";
import { useState } from "react";
import { Lock } from "lucide-react";

// The real case of the 75 lb angle bar, step by step: each step shows what
// was done and the picture or drawing behind it.
const PASOS = [
  {
    titulo: "Ingeniería inversa",
    texto: "Partimos de la pieza original en uso en el corredor: medimos su sección, sus agujeros y su material.",
    imagen: "/images/fabricacion/eclisa-angular-75.webp",
    alt: "Eclisa angular para riel de 75 lb",
    ancho: 623,
    alto: 230,
  },
  {
    titulo: "Diseño y planos",
    texto: "Con esas medidas levantamos nuestros propios planos de fabricación. Los compartimos con el cliente bajo acuerdo de confidencialidad.",
    imagen: "/images/fabricacion/plano-reservado.webp",
    alt: "Plano de fabricación difuminado, reservado",
    reservado: true,
    ancho: 527,
    alto: 480,
  },
  {
    titulo: "Fundición nacional",
    texto: "La pieza se funde en Colombia con nuestro aliado industrial, en hierro nodular ASTM A536 y hornos de inducción de 1.800 kg por colada.",
    imagen: "/images/fabricacion/fundicion.webp",
    alt: "Colada de metal fundido en el horno de inducción",
    ancho: 460,
    alto: 362,
  },
  {
    titulo: "Control y entrega",
    texto: "Cada lote pasa cinco controles de calidad antes de salir. Entregamos 400 eclisas (200 pares) a Línea Férrea Central.",
    imagen: "/images/fabricacion/eclisa-angular-75.webp",
    alt: "Eclisa angular terminada",
    ancho: 623,
    alto: 230,
  },
];

export default function RutaFabricacion() {
  const [paso, setPaso] = useState(0);
  const p = PASOS[paso];
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-start">
      <ol className="flex flex-col" aria-label="Pasos de fabricación">
        {PASOS.map((x, i) => (
          <li key={x.titulo}>
            <button
              type="button"
              onClick={() => setPaso(i)}
              aria-current={paso === i ? "step" : undefined}
              className={`group w-full min-h-14 flex items-start gap-4 text-left py-4 border-l-2 pl-4 transition-colors ${paso === i ? "border-azul" : "border-linea hover:border-azul/40"}`}
            >
              <span className={`grid place-items-center size-9 shrink-0 rounded-full font-semibold tabular-nums transition-colors ${paso === i ? "bg-azul text-white" : "bg-gris text-tenue group-hover:text-azul"}`}>
                {i + 1}
              </span>
              <span className="flex flex-col gap-1">
                <span className={`font-semibold ${paso === i ? "text-azul" : "text-tinta"}`}>{x.titulo}</span>
                <span className={`text-sm text-tenue grid transition-[grid-template-rows] duration-300 ${paso === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <span className="overflow-hidden">{x.texto}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <figure key={paso} className="aparecer-rapido relative rounded border border-linea bg-white p-4 grid place-items-center min-h-[320px]">
        {"reservado" in p && (
          <span className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-4 py-2 rounded bg-azul text-white text-sm font-semibold shadow-lg">
            <Lock size={16} aria-hidden /> Planos bajo confidencialidad
          </span>
        )}
        <Image src={p.imagen} alt={p.alt} width={p.ancho} height={p.alto} className="w-full h-auto max-h-[420px] object-contain" />
        <figcaption className="mt-3 text-sm text-tenue">
          Paso {paso + 1} de {PASOS.length}: {p.titulo}
        </figcaption>
      </figure>
    </div>
  );
}
