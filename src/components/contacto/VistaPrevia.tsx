"use client";

import { Fragment } from "react";
import { COMPANIA_INFO } from "@/constants/productos";
import { cn } from "@/lib/cn";
import TechFrame from "@/components/motion/TechFrame";
import IconoWhatsApp from "./IconoWhatsApp";
import {
  construirMensajeContacto,
  formatearTelefono,
  HUECO_ABRE,
  HUECO_CIERRA,
  type DatosContacto,
  type TipoSolicitud,
} from "./datos";
import estilos from "./contacto.module.css";

// Negrita como la entiende WhatsApp: asteriscos pegados al texto ("*así*", no "* así *").
const PATRON = new RegExp(`(\\*[^*\\s](?:[^*\\n]*[^*\\s])?\\*|${HUECO_ABRE}[^${HUECO_CIERRA}]+${HUECO_CIERRA})`, "g");

/*
 * Lo que verá GAVICOM en WhatsApp, mientras se escribe. Los *asteriscos* se
 * pintan en negrita como en WhatsApp y los huecos sin llenar, en gris.
 */
export default function VistaPrevia({ tipo, datos }: { tipo: TipoSolicitud; datos: DatosContacto }) {
  const mensaje = construirMensajeContacto(tipo, datos, { vistaPrevia: true });
  const partes = mensaje.split(PATRON);

  return (
    <section aria-label="Vista previa del mensaje">
      {/* Márgenes de 32 px: las marcas del TechFrame ocupan hasta ~30 px de cada esquina al crecer. */}
      <TechFrame tone="oscuro" className="rounded-[4px] bg-brand-deep text-white">
        <div className="flex items-center gap-3 border-b border-white/10 px-8 py-6">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[4px] bg-white/10">
            <IconoWhatsApp className="size-[18px] text-white" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">Vista previa</p>
            <p className="mt-1 truncate text-sm font-medium text-white">
              WhatsApp comercial · <span className="tabular-nums">{formatearTelefono(COMPANIA_INFO.whatsappSales)}</span>
            </p>
          </div>
        </div>

        {/* Fondo de conversación: rejilla tenue en lugar del papel tapiz de WhatsApp.
            Un mensaje largo se recorre aquí dentro: con tabIndex también con el
            teclado, y data-lenis-prevent devuelve la rueda del ratón a este bloque. */}
        <div
          role="region"
          aria-label="Mensaje"
          tabIndex={0}
          data-lenis-prevent=""
          className="max-h-[46vh] overflow-y-auto bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-size-[20px_20px] px-8 py-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        >
          <div className={cn(estilos.globo, "ml-6 rounded-[6px] rounded-tr-none bg-white px-4 py-3.5 text-ink shadow-sm")}>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {partes.map((parte, i) => {
                // split() con grupo de captura alterna texto suelto (pares) y coincidencias (impares).
                if (i % 2 === 0) return <Fragment key={i}>{parte}</Fragment>;
                if (parte.startsWith("*")) {
                  // La key lleva el texto: al cambiar el tipo, se monta de nuevo y repite el resaltado.
                  return (
                    <strong key={`${i}-${parte}`} className={cn(estilos.resaltado, "rounded-[2px] font-semibold")}>
                      {parte.slice(1, -1)}
                    </strong>
                  );
                }
                return (
                  <span key={i} className="text-zinc-500 italic">
                    {parte.slice(HUECO_ABRE.length, -HUECO_CIERRA.length)}
                  </span>
                );
              })}
            </p>
          </div>
        </div>

        <p className="border-t border-white/10 px-8 py-5 text-xs leading-relaxed text-zinc-300">
          Así llegará su mensaje. En WhatsApp podrá revisarlo antes de enviarlo.
        </p>
      </TechFrame>
    </section>
  );
}
