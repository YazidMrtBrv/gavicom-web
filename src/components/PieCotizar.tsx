"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BotonWhatsAppVenta, LineaHorario } from "@/components/venta/Venta";

// The closing call to action of every page, at the top of the footer: the
// one ask at the end of the page's story (the other is in the hero). Pages
// do not add a closing band of their own, so it never shows twice. The text
// follows the section, so a solar buyer is not asked for "a drawing". Left
// out on the two pages whose whole purpose is already sending the quote.
function textosDe(ruta: string) {
  if (ruta.startsWith("/energy")) {
    return {
      titulo: "Con una foto de tu factura de luz empezamos el estimado de tu sistema.",
      mensaje: "Hola GAVICOM, quiero cotizar un sistema de energía solar con GAVICOM Energy. Les envío una foto de mi factura de energía.",
      secundario: { href: "/energy#cotizar", texto: "Calcular mis paneles" },
    };
  }
  if (ruta.startsWith("/servicios")) {
    return {
      titulo: "Cuéntanos el tramo, el equipo o el plano, y te cotizamos el servicio.",
      mensaje: "Hola GAVICOM, quiero cotizar un servicio técnico: ",
      secundario: { href: "/catalogo", texto: "Ver catálogo" },
    };
  }
  if (ruta.startsWith("/fabricacion")) {
    return {
      titulo: "Con el plano, una foto o la muestra, cotizamos tu pieza.",
      mensaje: "Hola GAVICOM, necesito fabricar una pieza ferroviaria: ",
      secundario: { href: "/fabricacion#arma-tu-pedido", texto: "Armar mi pedido" },
    };
  }
  return {
    titulo: "¿Tienes la lista o el plano? Te cotizamos con el código de cada pieza.",
    mensaje: "Hola GAVICOM, quiero cotizar: ",
    secundario: { href: "/catalogo", texto: "Ver catálogo" },
  };
}

export default function PieCotizar() {
  const ruta = usePathname();
  if (ruta === "/cotizacion" || ruta === "/contacto") return null;
  const t = textosDe(ruta);
  return (
    <div className="border-b border-white/15">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-14 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div>
          <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight max-w-2xl text-balance">{t.titulo}</h2>
          <LineaHorario claro className="mt-4" />
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3">
          <BotonWhatsAppVenta mensaje={t.mensaje} grande ancho>
            Pedir cotización
          </BotonWhatsAppVenta>
          <Link
            href={t.secundario.href}
            className="inline-flex items-center justify-center min-h-14 px-6 rounded border border-white text-white font-semibold hover:bg-white/10"
          >
            {t.secundario.texto}
          </Link>
        </div>
      </div>
    </div>
  );
}
