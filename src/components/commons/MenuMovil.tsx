"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import Logo from "@/components/marca/Logo";
import Boton from "@/components/ui/Boton";
import { COMPANIA_INFO } from "@/constants/productos";
import { cn } from "@/lib/cn";
import BotonCotizar from "./BotonCotizar";
import { dosCifras, ENLACES_PRINCIPALES, esRutaActiva, ID_MENU_MOVIL } from "./navegacion";

const CURVA_SUAVE = "cubic-bezier(0.16, 1, 0.3, 1)";
const CURVA_SALIDA = "cubic-bezier(0.7, 0, 0.84, 0)";

const RETICULA =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.035)_1px,transparent_1px)] bg-size-[32px_32px]";

// El telón baja desde el menú y las filas suben una tras otra. Va con la Web
// Animations API porque el <dialog> cerrado no existe en pantalla: no hay un
// estado inicial oculto que pueda quedarse pegado en el HTML.
function animarEntrada(dialogo: HTMLDialogElement): Animation[] {
  const telon = dialogo.animate(
    [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }],
    { duration: 560, easing: CURVA_SUAVE }
  );
  const piezas = Array.from(dialogo.querySelectorAll<HTMLElement>("[data-entrada]"), (pieza, i) =>
    pieza.animate(
      [
        { opacity: 0, transform: "translateY(18px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 620, delay: 160 + i * 60, easing: CURVA_SUAVE, fill: "backwards" }
    )
  );
  return [telon, ...piezas];
}

interface MenuMovilProps {
  abierto: boolean;
  alCerrar: () => void;
  ruta: string;
  /** La barra de contacto del menú está recogida: el logo y el botón suben con ella. */
  barraOculta: boolean;
  total: number;
  pulsos: number;
  urlWhatsApp: string;
}

/*
 * Menú del móvil como <dialog> modal: el navegador atrapa el foco, deja inerte
 * el resto de la página y lo devuelve al botón que lo abrió al cerrar. Repite
 * la fila del logo exactamente donde está la del menú fijo, así que al abrir
 * solo cambia el fondo y el botón pasa a ser "Cerrar".
 */
export default function MenuMovil({
  abierto,
  alCerrar,
  ruta,
  barraOculta,
  total,
  pulsos,
  urlWhatsApp,
}: MenuMovilProps) {
  const dialogoRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogo = dialogoRef.current;
    if (!dialogo) return;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (abierto) {
      if (!dialogo.open) dialogo.showModal();
      // Arranca en la página actual (o en la primera): desde ahí se recorre el menú.
      const destino =
        dialogo.querySelector<HTMLElement>('[aria-current="page"]') ??
        dialogo.querySelector<HTMLElement>("[data-enlace-menu]");
      destino?.focus();

      // El modal no bloquea el desplazamiento de la página de fondo.
      const raiz = document.documentElement;
      const overflowPrevio = raiz.style.overflow;
      raiz.style.overflow = "hidden";
      const animaciones = reducido ? [] : animarEntrada(dialogo);

      return () => {
        raiz.style.overflow = overflowPrevio;
        animaciones.forEach((animacion) => animacion.cancel());
      };
    }

    if (!dialogo.open) return;
    if (reducido) {
      dialogo.close();
      return;
    }
    const salida = dialogo.animate(
      [{ clipPath: "inset(0 0 0% 0)" }, { clipPath: "inset(0 0 100% 0)" }],
      { duration: 380, easing: CURVA_SALIDA, fill: "forwards" }
    );
    salida.finished.then(
      () => {
        dialogo.close();
        // Sin esto el último fotograma (recogido) se quedaría aplicado al volver a abrir.
        salida.cancel();
      },
      () => {}
    );
  }, [abierto]);

  return (
    <dialog
      ref={dialogoRef}
      id={ID_MENU_MOVIL}
      aria-label="Menú del sitio"
      // Lenis no debe mover la página de fondo con la rueda mientras el menú está abierto.
      data-lenis-prevent=""
      onCancel={(evento) => {
        // Esc: se cierra con la misma animación que el botón.
        evento.preventDefault();
        alCerrar();
      }}
      onClose={alCerrar}
      className="m-0 size-full max-h-none max-w-none overflow-y-auto overscroll-contain border-0 bg-brand-deep p-0 text-white backdrop:bg-transparent"
    >
      <div className="relative min-h-full">
        <div aria-hidden="true" className={RETICULA} />

        <div className="relative mx-auto max-w-6xl px-4 pt-4 sm:px-6">
          {/* Mismo alto que la tarjeta del menú fijo (incluido su borde de 1 px). */}
          <div className="border border-transparent">
            {!barraOculta && (
              <p className="flex h-7 items-center justify-center gap-2 border-b border-white/10 px-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300 sm:px-5">
                <span aria-hidden="true" className="size-1.5 bg-accent" />
                {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento} · Cobertura nacional
              </p>
            )}
            <div className="flex h-14 items-center justify-between gap-3 px-3 sm:h-16 sm:px-5">
              <Link
                href="/"
                onClick={alCerrar}
                aria-label={`${COMPANIA_INFO.nombre}, ir al inicio`}
                className="rounded-[4px] p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Logo variante="blanco" ancho={56} />
              </Link>
              <button
                type="button"
                onClick={alCerrar}
                aria-label="Cerrar menú"
                className="-mr-1 flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded-[4px] px-2 text-white transition-colors hover:text-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-3"
              >
                <span aria-hidden="true" className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] sm:inline">
                  Cerrar
                </span>
                <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <nav aria-label="Principal" className="mt-6 px-3 sm:mt-10 sm:px-5">
            <ol className="border-t border-white/10">
              {ENLACES_PRINCIPALES.map((enlace, i) => {
                const activo = esRutaActiva(ruta, enlace.href);
                return (
                  <li key={enlace.href} data-entrada="" className="border-b border-white/10">
                    <Link
                      href={enlace.href}
                      data-enlace-menu=""
                      aria-current={activo ? "page" : undefined}
                      onClick={alCerrar}
                      className="group flex items-center gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:gap-6 sm:py-5"
                    >
                      <span
                        aria-hidden="true"
                        className="w-6 shrink-0 self-start pt-2 text-[11px] font-semibold tracking-[0.2em] text-accent tabular-nums sm:pt-3"
                      >
                        {dosCifras(i + 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block font-titulo text-2xl font-semibold leading-tight tracking-tight text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 motion-reduce:transition-none sm:text-4xl",
                            activo && "underline decoration-accent decoration-2 underline-offset-8"
                          )}
                        >
                          {enlace.etiqueta}
                        </span>
                        <span className="mt-1.5 block text-xs leading-relaxed text-zinc-300 sm:text-sm">
                          {enlace.descripcion}
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="size-5 shrink-0 text-white/40 transition-[color,translate] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
                      />
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div data-entrada="" className="mt-10 flex flex-col gap-3 px-3 sm:flex-row sm:px-5">
            <BotonCotizar
              total={total}
              pulsos={pulsos}
              activo={ruta === "/cotizar"}
              etiqueta="Solicitar cotización"
              onClick={alCerrar}
              className="min-h-12"
            />
            <Boton href={urlWhatsApp} externo icono="whatsapp" variante="claro" className="min-h-12">
              WhatsApp comercial
            </Boton>
          </div>

          <dl data-entrada="" className="mt-10 grid gap-6 px-3 pb-12 text-sm sm:grid-cols-2 sm:px-5">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">Gerencia</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${COMPANIA_INFO.email}`}
                  className="break-all text-white underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent-strong"
                >
                  {COMPANIA_INFO.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">Sede</dt>
              <dd className="mt-2 text-white">
                {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento} · {COMPANIA_INFO.pais}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </dialog>
  );
}
