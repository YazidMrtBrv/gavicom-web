import { SERVICIOS_ENERGY } from "@/constants/energy";
import Reveal, { type PasoReveal } from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import TarjetaServicio from "./TarjetaServicio";
import ResumenCotizacionEnergy from "./ResumenCotizacionEnergy";
import { dosCifras, TOTAL_SERVICIOS } from "./datos";

export default function ServiciosEnergy() {
  return (
    <section aria-labelledby="titulo-servicios-energy" className="bg-white py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            etiqueta="S.01 — SERVICIOS"
            titulo="Fabricamos, instalamos e integramos"
            entradilla="Puede agregar uno o varios servicios a su cotización y enviarlos en una sola solicitud, junto con referencias del catálogo Railway si las necesita."
            acentos={["integramos"]}
            id="titulo-servicios-energy"
          />
          <Reveal variant="fade" className="flex items-end gap-4 lg:pb-2">
            <span className="text-7xl font-light leading-[0.8] tracking-tight text-brand tabular-nums sm:text-8xl">
              {dosCifras(TOTAL_SERVICIOS)}
            </span>
            <span className="max-w-[9rem] pb-1 text-[11px] font-semibold uppercase leading-snug tracking-[0.2em] text-zinc-500">
              Servicios de la línea Energy
            </span>
          </Reveal>
        </div>

        <ol className="mt-16 grid gap-6 sm:mt-20 lg:grid-cols-2 lg:gap-8">
          {SERVICIOS_ENERGY.map((servicio, i) => (
            <Reveal as="li" key={servicio.codigo} delay={(i % 2) as PasoReveal}>
              <TarjetaServicio servicio={servicio} indice={i} total={TOTAL_SERVICIOS} />
            </Reveal>
          ))}
        </ol>

        <div className="mt-14 grid gap-8 border-t border-zinc-200 pt-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="flex gap-4 lg:col-span-6">
            <span aria-hidden="true" className="w-0.5 shrink-0 bg-accent" />
            <p className="text-sm leading-relaxed text-zinc-600">
              <span className="font-semibold text-brand">RETIE</span> — Reglamento Técnico de Instalaciones Eléctricas
              de Colombia. Los cofres fotovoltaicos de GAVICOM se fabrican con cumplimiento de los requisitos
              aplicables del RETIE.
            </p>
          </div>
          <ResumenCotizacionEnergy className="lg:col-span-6" />
        </div>
      </div>
    </section>
  );
}
