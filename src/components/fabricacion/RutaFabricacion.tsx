"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check, Lock } from "lucide-react";
import "./fabricacion.css";

type Paso = {
  titulo: string;
  texto: string;
  // Step 4 has no photo of its own: repeating the step 1 picture said
  // nothing, so it shows the five quality checks instead.
  imagen?: { src: string; alt: string; ancho: number; alto: number; reservado?: boolean };
};

// The real case of the 75 lb angle bar, step by step: each step shows what
// was done and the picture or drawing behind it.
const PASOS: Paso[] = [
  {
    titulo: "Ingeniería inversa",
    texto: "Partimos de la pieza original en uso en el corredor: medimos su sección, sus agujeros y su material.",
    imagen: { src: "/images/fabricacion/eclisa-angular-75.webp", alt: "Eclisa angular para riel de 75 lb", ancho: 600, alto: 230 },
  },
  {
    titulo: "Diseño y planos",
    texto: "Con esas medidas levantamos nuestros propios planos de fabricación. Los compartimos con el cliente bajo acuerdo de confidencialidad.",
    // The drawing stays blurred: its dimensions are GAVICOM's engineering work.
    imagen: { src: "/images/fabricacion/plano-reservado.webp", alt: "Plano de fabricación difuminado, reservado", ancho: 527, alto: 480, reservado: true },
  },
  {
    titulo: "Fundición nacional",
    texto: "La pieza se funde en Colombia con nuestro aliado industrial, en hierro nodular ASTM A536 y hornos de inducción de 1.800 kg por colada.",
    imagen: { src: "/images/fabricacion/fundicion.webp", alt: "Colada de metal fundido en el horno de inducción", ancho: 460, alto: 362 },
  },
  {
    titulo: "Control y entrega",
    texto: "Cada lote pasa cinco controles de calidad antes de salir. Entregamos 400 eclisas (200 pares) a un operador ferroviario nacional.",
  },
];

function Sello() {
  return (
    <span className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 whitespace-nowrap px-3 py-2 md:px-4 rounded bg-azul text-white text-xs md:text-sm font-semibold shadow-lg">
      <Lock size={16} aria-hidden /> Planos bajo confidencialidad
    </span>
  );
}

function Visual({ paso, controles }: { paso: Paso; controles: string[] }) {
  if (!paso.imagen) {
    return (
      <div className="w-full rounded bg-azul text-white p-6 md:p-8">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/70">Antes de salir, cada lote</p>
        <ul className="mt-4 flex flex-col gap-3">
          {controles.map((c) => (
            <li key={c} className="flex items-center gap-3">
              <span className="grid place-items-center size-7 shrink-0 rounded-full bg-white text-azul">
                <Check size={16} strokeWidth={3} aria-hidden />
              </span>
              <span className="font-semibold">{c}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const { src, alt, ancho, alto, reservado } = paso.imagen;
  return (
    <div className="relative w-full grid place-items-center">
      {reservado && <Sello />}
      <Image src={src} alt={alt} width={ancho} height={alto} sizes="(min-width: 768px) 560px, 100vw" className="w-full h-auto max-h-[420px] object-contain" />
    </div>
  );
}

export default function RutaFabricacion({ controles }: { controles: string[] }) {
  const [activo, setActivo] = useState(0);
  const pasos = useRef<(HTMLLIElement | null)[]>([]);
  const p = PASOS[activo];

  // On wide screens the step follows the scroll while the figure stays put.
  // Phones use the accordion instead, and with reduced motion nothing moves
  // on its own: only a tap or click changes the step.
  useEffect(() => {
    const ancho = window.matchMedia("(min-width: 768px)");
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    let io: IntersectionObserver | null = null;
    const montar = () => {
      io?.disconnect();
      io = null;
      if (!ancho.matches || quieto.matches) return;
      io = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            if (!e.isIntersecting) continue;
            const i = pasos.current.indexOf(e.target as HTMLLIElement);
            if (i >= 0) setActivo(i);
          }
        },
        // A thin band across the middle of the viewport: the step crossing it
        // is the one being read.
        { rootMargin: "-45% 0px -45% 0px" }
      );
      pasos.current.forEach((li) => li && io!.observe(li));
    };
    montar();
    ancho.addEventListener("change", montar);
    quieto.addEventListener("change", montar);
    return () => {
      io?.disconnect();
      ancho.removeEventListener("change", montar);
      quieto.removeEventListener("change", montar);
    };
  }, []);

  return (
    <div className="grid gap-6 md:gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-start">
      <div>
        <div className="flex gap-1.5 mb-4" aria-hidden>
          {PASOS.map((x, i) => (
            <span key={x.titulo} data-lleno={i <= activo} className="ruta-segmento h-1 flex-1 rounded-full bg-linea" />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Paso {activo + 1} de {PASOS.length}: {p.titulo}
        </p>
        <ol className="flex flex-col" aria-label="Pasos de fabricación">
          {PASOS.map((x, i) => {
            const abierto = activo === i;
            return (
              <li
                key={x.titulo}
                ref={(el) => {
                  pasos.current[i] = el;
                }}
                className="md:min-h-[34vh] md:flex md:items-center"
              >
                <div className="w-full">
                  <button
                    type="button"
                    onClick={() => setActivo(i)}
                    aria-current={abierto ? "step" : undefined}
                    aria-expanded={abierto}
                    className={`group w-full min-h-14 flex items-start gap-4 text-left py-4 border-l-2 pl-4 transition-colors ${abierto ? "border-azul" : "border-linea hover:border-azul/40"}`}
                  >
                    <span className={`grid place-items-center size-9 shrink-0 rounded-full font-mono font-semibold tabular-nums transition-colors ${abierto ? "bg-azul text-white" : "bg-gris text-tenue group-hover:text-azul"}`}>
                      {i + 1}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className={`font-semibold ${abierto ? "text-azul" : "text-tinta"}`}>{x.titulo}</span>
                      <span data-abierto={abierto} className="ruta-acordeon text-sm text-tenue">
                        <span>{x.texto}</span>
                      </span>
                    </span>
                  </button>
                  {/* Phone only: the step's own picture opens right under it.
                      md:hidden sits on a wrapper because the accordion's own
                      display rule (unlayered CSS) would beat the utility. */}
                  <div className="md:hidden">
                    <div data-abierto={abierto} className="ruta-acordeon" aria-hidden={!abierto}>
                      <div>
                        <div className="mt-1 mb-3 ml-[18px] rounded border border-linea bg-white p-3">
                          <Visual paso={x} controles={controles} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <figure className="hidden md:block md:sticky md:top-24 rounded border border-linea bg-white p-4">
        <div key={activo} className="ruta-figura min-h-[320px] grid place-items-center">
          <Visual paso={p} controles={controles} />
        </div>
        <figcaption className="mt-3 text-sm text-tenue">
          <span className="font-mono">Paso {activo + 1} de {PASOS.length}</span>: {p.titulo}
        </figcaption>
      </figure>
    </div>
  );
}
