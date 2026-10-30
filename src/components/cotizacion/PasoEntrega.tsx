"use client";

import type { RefObject } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import ScrambleLabel from "@/components/motion/ScrambleLabel";
import { LARGO_MAXIMO_COMENTARIO, PLAZOS_COTIZACION } from "@/lib/cotizacion";
import { BOTON_PRIMARIO, BOTON_SECUNDARIO, CONTROL, Campo, Contador, propsDeCampo } from "./campos";
import type { BorradorCotizacion } from "./borrador";
import { dosCifras, PASOS } from "./RielPasos";
import type { CampoValidable, Errores } from "./validacion";

// Geografía, no datos de la empresa: sugerencias para escribir el departamento sin errores.
const DEPARTAMENTOS = [
  "Amazonas",
  "Antioquia",
  "Arauca",
  "Atlántico",
  "Bogotá D. C.",
  "Bolívar",
  "Boyacá",
  "Caldas",
  "Caquetá",
  "Casanare",
  "Cauca",
  "Cesar",
  "Chocó",
  "Córdoba",
  "Cundinamarca",
  "Guainía",
  "Guaviare",
  "Huila",
  "La Guajira",
  "Magdalena",
  "Meta",
  "Nariño",
  "Norte de Santander",
  "Putumayo",
  "Quindío",
  "Risaralda",
  "San Andrés y Providencia",
  "Santander",
  "Sucre",
  "Tolima",
  "Valle del Cauca",
  "Vaupés",
  "Vichada",
];

interface PasoEntregaProps {
  base: string;
  tituloRef: RefObject<HTMLHeadingElement | null>;
  borrador: BorradorCotizacion;
  errores: Errores;
  onCambio: <K extends keyof BorradorCotizacion>(campo: K, valor: BorradorCotizacion[K]) => void;
  onSalir: (campo: CampoValidable) => void;
  onVolver: () => void;
}

export default function PasoEntrega({ base, tituloRef, borrador, errores, onCambio, onSalir, onVolver }: PasoEntregaProps) {
  const idCiudad = `${base}-ciudad`;
  const idDepartamento = `${base}-departamento`;
  const idComentarios = `${base}-comentarios`;
  const idListaDepartamentos = `${base}-departamentos`;

  return (
    <div>
      <header className="max-w-2xl">
        <ScrambleLabel text={`PASO ${dosCifras(2)} / ${dosCifras(PASOS.length)}`} />
        <h2
          ref={tituloRef}
          tabIndex={-1}
          className="mt-4 font-titulo text-3xl font-semibold leading-tight tracking-tight text-brand focus:outline-none sm:text-4xl"
        >
          Dónde y cuándo
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-600">
          El lugar de entrega cambia la logística y el plazo nos dice qué tan pronto lo necesita. Con eso la
          cotización llega más precisa.
        </p>
      </header>

      <fieldset className="mt-10">
        <legend className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-600">Lugar de entrega</legend>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <Campo id={idCiudad} etiqueta="Ciudad o municipio" requerido error={errores.ciudad}>
            <input
              {...propsDeCampo(idCiudad, { error: errores.ciudad })}
              name="ciudad"
              type="text"
              required
              autoComplete="address-level2"
              enterKeyHint="next"
              maxLength={80}
              placeholder="Ej.: Barranquilla"
              value={borrador.ciudad}
              onChange={(evento) => onCambio("ciudad", evento.target.value)}
              onBlur={() => onSalir("ciudad")}
              className={CONTROL}
            />
          </Campo>
          <Campo id={idDepartamento} etiqueta="Departamento">
            <input
              {...propsDeCampo(idDepartamento, {})}
              name="departamento"
              type="text"
              list={idListaDepartamentos}
              autoComplete="address-level1"
              enterKeyHint="next"
              maxLength={60}
              placeholder="Ej.: Atlántico"
              value={borrador.departamento}
              onChange={(evento) => onCambio("departamento", evento.target.value)}
              className={CONTROL}
            />
            <datalist id={idListaDepartamentos}>
              {DEPARTAMENTOS.map((departamento) => (
                <option key={departamento} value={departamento} />
              ))}
            </datalist>
          </Campo>
        </div>
        <p className="mt-3 text-sm leading-snug text-zinc-600">
          Donde se entrega el suministro o se hace la instalación.
        </p>
      </fieldset>

      <fieldset className="mt-12">
        <legend className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
          Plazo requerido <span className="normal-case tracking-normal">(opcional)</span>
        </legend>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PLAZOS_COTIZACION.map((plazo) => (
            <label key={plazo} className="relative cursor-pointer">
              <input
                type="radio"
                name="plazo"
                value={plazo}
                checked={borrador.plazo === plazo}
                onChange={() => onCambio("plazo", plazo)}
                className="peer sr-only"
              />
              <span className="flex min-h-12 items-center justify-center rounded-[3px] border border-zinc-300 bg-white px-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-brand transition-colors duration-200 hover:border-brand peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {plazo}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-12">
        <Campo
          id={idComentarios}
          etiqueta="Comentarios técnicos"
          ayuda="Normas o especificaciones de referencia, condiciones del sitio, presentación del suministro…"
          extra={<Contador actual={borrador.comentarios.length} maximo={LARGO_MAXIMO_COMENTARIO} />}
        >
          <textarea
            {...propsDeCampo(idComentarios, { ayuda: true })}
            name="comentarios"
            rows={4}
            maxLength={LARGO_MAXIMO_COMENTARIO}
            value={borrador.comentarios}
            onChange={(evento) => onCambio("comentarios", evento.target.value)}
            data-lenis-prevent=""
            className={cn(CONTROL, "min-h-32 resize-y leading-relaxed")}
          />
        </Campo>
      </div>

      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-zinc-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onVolver} className={cn(BOTON_SECUNDARIO, "w-full sm:w-auto")}>
          <ArrowLeft aria-hidden="true" className="size-4" />
          Volver
        </button>
        <button type="submit" className={cn(BOTON_PRIMARIO, "w-full sm:w-auto")}>
          <span className="relative">
            Continuar<span className="max-sm:sr-only">: sus datos</span>
          </span>
          <ArrowRight
            aria-hidden="true"
            className="relative size-4 transition-transform duration-300 group-hover/boton:translate-x-1 motion-reduce:transition-none"
          />
        </button>
      </div>
    </div>
  );
}
