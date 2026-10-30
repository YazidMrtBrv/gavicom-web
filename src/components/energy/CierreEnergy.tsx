import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import SectionHeader from "@/components/ui/SectionHeader";
import Boton from "@/components/ui/Boton";
import Reveal from "@/components/motion/Reveal";
import { arco, linea, polar, Trazo, type Punto } from "./trazos";
import { MENSAJE_WHATSAPP_ENERGY } from "./datos";
import "./energia.css";

// La misma trayectoria del sol del hero, ya a la tarde: cierra la página.
const CENTRO: Punto = [400, 420];
const RADIO = 330;
const ARCO = arco(CENTRO, RADIO, -70, 70);
const MARCAS = [-60, -45, -30, -15, 0, 15, 30, 45, 60]
  .map((g) => linea(polar(CENTRO, RADIO - 6, g), polar(CENTRO, RADIO + 6, g)))
  .join("");
const SOL = polar(CENTRO, RADIO, 48);
const RAYOS = Array.from({ length: 8 }, (_, i) => linea(polar(SOL, 16, i * 45), polar(SOL, 22, i * 45))).join("");

export default function CierreEnergy() {
  return (
    <section aria-labelledby="titulo-cierre-energy" className="relative isolate overflow-clip bg-brand-deep text-white">
      <div aria-hidden="true" className="energia-cuadricula pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="energia-lienzo pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[56rem] max-w-[70%] md:block">
        <svg
          viewBox="0 0 800 440"
          preserveAspectRatio="xMaxYMax meet"
          focusable="false"
          className="absolute inset-x-0 bottom-0 h-auto w-full text-white"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
        >
          <Trazo d={linea([40, 420], [780, 420])} orden={0} strokeOpacity={0.2} strokeWidth={1.2} />
          <path d={ARCO} strokeOpacity={0.22} strokeDasharray="2 8" strokeWidth={1.4} className="energia-aparece" />
          <Trazo d={MARCAS} orden={2} strokeOpacity={0.25} strokeWidth={1.2} />
          <circle cx={SOL[0]} cy={SOL[1]} r={11} className="fill-accent/20 stroke-accent energia-aparece" strokeWidth={1.6} />
          <Trazo d={RAYOS} orden={3} className="stroke-accent" strokeWidth={1.6} />
        </svg>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-12">
        <SectionHeader
          tono="oscuro"
          etiqueta="S.03 — CONTACTO"
          titulo="Cuéntenos de su proyecto solar"
          entradilla="Arme su solicitud con los servicios de GAVICOM Energy en el cotizador o escríbanos directamente por WhatsApp."
          acentos={["solar"]}
          id="titulo-cierre-energy"
        />

        <Reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Boton href="/cotizar" icono="flecha">
            Solicitar cotización
          </Boton>
          <Boton href={construirUrlWhatsApp(MENSAJE_WHATSAPP_ENERGY)} externo icono="whatsapp" variante="claro">
            WhatsApp comercial
          </Boton>
        </Reveal>

        <Reveal
          as="dl"
          delay={1}
          className="mt-16 grid max-w-4xl gap-8 border-t border-white/15 pt-8 text-sm sm:grid-cols-3 sm:gap-10"
        >
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">Correo</dt>
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
            <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">Sede</dt>
            <dd className="mt-2 font-medium text-white">
              {COMPANIA_INFO.nombre} · {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">Otra línea</dt>
            <dd className="mt-2">
              <Link
                href="/catalogo"
                className="group/railway inline-flex items-start gap-1.5 font-medium text-white transition-colors hover:text-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                GAVICOM Railway Solutions &amp; Supply
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 transition-transform duration-300 group-hover/railway:-translate-y-0.5 group-hover/railway:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
            </dd>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
