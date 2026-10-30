import type { CSSProperties } from "react";
import Contador from "@/components/portada/Contador";
import estilos from "@/components/portada/portada.module.css";
import { cn } from "@/lib/cn";

// Colores oficiales de la bandera. Solo como franjas y subrayados: el amarillo
// sobre blanco no se lee, así que las letras van siempre en azul de marca.
const BANDERA = { amarillo: "#FFD100", azul: "#003893", rojo: "#CE1126" } as const;
const COLORES_LETRA = [BANDERA.amarillo, BANDERA.azul, BANDERA.rojo];
const PALABRA = "COLOMBIANA";

interface ColombiaProudProps {
  className?: string;
}

export default function ColombiaProud({ className }: ColombiaProudProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Proporción real de la bandera: amarillo la mitad, azul y rojo un cuarto cada uno. */}
      <div aria-hidden="true" className="relative flex h-9 w-14 flex-col overflow-clip rounded-[2px] ring-1 ring-zinc-200">
        <span className={cn(estilos.banderaFranja, "h-1/2")} style={{ backgroundColor: BANDERA.amarillo }} />
        <span className={cn(estilos.banderaFranja, "h-1/4")} style={{ backgroundColor: BANDERA.azul }} />
        <span className={cn(estilos.banderaFranja, "h-1/4")} style={{ backgroundColor: BANDERA.rojo }} />
        <span
          className={cn(
            estilos.banderaBrillo,
            "pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/35 to-transparent"
          )}
        />
      </div>

      <p className="mt-6 flex h-12 items-end font-titulo text-5xl font-semibold leading-none tracking-tight text-brand sm:h-15 sm:text-6xl">
        <Contador hasta={100} sufijo="%" retardo={360} />
      </p>

      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        <span className="sr-only">Colombiana</span>
        {/* Cada letra salta al pasar el cursor y se subraya con un color de la bandera. */}
        <span aria-hidden="true" className="inline-flex">
          {Array.from(PALABRA, (letra, i) => (
            <span
              key={i}
              style={{ "--color-letra": COLORES_LETRA[i % COLORES_LETRA.length] } as CSSProperties}
              className="relative inline-block cursor-default transition-transform duration-300 ease-out after:absolute after:inset-x-[0.05em] after:-bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-(--color-letra) after:transition-transform after:duration-300 hover:-translate-y-0.5 hover:scale-125 hover:after:scale-x-100 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
            >
              {letra}
            </span>
          ))}
        </span>
      </p>
      <p className="mt-1.5 text-sm text-zinc-600">Orgullo colombiano</p>
    </div>
  );
}
