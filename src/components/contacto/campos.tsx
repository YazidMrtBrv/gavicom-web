"use client";

import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import estilos from "./contacto.module.css";

// text-base (16 px): con menos, Safari en iPhone hace zoom al enfocar el campo.
export const CONTROL_LINEA = cn(
  estilos.control,
  "block w-full rounded-none border-0 border-b border-zinc-300 bg-transparent px-0 py-3 text-base text-ink placeholder:text-zinc-500 transition-colors duration-200 hover:border-zinc-400 focus:outline-none aria-[invalid=true]:border-red-700"
);

export const CONTROL_AREA = cn(
  estilos.control,
  "block min-h-40 w-full resize-y rounded-none border border-zinc-300 bg-white px-4 py-3.5 text-base leading-relaxed text-ink placeholder:text-zinc-500 transition-colors duration-200 hover:border-zinc-400 focus:outline-none aria-[invalid=true]:border-red-700"
);

// Versión <button> de <Boton>: aquí hacen falta botones de formulario, no enlaces.
const BOTON_BASE =
  "boton group/boton relative inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[4px] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-8";
export const BOTON_PRIMARIO = `${BOTON_BASE} spotlight shiny-btn bg-accent text-brand-deep hover:bg-accent-strong`;
export const BOTON_SECUNDARIO = `${BOTON_BASE} border border-brand text-brand hover:bg-brand hover:text-white`;

// Alto del menú fijo más un margen: un campo enfocado por encima de esto queda tapado.
const MARGEN_MENU = 132;

/**
 * Enfoca sin dejar el elemento bajo el menú fijo: el desplazamiento nativo del
 * foco lo pega al borde superior, justo donde está el menú.
 */
export function enfocarVisible(elemento: HTMLElement | null) {
  if (!elemento) return;
  elemento.focus({ preventScroll: true });
  const caja = elemento.getBoundingClientRect();
  if (caja.top < MARGEN_MENU || caja.bottom > window.innerHeight) {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    elemento.scrollIntoView({ block: "center", behavior: reducido ? "auto" : "smooth" });
  }
}

export const idAyuda = (id: string) => `${id}-ayuda`;
export const idError = (id: string) => `${id}-error`;

/** id, aria-describedby y aria-invalid para el control de un campo. */
export function propsDeCampo(id: string, { ayuda, error }: { ayuda?: boolean; error?: string }) {
  const describe = [ayuda ? idAyuda(id) : null, error ? idError(id) : null].filter(Boolean).join(" ");
  return {
    id,
    "aria-describedby": describe || undefined,
    "aria-invalid": error ? true : undefined,
  } as const;
}

export function MensajeError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-sm font-medium leading-snug text-red-700">
      <CircleAlert aria-hidden="true" className="mt-px size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/** La línea de marca bajo el control (va justo después de él: la enciende `:focus ~`). */
export function LineaFoco() {
  return (
    <span aria-hidden="true" className={estilos.linea}>
      <span className={estilos.luz} />
    </span>
  );
}

interface CampoProps {
  id: string;
  etiqueta: string;
  requerido?: boolean;
  ayuda?: ReactNode;
  error?: string;
  /** Contador u otra nota a la derecha de la etiqueta. */
  extra?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Campo({ id, etiqueta, requerido, ayuda, error, extra, className, children }: CampoProps) {
  return (
    <div className={cn("group/campo flex flex-col", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600 transition-colors duration-300 group-focus-within/campo:text-brand"
        >
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 bg-zinc-300 transition-colors duration-300 group-focus-within/campo:bg-accent"
          />
          {etiqueta}
          {requerido ? (
            <span aria-hidden="true" className="text-brand">
              *
            </span>
          ) : (
            <span className="font-normal normal-case tracking-normal">(opcional)</span>
          )}
        </label>
        {extra}
      </div>
      <div className="relative">{children}</div>
      {ayuda && (
        <p id={idAyuda(id)} className="mt-2.5 text-sm leading-snug text-zinc-600">
          {ayuda}
        </p>
      )}
      <MensajeError id={idError(id)}>{error}</MensajeError>
    </div>
  );
}
