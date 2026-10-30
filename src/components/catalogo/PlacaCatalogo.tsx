import TechFrame from "@/components/motion/TechFrame";
import { COMPANIA_INFO } from "@/constants/productos";
import { cn } from "@/lib/cn";
import CifraOdometro from "./CifraOdometro";
import { TOTAL_CATEGORIAS, TOTAL_REFERENCIAS, TOTAL_SUBCATEGORIAS } from "./datos";

const ROTULO = "text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300";

/*
 * La placa de fabricante del catálogo, como la que llevan las locomotoras:
 * todas las cifras salen del catálogo publicado, ninguna se escribe a mano.
 */
export default function PlacaCatalogo({ className }: { className?: string }) {
  return (
    <TechFrame tone="oscuro" className={cn("rounded-[4px] bg-brand-deep text-white", className)}>
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">Placa del catálogo</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300">{COMPANIA_INFO.nombre}</p>
        </div>

        <dl className="grid grid-cols-2">
          <div className="col-span-2 border-b border-white/15 py-6">
            <dt className={ROTULO}>Referencias en catálogo</dt>
            <dd className="mt-3 font-titulo text-6xl leading-none font-semibold tracking-tight sm:text-7xl">
              <CifraOdometro valor={TOTAL_REFERENCIAS} />
            </dd>
          </div>
          <div className="border-r border-b border-white/15 py-5 pr-4">
            <dt className={ROTULO}>Categorías</dt>
            <dd className="mt-2 font-titulo text-3xl leading-none font-semibold">
              <CifraOdometro valor={TOTAL_CATEGORIAS} digitos={2} retardo={180} />
            </dd>
          </div>
          <div className="border-b border-white/15 py-5 pl-5">
            <dt className={ROTULO}>Subcategorías</dt>
            <dd className="mt-2 font-titulo text-3xl leading-none font-semibold">
              <CifraOdometro valor={TOTAL_SUBCATEGORIAS} digitos={2} retardo={360} />
            </dd>
          </div>
          <div className="col-span-2 border-b border-white/15 py-5">
            <dt className={ROTULO}>Trabaja bajo estándares</dt>
            <dd className="mt-2 text-lg font-semibold tracking-wide">AREMA / UIC</dd>
          </div>
          <div className="col-span-2 pt-5">
            <dt className={ROTULO}>Sede</dt>
            <dd className="mt-2 text-sm leading-relaxed text-white">
              {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento} · {COMPANIA_INFO.cobertura}
            </dd>
          </div>
        </dl>
      </div>
    </TechFrame>
  );
}
