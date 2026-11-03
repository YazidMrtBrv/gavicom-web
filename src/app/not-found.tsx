import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import Buscador from "@/components/Buscador";
import { enlaceWhatsApp } from "@/lib/whatsapp";

// Next already sends noindex with the 404 status; it is repeated here so a
// streamed (200) not-found page is never indexed either.
export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

const DESTINOS = [
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/fabricacion", texto: "Fabricación" },
  { href: "/energy", texto: "Energy" },
  { href: "/contacto", texto: "Contacto" },
];

export default function NoEncontrada() {
  return (
    <section aria-labelledby="h-404" className="relative overflow-hidden bg-azul flex items-center min-h-[calc(100svh-72px)]">
      {/* A frame of the home video, not the logo; the strong blue veil keeps the
          white text AA-legible over any part of the photo. */}
      <Image src="/video/gaviota-poster.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,38,66,0.82)_0%,rgba(12,38,66,0.94)_55%,rgba(12,38,66,1)_100%)] md:bg-[linear-gradient(90deg,rgba(12,38,66,0.96)_0%,rgba(12,38,66,0.88)_55%,rgba(12,38,66,0.6)_100%)]" />
      <div className="relative w-full mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-28">
        <p className="font-mono text-sm text-white/75">Error 404</p>
        <h1 id="h-404" className="mt-3 text-white text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Esta página no existe o cambió de dirección
        </h1>
        <p className="mt-4 text-white/85 text-base md:text-lg max-w-xl">
          Busca la referencia por nombre o código, o sigue por una de las secciones del sitio.
        </p>

        <Buscador className="mt-8 max-w-xl" />

        <nav aria-label="Secciones del sitio" className="mt-8">
          <ul className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
            {DESTINOS.map((d) => (
              <li key={d.href}>
                <Link
                  href={d.href}
                  className="group w-full sm:w-auto inline-flex items-center justify-between gap-2 min-h-12 px-5 rounded bg-white text-azul font-semibold hover:bg-azul-suave"
                >
                  {d.texto}
                  <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={enlaceWhatsApp("Hola GAVICOM, busqué una página en la web y no la encontré: ")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 min-h-12 px-5 rounded bg-whatsapp text-white font-semibold hover:brightness-110"
        >
          <MessageCircle size={18} aria-hidden />
          Dinos qué buscabas por WhatsApp
        </a>
      </div>
    </section>
  );
}
