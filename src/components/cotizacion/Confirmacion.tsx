"use client";

import { useState, type RefObject } from "react";
import { Check, ChevronDown, Copy, PencilLine, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import Boton from "@/components/ui/Boton";
import ScrambleLabel from "@/components/motion/ScrambleLabel";
import { COMPANIA_INFO } from "@/constants/productos";
import { BOTON_TEXTO } from "./campos";
import estilos from "./cotizador.module.css";

export type EstadoCopia = "pendiente" | "enviada" | "no-disponible";

export interface Envio {
  mensaje: string;
  urlWhatsApp: string;
  urlCorreo: string;
  copia: EstadoCopia;
}

interface ConfirmacionProps {
  envio: Envio;
  tituloRef: RefObject<HTMLHeadingElement | null>;
  onModificar: () => void;
  onNuevaSolicitud: () => void;
}

/** Marca de verificación dentro de un marco técnico; los trazos se dibujan al aparecer. */
function MarcaEnviada() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="size-16 shrink-0" fill="none">
      <path
        d="M2 18V2h16M46 2h16v16M62 46v16H46M18 62H2V46"
        pathLength={1}
        className={estilos.trazo}
        stroke="var(--accent)"
        strokeWidth={3}
      />
      <path
        d="M19 33.5l9 9 18-20"
        pathLength={1}
        className={cn(estilos.trazo, estilos.trazoTarde)}
        stroke="var(--brand)"
        strokeWidth={4}
        strokeLinecap="square"
      />
    </svg>
  );
}

export default function Confirmacion({ envio, tituloRef, onModificar, onNuevaSolicitud }: ConfirmacionProps) {
  const [copiado, setCopiado] = useState(false);
  const [confirmarNueva, setConfirmarNueva] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(envio.mensaje);
      setCopiado(true);
    } catch {
      // Sin permiso de portapapeles: el mensaje sigue visible para copiarlo a mano.
      setCopiado(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <MarcaEnviada />
        <header className="max-w-2xl">
          <ScrambleLabel text="SOLICITUD LISTA" />
          <h2
            ref={tituloRef}
            tabIndex={-1}
            className="mt-4 font-titulo text-3xl font-semibold leading-tight tracking-tight text-brand focus:outline-none sm:text-4xl"
          >
            Su solicitud está lista en WhatsApp
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            Abrimos WhatsApp en una pestaña nueva con el mensaje completo. Pulse «Enviar» allí para que llegue a
            nuestro equipo comercial. Si no se abrió, o la cerró antes de enviarlo, ábralo de nuevo.
          </p>
        </header>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:pl-24">
        <Boton href={envio.urlWhatsApp} externo icono="whatsapp">
          Abrir WhatsApp<span className="max-sm:sr-only"> de nuevo</span>
        </Boton>
        <Boton href={envio.urlCorreo} variante="secundario">
          Enviar por correo
        </Boton>
      </div>

      <div className="mt-5 sm:pl-24" aria-live="polite">
        {envio.copia === "enviada" && (
          <p className="flex items-center gap-2 text-sm font-medium text-brand">
            <Check aria-hidden="true" className="size-4" />
            También recibimos una copia de su solicitud por correo.
          </p>
        )}
      </div>

      <div className="mt-10 grid gap-8 border-t border-zinc-200 pt-8 sm:pl-24 lg:grid-cols-[1fr_auto]">
        <p className="max-w-md text-sm leading-relaxed text-zinc-600">
          ¿Prefiere el correo? Escriba a{" "}
          <a
            href={`mailto:${COMPANIA_INFO.email}`}
            className="font-semibold text-brand underline decoration-accent decoration-2 underline-offset-4 hover:text-brand-deep"
          >
            {COMPANIA_INFO.email}
          </a>
          : «Enviar por correo» abre su programa de correo con la misma solicitud.
        </p>
        <button type="button" onClick={copiar} className={cn(BOTON_TEXTO, "self-start")}>
          {copiado ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
          <span className="boton-enlace-texto" aria-live="polite">
            {copiado ? "Mensaje copiado" : "Copiar mensaje"}
          </span>
        </button>
      </div>

      <details className="group/vista mt-6 border-y border-zinc-200 sm:ml-24">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
          Ver el resumen enviado
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-open/vista:rotate-180 motion-reduce:transition-none"
          />
        </summary>
        <div className="pb-6">
          <div className="relative max-w-xl rounded-[4px] rounded-bl-none border border-brand/15 bg-brand/[0.04] px-5 py-4">
            <p
              data-lenis-prevent=""
              className="max-h-96 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-relaxed text-ink"
            >
              {envio.mensaje}
            </p>
          </div>
        </div>
      </details>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:pl-24">
        <button type="button" onClick={onModificar} className={BOTON_TEXTO}>
          <PencilLine aria-hidden="true" className="size-4" />
          <span className="boton-enlace-texto">Modificar solicitud</span>
        </button>

        {confirmarNueva ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="text-sm text-zinc-700">Se vaciará su lista y los datos del formulario.</p>
            <button type="button" onClick={onNuevaSolicitud} className={cn(BOTON_TEXTO, "text-red-700")}>
              Sí, vaciar
            </button>
            <button type="button" onClick={() => setConfirmarNueva(false)} className={BOTON_TEXTO}>
              Cancelar
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmarNueva(true)} className={BOTON_TEXTO}>
            <RotateCcw aria-hidden="true" className="size-4" />
            <span className="boton-enlace-texto">Vaciar cotización</span>
          </button>
        )}
      </div>
    </div>
  );
}
