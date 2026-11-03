"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCotizacion } from "@/lib/cotizacion";
import { enlaceWhatsApp } from "@/lib/whatsapp";

const GENERICO = "Hola GAVICOM, quiero hacer una consulta.";

// Each section opens WhatsApp with a first line that already says what the
// visitor wants, so sales does not have to ask.
function mensajeDeRuta(ruta: string): string {
  if (ruta === "/energy" || ruta.startsWith("/energy/")) return "Hola GAVICOM, quiero información sobre GAVICOM Energy (solar).";
  if (ruta === "/fabricacion" || ruta.startsWith("/fabricacion/")) return "Hola GAVICOM, necesito fabricar una pieza ferroviaria.";
  if (ruta === "/servicios" || ruta.startsWith("/servicios/")) return "Hola GAVICOM, quiero consultar un servicio técnico.";
  return GENERICO;
}

// On a product page the name and code come from the page itself
// ([data-producto-sku] / [data-producto-nombre], set by the catalog), instead of
// importing the whole catalog into a component every page loads. Without
// those attributes the page's h1 is the product name.
function mensajeDeFicha(): string {
  const ficha = document.querySelector<HTMLElement>("[data-producto-sku]");
  const nombre = ficha?.dataset.productoNombre?.trim() || document.querySelector("main h1")?.textContent?.trim();
  const sku = ficha?.dataset.productoSku?.trim();
  if (!nombre) return GENERICO;
  return sku ? `Hola GAVICOM, quiero cotizar ${nombre} (${sku}).` : `Hola GAVICOM, quiero cotizar ${nombre}.`;
}

const ICONO = (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden className="shrink-0">
    <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.9-3.9-1.9-6 0-5.9 4.9-10.6 11-10.6s11 4.8 11 10.6-4.9 10.9-10.9 10.9zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
  </svg>
);

// A single floating button: in Colombia most B2B quotes start on WhatsApp.
export default function BotonWhatsApp() {
  const ruta = usePathname();
  const { total } = useCotizacion();

  // Hidden while a hero's own call to action ([data-hero-cta]) is on screen,
  // so the page never shows two competing buttons, and while a pinned card
  // with its own buttons ([data-tapa-flotante]) is, so it never covers them. The observer is rebuilt on
  // every route because the button persists across navigations.
  const [tapadoEn, setTapadoEn] = useState<string | null>(null);
  useEffect(() => {
    const ctas = Array.from(document.querySelectorAll("[data-hero-cta], [data-tapa-flotante]"));
    if (ctas.length === 0) return;
    const visibles = new Set<Element>();
    const obs = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) visibles.add(e.target);
        else visibles.delete(e.target);
      }
      setTapadoEn(visibles.size > 0 ? ruta : null);
    });
    ctas.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [ruta]);
  const tapado = tapadoEn === ruta;

  // Pages that already lead with a WhatsApp button would show it twice, and
  // the floating one covered form fields there.
  if (ruta === "/cotizacion" || ruta === "/contacto") return null;

  const enFicha = ruta.startsWith("/catalogo/");
  const conCotizacion = total > 0;

  return (
    <div
      inert={tapado}
      aria-hidden={tapado || undefined}
      className={`${enFicha ? "hidden sm:flex" : "flex"} fixed z-30 right-4 bottom-4 sm:right-6 sm:bottom-6 transition-opacity duration-200 ${
        tapado ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {conCotizacion && (
        <Link
          href="/cotizacion"
          aria-label={`Enviar cotización, ${total} unidades en la lista`}
          className="hidden sm:inline-flex items-center min-h-14 px-6 rounded-full bg-azul text-white font-semibold shadow-lg hover:bg-azul-hover"
        >
          Enviar cotización ({total})
        </Link>
      )}
      <a
        href={enlaceWhatsApp(mensajeDeRuta(ruta))}
        onClick={(e) => {
          if (enFicha) e.currentTarget.href = enlaceWhatsApp(mensajeDeFicha());
        }}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir a GAVICOM por WhatsApp (abre WhatsApp)"
        className={`${conCotizacion ? "sm:hidden" : "sm:inline-flex sm:w-auto sm:px-5 sm:gap-2"} inline-flex items-center justify-center size-14 rounded-full bg-whatsapp text-white font-semibold shadow-lg hover:brightness-110`}
      >
        {ICONO}
        <span className="hidden sm:inline" aria-hidden>
          WhatsApp
        </span>
      </a>
    </div>
  );
}
