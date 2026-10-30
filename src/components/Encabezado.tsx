"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useCotizacion } from "@/lib/cotizacion";

const ENLACES = [
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/servicios", texto: "Servicios" },
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/contacto", texto: "Contacto" },
];

export default function Encabezado() {
  const ruta = usePathname();
  // The menu remembers the page it was opened on, so navigating closes it
  // without an effect resetting state after render.
  const [abiertoEn, setAbiertoEn] = useState<string | null>(null);
  const abierto = abiertoEn === ruta;
  const { total } = useCotizacion();

  const activo = (href: string) => ruta === href || ruta.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-linea">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-[72px] flex items-center gap-6">
        <Link href="/" className="shrink-0 py-2" aria-label="GAVICOM, inicio">
          {/* The manual sets 120 px as the minimum on screen. */}
          <Image src="/marca/gavicom-azul.png" alt="GAVICOM" width={140} height={36} priority className="h-9 w-auto" />
        </Link>

        <nav aria-label="Principal" className="hidden md:flex items-center gap-1 ml-auto">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              aria-current={activo(e.href) ? "page" : undefined}
              className={`px-3 py-2 text-[15px] font-medium border-b-2 transition-colors ${
                activo(e.href) ? "text-azul border-azul" : "text-tenue border-transparent hover:text-azul"
              }`}
            >
              {e.texto}
            </Link>
          ))}
        </nav>

        <Link
          href="/cotizacion"
          className="ml-auto md:ml-2 inline-flex items-center gap-2 min-h-11 px-4 rounded bg-azul text-white text-sm font-semibold hover:bg-azul-hover transition-colors"
        >
          Cotización
          <span className="min-w-6 h-6 px-1.5 rounded-full bg-white text-azul text-xs font-bold grid place-items-center tabular-nums" aria-label={`${total} unidades en la lista`}>
            {total}
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setAbiertoEn(abierto ? null : ruta)}
          className="md:hidden grid place-items-center w-11 h-11 -mr-2 text-azul"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        >
          {abierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {abierto && (
        <nav id="menu-movil" aria-label="Principal" className="md:hidden border-t border-linea bg-white">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {ENLACES.map((e) => (
              <li key={e.href}>
                <Link
                  href={e.href}
                  aria-current={activo(e.href) ? "page" : undefined}
                  className={`flex items-center min-h-12 text-base font-medium ${activo(e.href) ? "text-azul" : "text-tinta"}`}
                >
                  {e.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
