import { COMPANIA_INFO } from "@/constants/productos";
import { cn } from "@/lib/cn";
import Reveal from "@/components/motion/Reveal";
import TechFrame from "@/components/motion/TechFrame";
import SectionHeader from "@/components/ui/SectionHeader";
import Boton from "@/components/ui/Boton";
import PerfilRiel from "./PerfilRiel";
import { anclaServicio, SERVICIO_NORMATIVO } from "./datos";
import estilos from "./servicios.module.css";

// Qué es cada sigla: dato público, no un atributo de la empresa.
const REFERENCIAS: { sigla: string; nombre: string; detalle: string }[] = [
  {
    sigla: "AREMA",
    nombre: "American Railway Engineering and Maintenance-of-Way Association",
    detalle: "Asociación estadounidense de ingeniería ferroviaria y mantenimiento de vía.",
  },
  {
    sigla: "UIC",
    nombre: "Union Internationale des Chemins de fer",
    detalle: "Unión Internacional de Ferrocarriles.",
  },
];

export default function EstandaresServicios() {
  return (
    <section aria-labelledby="titulo-estandares" className="bg-white py-24 sm:py-32">
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-12">
        <div className="lg:col-span-7">
          <SectionHeader
            etiqueta="S.03 — ESTÁNDARES"
            titulo="Trabajamos bajo estándares AREMA / UIC"
            entradilla="Son la referencia técnica con la que especificamos los materiales y revisamos su compatibilidad, tanto en el suministro como en la consultoría ferroviaria."
            acentos={["estándares"]}
            id="titulo-estandares"
          />

          <dl className="mt-10 grid gap-px border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
            {REFERENCIAS.map(({ sigla, nombre, detalle }, i) => (
              <Reveal key={sigla} delay={i === 0 ? 0 : 1} className="spec-row bg-white p-6">
                <dt className="flex items-center gap-3">
                  <span className="rounded-[2px] bg-brand-deep px-2.5 py-1.5 text-[11px] font-semibold leading-none tracking-[0.18em] text-accent">
                    {sigla}
                  </span>
                </dt>
                <dd className="mt-4">
                  <span lang={sigla === "UIC" ? "fr" : "en"} className="block text-sm font-semibold leading-snug text-brand">
                    {nombre}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-zinc-600">{detalle}</span>
                </dd>
              </Reveal>
            ))}
          </dl>

          <Reveal className="mt-10 flex flex-col gap-6">
            <p className="border-l-2 border-accent pl-5 text-sm leading-relaxed text-zinc-600">
              {COMPANIA_INFO.disclaimerLegal}
            </p>
            {SERVICIO_NORMATIVO && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Servicio relacionado</p>
                <Boton href={`#${anclaServicio(SERVICIO_NORMATIVO.sku)}`} variante="enlace" icono="flecha" className="mt-1">
                  {SERVICIO_NORMATIVO.nombre}
                </Boton>
              </div>
            )}
          </Reveal>
        </div>

        {/* Después del texto en el HTML (se lee primero el titular); a la izquierda en escritorio. */}
        <figure className="lg:order-first lg:col-span-5">
          <Reveal variant="clip">
            <TechFrame tone="oscuro" className="relative isolate bg-brand-deep p-6 text-white sm:p-8">
              <div aria-hidden="true" className={cn(estilos.cuadriculaOscura, "pointer-events-none absolute inset-0 -z-10")} />
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                <span>Perfil de riel</span>
                <span>Esquema sin escala</span>
              </div>
              <PerfilRiel className="mx-auto mt-4 max-w-[26rem]" />
              <div className="mt-4 border-t border-white/15 pt-5">
                <p className="font-titulo text-3xl font-semibold tracking-tight text-accent sm:text-4xl">AREMA / UIC</p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-300">
                  Estándares operativos
                </p>
              </div>
            </TechFrame>
          </Reveal>
          <figcaption className="sr-only">
            Esquema de la sección de un riel, con cabeza, alma y patín, rodeado por un sello con las siglas AREMA y
            UIC.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
