"use client";

import type { RefObject } from "react";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import ScrambleLabel from "@/components/motion/ScrambleLabel";
import { COMPANIA_INFO } from "@/constants/productos";
import { BOTON_PRIMARIO, BOTON_SECUNDARIO, CONTROL, Campo, MensajeError, idError, propsDeCampo } from "./campos";
import type { BorradorCotizacion } from "./borrador";
import { dosCifras, PASOS } from "./RielPasos";
import type { CampoValidable, Errores } from "./validacion";

function IconoWhatsApp() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="relative size-4 shrink-0 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface PasoDatosProps {
  base: string;
  tituloRef: RefObject<HTMLHeadingElement | null>;
  borrador: BorradorCotizacion;
  errores: Errores;
  /** El mensaje tal como llegará a WhatsApp, para revisarlo antes de enviar. */
  mensaje: string;
  onCambio: <K extends keyof BorradorCotizacion>(campo: K, valor: BorradorCotizacion[K]) => void;
  onSalir: (campo: CampoValidable) => void;
  onVolver: () => void;
}

export default function PasoDatos({
  base,
  tituloRef,
  borrador,
  errores,
  mensaje,
  onCambio,
  onSalir,
  onVolver,
}: PasoDatosProps) {
  const id = (campo: string) => `${base}-${campo}`;
  const empresa = !borrador.personaNatural;

  return (
    <div>
      <header className="max-w-2xl">
        <ScrambleLabel text={`PASO ${dosCifras(3)} / ${dosCifras(PASOS.length)}`} />
        <h2
          ref={tituloRef}
          tabIndex={-1}
          className="mt-4 font-titulo text-3xl font-semibold leading-tight tracking-tight text-brand focus:outline-none sm:text-4xl"
        >
          Sus datos
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-600">
          Para saber a quién responder. Los campos con <span aria-hidden="true">*</span>
          <span className="sr-only">asterisco</span> son obligatorios.
        </p>
      </header>

      <fieldset className="mt-10">
        <legend className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-600">Solicita como</legend>
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-[4px] border border-zinc-300 bg-surface p-1 sm:inline-grid">
          {[
            { valor: false, rotulo: "Empresa" },
            { valor: true, rotulo: "Persona natural" },
          ].map(({ valor, rotulo }) => (
            <label key={rotulo} className="relative cursor-pointer">
              <input
                type="radio"
                name="solicitaComo"
                checked={borrador.personaNatural === valor}
                onChange={() => onCambio("personaNatural", valor)}
                className="peer sr-only"
              />
              <span className="flex min-h-11 items-center justify-center rounded-[3px] px-2 text-center text-xs font-semibold uppercase leading-tight tracking-[0.12em] text-zinc-600 transition-colors duration-200 hover:text-brand peer-checked:bg-white peer-checked:text-brand peer-checked:shadow-[0_1px_3px_rgb(12_38_66/0.15)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent sm:px-6">
                {rotulo}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-x-6 gap-y-7 sm:grid-cols-2">
        <Campo id={id("nombre")} etiqueta="Nombre completo" requerido error={errores.nombre}>
          <input
            {...propsDeCampo(id("nombre"), { error: errores.nombre })}
            name="nombre"
            type="text"
            required
            autoComplete="name"
            enterKeyHint="next"
            maxLength={100}
            value={borrador.nombre}
            onChange={(evento) => onCambio("nombre", evento.target.value)}
            onBlur={() => onSalir("nombre")}
            className={CONTROL}
          />
        </Campo>
        <Campo
          id={id("telefono")}
          etiqueta="Teléfono o WhatsApp"
          requerido
          ayuda="Con indicativo si es de otro país."
          error={errores.telefono}
        >
          <input
            {...propsDeCampo(id("telefono"), { ayuda: true, error: errores.telefono })}
            name="telefono"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            maxLength={24}
            placeholder="300 000 0000"
            value={borrador.telefono}
            onChange={(evento) => onCambio("telefono", evento.target.value)}
            onBlur={() => onSalir("telefono")}
            className={CONTROL}
          />
        </Campo>

        {empresa && (
          <>
            <Campo id={id("empresa")} etiqueta="Empresa" requerido error={errores.empresa}>
              <input
                {...propsDeCampo(id("empresa"), { error: errores.empresa })}
                name="empresa"
                type="text"
                required
                autoComplete="organization"
                enterKeyHint="next"
                maxLength={120}
                value={borrador.empresa}
                onChange={(evento) => onCambio("empresa", evento.target.value)}
                onBlur={() => onSalir("empresa")}
                className={CONTROL}
              />
            </Campo>
            <Campo id={id("nit")} etiqueta="NIT" error={errores.nit}>
              <input
                {...propsDeCampo(id("nit"), { error: errores.nit })}
                name="nit"
                type="text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                maxLength={20}
                placeholder="900.123.456-7"
                value={borrador.nit}
                onChange={(evento) => onCambio("nit", evento.target.value)}
                onBlur={() => onSalir("nit")}
                className={CONTROL}
              />
            </Campo>
            <Campo id={id("cargo")} etiqueta="Cargo">
              <input
                {...propsDeCampo(id("cargo"), {})}
                name="cargo"
                type="text"
                autoComplete="organization-title"
                enterKeyHint="next"
                maxLength={80}
                value={borrador.cargo}
                onChange={(evento) => onCambio("cargo", evento.target.value)}
                className={CONTROL}
              />
            </Campo>
          </>
        )}

        <Campo
          id={id("correo")}
          etiqueta="Correo"
          ayuda="Si prefiere que también le respondamos por correo."
          error={errores.correo}
        >
          <input
            {...propsDeCampo(id("correo"), { ayuda: true, error: errores.correo })}
            name="correo"
            type="email"
            autoComplete="email"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="done"
            maxLength={120}
            placeholder="nombre@empresa.com"
            value={borrador.correo}
            onChange={(evento) => onCambio("correo", evento.target.value)}
            onBlur={() => onSalir("correo")}
            className={CONTROL}
          />
        </Campo>
      </div>

      {/* Autorización de tratamiento de datos (Ley 1581 de 2012): obligatoria y sin marcar por defecto. */}
      <div className="mt-10 rounded-[3px] border border-zinc-200 bg-surface p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="relative mt-0.5 flex size-6 shrink-0">
            <input
              {...propsDeCampo(id("autorizaDatos"), { error: errores.autorizaDatos })}
              name="autorizaDatos"
              type="checkbox"
              required
              checked={borrador.autorizaDatos}
              onChange={(evento) => {
                onCambio("autorizaDatos", evento.target.checked);
              }}
              className="peer absolute inset-0 size-6 cursor-pointer appearance-none rounded-[3px] border-2 border-brand bg-white transition-colors duration-200 checked:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-red-700"
            />
            <Check
              aria-hidden="true"
              strokeWidth={3}
              className="pointer-events-none absolute inset-0 m-auto size-4 text-white opacity-0 peer-checked:opacity-100"
            />
          </span>
          <label htmlFor={id("autorizaDatos")} className="cursor-pointer text-sm leading-relaxed text-zinc-700">
            <span className="font-semibold text-brand">Autorizo el tratamiento de mis datos personales.</span>{" "}
            {COMPANIA_INFO.nombre} los usará para atender esta solicitud de cotización y comunicarse conmigo sobre ella,
            conforme a la Ley 1581 de 2012.
            <span aria-hidden="true" className="ml-1 text-brand">
              *
            </span>
          </label>
        </div>
        <div className="pl-10">
          <MensajeError id={idError(id("autorizaDatos"))}>{errores.autorizaDatos}</MensajeError>
        </div>
      </div>

      <details className="group/vista mt-8 border-y border-zinc-200">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
          Ver el mensaje que se enviará
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-open/vista:rotate-180 motion-reduce:transition-none"
          />
        </summary>
        <div className="pb-6">
          {/* Globo de chat en colores de marca: lo que verá GAVICOM en WhatsApp. */}
          <div className="relative max-w-xl rounded-[4px] rounded-bl-none border border-brand/15 bg-brand/[0.04] px-5 py-4">
            <p
              data-lenis-prevent=""
              className="max-h-80 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-relaxed text-ink"
            >
              {mensaje}
            </p>
          </div>
        </div>
      </details>

      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-zinc-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onVolver} className={cn(BOTON_SECUNDARIO, "w-full sm:w-auto")}>
          <ArrowLeft aria-hidden="true" className="size-4" />
          Volver
        </button>
        <div className="flex flex-col gap-3 sm:items-end">
          <button type="submit" className={cn(BOTON_PRIMARIO, "w-full sm:w-auto")}>
            <IconoWhatsApp />
            <span className="relative">
              Enviar<span className="max-sm:sr-only"> solicitud</span> por WhatsApp
            </span>
          </button>
          <p className="text-center text-xs leading-snug text-zinc-600 sm:text-right">
            Se abre WhatsApp con el mensaje listo: solo falta pulsar enviar.
          </p>
        </div>
      </div>
    </div>
  );
}
