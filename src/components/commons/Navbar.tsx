"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotionConfig, motion } from "framer-motion";
import Logo from "@/components/marca/Logo";
import { useCotizacion } from "@/components/cotizacion/CotizacionProvider";
import { COMPANIA_INFO } from "@/constants/productos";
import { cn } from "@/lib/cn";
import BotonCotizar from "./BotonCotizar";
import MenuMovil from "./MenuMovil";
import { ENLACES_PRINCIPALES, esRutaActiva, ID_MENU_MOVIL, textoReferencias } from "./navegacion";
import { urlWhatsAppDeRuta } from "./whatsapp";
import estilos from "./navbar.module.css";

// A partir de aquí el vidrio se vuelve más opaco.
const UMBRAL_VIDRIO = 40;
// Por encima de esta altura la barra de contacto se recoge al bajar y vuelve al subir.
const UMBRAL_BARRA = 120;
// Lenis entrega el desplazamiento en pasos muy finos: sin margen, la barra
// parpadearía con cualquier temblor del trackpad.
const SENSIBILIDAD = 6;

interface EstadoDesplazamiento {
  desplazado: boolean;
  barraOculta: boolean;
}

function useEstadoDesplazamiento(): EstadoDesplazamiento {
  const [estado, setEstado] = useState<EstadoDesplazamiento>({ desplazado: false, barraOculta: false });

  useEffect(() => {
    let ultimoY = window.scrollY;
    let frame = 0;

    const medir = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - ultimoY;
      const decide = y <= UMBRAL_BARRA || Math.abs(delta) >= SENSIBILIDAD;
      if (decide) ultimoY = y;

      setEstado((previo) => {
        const desplazado = y > UMBRAL_VIDRIO;
        const barraOculta = y <= UMBRAL_BARRA ? false : decide ? delta > 0 : previo.barraOculta;
        return previo.desplazado === desplazado && previo.barraOculta === barraOculta
          ? previo
          : { desplazado, barraOculta };
      });
    };

    const pedirFotograma = () => {
      frame ||= requestAnimationFrame(medir);
    };

    // Una página recargada a media altura arranca ya desplazada.
    pedirFotograma();
    window.addEventListener("scroll", pedirFotograma, { passive: true });
    return () => {
      window.removeEventListener("scroll", pedirFotograma);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return estado;
}

function BarraContacto({ urlWhatsApp }: { urlWhatsApp: string }) {
  return (
    <div className="flex h-7 items-center justify-center gap-3 border-b border-brand/10 px-4 text-[10px] sm:px-5 lg:justify-between">
      <p className="hidden items-center gap-2 font-semibold uppercase tracking-[0.22em] text-zinc-600 lg:flex">
        <span aria-hidden="true" className="size-1.5 bg-accent" />
        {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento} · Cobertura nacional
      </p>
      <div className="flex min-w-0 items-center gap-3">
        <span className="hidden font-semibold uppercase tracking-widest text-brand sm:inline">Contacto directo:</span>
        <a
          href={urlWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-semibold text-brand decoration-accent decoration-2 underline-offset-2 transition-colors hover:text-brand-deep hover:underline"
        >
          WhatsApp
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
        <span aria-hidden="true" className="select-none text-zinc-300">
          |
        </span>
        <a
          href={`mailto:${COMPANIA_INFO.email}`}
          className="truncate text-zinc-600 decoration-accent decoration-2 underline-offset-2 transition-colors hover:text-brand hover:underline"
        >
          {COMPANIA_INFO.email}
        </a>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { desplazado, barraOculta } = useEstadoDesplazamiento();
  const { total, hidratado } = useCotizacion();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Volver atrás con el menú abierto también lo cierra, no solo pulsar un enlace.
  const [rutaDelMenu, setRutaDelMenu] = useState(pathname);
  if (rutaDelMenu !== pathname) {
    setRutaDelMenu(pathname);
    setMenuAbierto(false);
  }

  // Al hidratar, la lista guardada aparece de golpe: eso no es una acción del
  // visitante y no debe latir ni anunciarse. Solo cuentan los cambios posteriores.
  const [seguimiento, setSeguimiento] = useState({ total, hidratado, pulsos: 0, cambios: 0 });
  if (seguimiento.total !== total || seguimiento.hidratado !== hidratado) {
    const delVisitante = seguimiento.hidratado && hidratado;
    setSeguimiento({
      total,
      hidratado,
      pulsos: seguimiento.pulsos + (delVisitante && total > seguimiento.total ? 1 : 0),
      cambios: seguimiento.cambios + (delVisitante ? 1 : 0),
    });
  }
  const anuncio =
    seguimiento.cambios === 0
      ? ""
      : total === 0
        ? "Su lista de cotización está vacía."
        : `Su lista de cotización tiene ${textoReferencias(total)}.`;

  // El menú móvil no tiene sentido en escritorio: si la ventana crece, se cierra.
  useEffect(() => {
    const escritorio = window.matchMedia("(min-width: 1024px)");
    const alCambiar = (evento: MediaQueryListEvent) => {
      if (evento.matches) setMenuAbierto(false);
    };
    escritorio.addEventListener("change", alCambiar);
    return () => escritorio.removeEventListener("change", alCambiar);
  }, []);

  const urlWhatsApp = urlWhatsAppDeRuta(pathname);

  return (
    <MotionConfig reducedMotion="user">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-55 px-4 pt-4 sm:px-6">
        <div
          className={cn(
            "pointer-events-auto mx-auto max-w-6xl rounded-[4px] transition-[background-color,box-shadow,border-color] duration-500",
            desplazado ? "glass-strong" : "glass"
          )}
        >
          {/* Se recoge al bajar y vuelve al subir; recogida queda inerte para que
              el tabulador no entre en enlaces que no se ven. */}
          <div
            inert={barraOculta}
            className={cn(
              "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
              barraOculta ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <BarraContacto urlWhatsApp={urlWhatsApp} />
            </div>
          </div>

          <div className="flex h-14 items-center justify-between gap-3 px-3 sm:h-16 sm:px-5">
            <Link
              href="/"
              data-inicio-sitio=""
              aria-label={`${COMPANIA_INFO.nombre}, ir al inicio`}
              className="flex shrink-0 items-center gap-3 rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <Logo ancho={56} />
              <span
                aria-hidden="true"
                className="hidden border-l border-zinc-200 pl-3 text-[9px] font-semibold uppercase leading-[1.7] tracking-[0.22em] text-zinc-500 xl:block"
              >
                Railway Solutions &amp; Supply
                <br />
                GAVICOM Energy
              </span>
            </Link>

            <nav aria-label="Principal" className="hidden lg:block">
              <ul className="flex items-center gap-1 xl:gap-2">
                {ENLACES_PRINCIPALES.map((enlace) => {
                  const activo = esRutaActiva(pathname, enlace.href);
                  return (
                    <li key={enlace.href}>
                      <Link
                        href={enlace.href}
                        aria-current={activo ? "page" : undefined}
                        className={cn(
                          estilos.enlace,
                          "group/enlace relative flex items-center whitespace-nowrap rounded-[2px] px-3 py-2 text-[13px] font-medium tracking-wide text-zinc-600 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[current=page]:text-brand"
                        )}
                      >
                        <span className={estilos.rodillo} data-texto={enlace.etiqueta}>
                          <span className={estilos.rodilloTexto}>{enlace.etiqueta}</span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-3 bottom-0.5 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/enlace:scale-x-100 motion-reduce:transition-none"
                        />
                        {/* El subrayado de la página actual se desliza hasta la nueva al navegar. */}
                        {activo && (
                          <motion.span
                            layoutId="navbar-subrayado-activo"
                            aria-hidden="true"
                            className="absolute inset-x-3 bottom-0.5 h-0.5 bg-accent"
                            transition={{ type: "spring", stiffness: 420, damping: 36 }}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-3">
              <BotonCotizar total={total} pulsos={seguimiento.pulsos} activo={pathname === "/cotizar"} />

              <span aria-hidden="true" className="hidden h-6 w-px bg-zinc-200 sm:block lg:hidden" />

              <button
                type="button"
                onClick={() => setMenuAbierto(true)}
                aria-label="Abrir menú"
                aria-haspopup="dialog"
                aria-expanded={menuAbierto}
                aria-controls={ID_MENU_MOVIL}
                className="group/menu -mr-1 flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded-[4px] px-2 text-brand transition-colors hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-3 lg:hidden"
              >
                <span aria-hidden="true" className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] sm:inline">
                  Menú
                </span>
                <span aria-hidden="true" className="flex w-5 flex-col items-end gap-[5px]">
                  <span className="h-[1.5px] w-5 bg-current" />
                  <span className="h-[1.5px] w-3 bg-current transition-[width] duration-300 group-hover/menu:w-5 motion-reduce:transition-none" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MenuMovil
        abierto={menuAbierto}
        alCerrar={() => setMenuAbierto(false)}
        ruta={pathname}
        barraOculta={barraOculta}
        total={total}
        pulsos={seguimiento.pulsos}
        urlWhatsApp={urlWhatsApp}
      />

      {/* Los botones "Agregar a cotización" no dicen cuántas referencias van: lo dice esta región. */}
      <p role="status" className="sr-only">
        {anuncio}
      </p>
    </MotionConfig>
  );
}
