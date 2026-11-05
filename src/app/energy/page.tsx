import type { Metadata } from "next";
import { BadgeCheck, Calculator, Crosshair, ShieldCheck, Zap } from "lucide-react";
import { PASOS_TRABAJO, RAZONES_GAVICOM, SERVICIOS_ENERGY } from "@/constants/energy";
import { urlAbsoluta } from "@/lib/sitio";
import { alternas } from "@/lib/meta";
import { BotonWhatsAppVenta, FranjaConfianza, LineaHorario, type PuntoConfianza } from "@/components/venta/Venta";
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
  alternates: alternas("/energy"),
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

const MENSAJE_FACTURA =
  "Hola GAVICOM, quiero cotizar un sistema de energía solar con GAVICOM Energy. Les envío una foto de mi factura de energía.";

// Work already done, as the client listed it.
const HECHO = [
  { t: "Suministro de gabinetes", d: "Gabinetes para sistemas fotovoltaicos." },
  { t: "Ensamble de componentes DC y AC", d: "Armado de los componentes de corriente continua y alterna del sistema." },
  { t: "Sistemas monopolares", d: "Configuración e instalación de sistemas monopolares." },
];

const H2 = "t-seccion";

function Antetitulo({ n, texto, claro = false }: { n: string; texto: string; claro?: boolean }) {
  return (
    <p className={`font-mono text-sm tracking-wide ${claro ? "text-white/75" : "text-tenue"}`}>
      {n} · {texto}
    </p>
  );
}

