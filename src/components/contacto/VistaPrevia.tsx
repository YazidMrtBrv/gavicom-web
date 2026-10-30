"use client";

import { Fragment } from "react";
import { COMPANIA_INFO } from "@/constants/productos";
import { cn } from "@/lib/cn";
import TechFrame from "@/components/motion/TechFrame";
import {
  construirMensajeContacto,
  formatearTelefono,
  HUECO_ABRE,
  HUECO_CIERRA,
  type DatosContacto,
  type TipoSolicitud,
} from "./datos";
import estilos from "./contacto.module.css";

const PATRON = new RegExp(`(\\*[^*\\n]+\\*|${HUECO_ABRE}[^${HUECO_CIERRA}]+${HUECO_CIERRA})`, "g");

function IconoWhatsApp({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={cn("fill-current", className)}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/*
 * Lo que verá GAVICOM en WhatsApp, mientras se escribe. Los *asteriscos* se
 * pintan en negrita como en WhatsApp y los huecos sin llenar, en gris.
 */
export default function VistaPrevia({ tipo, datos }: { tipo: TipoSolicitud; datos: DatosContacto }) {
  const mensaje = construirMensajeContacto(tipo, datos, { vistaPrevia: true });
  const partes = mensaje.split(PATRON);

  return (
    <section aria-label="Vista previa del mensaje">
      <TechFrame tone="oscuro" className="rounded-[4px] bg-brand-deep text-white">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
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

        {/* Fondo de conversación: rejilla tenue en lugar del papel tapiz de WhatsApp. */}
        <div className="max-h-[46vh] overflow-y-auto bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-size-[20px_20px] px-5 py-6 sm:px-6">
          <div className={cn(estilos.globo, "ml-6 rounded-[6px] rounded-tr-none bg-white px-4 py-3.5 text-ink shadow-sm")}>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {partes.map((parte, i) => {
                if (parte.startsWith("*") && parte.endsWith("*") && parte.length > 2) {
                  // key con el tipo: al cambiarlo, el span se monta de nuevo y repite el resaltado.
                  return (
                    <strong key={`${i}-${parte}`} className={cn(estilos.resaltado, "rounded-[2px] font-semibold")}>
                      {parte.slice(1, -1)}
                    </strong>
                  );
                }
                if (parte.startsWith(HUECO_ABRE)) {
                  return (
                    <span key={i} className="text-zinc-500 italic">
                      {parte.slice(1, -1)}
                    </span>
                  );
                }
                return <Fragment key={i}>{parte}</Fragment>;
              })}
            </p>
          </div>
        </div>

        <p className="border-t border-white/10 px-5 py-4 text-xs leading-relaxed text-zinc-300 sm:px-6">
          Así llegará su mensaje. En WhatsApp podrá revisarlo antes de enviarlo.
        </p>
      </TechFrame>
    </section>
  );
}
