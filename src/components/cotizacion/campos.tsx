"use client";

import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

// text-base (16 px) en los controles: con menos, Safari en iPhone hace zoom al enfocar.
export const CONTROL =
  "block w-full rounded-[3px] border border-zinc-300 bg-white px-4 py-3 text-base text-ink placeholder:text-zinc-500 transition-[border-color,box-shadow] duration-200 hover:border-zinc-400 focus:border-brand focus:shadow-[0_0_0_3px_rgb(20_59_100/0.12)] focus:outline-none aria-[invalid=true]:border-red-700 aria-[invalid=true]:shadow-[0_0_0_3px_rgb(185_28_28/0.1)]";

export const ETIQUETA = "block text-sm font-semibold text-brand";

// Versión <button> de <Boton>: la de Boton es un enlace y aquí hacen falta botones de formulario.
const BOTON_BASE =
  "boton group/boton relative inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[4px] px-5 py-3 text-xs sm:px-7 font-semibold uppercase tracking-[0.18em] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
export const BOTON_PRIMARIO = `${BOTON_BASE} spotlight shiny-btn bg-accent text-brand-deep hover:bg-accent-strong`;
export const BOTON_SECUNDARIO = `${BOTON_BASE} border border-brand text-brand hover:bg-brand hover:text-white`;
export const BOTON_TEXTO =
  "boton inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

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

interface CampoProps {
  id: string;
  etiqueta: string;
  /** Marca de obligatorio; los opcionales lo dicen con texto. */
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
    <div className={cn("flex flex-col", className)}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={ETIQUETA}>
          {etiqueta}
          {requerido ? (
            <span aria-hidden="true" className="ml-1 text-brand">
              *
            </span>
          ) : (
            <span className="ml-1.5 font-normal text-zinc-600">(opcional)</span>
          )}
        </label>
        {extra}
      </div>
      {children}
      {ayuda && (
        <p id={idAyuda(id)} className="mt-2 text-sm leading-snug text-zinc-600">
          {ayuda}
        </p>
      )}
      <MensajeError id={idError(id)}>{error}</MensajeError>
    </div>
  );
}

export function Contador({ actual, maximo }: { actual: number; maximo: number }) {
  return (
    <span aria-hidden="true" className="text-xs text-zinc-600 tabular-nums">
      {actual}/{maximo}
    </span>
  );
}
