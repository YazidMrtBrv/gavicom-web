import type { Metadata } from "next";
import { Calculator, MessageCircle, ShieldCheck } from "lucide-react";
import { ENERGY_INTRO, PASOS_TRABAJO, RAZONES_GAVICOM, SERVICIOS_ENERGY } from "@/constants/energy";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import { urlAbsoluta } from "@/lib/sitio";
import BotonCotizar from "@/components/BotonCotizar";
import EsquemaSolar from "@/components/energia/EsquemaSolar";
import RecorridoSolar from "@/components/energia/RecorridoSolar";
import PorQueSolar from "@/components/energia/PorQueSolar";
import CotizadorEnergia from "@/components/energia/CotizadorEnergia";
import "@/components/energia/energia.css";

const TITULO = "GAVICOM Energy, energía solar fotovoltaica";
// 155 characters at most, so search results show it whole.
const DESCRIPCION =
  "Cofres fotovoltaicos metálicos rígidos (requisitos aplicables del RETIE), instalación de sistemas solares, protecciones AC y DC y gabinetes. Barranquilla.";

// The image comes from opengraph-image.tsx next to this file, so no fixed
// `images` here: Next wires it into both Open Graph and Twitter.
export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  // TODO(integración): pasar a `alternates: alternas("/energy")` cuando
  // mejora/seo-ia traiga alternas() a src/lib/meta.ts.
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

const MIGAS = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: urlAbsoluta("/") },
    { "@type": "ListItem", position: 2, name: "GAVICOM Energy", item: urlAbsoluta("/energy") },
  ],
};

// One Service per line of work, tied to the site-wide organization node.
// No prices or offers: every project is quoted after the visit.
const SERVICIOS_LD = SERVICIOS_ENERGY.map((s) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": urlAbsoluta(`/energy#${s.codigo.toLowerCase()}`),
  name: s.titulo,
  description: s.descripcion,
  serviceType: s.corto,
  provider: { "@id": urlAbsoluta("/#organizacion") },
  areaServed: { "@type": "Country", name: "Colombia" },
  url: urlAbsoluta(`/energy#${s.codigo.toLowerCase()}`),
}));

const MENSAJE_HEROE = "Hola GAVICOM, me interesa cotizar un proyecto de energía solar con GAVICOM Energy.";

const MENSAJE_FACTURA =
  "Hola GAVICOM, quiero cotizar un sistema de energía solar con GAVICOM Energy. Les envío una foto de mi factura de energía.";