// Same promise as the rest of the site, in solar terms. The RETIE and IEC
// lines keep the exact wording rule: cofres "meet the applicable RETIE
// requirements"; only the supplied cabinets carry RETIE and IEC certificates.
const CONFIANZA_SOLAR: PuntoConfianza[] = [
  { icono: ShieldCheck, titulo: "100% confiables", texto: "Cofres con cumplimiento de los requisitos aplicables del RETIE." },
  { icono: BadgeCheck, titulo: "Gabinetes certificados", texto: "Los gabinetes suministrados llegan con certificados RETIE e IEC." },
  { icono: Zap, titulo: "Rápidos", texto: "Con una foto de tu factura empezamos el estimado." },
  { icono: Crosshair, titulo: "Precisos", texto: "Dimensionamos con tu consumo real y una visita al sitio." },
];

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
          transparent with the white logo (Encabezado.tsx). The offer leads on
          every screen; the system drawing is a desktop-only companion, since
          on a phone it pushed the headline and the buttons below the fold. */}
      <section id="vuelo" aria-labelledby="h-energy" className="sobre-azul energia-azul relative overflow-hidden bg-azul text-white lg:min-h-[100svh]">
        <div aria-hidden className="plano absolute inset-0 pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-[96px] pb-10 md:pb-14 lg:min-h-[100svh] grid content-center gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
          <div className="hidden lg:block lg:order-last">
            <EsquemaSolar />
          </div>
          <div>
            <p className="inline-flex items-center min-h-8 px-3 rounded-sm border border-white text-white text-sm font-semibold tracking-wide">
              GAVICOM Energy · Solar
            </p>
            <h1 id="h-energy" className="mt-4 t-portada text-white">
              Paga menos luz con tu propio sistema solar.
            </h1>
            <p className="mt-3 md:mt-5 t-entrada text-white/90 max-w-xl">
              Para tu casa, tu negocio o tu planta en el Caribe colombiano. Un solo equipo te entrega el sistema completo: montaje, cofres, protecciones y gabinetes.
            </p>
            <div data-hero-cta className="mt-5 md:mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <BotonWhatsAppVenta mensaje={MENSAJE_FACTURA} grande ancho>
                Cotizar con mi factura
              </BotonWhatsAppVenta>
              <a
                href="#cotizar"
                className="boton-iman inline-flex items-center justify-center gap-2 min-h-14 px-6 rounded-sm border border-white/70 text-white font-semibold hover:bg-white/10"
              >
                <Calculator size={20} aria-hidden />
                Calcular mis paneles
              </a>
            </div>
            <LineaHorario claro className="mt-4" />
            {/* Same claims as the rest of the page, word for word: the cofres meet
                the applicable RETIE requirements; only the supplied cabinets
                carry RETIE and IEC certificates. */}
            <ul className="mt-5 md:mt-7 grid gap-2 border-t border-white/20 pt-4 text-sm text-white/85 max-w-xl">
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

      <FranjaConfianza puntos={CONFIANZA_SOLAR} etiqueta="Por qué GAVICOM Energy" />

      {/* The offer: four services, each with its own prefilled WhatsApp
          button. The legal title stays under each card, as the client wrote it. */}
      <section id="servicios" aria-labelledby="h-servicios" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Antetitulo n="01" texto="Lo que hacemos" />
          <h2 id="h-servicios" data-aparecer className={`mt-2 ${H2}`}>
            Tu sistema solar completo, con un solo proveedor
          </h2>
          <p className="mt-4 t-entrada text-tenue max-w-2xl">
            El sistema entero o solo la parte que te falta: cofres, montaje, protecciones y gabinetes, del mismo equipo.
          </p>
          <ol data-aparecer="grupo" className="mt-10 grid gap-px bg-linea border border-linea md:grid-cols-2">
            {SERVICIOS_ENERGY.map((s, i) => (
              <li key={s.codigo} id={s.codigo.toLowerCase()} className="bg-white p-6 md:p-8 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <p aria-hidden className="t-cifra text-azul">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="font-mono text-xs text-tenue pt-1">{s.codigo}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="t-subtitulo text-azul">{s.corto}</h3>
                  <p className="text-tinta">{s.descripcion}</p>
                </div>
                <div className="mt-auto flex flex-col gap-4">
                  {/* Legal title as the client wrote it; keeps "requisitos aplicables del RETIE". */}
                  <p className="text-sm text-tenue border-t border-linea pt-3">{s.titulo}</p>
                </div>
              </li>
            ))}
          </ol>
          {/* One way on from the list, not a button per card: the
              calculator is where the visitor turns interest into a message. */}
          <a href="#cotizar" className="mt-6 inline-flex items-center gap-2 min-h-11 font-semibold text-azul hover:underline underline-offset-4">
            <Calculator size={18} aria-hidden /> Calcula qué sistema necesitas
          </a>
        </div>
      </section>

      <section id="por-que-solar" aria-labelledby="h-por-que" className="bg-gris border-y border-linea py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Antetitulo n="02" texto="Lo que ganas" />
          <h2 id="h-por-que" data-aparecer className={`mt-2 max-w-3xl ${H2}`}>
            Menos factura, menos alzas, más control
          </h2>
          <p className="mt-4 text-tenue max-w-2xl">Elige tu caso y mira lo que cambia para ti.</p>
          <div data-aparecer className="mt-10">
            <PorQueSolar />
          </div>
        </div>
      </section>

      <section aria-labelledby="h-gavicom" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 self-start">
            <Antetitulo n="03" texto="Por qué GAVICOM" />
            <h2 id="h-gavicom" data-aparecer className={`mt-2 ${H2}`}>
              Un solo equipo, del cofre al gabinete
            </h2>
            <p data-aparecer className="mt-4 text-tinta/85">
              GAVICOM Energy es la línea solar de GAVICOM SAS, la empresa de Barranquilla que fabrica y suministra componentes para la vía férrea. La misma exigencia técnica, ahora en tu techo: el cofre, las protecciones y los gabinetes los resuelve un mismo equipo.
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
                <li key={r.titulo} className="grid grid-cols-[3rem_minmax(0,1fr)] sm:grid-cols-[3.5rem_minmax(0,1fr)_7rem] gap-x-4 gap-y-1 py-4 border-b border-linea">
                  <span aria-hidden className="font-mono text-sm text-tenue pt-1 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="t-tarjeta text-azul">{r.titulo}</h3>
                    <p className="mt-1 text-tinta/85">{r.texto}</p>
                  </div>
                  <span aria-hidden className="hidden sm:block t-etiqueta text-tenue text-right pt-1.5">{r.clave}</span>
                </li>
              ))}
            </ol>

            <h3 className="mt-12 t-subtitulo">Lo que ya hemos hecho</h3>
            <ul data-aparecer="grupo" className="mt-5 grid gap-px bg-linea border border-linea sm:grid-cols-3">
              {HECHO.map(({ t, d }) => (
                <li key={t} className="bg-white p-5">
                  <h4 className="t-tarjeta text-azul">{t}</h4>
                  <p className="mt-1 text-sm text-tenue">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="h-proceso" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Antetitulo n="04" texto="Cómo trabajamos" />
          <h2 id="h-proceso" data-aparecer className={`mt-2 ${H2}`}>
            De tu factura a tu sistema, en cinco pasos
          </h2>
          <ol data-aparecer="grupo" className="proceso mt-12 grid gap-8 md:grid-cols-5 md:gap-6">
            {PASOS_TRABAJO.map((p, i) => (
              <li key={p.titulo} className="proceso-paso relative pl-14 md:pl-0 md:pt-16">
                <span aria-hidden className="proceso-num absolute left-0 top-0 grid place-items-center size-10 rounded-full border-2 border-azul bg-white font-mono text-sm font-bold text-azul tabular-nums">
                  {i + 1}
                </span>
                <h3 className="t-tarjeta text-azul">{p.titulo}</h3>
                <p className="mt-1 text-sm text-tinta/85">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CorteAla />
      <section id="cotizar" aria-labelledby="h-cotizar" className="sobre-azul energia-azul bg-azul text-white py-16 md:py-24 scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Antetitulo n="05" texto="Cotizar" claro />
          <h2 id="h-cotizar" data-aparecer className={`mt-2 text-white ${H2}`}>
            ¿Cuántos paneles necesitas?
          </h2>
          <p data-aparecer className="mt-4 text-white/80 max-w-2xl">
            Pon tu consumo y lo que ya tienes: el estimado y tu mensaje salen listos para enviar por WhatsApp. Después lo afinamos con una visita.
          </p>
          <div className="mt-10">
            <CotizadorEnergia />
          </div>
        </div>
      </section>

      {/* "How a solar system works" used to lead the page as a lesson. It now
          closes it as a scope list: each stage says what GAVICOM installs
          there, for the visitor who wants to see what the quote covers. */}
      <section aria-labelledby="h-recorrido" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Antetitulo n="06" texto="Qué incluye" />
          <h2 id="h-recorrido" data-aparecer className={`mt-2 ${H2}`}>
            Lo que instalamos, etapa por etapa
          </h2>
          <p data-aparecer className="mt-4 text-tenue max-w-2xl">
            Toca cada etapa para ver qué hace GAVICOM ahí, del panel a tu operación.
          </p>
          <div data-aparecer className="mt-10 sobre-azul energia-azul bg-azul text-white rounded-sm p-5 md:p-8">
            <RecorridoSolar />
          </div>
        </div>
      </section>
    </>
  );
}
