import type { ServicioEnergy } from "@/constants/energy";
import TechFrame from "@/components/motion/TechFrame";
import Boton from "@/components/ui/Boton";
import BotonAgregarCotizacion from "@/components/cotizacion/BotonAgregarCotizacion";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import Pictograma from "./Pictogramas";
import { anclaServicio, dosCifras, esCodigoServicio, mensajeConsultaServicio } from "./datos";

interface TarjetaServicioProps {
  servicio: ServicioEnergy;
  indice: number;
  total: number;
}

export default function TarjetaServicio({ servicio, indice, total }: TarjetaServicioProps) {
  const { codigo, titulo, descripcion, alcance } = servicio;
  const ancla = anclaServicio(codigo);
  const idTitulo = `${ancla}-titulo`;

  return (
    <TechFrame className="group h-full border border-zinc-200 bg-white transition-colors duration-500 hover:border-brand/30">
      <article id={ancla} aria-labelledby={idTitulo} className="flex h-full scroll-mt-36 flex-col">
        <header className="flex items-center justify-between gap-4 px-7 pb-5 pt-7 sm:px-9">
          {/* Placa de referencia, igual que el SKU del catálogo Railway. */}
          <span className="rounded-[2px] bg-brand-deep px-2.5 py-1.5 text-[11px] font-semibold leading-none tracking-[0.18em] text-accent tabular-nums">
            {codigo}
          </span>
          <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-500 tabular-nums">
            {dosCifras(indice + 1)}
            <span aria-hidden="true" className="px-1 text-zinc-300">/</span>
            <span className="sr-only"> de </span>
            {dosCifras(total)}
          </span>
        </header>

        {esCodigoServicio(codigo) && (
          <div className="energia-lienzo energia-cuadricula-clara relative mx-7 aspect-[16/9] overflow-clip border border-zinc-200 bg-surface sm:mx-9">
            <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none">
              <Pictograma codigo={codigo} />
            </div>
            <span
              aria-hidden="true"
              className="absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 tabular-nums"
            >
              Fig. {dosCifras(indice + 1)}
            </span>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-6 px-7 pb-8 pt-7 sm:px-9 sm:pb-9">
          <h3 id={idTitulo} className="text-xl font-semibold leading-snug text-brand text-pretty sm:text-2xl sm:leading-snug">
            {titulo}
          </h3>
          <p className="leading-relaxed text-zinc-600">{descripcion}</p>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Alcance</p>
            <ul className="mt-3 border-t border-zinc-200">
              {alcance.map((punto) => (
                <li
                  key={punto}
                  className="spec-row flex items-center gap-3 border-b border-zinc-200 py-3 pl-4 pr-2 text-sm text-ink"
                >
                  <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
                  {punto}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-x-7 gap-y-3 pt-2">
            <BotonAgregarCotizacion sku={codigo} nombre={titulo} linea="energy" />
            <Boton
              href={construirUrlWhatsApp(mensajeConsultaServicio(codigo, titulo))}
              externo
              variante="enlace"
              icono="whatsapp"
              aria-label={`Consultar por WhatsApp: ${titulo} (se abre en una pestaña nueva)`}
            >
              Consultar
            </Boton>
          </div>
        </div>
      </article>
    </TechFrame>
  );
}
