"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPANIA_INFO } from "@/constants/productos";
import { BotonWhatsAppVenta, LineaHorario } from "@/components/venta/Venta";

// The closing call to action of every page, at the top of the footer. It
// changes with the section so a solar buyer is not asked for "a reference or
// a drawing", and it is left out on the two pages whose whole purpose is
// already sending the quote.
function textosDe(ruta: string) {
  if (ruta.startsWith("/energy")) {
    return {
      titulo: "Envíanos tu factura de luz y te cotizamos tu sistema solar.",
      mensaje: "Hola GAVICOM, quiero cotizar un sistema de energía solar con GAVICOM Energy. Les envío una foto de mi factura de energía.",
      boton: "Enviar mi factura",
      secundario: { href: "/energy#cotizar", texto: "Calcular mis paneles" },
    };
  }
  if (ruta.startsWith("/servicios")) {
    return {
      titulo: "Cuéntanos el tramo, el equipo o el plano: te cotizamos el servicio.",
      mensaje: "Hola GAVICOM, quiero cotizar un servicio técnico: ",
      boton: "Cotizar servicio",
      secundario: { href: "/catalogo", texto: "Ver catálogo" },
    };
  }
  if (ruta.startsWith("/fabricacion")) {
    return {
      titulo: "Envíanos el plano o la foto de la pieza y la cotizamos.",
      mensaje: "Hola GAVICOM, necesito fabricar una pieza ferroviaria: ",
      boton: "Cotizar fabricación",
      secundario: { href: "/fabricacion#arma-tu-pedido", texto: "Armar mi pedido" },
    };
  }
  return {
    titulo: "¿Tienes la lista o el plano? Cotízalo hoy por WhatsApp.",
    mensaje: "Hola GAVICOM, quiero cotizar: ",
    boton: "Cotizar por WhatsApp",
    secundario: { href: "/catalogo", texto: "Armar lista en el catálogo" },
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
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-white/75">{COMPANIA_INFO.promesa.replace(/\.$/, "")}</p>
          <h2 className="mt-2 text-white text-2xl md:text-4xl font-bold tracking-tight max-w-2xl text-balance">{t.titulo}</h2>
          <LineaHorario claro className="mt-4" />
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3">
          <BotonWhatsAppVenta mensaje={t.mensaje} grande ancho>
            {t.boton}
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
