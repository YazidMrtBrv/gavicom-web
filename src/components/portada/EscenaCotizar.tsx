"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TechFrame from "@/components/motion/TechFrame";
import { cn } from "@/lib/cn";
import estilos from "./portada.module.css";

gsap.registerPlugin(ScrollTrigger);

export interface PasoCotizar {
  numero: string;
  titulo: string;
  descripcion: string;
  /** Muestra decorativa del cotizador (se marca aria-hidden). */
  muestra: ReactNode;
}

interface EscenaCotizarProps {
  encabezado: ReactNode;
  accion: ReactNode;
  pasos: PasoCotizar[];
}

// Solo se ancla donde caben los tres pasos a la vez y nadie pidió menos
// movimiento; en el resto se ve como una lista normal.
const CONSULTA_ANCLAJE = "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";

/*
 * Mientras la sección está anclada, el scroll recorre los pasos: el riel baja
 * de estación en estación y cada paso pasa de gris a activo cuando el riel
 * llega a él. Todo el texto está en el HTML; sin JS, en móvil o con
 * movimiento reducido, los tres pasos se ven activos desde el principio.
 */
export default function EscenaCotizar({ encabezado, accion, pasos }: EscenaCotizarProps) {
  const escenaRef = useRef<HTMLDivElement>(null);
  const actualRef = useRef(0);
  const [actual, setActual] = useState(0);
  const total = pasos.length;

  useEffect(() => {
    const escena = escenaRef.current;
    if (!escena) return;

    // Si anclada no cabe entera en la pantalla (zoom del navegador, fuentes que
    // llegan tarde), el último paso quedaría fuera de vista. Se mide el
    // contenido y no la escena: anclada, GSAP le fija el alto.
    const cabe = () => {
      const contenido = escena.firstElementChild as HTMLElement | null;
      if (!contenido) return true;
      const estilo = getComputedStyle(escena);
      const alto = contenido.offsetHeight + parseFloat(estilo.paddingTop) + parseFloat(estilo.paddingBottom);
      return alto <= window.innerHeight + 1;
    };

    const medios = gsap.matchMedia();
    medios.add(CONSULTA_ANCLAJE, () => {
      // Atributo y no estado de React: tiene que estar en el DOM antes de que
      // ScrollTrigger mida la escena, que pasa a ocupar el alto de la pantalla.
      escena.dataset.anclado = "true";
      if (!cabe()) {
        delete escena.dataset.anclado;
        return;
      }
      escena.style.setProperty("--progreso", "0");

      const disparador = ScrollTrigger.create({
        trigger: escena,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 1.5)}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          escena.style.setProperty("--progreso", progress.toFixed(4));
          const indice = Math.min(total - 1, Math.floor(progress * total));
          if (indice !== actualRef.current) {
            actualRef.current = indice;
            setActual(indice);
          }
        },
      });

      // ScrollTrigger mide al crearse; si algo de más arriba cambia de alto
      // (fuentes que llegan tarde, contenido que se despliega), se vuelve a medir
      // para que el anclaje no arranque corrido; si la escena ya no cabe, se suelta.
      let espera = 0;
      const soltar = () => {
        observador.disconnect();
        window.clearTimeout(espera);
        disparador.kill();
        delete escena.dataset.anclado;
        escena.style.removeProperty("--progreso");
        actualRef.current = 0;
        setActual(0);
      };
      const observador = new ResizeObserver(() => {
        window.clearTimeout(espera);
        espera = window.setTimeout(() => {
          if (cabe()) ScrollTrigger.refresh();
          else soltar();
        }, 200);
      });
      observador.observe(document.body);
      // También el contenido: GSAP fija el alto del espaciador del anclaje y lo
      // que crece dentro de la escena no cambia el alto de la página.
      if (escena.firstElementChild) observador.observe(escena.firstElementChild);

      return soltar;
    });

    return () => medios.revert();
  }, [total]);

  return (
    <div ref={escenaRef} className={cn(estilos.escena, "bg-white py-24 lg:py-32")}>
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-12 xl:gap-16">
        <div className="lg:col-span-5">
          {encabezado}
          <div className="mt-10">{accion}</div>
        </div>

        <ol className="flex flex-col gap-4 lg:col-span-7" style={{ "--n": total } as CSSProperties}>
          {pasos.map((paso, i) => (
            <li
              key={paso.numero}
              data-activo={i <= actual ? "true" : "false"}
              data-actual={i === actual ? "true" : "false"}
              aria-labelledby={`paso-cotizar-${i}`}
              className={cn(estilos.paso, "relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 sm:gap-x-6")}
              style={{ "--i": i } as CSSProperties}
            >
              {/* Tramo de riel hasta la estación siguiente: traviesas en gris y
                  el relleno azul que avanza con el scroll. */}
              {i < total - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[21px] top-[22px] h-[calc(100%+1rem)] w-0.5 bg-[repeating-linear-gradient(to_bottom,#d4d4d8_0_6px,transparent_6px_10px)]"
                >
                  <span className={cn(estilos.tramoRelleno, "absolute inset-0 bg-brand")} />
                </span>
              )}

              <span
                aria-hidden="true"
                className={cn(
                  estilos.pasoNumero,
                  "relative z-10 flex size-11 items-center justify-center rounded-[2px] border border-brand-deep bg-brand-deep font-titulo text-sm font-semibold text-white tabular-nums"
                )}
              >
                {paso.numero}
              </span>

              <TechFrame
                className={cn(
                  estilos.pasoTarjeta,
                  "group rounded-[4px] border border-surface bg-surface p-5 sm:p-6"
                )}
              >
                <div className={cn(estilos.pasoCuerpo, "xl:grid xl:grid-cols-[minmax(0,1fr)_13.5rem] xl:items-center xl:gap-6")}>
                  <div>
                    <h3
                      id={`paso-cotizar-${i}`}
                      className={cn(estilos.pasoTitulo, "text-lg font-semibold leading-snug text-brand text-balance")}
                    >
                      {paso.titulo}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">{paso.descripcion}</p>
                  </div>
                  {/* En pantallas medianas se omite: es decorativa y la escena anclada tiene que caber entera. */}
                  <div aria-hidden="true" className={cn(estilos.pasoMuestra, "mt-5 lg:hidden xl:mt-0 xl:block")}>
                    {paso.muestra}
                  </div>
                </div>
              </TechFrame>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
