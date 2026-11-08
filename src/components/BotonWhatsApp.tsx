"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCotizacion } from "@/lib/cotizacion";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import { IconoWhatsApp } from "@/components/venta/Venta";
import { ClipboardList } from "lucide-react";
import { abrirLista } from "@/components/catalogo/CajonLista";

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
  // The agent demo is a mailbox demo for GAVICOM; a floating sales button
  // there would cover the agent's panel on phones.
  if (ruta === "/cotizacion" || ruta === "/contacto" || ruta === "/agente") return null;

  const enFicha = ruta.startsWith("/catalogo/");
  const conCotizacion = total > 0;

  return (
    <div
      className={`${enFicha ? "hidden sm:flex" : "flex"} fixed z-30 right-4 bottom-4 sm:right-6 sm:bottom-6 items-center gap-2`}
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* The live list opens in place, as a drawer: building a quote is an
          interaction on the page, not a trip to another one. It stays
          visible even while a hero call to action hides the WhatsApp pill. */}
      {conCotizacion && (
        <button
          type="button"
          onClick={abrirLista}
          aria-label={`Abrir tu lista de cotización, ${total} unidades`}
          className="inline-flex items-center gap-2 min-h-14 px-5 rounded-full bg-azul text-white font-semibold shadow-lg hover:bg-azul-hover"
        >
          <ClipboardList size={20} aria-hidden />
          <span aria-hidden>
            <span className="hidden sm:inline">Tu lista </span>
            <span className="sm:hidden">Lista </span>({total})
          </span>
        </button>
      )}
      <a
        href={enlaceWhatsApp(mensajeDeRuta(ruta))}
        onClick={(e) => {
          if (enFicha) e.currentTarget.href = enlaceWhatsApp(mensajeDeFicha());
        }}
        target="_blank"
        rel="noopener noreferrer"
        inert={tapado}
        aria-hidden={tapado || undefined}
        aria-label="Cotizar con GAVICOM por WhatsApp (abre WhatsApp)"
        className={`inline-flex items-center justify-center gap-2 min-h-14 rounded-full bg-whatsapp text-white font-semibold shadow-lg hover:brightness-110 transition-opacity duration-200 ${
          conCotizacion ? "size-14 sm:size-auto sm:pl-4 sm:pr-5" : "pl-4 pr-5"
        } ${tapado ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <IconoWhatsApp size={26} />
        {/* With the list button beside it, phones keep only the icon. */}
        <span aria-hidden className={conCotizacion ? "hidden sm:inline" : ""}>
          Cotizar<span className="hidden sm:inline"> por WhatsApp</span>
        </span>
      </a>
    </div>
  );
}
