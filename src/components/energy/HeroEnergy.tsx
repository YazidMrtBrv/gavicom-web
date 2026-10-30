import { ArrowDown } from "lucide-react";
import { ENERGY_INTRO, SERVICIOS_ENERGY } from "@/constants/energy";
import { COMPANIA_INFO } from "@/constants/productos";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import SectionHeader from "@/components/ui/SectionHeader";
import Boton from "@/components/ui/Boton";
import VisualEnergy, { type MaterialEnergy } from "./VisualEnergy";
import {
  anclaServicio,
  dosCifras,
  esCodigoServicio,
  MENSAJE_WHATSAPP_ENERGY,
  NOMBRE_CORTO,
  PIEZA_SERVICIO,
  TOTAL_SERVICIOS,
} from "./datos";
import "./energia.css";

const FICHA: [string, string][] = [
  ["Línea", "GAVICOM Energy"],
  ["Servicios", dosCifras(TOTAL_SERVICIOS)],
  ["Sede", `${COMPANIA_INFO.ciudad}, ${COMPANIA_INFO.departamento}`],
];

export default function HeroEnergy({ material }: { material?: MaterialEnergy }) {
  return (
    // .energia-hero es el ámbito del resaltado leyenda → esquema (energia.css).
    <section aria-labelledby="titulo-energy" className="energia-hero relative isolate overflow-clip bg-brand-deep text-white">
      <div aria-hidden="true" className="energia-cuadricula pointer-events-none absolute inset-0 -z-10" />
      {/* Halo cálido muy tenue donde "sale" el sol del esquema. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 -z-10 size-[44rem] rounded-full bg-[radial-gradient(circle,rgb(232_146_12/0.10),transparent_65%)]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 pt-32 sm:px-6 sm:pt-40 lg:px-12 lg:pt-44">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <SectionHeader
              as="h1"
              tono="oscuro"
              etiqueta="GAVICOM ENERGY"
              titulo="Energía solar fotovoltaica para hogares, comercios e industria"
              entradilla={ENERGY_INTRO}
              acentos={["solar"]}
              id="titulo-energy"
            />

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Boton href="/cotizar" icono="flecha">
                Solicitar cotización
              </Boton>
              <Boton href={construirUrlWhatsApp(MENSAJE_WHATSAPP_ENERGY)} externo icono="whatsapp" variante="claro">
                Escribir por WhatsApp
              </Boton>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-6 sm:gap-8">
              {FICHA.map(([termino, valor]) => (
                <div key={termino}>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">{termino}</dt>
                  <dd className="mt-2 text-sm font-medium leading-snug text-white tabular-nums">{valor}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6">
            <VisualEnergy material={material} />
          </div>
        </div>

        {/* Leyenda del esquema y, a la vez, índice de la página: lleva a cada servicio. */}
        <nav aria-label="Servicios de GAVICOM Energy" className="mt-16 sm:mt-20 lg:mt-24">
          <ol className="grid grid-cols-2 gap-px border-t border-white/15 bg-white/15 lg:grid-cols-4">
            {SERVICIOS_ENERGY.map((servicio) => {
              const codigo = servicio.codigo;
              return (
                <li key={codigo} className="bg-brand-deep">
                  <a
                    href={`#${anclaServicio(codigo)}`}
                    data-enlace={esCodigoServicio(codigo) ? PIEZA_SERVICIO[codigo] : undefined}
                    className="energia-enlace group/enlace relative flex h-full flex-col gap-3 px-4 pb-7 pt-6 transition-colors duration-300 hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:px-6 lg:pb-9 lg:pt-8"
                  >
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-accent tabular-nums">{codigo}</span>
                    <span className="text-sm font-medium leading-snug text-white sm:text-base">
                      {esCodigoServicio(codigo) ? NOMBRE_CORTO[codigo] : servicio.titulo}
                    </span>
                    <ArrowDown
                      aria-hidden="true"
                      className="mt-auto size-4 text-zinc-400 transition-transform duration-300 group-hover/enlace:translate-y-1 group-hover/enlace:text-accent motion-reduce:transition-none"
                    />
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </section>
  );
}
