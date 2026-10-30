import BotonAgregarCotizacion from "@/components/cotizacion/BotonAgregarCotizacion";
import Reveal, { type PasoReveal } from "@/components/motion/Reveal";
import Boton from "@/components/ui/Boton";
import SectionHeader from "@/components/ui/SectionHeader";
import { ENERGY_INTRO, SERVICIOS_ENERGY } from "@/constants/energy";

function dosCifras(n: number): string {
  return String(n).padStart(2, "0");
}

export default function ServiciosEnergy() {
  const total = SERVICIOS_ENERGY.length;

  return (
    <section id="energy" aria-labelledby="titulo-energy" className="relative bg-brand-deep py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.03)_1px,transparent_1px)] bg-size-[64px_64px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-36">
              <SectionHeader
                id="titulo-energy"
                tono="oscuro"
                etiqueta="S.04 — ENERGY"
                titulo="Energía solar fotovoltaica, del cofre a la instalación"
                acentos={["solar"]}
                entradilla={ENERGY_INTRO}
              />

              <Reveal variant="fade" className="mt-10">
                <dl className="grid grid-cols-2 gap-px border-y border-white/10 bg-white/10">
                  <div className="bg-brand-deep py-5 pr-4">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">Servicios</dt>
                    <dd className="mt-2 font-titulo text-3xl font-semibold text-white tabular-nums">{dosCifras(total)}</dd>
                  </div>
                  <div className="bg-brand-deep py-5 pl-5">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">Instalaciones</dt>
                    <dd className="mt-2 text-sm leading-snug text-zinc-200">Residencial · comercial · industrial</dd>
                  </div>
                </dl>
                <Boton href="/energy" icono="flecha" className="mt-10">
                  Conocer GAVICOM Energy
                </Boton>
              </Reveal>
            </div>
          </div>

          <ol className="border-t border-white/10 lg:col-span-7">
            {SERVICIOS_ENERGY.map((servicio, i) => (
              <Reveal
                key={servicio.codigo}
                as="li"
                delay={(i % 4) as PasoReveal}
                aria-labelledby={`servicio-energy-${i}`}
                className="spec-row border-b border-white/10 py-8 pl-6 pr-1 hover:bg-white/3 sm:py-10 sm:pl-8"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-xs font-semibold tracking-[0.2em] text-accent tabular-nums">{servicio.codigo}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400 tabular-nums">
                    {dosCifras(i + 1)} / {dosCifras(total)}
                  </p>
                </div>
                <h3
                  id={`servicio-energy-${i}`}
                  className="mt-3 max-w-2xl text-lg font-semibold leading-snug text-white sm:text-xl"
                >
                  {servicio.titulo}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300">{servicio.descripcion}</p>
                <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                  <ul aria-label="Alcance" className="flex flex-wrap gap-2">
                    {servicio.alcance.map((alcance) => (
                      <li
                        key={alcance}
                        className="rounded-[2px] border border-white/15 px-2.5 py-1 text-xs text-zinc-200"
                      >
                        {alcance}
                      </li>
                    ))}
                  </ul>
                  <BotonAgregarCotizacion
                    sku={servicio.codigo}
                    nombre={servicio.titulo}
                    linea="energy"
                    variante="compacto"
                    className="border-white/35 bg-transparent text-white hover:border-white hover:bg-white hover:text-brand-deep aria-pressed:border-white aria-pressed:bg-white aria-pressed:text-brand-deep"
                  />
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
