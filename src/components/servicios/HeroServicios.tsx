import { COMPANIA_INFO } from "@/constants/productos";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import { cn } from "@/lib/cn";
import MediaSlot from "@/components/motion/MediaSlot";
import SectionHeader from "@/components/ui/SectionHeader";
import Boton from "@/components/ui/Boton";
import { AMBITOS, dosCifras, MENSAJE_WHATSAPP_SERVICIOS, TOTAL_SERVICIOS } from "./datos";
import estilos from "./servicios.module.css";

/*
 * Cajetín de plano bajo la foto: los datos de la página como en el rótulo de
 * un plano técnico. Las cifras salen del catálogo, no se escriben a mano.
 */
const CAJETIN: [string, string][] = [
  ["Línea", "Railway Solutions & Supply"],
  ["Servicios", dosCifras(TOTAL_SERVICIOS)],
  ["Ámbitos técnicos", dosCifras(AMBITOS.length)],
  ["Referencia técnica", "AREMA / UIC"],
  ["Sede", `${COMPANIA_INFO.ciudad}, ${COMPANIA_INFO.departamento}`],
  ["Cobertura", "Nacional"],
];

export default function HeroServicios() {
  return (
    <section aria-labelledby="titulo-servicios" className="relative isolate bg-white pb-16 sm:pb-24">
      <div
        aria-hidden="true"
        className={cn(estilos.cuadricula, "pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem]")}
      />

      <div className="mx-auto w-full max-w-7xl px-4 pt-32 sm:px-6 sm:pt-40 lg:px-12 lg:pt-44">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <SectionHeader
            as="h1"
            etiqueta="S.01 — SERVICIOS TÉCNICOS"
            titulo="Servicios técnicos para la infraestructura ferroviaria"
            acentos={["ferroviaria"]}
            id="titulo-servicios"
            className="lg:col-span-7"
          />

          <div className="lg:col-span-5 lg:pb-1.5">
            <p className="border-l-2 border-accent pl-5 text-base leading-relaxed text-zinc-600 sm:text-lg">
              Topografía con drones, mantenimiento de equipos, servicio hidráulico, alquiler de equipos de soldadura,
              planos técnicos, renderizado 3D y consultoría para la vía férrea en Colombia.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Boton href="/cotizar" icono="flecha">
                Solicitar cotización
              </Boton>
              <Boton
                href={construirUrlWhatsApp(MENSAJE_WHATSAPP_SERVICIOS)}
                externo
                icono="whatsapp"
                variante="secundario"
              >
                Asesoría técnica
              </Boton>
            </div>
          </div>
        </div>

        <MediaSlot
          imagen="/images/gemini-hero.webp"
          alt="Locomotoras de carga sobre una vía férrea"
          prioridad
          enmarcado
          sizes="(min-width: 1280px) 1184px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
          className="mt-14 aspect-[4/3] sm:aspect-[16/9] lg:mt-20 lg:aspect-[21/9]"
        />

        <dl className="grid grid-cols-2 gap-px border-x border-b border-zinc-200 bg-zinc-200 sm:grid-cols-3 lg:grid-cols-6">
          {CAJETIN.map(([termino, valor]) => (
            <div key={termino} className="bg-white px-4 py-4 sm:px-5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">{termino}</dt>
              <dd className="mt-2 text-sm font-semibold leading-snug text-brand tabular-nums">{valor}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex justify-center sm:justify-start">
          <Boton href="#portafolio" variante="enlace" icono="flecha">
            Ver los {TOTAL_SERVICIOS} servicios
          </Boton>
        </div>
      </div>
    </section>
  );
}
