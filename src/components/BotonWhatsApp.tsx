"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCotizacion } from "@/lib/cotizacion";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import { IconoWhatsApp } from "@/components/venta/Venta";

const GENERICO = "Hola GAVICOM, quiero cotizar: ";

// Each section opens WhatsApp with a first line that already says what the
// visitor wants, so sales does not have to ask.
function mensajeDeRuta(ruta: string): string {
  if (ruta === "/energy" || ruta.startsWith("/energy/")) return "Hola GAVICOM, quiero cotizar un sistema de energía solar con GAVICOM Energy: ";
  if (ruta === "/fabricacion" || ruta.startsWith("/fabricacion/")) return "Hola GAVICOM, necesito fabricar una pieza ferroviaria.";
  if (ruta === "/servicios" || ruta.startsWith("/servicios/")) return "Hola GAVICOM, quiero cotizar un servicio técnico: ";
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


// A single floating button: in Colombia most B2B quotes start on WhatsApp.
// It carries a word ("Cotizar") and not just the logo: an icon alone reads as
// "chat", the label says what the visitor gets by tapping it.
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
        aria-label="Cotizar con GAVICOM por WhatsApp (abre WhatsApp)"
        className={`${conCotizacion ? "sm:hidden" : "sm:inline-flex"} inline-flex items-center justify-center gap-2 min-h-14 pl-4 pr-5 rounded-full bg-whatsapp text-white font-semibold shadow-lg hover:brightness-110`}
      >
        <IconoWhatsApp size={26} />
        <span aria-hidden>
          Cotizar<span className="hidden sm:inline"> por WhatsApp</span>
        </span>
      </a>
    </div>
  );
}
