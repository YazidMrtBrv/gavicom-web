import ScrambleLabel from "@/components/motion/ScrambleLabel";
import SplitHeading from "@/components/motion/SplitHeading";
import Boton from "@/components/ui/Boton";
import { COMPANIA_INFO } from "@/constants/productos";
import { urlWhatsAppCotizacion } from "@/lib/cotizacion";
import estilos from "./portada.module.css";

// "+573150509803" → "+57 315 050 9803"
function formatearTelefono(telefono: string): string {
  return telefono.replace(/^\+57(\d{3})(\d{3})(\d{4})$/, "+57 $1 $2 $3");
}

const TRAVIESAS = Array.from({ length: 50 }, (_, i) => 12 + i * 24);

export default function CierrePortada() {
  return (
    <section
      aria-labelledby="titulo-cierre"
      className="relative overflow-clip bg-brand-deep pb-28 pt-24 text-white lg:pb-40 lg:pt-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[linear-gradient(to_bottom,black,transparent_85%)]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:items-end lg:gap-12 lg:px-12">
        <div className="lg:col-span-8">
          <ScrambleLabel text="S.07 — COTIZACIÓN" className="text-accent" />
          <SplitHeading
            as="h2"
            id="titulo-cierre"
            text="¿Necesita suministros para vía férrea o un sistema solar?"
            accentWords={["férrea", "solar"]}
            className="mt-6 font-titulo text-4xl font-semibold leading-[1.06] tracking-tight text-white text-balance [--split-desde:rgb(255_255_255/0.35)] sm:text-5xl lg:text-6xl"
          />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Envíenos las referencias, las cantidades y la ciudad de entrega, y preparamos su cotización.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Boton href="/cotizar" icono="flecha">
              Solicitar cotización
            </Boton>
            <Boton href={urlWhatsAppCotizacion([])} externo icono="whatsapp" variante="claro">
              WhatsApp comercial
            </Boton>
          </div>
        </div>

        <dl className="grid gap-px border-y border-white/10 bg-white/10 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
          <div className="bg-brand-deep py-5 sm:pr-4 lg:pr-0">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">Gerencia</dt>
            <dd className="mt-2 text-sm">
              <a
                href={`mailto:${COMPANIA_INFO.email}`}
                className="break-all text-white underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent-strong"
              >
                {COMPANIA_INFO.email}
              </a>
            </dd>
          </div>
          <div className="bg-brand-deep py-5 sm:px-4 lg:px-0">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">WhatsApp comercial</dt>
            <dd className="mt-2 text-sm text-white tabular-nums">{formatearTelefono(COMPANIA_INFO.whatsappSales)}</dd>
          </div>
          <div className="bg-brand-deep py-5 sm:pl-4 lg:pl-0">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">Sede</dt>
            <dd className="mt-2 text-sm text-white">
              {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento} · Cobertura nacional
            </dd>
          </div>
        </dl>
      </div>

      {/* La vía se tiende de izquierda a derecha al entrar la sección. */}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1200 48"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        className="pointer-events-none absolute inset-x-0 bottom-8 h-12 w-full lg:bottom-12"
      >
        <path d={TRAVIESAS.map((x) => `M${x},10V38`).join("")} stroke="white" strokeOpacity="0.1" strokeWidth="5" />
        <path d="M0,16H1200" pathLength={1} stroke="white" strokeOpacity="0.35" strokeWidth="1.5" className={estilos.viaRiel} />
        <path d="M0,32H1200" pathLength={1} stroke="white" strokeOpacity="0.35" strokeWidth="1.5" className={estilos.viaRiel} />
      </svg>
    </section>
  );
}
