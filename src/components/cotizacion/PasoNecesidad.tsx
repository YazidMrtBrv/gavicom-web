"use client";

import { useState, type RefObject } from "react";
import { ArrowRight, Check, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import Boton from "@/components/ui/Boton";
import ScrambleLabel from "@/components/motion/ScrambleLabel";
import { LARGO_MAXIMO_OTRO, type ItemCotizacion } from "@/lib/cotizacion";
import BuscadorReferencias from "./BuscadorReferencias";
import ListaItems from "./ListaItems";
import { BOTON_PRIMARIO, BOTON_TEXTO, CONTROL, Campo, Contador, MensajeError, idAyuda, idError } from "./campos";
import type { BorradorCotizacion } from "./borrador";
import type { ReferenciaCotizable } from "./referencias";
import { dosCifras, PASOS } from "./RielPasos";

interface PasoNecesidadProps {
  base: string;
  tituloRef: RefObject<HTMLHeadingElement | null>;
  referencias: ReferenciaCotizable[];
  porSku: ReadonlyMap<string, ReferenciaCotizable>;
  items: ItemCotizacion[];
  hidratado: boolean;
  unidades: number;
  contiene: (sku: string) => boolean;
  borrador: BorradorCotizacion;
  errorLista?: string;
  recienAgregado: string | null;
  ultimoQuitado: ItemCotizacion | null;
  onElegir: (referencia: ReferenciaCotizable) => void;
  onAlternarServicio: (referencia: ReferenciaCotizable) => void;
  onCantidad: (sku: string, cantidad: number) => void;
  onNota: (sku: string, nota: string) => void;
  onQuitar: (item: ItemCotizacion) => void;
  onDeshacer: () => void;
  onVaciar: () => void;
  onOtro: (texto: string) => void;
  onSalirOtro: () => void;
}

export const idDeshacer = (base: string) => `${base}-deshacer`;
export const idBuscador = (base: string) => `${base}-buscar`;
export const idOtro = (base: string) => `${base}-otro`;

export default function PasoNecesidad({
  base,
  tituloRef,
  referencias,
  porSku,
  items,
  hidratado,
  unidades,
  contiene,
  borrador,
  errorLista,
  recienAgregado,
  ultimoQuitado,
  onElegir,
  onAlternarServicio,
  onCantidad,
  onNota,
  onQuitar,
  onDeshacer,
  onVaciar,
  onOtro,
  onSalirOtro,
}: PasoNecesidadProps) {
  const [confirmarVaciado, setConfirmarVaciado] = useState(false);
  const servicios = referencias.filter((referencia) => referencia.linea === "energy");
  const idErrorLista = idError(`${base}-lista`);
  const idTitulo = `${base}-titulo-1`;
  const idTituloLista = `${base}-titulo-lista`;

  return (
    <div>
      <header className="max-w-2xl">
        <ScrambleLabel text={`PASO ${dosCifras(1)} / ${dosCifras(PASOS.length)}`} />
        <h2
          ref={tituloRef}
          id={idTitulo}
          tabIndex={-1}
          className="mt-4 font-titulo text-3xl font-semibold leading-tight tracking-tight text-brand focus:outline-none sm:text-4xl"
        >
          Qué necesita
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-600">
          Busque por referencia o nombre y ajuste las cantidades. Lo que no esté en el catálogo, descríbalo al final y
          va en la misma solicitud.
        </p>
      </header>

      <div className="mt-10">
        <BuscadorReferencias
          id={idBuscador(base)}
          referencias={referencias}
          contiene={contiene}
          onElegir={onElegir}
          onPasarAOtro={(texto) => {
            const actual = borrador.otroRequerimiento.trim();
            onOtro((actual ? `${actual}\n${texto}` : texto).slice(0, LARGO_MAXIMO_OTRO));
            requestAnimationFrame(() => document.getElementById(idOtro(base))?.focus());
          }}
          describidoPor={errorLista ? idErrorLista : undefined}
          invalido={Boolean(errorLista)}
        />
      </div>

      {/* Accesos directos: los servicios de Energy son pocos y se piden enteros. */}
      <div className="mt-8 border-t border-zinc-200 pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p id={`${base}-titulo-energy`} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
            Servicios de GAVICOM Energy
          </p>
          <Boton href="/catalogo" variante="enlace" icono="flecha" className="min-h-9 py-0 text-[11px]">
            Ver catálogo Railway
          </Boton>
        </div>
        <ul aria-labelledby={`${base}-titulo-energy`} className="mt-3 grid gap-2 sm:grid-cols-2">
          {servicios.map((servicio) => {
            const enLista = hidratado && contiene(servicio.sku);
            return (
              <li key={servicio.sku}>
                <button
                  type="button"
                  aria-pressed={enLista}
                  onClick={() => onAlternarServicio(servicio)}
                  className={cn(
                    "boton group/servicio flex min-h-14 w-full items-center gap-3 rounded-[3px] border px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    enLista
                      ? "border-brand bg-brand text-white"
                      : "border-zinc-300 bg-white text-brand hover:border-brand"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-[3px] border transition-colors duration-200",
                      enLista ? "border-accent bg-accent text-brand-deep" : "border-zinc-300 group-hover/servicio:border-brand"
                    )}
                  >
                    {enLista ? <Check className="size-4" strokeWidth={2.5} /> : <Plus className="size-4" />}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-[10px] font-semibold tracking-[0.2em] tabular-nums",
                        enLista ? "text-accent" : "text-zinc-600"
                      )}
                    >
                      {servicio.sku}
                    </span>
                    <span className="block text-sm font-semibold leading-snug">
                      {servicio.nombreCorto ?? servicio.nombre}
                    </span>
                  </span>
                  <span className="sr-only">{enLista ? ", en su cotización" : ", agregar a su cotización"}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <section aria-labelledby={idTituloLista} className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-zinc-300 pb-4">
          <h3 id={idTituloLista} tabIndex={-1} className="font-titulo text-xl font-semibold text-brand focus:outline-none">
            Su lista
          </h3>
          {hidratado && items.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600 tabular-nums">
                {dosCifras(items.length)} {items.length === 1 ? "referencia" : "referencias"} ·{" "}
                {unidades} {unidades === 1 ? "unidad" : "unidades"}
              </p>
              {confirmarVaciado ? (
                <span className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmarVaciado(false);
                      onVaciar();
                    }}
                    className={cn(BOTON_TEXTO, "min-h-9 text-red-700")}
                  >
                    Sí, vaciar
                  </button>
                  <button type="button" onClick={() => setConfirmarVaciado(false)} className={cn(BOTON_TEXTO, "min-h-9")}>
                    Cancelar
                  </button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirmarVaciado(true)} className={cn(BOTON_TEXTO, "min-h-9")}>
                  <span className="boton-enlace-texto">Vaciar lista</span>
                </button>
              )}
            </div>
          )}
        </div>

        {ultimoQuitado && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[3px] bg-surface px-4 py-3">
            <p className="text-sm text-zinc-700">
              Quitó <span className="font-semibold text-brand">{ultimoQuitado.sku}</span> de su lista.
            </p>
            <button id={idDeshacer(base)} type="button" onClick={onDeshacer} className={cn(BOTON_TEXTO, "min-h-9")}>
              <RotateCcw aria-hidden="true" className="size-3.5" />
              <span className="boton-enlace-texto">Deshacer</span>
            </button>
          </div>
        )}

        {/* Hasta hidratar no se sabe qué guardó el visitante: ni lista ni "vacía". */}
        {hidratado && items.length > 0 && (
          <div className="mt-6">
            <ListaItems
              base={base}
              items={items}
              referencias={porSku}
              recienAgregado={recienAgregado}
              onCantidad={onCantidad}
              onNota={onNota}
              onQuitar={onQuitar}
            />
          </div>
        )}

        {hidratado && items.length === 0 && (
          <div className="relative mt-6 border border-dashed border-zinc-300 px-5 py-10 sm:px-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-600">Lista vacía</p>
            <p className="mt-3 max-w-xl text-lg font-medium leading-snug text-brand">
              Todavía no ha agregado referencias.
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600">
              Use el buscador de arriba o recorra el catálogo y los servicios de Energy: cada ficha tiene el botón
              «Agregar a cotización» y lo que agregue aparece aquí.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Boton href="/catalogo" variante="secundario" icono="flecha">
                Catálogo Railway
              </Boton>
              <Boton href="/energy" variante="secundario" icono="flecha">
                Servicios Energy
              </Boton>
            </div>
          </div>
        )}
      </section>

      <div className="mt-12">
        <Campo
          id={idOtro(base)}
          etiqueta="Otro requerimiento"
          ayuda="Lo que no encuentre en el catálogo: descríbalo con medida, norma de referencia y cantidad."
          extra={<Contador actual={borrador.otroRequerimiento.length} maximo={LARGO_MAXIMO_OTRO} />}
        >
          <textarea
            id={idOtro(base)}
            // El error es del paso (lista u «otro»), no solo de este campo: se enlaza el del pie.
            aria-describedby={[idAyuda(idOtro(base)), errorLista ? idErrorLista : null].filter(Boolean).join(" ")}
            aria-invalid={errorLista ? true : undefined}
            name="otroRequerimiento"
            rows={3}
            maxLength={LARGO_MAXIMO_OTRO}
            value={borrador.otroRequerimiento}
            onChange={(evento) => onOtro(evento.target.value)}
            onBlur={onSalirOtro}
            data-lenis-prevent=""
            className={cn(CONTROL, "min-h-28 resize-y leading-relaxed")}
          />
        </Campo>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-zinc-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-6 sm:max-w-md" aria-live="polite">
          <MensajeError id={idErrorLista}>{errorLista}</MensajeError>
        </div>
        <button type="submit" enterKeyHint="next" className={cn(BOTON_PRIMARIO, "w-full sm:w-auto")}>
          <span className="relative">
            Continuar<span className="max-sm:sr-only">: dónde y cuándo</span>
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
