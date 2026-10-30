"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import estilos from "./servicios.module.css";

const DISCIPLINAS = [
  "INGENIERÍA",
  "TOPOGRAFÍA",
  "CONSULTORÍA",
  "MANTENIMIENTO",
  "SOLDADURA",
  "RENDERIZADO 3D",
  "INFRAESTRUCTURA",
];

// Dos mitades idénticas: al llegar al -50 % la pista vuelve a 0 sin salto.
// Cada mitad repite la lista para cubrir pantallas anchas.
const MITAD = [...DISCIPLINAS, ...DISCIPLINAS];

function Mitad() {
  return (
    <>
      {MITAD.map((disciplina, i) => (
        <span
          key={i}
          className="flex items-center gap-8 whitespace-nowrap pr-8 text-[11px] font-semibold tracking-[0.4em] text-accent sm:gap-12 sm:pr-12"
        >
          {disciplina}
          <span className="size-1 bg-white/30" />
        </span>
      ))}
    </>
  );
}

/*
 * La cinta de disciplinas de la página anterior, ahora en CSS. Es decorativa
 * (las disciplinas están en las fichas), pero se mueve sola: WCAG 2.2.2 pide
 * poder detenerla, así que lleva su botón. Con movimiento reducido no corre y
 * el botón sobra.
 */
export default function CintaServicios() {
  const [pausada, setPausada] = useState(false);

  return (
    <div className="relative z-10 flex items-stretch border-y border-accent/60 bg-brand-deep">
      <div
        aria-hidden="true"
        data-pausada={pausada}
        className={cn(estilos.cinta, "min-w-0 flex-1 overflow-clip py-4")}
      >
        <div className={estilos.cintaPista}>
          <Mitad />
          <Mitad />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPausada((valor) => !valor)}
        aria-pressed={pausada}
        aria-label="Pausar la cinta de disciplinas"
        className="flex w-12 shrink-0 items-center justify-center border-l border-white/10 text-zinc-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent motion-reduce:hidden lg:mr-9"
      >
        {pausada ? <Play aria-hidden="true" className="size-3.5" /> : <Pause aria-hidden="true" className="size-3.5" />}
      </button>
    </div>
  );
}
