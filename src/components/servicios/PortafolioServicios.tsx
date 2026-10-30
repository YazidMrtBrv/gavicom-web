import Reveal from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import Boton from "@/components/ui/Boton";
import IndiceServicios, { type ItemIndice } from "./IndiceServicios";
import TarjetaServicio from "./TarjetaServicio";
import { anclaServicio, SERVICIOS, TOTAL_SERVICIOS } from "./datos";

// Al cliente solo viaja lo que pinta el índice, no el catálogo entero.
const ITEMS_INDICE: ItemIndice[] = SERVICIOS.map(({ sku, nombre }) => ({ sku, nombre, ancla: anclaServicio(sku) }));

export default function PortafolioServicios() {
  return (
    <section id="portafolio" aria-labelledby="titulo-portafolio" className="scroll-mt-28 bg-surface py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
        <SectionHeader
          etiqueta="S.02 — PORTAFOLIO"
          titulo="Servicios especializados para la vía férrea"
          entradilla="Cada servicio tiene su código de referencia. Agréguelo a su cotización junto con los suministros que necesite, o consúltelo directamente por WhatsApp."
          acentos={["especializados"]}
          id="titulo-portafolio"
        />

        <div className="mt-14 grid gap-12 sm:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* El índice acompaña la lectura en escritorio; en móvil las fichas van seguidas. */}
          <div className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-32 -mx-2 flex max-h-[calc(100svh-9rem)] flex-col gap-8 overflow-y-auto px-2 pb-4 pt-1 [scrollbar-width:thin]">
              <IndiceServicios items={ITEMS_INDICE} />
              <div className="border-t border-zinc-300 pt-6">
                <p className="text-sm leading-relaxed text-zinc-600">
                  ¿Necesita varios? Agréguelos y envíelos en una sola solicitud.
                </p>
                <Boton href="/cotizar" variante="enlace" icono="flecha" className="mt-2">
                  Ir al cotizador
                </Boton>
              </div>
            </div>
          </div>

          <ol className="flex flex-col gap-8 sm:gap-10 lg:col-span-9">
            {SERVICIOS.map((servicio, i) => (
              <Reveal as="li" key={servicio.sku}>
                <TarjetaServicio servicio={servicio} indice={i} total={TOTAL_SERVICIOS} />
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
