import { COMPANIA_INFO } from "@/constants/productos";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import { cn } from "@/lib/cn";
import Reveal from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import Boton from "@/components/ui/Boton";
import ResumenServicios from "./ResumenServicios";
import { formatearTelefono, MENSAJE_WHATSAPP_SERVICIOS, SERVICIOS } from "./datos";
import estilos from "./servicios.module.css";

const SKUS_SERVICIOS = SERVICIOS.map((servicio) => servicio.sku);

// Cambiavía en planta: vía directa y vía desviada que nace en la aguja y
// cruza el riel en el corazón. Es el tipo de plano que diseña GVC-SRV-PL01.
const DURMIENTES = Array.from({ length: 50 }, (_, i) => `M${12 + i * 24},74V118`).join("");
// Un <path> por riel: así cada uno se dibuja entero de punta a punta.
const VIA_DIRECTA = ["M0,84H1200", "M0,108H1200"];
const VIA_DESVIADA = ["M380,84 C620,84 860,48 1200,12", "M380,108 C640,108 880,72 1200,36"];
const AGUJA = 380;
const CORAZON = 782;
const COTA = `M${AGUJA},126V138 M${CORAZON},126V138 M${AGUJA},132H${CORAZON} M${AGUJA - 4},136L${AGUJA + 4},128 M${CORAZON - 4},136L${CORAZON + 4},128`;

function Cambiavia() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1200 140"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      className={cn(estilos.dibujo, "h-16 w-full sm:h-24 lg:h-32")}
    >
      <path d={DURMIENTES} stroke="white" strokeOpacity={0.08} strokeWidth={5} className={estilos.aparece} />
      {VIA_DIRECTA.map((riel) => (
        <path key={riel} d={riel} pathLength={1} stroke="white" strokeOpacity={0.4} strokeWidth={1.5} className={estilos.trazo} />
      ))}
      {VIA_DESVIADA.map((riel) => (
        <path
          key={riel}
          d={riel}
          pathLength={1}
          strokeWidth={1.5}
          className={cn(estilos.trazo, estilos.trazoTarde, "stroke-accent")}
        />
      ))}
      <g className={estilos.aparece}>
        <path d={`M${AGUJA},64V128`} stroke="white" strokeOpacity={0.3} strokeDasharray="3 4" />
        <path d={`M${CORAZON - 6},84L${CORAZON},78L${CORAZON + 6},84L${CORAZON},90Z`} className="fill-accent" />
        <path d={COTA} stroke="white" strokeOpacity={0.35} strokeWidth={1} />
      </g>
    </svg>
  );
}

const DATO = "text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400";

export default function CierreServicios() {
  return (
    <section aria-labelledby="titulo-cierre-servicios" className="relative isolate overflow-clip bg-brand-deep text-white">
      <div aria-hidden="true" className={cn(estilos.rayado, "pointer-events-none absolute inset-0 -z-10")} />

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-32 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <SectionHeader
              tono="oscuro"
              etiqueta="S.04 — COTIZACIÓN"
              titulo="¿Necesita una solución técnica a la medida de su vía?"
              entradilla="Agregue los servicios a su cotización, indíquenos la ciudad y el alcance, y envíe la solicitud por WhatsApp."
              acentos={["medida"]}
              id="titulo-cierre-servicios"
            />
            <Reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Boton href="/cotizar" icono="flecha">
                Solicitar cotización
              </Boton>
              <Boton href={construirUrlWhatsApp(MENSAJE_WHATSAPP_SERVICIOS)} externo icono="whatsapp" variante="claro">
                WhatsApp comercial
              </Boton>
            </Reveal>
          </div>

          <Reveal delay={1} className="lg:col-span-5">
            <ResumenServicios skus={SKUS_SERVICIOS} />
          </Reveal>
        </div>

        <div className="mt-16 sm:mt-20">
          <Cambiavia />
        </div>

        <Reveal
          as="dl"
          variant="fade"
          className="mt-8 grid gap-8 border-t border-white/15 pt-8 text-sm sm:grid-cols-3 sm:gap-10"
        >
          <div>
            <dt className={DATO}>Gerencia</dt>
            <dd className="mt-2">
              <a
                href={`mailto:${COMPANIA_INFO.email}`}
                className="break-all font-medium text-white underline decoration-white/30 decoration-1 underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {COMPANIA_INFO.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className={DATO}>WhatsApp comercial</dt>
            <dd className="mt-2 font-medium text-white tabular-nums">{formatearTelefono(COMPANIA_INFO.whatsappSales)}</dd>
          </div>
          <div>
            <dt className={DATO}>Sede</dt>
            <dd className="mt-2 font-medium text-white">
              {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento} · Cobertura nacional
            </dd>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
