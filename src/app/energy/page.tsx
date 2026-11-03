import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { ENERGY_INTRO, SERVICIOS_ENERGY } from "@/constants/energy";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import BotonCotizar from "@/components/BotonCotizar";
import VideoEnergia from "@/components/energia/VideoEnergia";
import RecorridoSolar from "@/components/energia/RecorridoSolar";
import CotizadorEnergia from "@/components/energia/CotizadorEnergia";
import "@/components/energia/energia.css";

const TITULO = "GAVICOM Energy, energía solar fotovoltaica";
const DESCRIPCION =
  "Cofres fotovoltaicos metálicos rígidos con cumplimiento de los requisitos aplicables del RETIE, montaje e instalación de sistemas solares, protecciones eléctricas AC y DC y ensamble de gabinetes. GAVICOM, Barranquilla.";

// The image comes from opengraph-image.tsx next to this file, so no fixed
// `images` here: Next wires it into both Open Graph and Twitter.
export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: "/energy" },
  openGraph: {
    title: "GAVICOM Energy | GAVICOM SAS",
    description: DESCRIPCION,
    url: "/energy",
    siteName: "GAVICOM SAS",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GAVICOM Energy | GAVICOM SAS",
    description: DESCRIPCION,
  },
};

const SITIO = "https://gavicomferroviario.com";
const MIGAS = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITIO}/` },
    { "@type": "ListItem", position: 2, name: "GAVICOM Energy", item: `${SITIO}/energy` },
  ],
};

const H2 = "text-3xl md:text-5xl font-bold tracking-tight";

function Antetitulo({ n, texto, claro = false }: { n: string; texto: string; claro?: boolean }) {
  return (
    <p className={`font-mono text-sm tracking-wide ${claro ? "text-white/75" : "text-tenue"}`}>
      {n} · {texto}
    </p>
  );
}

// The wing cut of the logo as the edge where a blue section starts.
function CorteAla() {
  return <div aria-hidden className="corte-ala ml-auto h-8 md:h-12 w-3/4 md:w-2/3 bg-azul -mb-px" />;
}

export default function Energy() {
  const [gabinetes, ...otros] = [
    {
      t: "Suministro de gabinetes",
      d: "Gabinetes para sistemas fotovoltaicos.",
    },
    {
      t: "Ensamble de componentes DC y AC",
      d: "Armado de los componentes de corriente continua y alterna del sistema.",
    },
    {
      t: "Sistemas monopolares",
      d: "Configuración e instalación de sistemas monopolares.",
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(MIGAS) }} />

      <section id="vuelo" className="sobre-azul energia-azul relative h-[100svh] min-h-[560px] overflow-hidden bg-azul">
        {/* On phones the gull lands in the middle of the vertical frame, so the
            video takes the top and the text sits below it on the blue; on wide
            screens the video fills the section and the text is on the left. */}
        <div className="absolute inset-x-0 top-0 h-[60%] md:h-full">
          <VideoEnergia />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,38,66,0)_0%,rgba(12,38,66,0)_70%,rgba(12,38,66,1)_100%)] md:bg-[linear-gradient(90deg,rgba(12,38,66,0.9)_0%,rgba(12,38,66,0.6)_40%,rgba(12,38,66,0)_65%)]" />
        </div>
        {/* Veil under the fixed menu: the sky at the top of the footage is the
            lightest part of the frame, and white menu text needs AA there. The veil
            holds its strength down to the menu baseline before fading out. */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-[120px] bg-[linear-gradient(180deg,rgba(12,38,66,0.7)_0%,rgba(12,38,66,0.6)_55%,rgba(12,38,66,0)_100%)] pointer-events-none" />
        <div className="relative h-full mx-auto max-w-6xl px-4 sm:px-6 flex flex-col justify-end pb-8 md:justify-start md:pb-0 md:pt-[20vh]">
          <p className="self-start inline-flex items-center min-h-8 px-3 rounded-sm border border-white text-white text-sm font-semibold tracking-wide">
            GAVICOM Energy
          </p>
          <h1 className="mt-4 text-white text-[36px] leading-[1.04] sm:text-6xl md:text-7xl font-bold tracking-tight max-w-3xl">
            Energía solar, del cofre al gabinete.
          </h1>
          <p className="mt-3 md:mt-5 text-white/90 text-base md:text-xl max-w-lg">
            Fabricamos cofres fotovoltaicos, instalamos sistemas solares y sus protecciones, e integramos los gabinetes.
          </p>
          <div data-hero-cta className="mt-5 md:mt-8 flex flex-wrap gap-3">
            <a href="#servicios" className="inline-flex items-center min-h-12 px-6 rounded-sm bg-white text-azul font-semibold hover:bg-azul-suave">
              Ver servicios
            </a>
            <a
              href={enlaceWhatsApp("Hola GAVICOM, me interesa cotizar un proyecto de energía solar con GAVICOM Energy.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-12 px-6 rounded-sm border border-white/70 text-white font-semibold hover:bg-white/10"
            >
              <span className="sm:hidden">WhatsApp</span>
              <span className="hidden sm:inline">Escribir por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      <section id="servicios" aria-labelledby="h-servicios" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Antetitulo n="01" texto="Servicios" />
          <h2 id="h-servicios" data-aparecer className={`mt-2 ${H2}`}>
            Cuatro servicios, un sistema
          </h2>
          <p className="mt-4 text-tenue max-w-2xl">{ENERGY_INTRO}</p>
          <ol data-aparecer="grupo" className="mt-10 grid gap-px bg-linea border border-linea md:grid-cols-2">
            {SERVICIOS_ENERGY.map((s, i) => (
              <li key={s.codigo} id={s.codigo.toLowerCase()} className="bg-white p-6 md:p-8 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <p aria-hidden className="font-titulo font-bold text-5xl md:text-6xl leading-none text-azul tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="font-mono text-xs text-tenue pt-1">{s.codigo}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-titulo text-2xl font-bold text-azul leading-tight">{s.corto}</h3>
                  <p className="text-tinta">{s.descripcion}</p>
                </div>
                <div className="mt-auto flex flex-col gap-4">
                  <BotonCotizar sku={s.codigo} nombre={s.corto} />
                  {/* Legal title as the client wrote it; keeps "requisitos aplicables del RETIE". */}
                  <p className="text-sm text-tenue border-t border-linea pt-3">{s.titulo}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CorteAla />
      <section aria-labelledby="h-recorrido" className="sobre-azul energia-azul bg-azul text-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Antetitulo n="02" texto="Cómo funciona" claro />
          <h2 id="h-recorrido" data-aparecer className={`mt-2 text-white ${H2}`}>
            Así funciona un sistema solar
          </h2>
          <p data-aparecer className="mt-4 text-white/80 max-w-2xl">
            Sigue el camino de la energía del sol hasta tu operación. Toca cada paso para ver qué hacemos ahí.
          </p>
          <div data-aparecer className="mt-10">
            <RecorridoSolar />
          </div>
        </div>
      </section>

      <section aria-labelledby="h-hecho" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Antetitulo n="03" texto="Experiencia" />
          <h2 id="h-hecho" data-aparecer className={`mt-2 ${H2}`}>
            Lo que ya hemos hecho
          </h2>
          <div data-aparecer className="mt-10 grid gap-6 rounded-sm border border-linea p-6 md:p-8 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="font-titulo text-2xl font-bold text-azul">{gabinetes.t}</h3>
              <p className="mt-1 text-tenue">{gabinetes.d}</p>
              <p className="mt-4 inline-flex items-center gap-2 font-semibold text-tinta">
                <ShieldCheck size={20} className="text-azul shrink-0" aria-hidden />
                Gabinetes suministrados con certificados
              </p>
            </div>
            {/* The certificates belong to the supplied cabinets only; the
                cofres are described as meeting the applicable RETIE
                requirements, never as certified. */}
            <ul className="flex flex-wrap gap-3" aria-label="Certificados de los gabinetes suministrados">
              {[
                ["RETIE", "Reglamento Técnico de Instalaciones Eléctricas"],
                ["IEC", "Normas internacionales de equipos eléctricos"],
              ].map(([sigla, nombre]) => (
                <li key={sigla} className="flex-1 min-w-[12rem] flex flex-col gap-1 px-4 py-3 rounded-sm border border-azul/30 bg-azul-suave">
                  <span className="font-mono font-bold text-azul">{sigla}</span>
                  <span className="text-sm text-tenue">{nombre}</span>
                </li>
              ))}
            </ul>
          </div>
          <ul data-aparecer="grupo" className="mt-6 grid gap-6 sm:grid-cols-2">
            {otros.map(({ t, d }) => (
              <li key={t} className="rounded-sm border border-linea p-6">
                <h3 className="font-titulo text-xl font-bold text-azul">{t}</h3>
                <p className="mt-1 text-tenue">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CorteAla />
      <section id="cotizar" aria-labelledby="h-cotizar" className="sobre-azul energia-azul bg-azul text-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Antetitulo n="04" texto="Cotizar" claro />
          <h2 id="h-cotizar" data-aparecer className={`mt-2 text-white ${H2}`}>
            ¿Cuántos paneles necesitas?
          </h2>
          <p data-aparecer className="mt-4 text-white/80 max-w-2xl">
            Un cálculo rápido con tu consumo y los datos que ya tienes, en un solo mensaje. Después lo afinamos con una visita.
          </p>
          <div className="mt-10">
            <CotizadorEnergia />
          </div>
        </div>
      </section>
    </>
  );
}
