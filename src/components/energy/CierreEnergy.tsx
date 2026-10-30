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

// La misma trayectoria del sol del hero, ya a la tarde. Su centro está en el
// borde inferior del viewBox: ahí cae el borde superior de los datos de
// contacto, que hace de horizonte.
const ANCHO = 800;
const ALTO = 300;
const CENTRO: Punto = [400, ALTO];
const RADIO = 290;
const ARCO = arco(CENTRO, RADIO, -72, 72);
const MARCAS = [-60, -45, -30, -15, 0, 15, 30, 45, 60]
  .map((g) => linea(polar(CENTRO, RADIO - 6, g), polar(CENTRO, RADIO + 6, g)))
  .join("");
const SOL = polar(CENTRO, RADIO, 48);
const RAYOS = Array.from({ length: 8 }, (_, i) => linea(polar(SOL, 16, i * 45), polar(SOL, 22, i * 45))).join("");
// Cota de altura del sol sobre el horizonte, como en un plano.
const COTA_SOL =
  linea([SOL[0], SOL[1] + 28], [SOL[0], ALTO]) +
  linea([SOL[0] - 5, ALTO], [SOL[0] + 5, ALTO]);
const MARCAS_HORIZONTE = Array.from({ length: 11 }, (_, i) => {
  const x = 120 + i * 56;
  return linea([x, ALTO], [x, ALTO - (i % 5 === 0 ? 8 : 4)]);
}).join("");

const DATO = "text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400";
const ENLACE =
  "font-medium text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function CierreEnergy() {
  return (
    <section aria-labelledby="titulo-cierre-energy" className="relative isolate overflow-clip bg-brand-deep text-white">
      <div aria-hidden="true" className="energia-cuadricula pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-12">
        <div className="relative pb-16 sm:pb-20">
          <div
            aria-hidden="true"
            className="energia-lienzo pointer-events-none absolute bottom-0 right-0 hidden w-[52%] max-w-[42rem] lg:block"
          >
            <svg
              viewBox={`0 0 ${ANCHO} ${ALTO}`}
              focusable="false"
              className="block h-auto w-full overflow-visible text-white"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
            >
              <path d={ARCO} strokeOpacity={0.32} strokeDasharray="2 8" strokeWidth={1.4} className="energia-aparece" />
              <Trazo d={MARCAS} orden={1} strokeOpacity={0.36} strokeWidth={1.2} />
              <Trazo d={MARCAS_HORIZONTE} orden={0} strokeOpacity={0.36} strokeWidth={1.2} />
              <path
                d={COTA_SOL}
                className="stroke-accent energia-aparece"
                strokeOpacity={0.5}
                strokeDasharray="3 6"
                strokeWidth={1.2}
              />
              <circle
                cx={SOL[0]}
                cy={SOL[1]}
                r={11}
                className="fill-accent/20 stroke-accent energia-aparece"
                strokeWidth={1.6}
              />
              <Trazo d={RAYOS} orden={3} className="stroke-accent" strokeWidth={1.6} />
            </svg>
          </div>

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
        </div>

        {/* Solo opacidad: su borde superior es el horizonte del dibujo y no debe moverse. */}
        <Reveal
          as="dl"
          variant="fade"
          delay={1}
          className="grid gap-8 border-t border-white/20 pt-8 text-sm sm:grid-cols-3 sm:gap-10"
        >
          <div>
            <dt className={DATO}>Correo</dt>
            <dd className="mt-2">
              <a
                href={`mailto:${COMPANIA_INFO.email}`}
                className={`${ENLACE} break-all underline decoration-white/30 decoration-1 underline-offset-4 hover:decoration-accent`}
              >
                {COMPANIA_INFO.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className={DATO}>Sede</dt>
            <dd className="mt-2 font-medium text-white">
              {COMPANIA_INFO.nombre} · {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento}
            </dd>
          </div>
          <div>
            <dt className={DATO}>Otra línea</dt>
            <dd className="mt-2">
              <Link href="/catalogo" className={`${ENLACE} group/railway hover:text-accent-strong`}>
                GAVICOM Railway Solutions &amp; Supply
                {/* En línea con el texto: si el nombre parte en dos, la flecha sigue a la última palabra. */}
                <ArrowUpRight
                  aria-hidden="true"
                  className="ml-1 inline size-4 align-[-3px] transition-transform duration-300 group-hover/railway:-translate-y-0.5 group-hover/railway:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
            </dd>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
