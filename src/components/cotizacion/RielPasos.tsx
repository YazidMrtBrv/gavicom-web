"use client";

import type { CSSProperties } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Paso } from "./validacion";
import estilos from "./cotizador.module.css";

export const PASOS: { numero: Paso; titulo: string; detalle: string }[] = [
  { numero: 1, titulo: "Qué necesita", detalle: "Referencias, servicios y cantidades" },
  { numero: 2, titulo: "Dónde y cuándo", detalle: "Lugar de entrega y plazo" },
  { numero: 3, titulo: "Sus datos", detalle: "Contacto y autorización" },
];

export const dosCifras = (n: number) => String(n).padStart(2, "0");

interface RielPasosProps {
  paso: Paso;
  /** Paso más lejano al que ya llegó: hasta ahí se puede volver con un clic. */
  alcanzado: Paso;
  enviado: boolean;
  onIr: (paso: Paso) => void;
}

/*
 * Indicador de pasos dibujado como una vía en planta: el tramo recorrido se
 * pinta en color de marca y cada estación es un paso. Las estaciones ya
 * visitadas son botones para volver; las siguientes no se pueden saltar.
 */
export default function RielPasos({ paso, alcanzado, enviado, onIr }: RielPasosProps) {
  const avance = (paso - 1) / (PASOS.length - 1);

  return (
    <nav aria-label="Pasos de la solicitud" className="relative">
      {/* La vía nace en la marca de la primera estación (9 px = media marca) y
          sigue 32 px más allá de la última, hasta el tope: el último tramo
          solo se recorre al enviar. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[9px] right-[calc(100%/3_-_41px)] top-[3px] [--cola:32px]"
      >
        <div className={estilos.via} />
        <div
          className={cn(estilos.via, estilos.viaRecorrida, enviado && estilos.viaCompleta, "absolute inset-0")}
          style={{ "--avance": avance } as CSSProperties}
        />
        <span className={cn(estilos.tope, "absolute -right-px top-1/2 -translate-y-1/2")} />
      </div>

      <ol className="relative grid grid-cols-3">
        {PASOS.map(({ numero, titulo, detalle }) => {
          const completo = enviado || numero < paso;
          const actual = !enviado && numero === paso;
          const disponible = !enviado && numero <= alcanzado && numero !== paso;
          const estado = completo ? "completado" : actual ? "paso actual" : "pendiente";

          const contenido = (
            <>
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 flex size-[18px] items-center justify-center border-2 transition-colors duration-500",
                  completo && "border-brand bg-brand text-white",
                  actual && cn("border-brand-deep bg-accent", estilos.estacionActual),
                  !completo && !actual && "border-zinc-300 bg-white"
                )}
              >
                {completo && <Check className="size-3" strokeWidth={3} />}
              </span>
              <span className="mt-4 block text-[11px] font-semibold tracking-[0.22em] text-zinc-600 tabular-nums">
                {dosCifras(numero)}
                {/* Sobre surface, zinc-600 es el más claro que se lee bien: la jerarquía la da el peso. */}
                <span className="font-normal"> / {dosCifras(PASOS.length)}</span>
              </span>
              <span
                className={cn(
                  "mt-1 block text-sm font-semibold leading-snug sm:text-base",
                  completo || actual ? "text-brand" : "text-zinc-600"
                )}
              >
                {titulo}
              </span>
              <span className="mt-1 hidden text-xs leading-snug text-zinc-600 md:block">{detalle}</span>
              <span className="sr-only">, {estado}</span>
            </>
          );

          return (
            <li key={numero} aria-current={actual ? "step" : undefined} className="relative pr-3">
              {disponible ? (
                <button
                  type="button"
                  onClick={() => onIr(numero)}
                  className="group/estacion -m-2 block rounded-[4px] p-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {contenido}
                  <span
                    aria-hidden="true"
                    className="mt-2 block h-0.5 w-6 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover/estacion:scale-x-100 motion-reduce:transition-none"
                  />
                </button>
              ) : (
                <div className="-m-2 p-2">{contenido}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
