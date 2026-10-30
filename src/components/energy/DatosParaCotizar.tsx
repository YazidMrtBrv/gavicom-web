"use client";

import { useId, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import Boton from "@/components/ui/Boton";
import { useCotizacion } from "@/components/cotizacion/CotizacionProvider";
import { COMPANIA_INFO } from "@/constants/productos";
import { construirUrlWhatsApp, type ItemCotizacion } from "@/lib/cotizacion";
import {
  DATOS_PARA_COTIZAR,
  dosCifras,
  TIPOS_INSTALACION,
  type DatoParaCotizar,
  type TipoInstalacion,
} from "./datos";
import "./energia.css";

type IdDato = DatoParaCotizar["id"];

function construirMensaje(
  tipo: TipoInstalacion | null,
  tengo: ReadonlySet<IdDato>,
  servicios: readonly ItemCotizacion[]
): string {
  const lineas = [`Hola ${COMPANIA_INFO.nombre}, quiero cotizar un proyecto con GAVICOM Energy.`];
  if (tipo) lineas.push(`Tipo de instalación: ${tipo}.`);
  if (servicios.length > 0) {
    lineas.push("", "Servicios de interés:");
    for (const servicio of servicios) lineas.push(`- ${servicio.nombre} (Ref. ${servicio.sku})`);
  }
  const datos = DATOS_PARA_COTIZAR.filter((dato) => dato.id !== "tipo" && tengo.has(dato.id)).map(
    (dato) => dato.enMensaje
  );
  if (datos.length > 0) lineas.push("", `Puedo enviar: ${datos.join(", ")}.`);
  return lineas.join("\n");
}

const NUMERO = "pt-1 text-[11px] font-semibold tracking-[0.2em] text-zinc-500 tabular-nums";
const TITULO = "block text-lg font-semibold leading-snug text-brand sm:text-xl";
const DETALLE = "mt-1.5 block text-sm leading-relaxed text-zinc-600";
// Barra accent fija mientras el dato está marcado (la de .spec-row solo sale en hover).
const BARRA_MARCADO =
  "pointer-events-none absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-accent transition-transform duration-300 motion-reduce:transition-none";

/*
 * Lista de lo que la empresa necesita para cotizar. Marcarla no envía nada:
 * solo arma el mensaje de WhatsApp con lo que el visitante dice tener, para
 * que la primera respuesta ya pueda ir al grano.
 */
export default function DatosParaCotizar({ encabezado }: { encabezado: ReactNode }) {
  const base = useId();
  const [tengo, setTengo] = useState<ReadonlySet<IdDato>>(() => new Set());
  const [tipo, setTipo] = useState<TipoInstalacion | null>(null);
  const { items } = useCotizacion();

  const servicios = items.filter((item) => item.linea === "energy");
  const total = DATOS_PARA_COTIZAR.length;
  const listos = DATOS_PARA_COTIZAR.filter((dato) => (dato.id === "tipo" ? tipo !== null : tengo.has(dato.id))).length;
  const urlWhatsApp = construirUrlWhatsApp(construirMensaje(tipo, tengo, servicios));

  const alternar = (id: IdDato) =>
    setTengo((previo) => {
      const siguiente = new Set(previo);
      if (siguiente.has(id)) siguiente.delete(id);
      else siguiente.add(id);
      return siguiente;
    });

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-12">
      <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">{encabezado}</div>

      <ol className="border-t border-zinc-300 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
        {DATOS_PARA_COTIZAR.map((dato, i) => {
          const idTitulo = `${base}-${dato.id}-titulo`;
          const idDetalle = `${base}-${dato.id}-detalle`;

          if (dato.id === "tipo") {
            return (
              <li key={dato.id} className="spec-row group/dato border-b border-zinc-300">
                <span aria-hidden="true" className={cn(BARRA_MARCADO, tipo && "scale-y-100")} />
                <div className="flex items-start gap-5 py-6 pl-5 pr-1 sm:gap-8 sm:py-7">
                  <span aria-hidden="true" className={NUMERO}>
                    {dosCifras(i + 1)}
                  </span>
                  <div className="flex-1">
                    <span id={idTitulo} className={TITULO}>
                      {dato.titulo}
                    </span>
                    <span id={idDetalle} className={DETALLE}>
                      {dato.detalle}
                    </span>
                    <div
                      role="radiogroup"
                      aria-labelledby={idTitulo}
                      aria-describedby={idDetalle}
                      className="mt-4 flex flex-wrap gap-2"
                    >
                      {TIPOS_INSTALACION.map((opcion) => (
                        <label key={opcion} className="relative cursor-pointer">
                          <input
                            type="radio"
                            name={`${base}-tipo`}
                            value={opcion}
                            checked={tipo === opcion}
                            onChange={() => setTipo(opcion)}
                            className="peer sr-only"
                          />
                          <span className="inline-flex min-h-11 items-center rounded-[3px] border border-brand/30 bg-white px-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand transition-colors duration-300 hover:border-brand peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                            {opcion}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          }

          const marcado = tengo.has(dato.id);
          const idLoTengo = `${base}-${dato.id}-tengo`;
          return (
            <li key={dato.id} className="spec-row group/dato border-b border-zinc-300">
              <span aria-hidden="true" className={cn(BARRA_MARCADO, marcado && "scale-y-100")} />
              <label className="flex cursor-pointer items-start gap-5 py-6 pl-5 pr-1 sm:gap-8 sm:py-7">
                <span aria-hidden="true" className={NUMERO}>
                  {dosCifras(i + 1)}
                </span>
                <span className="flex-1">
                  <span id={idTitulo} className={TITULO}>
                    {dato.titulo}
                  </span>
                  <span id={idDetalle} className={DETALLE}>
                    {dato.detalle}
                  </span>
                </span>
                <span className="flex w-14 shrink-0 flex-col items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    checked={marcado}
                    onChange={() => alternar(dato.id)}
                    aria-labelledby={`${idTitulo} ${idLoTengo}`}
                    aria-describedby={idDetalle}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="flex size-7 items-center justify-center rounded-[3px] border border-brand/40 bg-white text-white transition-colors duration-300 group-hover/dato:border-brand peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
                  >
                    <Check className="size-4" strokeWidth={2.5} />
                  </span>
                  <span
                    id={idLoTengo}
                    className="text-[10px] font-semibold uppercase leading-none tracking-[0.14em] text-zinc-500"
                  >
                    Lo tengo
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ol>

      <div className="group lg:sticky lg:top-36 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start">
        <div className="tech-corners relative border border-zinc-300 bg-white p-7 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Su solicitud</p>

          <p aria-live="polite" className="mt-4 flex items-baseline gap-3">
            <span className="inline-block overflow-clip">
              {/* La key reinicia la animación de la cifra en cada cambio. */}
              <span key={listos} className="energia-cifra block text-5xl font-light leading-none text-brand tabular-nums">
                {listos}
              </span>
            </span>
            <span className="text-sm text-zinc-600">
              de {total} datos listos
            </span>
          </p>

          {/* Riel de avance: un tramo por dato. */}
          <div aria-hidden="true" className="mt-5 flex gap-1.5">
            {DATOS_PARA_COTIZAR.map((dato, i) => (
              <span
                key={dato.id}
                className={cn(
                  "h-1.5 flex-1 rounded-[1px] transition-colors duration-500 motion-reduce:transition-none",
                  i < listos ? "bg-accent" : "bg-zinc-200"
                )}
              />
            ))}
          </div>

          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between gap-4 border-b border-zinc-200 pb-2">
              <dt className="text-zinc-600">Tipo de instalación</dt>
              <dd className="font-semibold text-brand">{tipo ?? "Sin definir"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-zinc-200 pb-2">
              <dt className="text-zinc-600">Servicios en su cotización</dt>
              <dd className="font-semibold text-brand tabular-nums">{servicios.length}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3">
            <Boton href="/cotizar" icono="flecha">
              Solicitar cotización
            </Boton>
            <Boton href={urlWhatsApp} externo icono="whatsapp" variante="secundario">
              Enviar por WhatsApp
            </Boton>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-zinc-600">
            Por WhatsApp también puede adjuntar la factura, el plano o las fotos del sitio.
          </p>
        </div>
      </div>
    </div>
  );
}
