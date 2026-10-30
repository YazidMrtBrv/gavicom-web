import type { CSSProperties } from "react";
import { MapPin } from "lucide-react";
import MediaSlot from "@/components/motion/MediaSlot";
import ScrambleLabel from "@/components/motion/ScrambleLabel";
import TechFrame from "@/components/motion/TechFrame";
import Boton from "@/components/ui/Boton";
import { COMPANIA_INFO } from "@/constants/productos";
import { cn } from "@/lib/cn";
import IlustracionSolar from "./IlustracionSolar";
import estilos from "./portada.module.css";

// Cuando GAVICOM grabe su video de vía, basta con poner aquí la ruta del mp4
// en /public: MediaSlot lo reproduce mudo y en bucle solo mientras está en
// pantalla, con esta foto como póster.
const VIDEO_RAILWAY: string | undefined = undefined;

function retardo(segundos: number): CSSProperties {
  return { "--retardo": `${segundos}s` } as CSSProperties;
}

const CHIP =
  "shrink-0 rounded-[2px] border border-white/25 px-2.5 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.2em] text-white/85";

export default function HeroDosLineas() {
  return (
    <section aria-labelledby="titulo-portada" className="relative bg-white pb-6 pt-32 sm:pt-36 lg:pb-10 lg:pt-40">
      {/* Retícula de plano que se desvanece hacia abajo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[linear-gradient(to_right,rgb(20_59_100/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(20_59_100/0.06)_1px,transparent_1px)] bg-size-[56px_56px] mask-[linear-gradient(to_bottom,black_30%,transparent)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <ScrambleLabel
              text="GAVICOM SAS — BARRANQUILLA, COLOMBIA"
              className="text-[10px] tracking-[0.12em] sm:text-[11px] sm:tracking-[0.25em]"
            />
            <h1
              id="titulo-portada"
              className="mt-6 font-titulo text-[2.1rem] font-semibold leading-[1.04] tracking-tight text-brand sm:text-5xl lg:text-[3.4rem] xl:text-[3.9rem]"
            >
              <span className={estilos.lineaTitular}>
                <span className={cn(estilos.lineaTitularTexto, "text-balance")} style={retardo(0.3)}>
                  Suministro ferroviario y energía solar
                </span>
              </span>{" "}
              <span className={estilos.lineaTitular}>
                <span className={cn(estilos.lineaTitularTexto, "text-balance text-zinc-500")} style={retardo(0.42)}>
                  para la industria colombiana
                </span>
              </span>
            </h1>
          </div>

          <div className="lg:col-span-4 lg:pb-2">
            <p className="max-w-md text-base leading-relaxed text-zinc-600">
              Dos líneas de negocio en una sola empresa: suministro ferroviario bajo estándares AREMA/UIC y
              soluciones de energía solar fotovoltaica.
            </p>
            <p className="mt-5 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento} · Cobertura nacional
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-[1600px] px-3 sm:px-5 lg:mt-14 lg:pl-8 lg:pr-14">
        <div className={estilos.paneles}>
          {/* ── Railway ── */}
          <article
            aria-labelledby="panel-railway"
            className={cn(estilos.panel, "min-h-120 overflow-clip rounded-[4px] sm:min-h-136 lg:min-h-0")}
          >
            <MediaSlot
              imagen="/images/tren-gavicom-final.webp"
              alt="Locomotora de carga sobre la vía férrea"
              videoSrc={VIDEO_RAILWAY}
              prioridad
              sizes="(min-width: 1024px) 62vw, 100vw"
              overlay="oscuro"
              enmarcado
              className="absolute inset-0"
            >
              <div className="flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div className="flex items-start justify-between gap-4">
                  <ScrambleLabel text="S.01 — RAILWAY" className="text-accent" />
                  <span className={CHIP}>AREMA / UIC</span>
                </div>

                <div className="max-w-lg">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-300">GAVICOM</p>
                  <h2
                    id="panel-railway"
                    className="mt-2 font-titulo text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl xl:text-5xl"
                  >
                    Railway Solutions &amp; Supply
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-200 sm:text-base">
                    Componentes de vía, herramientas y señalización ferroviaria bajo estándares AREMA/UIC.
                  </p>
                  <span aria-hidden="true" className={cn(estilos.panelBarra, "mt-6 block h-0.5 w-full bg-accent")} />
                  <Boton href="/catalogo" icono="flecha" className="mt-6">
                    Ver catálogo
                  </Boton>
                </div>
              </div>
            </MediaSlot>
          </article>

          {/* ── Energy ── */}
          <article aria-labelledby="panel-energy" className={cn(estilos.panel, "rounded-[4px]")}>
            <TechFrame tone="oscuro" className="flex h-full flex-col overflow-clip rounded-[4px] bg-brand-deep">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-size-[32px_32px]"
              />

              <div className="relative z-10 flex items-start justify-between gap-4 p-6 pb-0 sm:p-8 sm:pb-0 lg:p-10 lg:pb-0">
                <ScrambleLabel text="S.02 — ENERGY" className="text-accent" />
                <span className={CHIP}>Fotovoltaica · AC / DC</span>
              </div>

              <div className="relative mx-auto aspect-15/14 max-h-80 w-full px-6 pt-4 sm:max-h-96 sm:px-10 lg:aspect-auto lg:max-h-none lg:min-h-0 lg:flex-1">
                <IlustracionSolar className="size-full" />
              </div>

              <div className="relative z-10 max-w-lg p-6 pt-2 sm:p-8 sm:pt-2 lg:p-10 lg:pt-2">
                <h2
                  id="panel-energy"
                  className="font-titulo text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl xl:text-5xl"
                >
                  GAVICOM Energy
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                  Fabricación y suministro de cofres fotovoltaicos, montaje e instalación de sistemas solares,
                  protecciones eléctricas AC y DC, y ensamble de componentes eléctricos.
                </p>
                <span aria-hidden="true" className={cn(estilos.panelBarra, "mt-6 block h-0.5 w-full bg-accent")} />
                <Boton href="/energy" icono="flecha" className="mt-6">
                  Conocer Energy
                </Boton>
              </div>
            </TechFrame>
          </article>
        </div>
      </div>
    </section>
  );
}
