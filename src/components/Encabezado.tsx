"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useCotizacion } from "@/lib/cotizacion";

const ENLACES = [
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/fabricacion", texto: "Fabricación" },
  { href: "/servicios", texto: "Servicios" },
  { href: "/energy", texto: "Energy" },
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
  // Over the home page's flight scene the bar is transparent with the white
  // logo (the manual's white-on-blue version); it turns white once past it.
  const [cieloEn, setCieloEn] = useState<string | null>(null);
  const sobreCielo = cieloEn === ruta;
  useEffect(() => {
    const vuelo = document.getElementById("vuelo");
    if (!vuelo) return;
    const revisar = () => setCieloEn(vuelo.getBoundingClientRect().bottom > 72 ? ruta : null);
    revisar();
    window.addEventListener("scroll", revisar, { passive: true });
    return () => window.removeEventListener("scroll", revisar);
  }, [ruta]);
  const oscuro = sobreCielo && !abierto;

  const activo = (href: string) => ruta === href || ruta.startsWith(`${href}/`);

  return (
    <header className={`${oscuro ? "fixed inset-x-0 bg-transparent border-transparent" : "sticky bg-white/95 backdrop-blur border-linea"} top-0 z-40 border-b transition-colors duration-300`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-[72px] flex items-center gap-6">
        <Link href="/" className="shrink-0 py-2" aria-label="GAVICOM, inicio">
          {/* The manual sets 120 px as the minimum on screen. */}
          <Image src={oscuro ? "/marca/gavicom-blanco.png" : "/marca/gavicom-azul.png"} alt="GAVICOM" width={140} height={36} priority className="h-9 w-auto" />
        </Link>

        <nav aria-label="Principal" className="hidden md:flex items-center gap-1 ml-auto">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              aria-current={activo(e.href) ? "page" : undefined}
              className={`px-3 py-2 text-[15px] font-medium border-b-2 transition-colors ${
                oscuro ? "text-white/85 border-transparent hover:text-white" : activo(e.href) ? "text-azul border-azul" : "text-tenue border-transparent hover:text-azul"
              }`}
            >
              {e.texto}
            </Link>
          ))}
        </nav>

        <Link
          href="/cotizacion"
          className={`ml-auto md:ml-2 inline-flex items-center gap-2 min-h-11 px-4 rounded text-sm font-semibold transition-colors ${oscuro ? "bg-white text-azul hover:bg-azul-suave" : "bg-azul text-white hover:bg-azul-hover"}`}
        >
          Cotización
          <span className={`min-w-6 h-6 px-1.5 rounded-full ${oscuro ? "bg-azul text-white" : "bg-white text-azul"} text-xs font-bold grid place-items-center tabular-nums`} aria-label={`${total} unidades en la lista`}>
            {total}
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setAbiertoEn(abierto ? null : ruta)}
          className={`md:hidden grid place-items-center w-11 h-11 -mr-2 ${oscuro ? "text-white" : "text-azul"}`}
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