// Work already done, as the client listed it.
const HECHO = [
  { t: "Suministro de gabinetes", d: "Gabinetes para sistemas fotovoltaicos." },
  { t: "Ensamble de componentes DC y AC", d: "Armado de los componentes de corriente continua y alterna del sistema." },
  { t: "Sistemas monopolares", d: "Configuración e instalación de sistemas monopolares." },
];

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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(MIGAS) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICIOS_LD) }} />

      {/* Full-bleed dark hero: keeps id="vuelo" so the header floats over it
          transparent with the white logo (Encabezado.tsx). */}
      <section id="vuelo" aria-labelledby="h-energy" className="sobre-azul energia-azul relative min-h-[100svh] overflow-hidden bg-azul text-white">
        <div aria-hidden className="plano absolute inset-0 pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-[88px] pb-6 md:pb-10 min-h-[100svh] grid content-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-10">
          <div className="lg:order-last">
            <EsquemaSolar />
          </div>
          <div>
            <p className="inline-flex items-center min-h-8 px-3 rounded-sm border border-white text-white text-sm font-semibold tracking-wide">
              GAVICOM Energy
            </p>
            <h1 id="h-energy" className="mt-4 text-white text-[34px] leading-[1.05] sm:text-6xl lg:text-[52px] min-[1400px]:text-[60px] font-bold tracking-tight">
              Energía solar, del cofre al gabinete.
            </h1>
            <p className="mt-3 md:mt-5 text-white/90 text-base md:text-xl max-w-xl">
              Desde Barranquilla fabricamos cofres fotovoltaicos, instalamos sistemas solares y sus protecciones, e integramos los gabinetes.
            </p>
            <div data-hero-cta className="mt-5 md:mt-8 flex flex-wrap gap-3">
              <a
                href={enlaceWhatsApp(MENSAJE_HEROE)}
                target="_blank"
                rel="noopener noreferrer"
                className="boton-iman inline-flex items-center gap-2 min-h-12 px-5 sm:px-6 rounded-sm bg-white text-azul font-semibold hover:bg-azul-suave"
              >
                <MessageCircle size={20} aria-hidden />
                <span className="sm:hidden">Cotizar</span>
                <span className="hidden sm:inline">Cotizar por WhatsApp</span>
              </a>
              <a
                href="#cotizar"
                className="boton-iman inline-flex items-center gap-2 min-h-12 px-5 sm:px-6 rounded-sm border border-white/70 text-white font-semibold hover:bg-white/10"
              >
                <Calculator size={20} aria-hidden />
                <span className="sm:hidden">Calcular</span>
                <span className="hidden sm:inline">Calcular paneles</span>
              </a>
            </div>
            {/* Same claims as the rest of the page, word for word: the cofres meet
                the applicable RETIE requirements; only the supplied cabinets
                carry RETIE and IEC certificates. */}
            <ul className="mt-6 md:mt-8 grid gap-2 border-t border-white/20 pt-4 text-sm text-white/85 max-w-xl">
              <li className="flex gap-2">
                <ShieldCheck size={18} aria-hidden className="shrink-0 mt-px" />
                <span>Cofres con cumplimiento de los requisitos aplicables del RETIE</span>
              </li>
              <li className="flex gap-2">
                <ShieldCheck size={18} aria-hidden className="shrink-0 mt-px" />
                <span>
                  Gabinetes suministrados con certificados <span className="font-mono font-semibold text-white">RETIE</span> e{" "}
                  <span className="font-mono font-semibold text-white">IEC</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="por-que-solar" aria-labelledby="h-por-que" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Antetitulo n="01" texto="Por qué solar" />
          <h2 id="h-por-que" data-aparecer className={`mt-2 max-w-3xl ${H2}`}>
            Tu propia energía, desde tu techo
          </h2>
          <p className="mt-4 text-tenue max-w-2xl">Elige tu tipo de proyecto y mira lo que cambia para ti.</p>
          <div data-aparecer className="mt-10">
            <PorQueSolar />
          </div>
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

      <section id="servicios" aria-labelledby="h-servicios" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Antetitulo n="03" texto="Servicios" />
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

      <section aria-labelledby="h-gavicom" className="bg-gris py-20 md:py-28 border-y border-linea">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 self-start">
            <Antetitulo n="04" texto="Por qué GAVICOM" />
            <h2 id="h-gavicom" data-aparecer className={`mt-2 ${H2}`}>
              Un solo equipo, del cofre al gabinete
            </h2>
            <p data-aparecer className="mt-4 text-tinta/85">
              GAVICOM Energy es la línea solar de GAVICOM SAS, la empresa de Barranquilla que suministra y fabrica componentes para la vía férrea. Llevamos a la energía solar la misma exigencia técnica: el cofre, las protecciones y los gabinetes los resuelve un mismo equipo.
            </p>
            {/* The certificates belong to the supplied cabinets only; the
                cofres are described as meeting the applicable RETIE
                requirements, never as certified. */}
            <div data-aparecer className="mt-8 rounded-sm border border-azul/25 bg-white p-5">
              <p className="inline-flex items-center gap-2 font-semibold text-tinta">
                <ShieldCheck size={20} className="text-azul shrink-0" aria-hidden />
                Gabinetes suministrados con certificados
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-3" aria-label="Certificados de los gabinetes suministrados">
                {[
                  ["RETIE", "Reglamento Técnico de Instalaciones Eléctricas"],
                  ["IEC", "Normas internacionales de equipos eléctricos"],
                ].map(([sigla, nombre]) => (
                  <li key={sigla} className="flex flex-col gap-1 px-4 py-3 rounded-sm border border-azul/30 bg-azul-suave">
                    <span className="font-mono font-bold text-azul">{sigla}</span>
                    <span className="text-sm text-tenue">{nombre}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <ol data-aparecer="grupo" className="border-t border-tinta/80">
              {RAZONES_GAVICOM.map((r, i) => (
                <li key={r.titulo} className="grid grid-cols-[3rem_minmax(0,1fr)] sm:grid-cols-[3.5rem_minmax(0,1fr)_7rem] gap-x-4 gap-y-1 py-5 border-b border-linea">
                  <span aria-hidden className="font-mono text-sm text-tenue pt-1 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-titulo text-xl font-bold text-azul leading-snug">{r.titulo}</h3>
                    <p className="mt-1 text-tinta/85">{r.texto}</p>
                  </div>
                  <span aria-hidden className="hidden sm:block font-mono text-xs uppercase tracking-wider text-tenue text-right pt-1.5">{r.clave}</span>
                </li>
              ))}
            </ol>

            <h3 className="mt-12 font-titulo text-2xl font-bold">Lo que ya hemos hecho</h3>
            <ul data-aparecer="grupo" className="mt-5 grid gap-px bg-linea border border-linea sm:grid-cols-3">
              {HECHO.map(({ t, d }) => (
                <li key={t} className="bg-white p-5">
                  <h4 className="font-titulo text-lg font-bold text-azul leading-snug">{t}</h4>
                  <p className="mt-1 text-sm text-tenue">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="h-proceso" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Antetitulo n="05" texto="Cómo trabajamos" />
          <h2 id="h-proceso" data-aparecer className={`mt-2 ${H2}`}>
            De tu factura a tu sistema
          </h2>
          <ol data-aparecer="grupo" className="proceso mt-12 grid gap-8 md:grid-cols-5 md:gap-6">
            {PASOS_TRABAJO.map((p, i) => (
              <li key={p.titulo} className="proceso-paso relative pl-14 md:pl-0 md:pt-16">
                <span aria-hidden className="proceso-num absolute left-0 top-0 grid place-items-center size-10 rounded-full border-2 border-azul bg-white font-mono text-sm font-bold text-azul tabular-nums">
                  {i + 1}
                </span>
                <h3 className="font-titulo text-lg font-bold text-azul leading-snug">{p.titulo}</h3>
                <p className="mt-1 text-sm text-tinta/85">{p.texto}</p>
              </li>
            ))}
          </ol>

          <div data-aparecer className="mt-14 grid gap-6 rounded-sm bg-azul text-white p-6 md:p-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center sobre-azul energia-azul">
            <div>
              <p className="font-titulo text-2xl md:text-3xl font-bold leading-tight">Empieza con tu factura de energía.</p>
              <p className="mt-2 text-white/80 max-w-xl">
                Escríbenos por WhatsApp y envíanos una foto de tu factura. Con ese dato arrancamos el estimado.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={enlaceWhatsApp(MENSAJE_FACTURA)}
                target="_blank"
                rel="noopener noreferrer"
                className="boton-iman inline-flex items-center gap-2 min-h-12 px-6 rounded-sm bg-white text-azul font-semibold hover:bg-azul-suave"
              >
                <MessageCircle size={20} aria-hidden />
                Enviar mi factura
              </a>
              <a href="#cotizar" className="inline-flex items-center min-h-12 px-6 rounded-sm border border-white/70 text-white font-semibold hover:bg-white/10">
                Calcular primero
              </a>
            </div>
          </div>
        </div>
      </section>

      <CorteAla />
      <section id="cotizar" aria-labelledby="h-cotizar" className="sobre-azul energia-azul bg-azul text-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Antetitulo n="06" texto="Cotizar" claro />
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
