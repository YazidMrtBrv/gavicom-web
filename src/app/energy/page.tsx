import type { Metadata } from "next";
import { ENERGY_INTRO, SERVICIOS_ENERGY } from "@/constants/energy";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import BotonCotizar from "@/components/BotonCotizar";
import CieloSolar from "@/components/energia/CieloSolar";
import DatosParaCotizar from "@/components/energia/DatosParaCotizar";

const DESCRIPCION =
  "Cofres fotovoltaicos metálicos rígidos con cumplimiento de los requisitos aplicables del RETIE, montaje e instalación de sistemas solares, protecciones eléctricas AC y DC y ensamble de gabinetes. GAVICOM, Barranquilla.";

export const metadata: Metadata = {
  title: "GAVICOM Energy, energía solar fotovoltaica",
  description: DESCRIPCION,
  alternates: { canonical: "/energy" },
  openGraph: { title: "GAVICOM Energy | GAVICOM SAS", description: DESCRIPCION, url: "/energy" },
};

// Short names for the big numbers column; the full titles are the client's own
// wording and stay as written (they say "requisitos aplicables del RETIE", not
// "certificado RETIE", on purpose).
const CORTO: Record<string, string> = {
  "GVC-ENR-01": "Cofres fotovoltaicos",
  "GVC-ENR-02": "Montaje e instalación",
  "GVC-ENR-03": "Protecciones AC y DC",
  "GVC-ENR-04": "Ensamble e integración",
};

export default function Energy() {
  return (
    <>
      <section id="vuelo" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-azul">
        <CieloSolar />
        {/* Keeps the headline readable where it overlaps the sky and panels. */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,38,66,0.85)_0%,rgba(12,38,66,0.55)_45%,rgba(12,38,66,0)_70%)] md:bg-[linear-gradient(90deg,rgba(12,38,66,0.9)_0%,rgba(12,38,66,0.6)_40%,rgba(12,38,66,0)_65%)]" />
        <div className="relative h-full mx-auto max-w-6xl px-4 sm:px-6 flex flex-col justify-start pt-[18vh] md:pt-[20vh]">
          <p className="text-white/70 font-semibold tracking-wide">GAVICOM Energy</p>
          <h1 className="mt-3 text-white text-[44px] leading-[1.02] sm:text-6xl md:text-7xl font-bold tracking-tight max-w-3xl">
            Energía solar, del cofre al gabinete.
          </h1>
          <p className="mt-5 text-white/85 text-lg md:text-xl max-w-lg">Fabricamos cofres fotovoltaicos, instalamos sistemas solares y sus protecciones, e integramos los gabinetes.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#servicios" className="inline-flex items-center min-h-12 px-6 rounded bg-white text-azul font-semibold hover:bg-azul-suave">
              Ver servicios
            </a>
            <a
              href={enlaceWhatsApp("Hola GAVICOM, me interesa cotizar un proyecto de energía solar con GAVICOM Energy.")}
              className="inline-flex items-center min-h-12 px-6 rounded border border-white/60 text-white font-semibold hover:bg-white/10"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section id="servicios" aria-labelledby="h-servicios" className="mx-auto max-w-6xl px-4 sm:px-6 pt-20">
        <h2 id="h-servicios" data-aparecer className="text-3xl md:text-4xl font-bold">
          Servicios
        </h2>
        <p className="mt-3 text-tenue max-w-2xl">{ENERGY_INTRO}</p>
        <ul data-aparecer="grupo" className="mt-8 border-t border-linea">
          {SERVICIOS_ENERGY.map((s) => (
            <li key={s.codigo} id={s.codigo.toLowerCase()} className="group grid gap-4 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)_auto] py-8 border-b border-linea items-start">
              <div>
                <p className="font-mono text-xs text-azul">{s.codigo}</p>
                <p className="font-titulo text-2xl font-bold text-azul mt-1 leading-tight group-hover:translate-x-1 transition-transform">{CORTO[s.codigo] ?? s.titulo}</p>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-sans text-lg font-semibold text-tinta leading-snug">{s.titulo}</h3>
                <p className="text-tenue">{s.descripcion}</p>
                <ul className="flex flex-wrap gap-2">
                  {s.alcance.map((a) => (
                    <li key={a} className="text-sm px-3 py-1 rounded bg-gris border border-linea">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:pt-6">
                <BotonCotizar sku={s.codigo} nombre={CORTO[s.codigo] ?? s.titulo} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="h-hecho" className="mx-auto max-w-6xl px-4 sm:px-6 pt-20">
        <h2 id="h-hecho" data-aparecer className="text-3xl md:text-4xl font-bold">
          Lo que ya hemos hecho
        </h2>
        <ul data-aparecer="grupo" className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Suministro de gabinetes", "Gabinetes para sistemas fotovoltaicos, con certificados RETIE e IEC."],
            ["Ensamble de componentes DC y AC", "Armado de los componentes de corriente continua y alterna del sistema."],
            ["Sistemas monopolares", "Configuración e instalación de sistemas monopolares."],
          ].map(([t, d]) => (
            <li key={t} className="foco rounded border border-linea p-5">
              <p className="font-titulo text-xl font-bold text-azul">{t}</p>
              <p className="mt-1 text-tenue">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="h-datos" className="mx-auto max-w-6xl px-4 sm:px-6 pt-20">
        <h2 id="h-datos" data-aparecer className="text-3xl md:text-4xl font-bold">
          Qué necesitamos para cotizar
        </h2>
        <p className="text-tenue mt-2 max-w-2xl mb-8">Marca lo que ya tienes y te armamos el mensaje.</p>
        <DatosParaCotizar />
      </section>
    </>
  );
}
