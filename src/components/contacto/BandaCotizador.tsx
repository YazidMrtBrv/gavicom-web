import { cn } from "@/lib/cn";
import Reveal, { type PasoReveal } from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import AccesoCotizador from "./AccesoCotizador";
import estilos from "./contacto.module.css";

// Describe el cotizador del sitio (/cotizar) tal como funciona, no un proceso interno.
const PASOS = [
  {
    numero: "01",
    titulo: "Elija lo que necesita",
    detalle: "Referencias del catálogo Railway o servicios de GAVICOM Energy, en la misma lista.",
  },
  {
    numero: "02",
    titulo: "Cantidades y entrega",
    detalle: "Indique cuántas unidades necesita de cada referencia y la ciudad de entrega.",
  },
  {
    numero: "03",
    titulo: "Envíe por WhatsApp",
    detalle: "La solicitud sale completa hacia el WhatsApp comercial, lista para cotizar.",
  },
];

function Via({ vertical = false }: { vertical?: boolean }) {
  const forma = vertical ? estilos.viaVertical : estilos.via;
  return (
    <>
      <span className={cn(forma, "absolute inset-0")} />
      <span className={cn(forma, estilos.recorrida, "absolute inset-0")} />
    </>
  );
}

export default function BandaCotizador() {
  return (
    <section aria-labelledby="titulo-cotizador" className="relative isolate overflow-clip bg-brand-deep text-white">
      <div aria-hidden="true" className={cn(estilos.cuadriculaOscura, "pointer-events-none absolute inset-0 -z-10")} />

      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-12">
        <SectionHeader
          tono="oscuro"
          etiqueta="S.03 — COTIZADOR"
          titulo="Para varias referencias, use el cotizador"
          entradilla="Reúne en una sola solicitud referencias del catálogo Railway y servicios de GAVICOM Energy, con sus cantidades y la ciudad de entrega."
          acentos={["cotizador"]}
          id="titulo-cotizador"
        />

        {/* Las estaciones van sobre una vía que se tiende al bajar: horizontal en
            escritorio, vertical en el teléfono. El texto de cada paso es HTML normal. */}
        <div className={cn(estilos.pasos, "relative mt-16 sm:mt-20")}>
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-3.5 hidden h-3 lg:block">
            <Via />
          </span>
          <span aria-hidden="true" className="pointer-events-none absolute bottom-10 left-3.5 top-0 w-3 lg:hidden">
            <Via vertical />
          </span>

          <ol className="relative grid gap-12 lg:grid-cols-3 lg:gap-10">
            {PASOS.map((paso, i) => (
              <Reveal as="li" key={paso.numero} delay={(i + 1) as PasoReveal} className="relative pl-16 lg:pl-0">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-[3px] border border-accent/70 bg-brand-deep text-xs font-semibold tracking-[0.12em] text-accent tabular-nums lg:relative"
                >
                  {paso.numero}
                </span>
                <h3 className="font-titulo text-lg font-semibold leading-snug text-white lg:mt-8 lg:text-xl">
                  <span className="sr-only">Paso {paso.numero}: </span>
                  {paso.titulo}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-300 sm:text-base">{paso.detalle}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal variant="fade" className="mt-16 border-t border-white/15 pt-10 sm:mt-20">
          <AccesoCotizador />
        </Reveal>
      </div>
    </section>
  );
}
