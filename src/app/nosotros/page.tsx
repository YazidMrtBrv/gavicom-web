import type { Metadata } from "next";
import { IMAGEN_COMPARTIR, alternas } from "@/lib/meta";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import "./nosotros.css";

const TITULO = "Nosotros | GAVICOM SAS";
const DESCRIPCION = `${COMPANIA_INFO.nombre}: experiencia en vía férrea. Suministro férreo, piezas fabricadas en Colombia con aliados industriales y GAVICOM Energy, desde ${COMPANIA_INFO.ciudad}.`;

export const metadata: Metadata = {
  title: "Nosotros",
  description: DESCRIPCION,
  alternates: alternas("/nosotros"),
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: "/nosotros",
    siteName: "GAVICOM SAS",
    locale: "es_CO",
    type: "website",
    images: [IMAGEN_COMPARTIR],
  },
  twitter: { card: "summary_large_image", images: [IMAGEN_COMPARTIR], title: TITULO, description: DESCRIPCION },
};

// Every line here is text that was already on the site; the cards only
// regroup it so the page reads as three lines of work instead of a wall.
const LINEAS = [
  {
    nombre: "Suministro",
    texto: "Distribuimos fijaciones, sistemas elásticos de sujeción, herramientas de vía y señalización.",
    href: "/catalogo",
    accion: "Ver el catálogo",
  },
  {
    nombre: "Fabricación",
    texto: "Fabricamos en Colombia con aliados industriales, desde la ingeniería inversa de la pieza hasta los planos, la fundición y el control de calidad.",
    href: "/fabricacion",
    accion: "Ver cómo fabricamos",
  },
  {
    nombre: "GAVICOM Energy",
    texto: "Fabricamos cofres fotovoltaicos, instalamos sistemas solares y sus protecciones, e integramos los gabinetes.",
    href: "/energy",
    accion: "Ver GAVICOM Energy",
  },
];

const anteTitulo = "font-mono text-xs md:text-sm tracking-widest uppercase";

export default function Nosotros() {
  return (
    <div className="flex flex-col">
      <section aria-labelledby="h-nosotros" className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-10 md:pt-16 pb-16 md:pb-20">
        <p className={`${anteTitulo} text-tenue`}>Nosotros</p>
        <h1 id="h-nosotros" className="mt-3 text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-[1.05]">
          Experiencia en vía férrea, fabricación en Colombia
        </h1>
        <p className="mt-5 text-lg md:text-xl leading-relaxed max-w-2xl">
          Somos una empresa de {COMPANIA_INFO.ciudad} creada desde la experiencia directa en infraestructura férrea y el conocimiento de sus exigencias técnicas y operativas.
        </p>
      </section>

      {/* Family-approved text, without the name, kept to this page on purpose:
          the logo already carries the seagull everywhere else. The photo sits
          under a near-solid blue veil and the logo on its own solid blue plate,
          as the brand manual asks for the white version. */}
      <section aria-labelledby="h-gaviota" className="sobre-azul relative isolate overflow-hidden bg-azul text-white">
        <Image src="/video/gaviota-poster.jpg" alt="" fill sizes="100vw" loading="lazy" className="object-cover -z-20" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-azul/90" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28 grid gap-10 md:grid-cols-[260px_1fr] items-center">
          <div className="bg-azul p-5 self-start md:self-center w-fit">
            <Image src="/marca/gavicom-blanco.png" alt="Logo de GAVICOM con la gaviota sobre la I" width={1267} height={327} sizes="220px" className="w-[180px] md:w-[220px] h-auto" />
          </div>
          <div>
            <h2 id="h-gaviota" className={`${anteTitulo} text-white/80 font-sans font-normal`}>
              01 · La gaviota
            </h2>
            <p data-aparecer="grupo" className="frase-gaviota mt-4 font-titulo text-[28px] md:text-[36px] leading-tight font-semibold text-white text-balance">
              <span className="block">La gaviota de nuestro logo es por nuestra abuela,</span>
              <span className="block">a quien de cariño le decían «Gaviota».</span>
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="h-hacemos" className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-20 md:py-28">
        <p className={`${anteTitulo} text-tenue`}>02 · Qué hacemos</p>
        <h2 id="h-hacemos" className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
          Tres líneas de trabajo
        </h2>
        <ul data-aparecer="grupo" className="mt-10 grid gap-4 md:grid-cols-3">
          {LINEAS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group h-full flex flex-col gap-3 border border-linea rounded p-6 bg-white hover:border-azul hover:bg-azul-suave transition-colors"
              >
                <span className="font-titulo text-2xl font-bold text-azul">{l.nombre}</span>
                <span className="text-tenue leading-relaxed flex-1">{l.texto}</span>
                <span className="inline-flex items-center gap-2 min-h-11 font-semibold text-azul">
                  {l.accion}
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-tenue max-w-3xl">
          También prestamos servicios de topografía con dron, mantenimiento de equipos, hidráulica, alquiler de motosoldadores, planos y consultoría, y acompañamos proyectos en prefactibilidad y factibilidad con modelación BIM.
        </p>
        <Link href="/servicios" className="mt-2 inline-flex items-center gap-2 min-h-11 font-semibold text-azul underline underline-offset-4 hover:no-underline">
          Ver servicios
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </section>

      <section aria-label="Reconocimiento" className="bg-gris border-y border-linea">
        <figure className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
          <p className={`${anteTitulo} text-tenue`}>03 · Reconocimiento</p>
          <blockquote className="mt-4 border-l-4 border-azul pl-5 md:pl-8">
            <p className="font-titulo text-2xl md:text-3xl font-semibold text-azul leading-snug max-w-3xl">
              Fuimos seleccionados por iNNpulsa Colombia en el programa En-Cadena, Mejores proveedores del sector ferroviario.
            </p>
          </blockquote>
        </figure>
      </section>

      <section aria-labelledby="h-equipo" className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-20 md:py-28">
        <p className={`${anteTitulo} text-tenue`}>04 · Contacto</p>
        <h2 id="h-equipo" className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
          Con quién hablas
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          <li className="border border-linea rounded p-6">
            <p className="font-titulo text-xl font-bold text-azul">{COMPANIA_INFO.gerente}</p>
            <p className="mt-1 text-tenue">{COMPANIA_INFO.cargo}</p>
          </li>
          <li className="border border-linea rounded p-6">
            <p className="font-titulo text-xl font-bold text-azul">{COMPANIA_INFO.directora}</p>
            <p className="mt-1 text-tenue">Directora ejecutiva</p>
          </li>
        </ul>
        <p className="mt-6 text-tenue">
          {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento}. {COMPANIA_INFO.cobertura}.
        </p>
        {/* One sales line for the whole team: a per-person WhatsApp button that
            lands on the same sales number would mislead. */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={enlaceWhatsApp("Hola GAVICOM, quiero hacer una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded bg-whatsapp text-white font-semibold hover:brightness-110"
          >
            <MessageCircle aria-hidden="true" className="size-5" />
            Escribir a ventas por WhatsApp
          </a>
          <a
            href={`mailto:${COMPANIA_INFO.email}`}
            className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded border border-azul text-azul font-semibold hover:bg-azul-suave"
          >
            <Mail aria-hidden="true" className="size-5" />
            {COMPANIA_INFO.email}
          </a>
        </div>
      </section>
    </div>
  );
}
