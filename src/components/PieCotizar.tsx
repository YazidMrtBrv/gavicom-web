"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { enlaceWhatsApp } from "@/lib/whatsapp";

// The quote call-to-action at the top of the footer. It is left out on the
// two pages whose whole purpose is already sending the quote.
export default function PieCotizar() {
  const ruta = usePathname();
  if (ruta === "/cotizacion" || ruta === "/contacto") return null;
  return (
    <div className="border-b border-white/15">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight max-w-xl">¿Tienes una referencia o un plano para cotizar?</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={enlaceWhatsApp("Hola GAVICOM, quiero cotizar: ")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-12 px-6 rounded bg-white text-azul font-semibold hover:bg-azul-suave"
          >
            Cotizar por WhatsApp
          </a>
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center min-h-12 px-6 rounded border border-white text-white font-semibold hover:bg-white/10"
          >
            Armar lista en el catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
