"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { IdPieza, Motor } from "./motor";

// What each part of the exploded joint is, and where its catalogue page is.
const PIEZAS: Record<IdPieza, { nombre: string; sku?: string }> = {
  riel: { nombre: "Riel" },
  eclisa: { nombre: "Eclisa 115 lb", sku: "GVC-AK-JB115" },
  perno: { nombre: "Pernos de cuello ovalado", sku: "GVC-AK-TB01" },
  placa: { nombre: "Placa de asiento", sku: "GVC-AK-TP03" },
  almohadilla: { nombre: "Almohadilla elástica", sku: "GVC-AD-RP02" },
  clip: { nombre: "Clip elástico", sku: "GVC-AD-E2055" },
  tirafondo: { nombre: "Tirafondo", sku: "GVC-AD-SS01" },
};
const enlace = (sku?: string) => (sku ? `/catalogo/${sku.toLowerCase()}` : "/catalogo");

// Chapters of the story, as windows of scroll progress (0..1).
const CAPITULOS = [
  { de: 0, a: 0.12, clase: "items-end md:items-center" },
  { de: 0.18, a: 0.4, clase: "items-end" },
  { de: 0.47, a: 0.62, clase: "items-end" },
  { de: 0.86, a: 1.01, clase: "items-start" },
];

const opacidad = (p: number, de: number, a: number) => {
  const borde = 0.04;
  if (p < de - borde || p > a + borde) return 0;
  if (p < de) return (p - (de - borde)) / borde;
  if (p > a) return 1 - (p - a) / borde;
  return 1;
};

export default function Vuelo() {
  const seccion = useRef<HTMLElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const etiquetas = useRef<Partial<Record<IdPieza, HTMLAnchorElement | null>>>({});
  const capas = useRef<(HTMLDivElement | null)[]>([]);
  const [listo, setListo] = useState(false);
  const [sinWebgl, setSinWebgl] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cont = seccion.current, canvas = lienzo.current;
    if (!cont || !canvas) return;
    let motor: Motor | null = null;
    let cuadroId = 0;
    let visible = true;
    let cancelado = false;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const movil = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    let objetivo = 0, actual = 0;
    const puntero = { x: 0, y: 0 }, punteroSuave = { x: 0, y: 0 };
    let encima: IdPieza | null = null;

    const leerProgreso = () => {
      const r = cont.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      objetivo = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 0;
    };
    const medir = () => motor?.redimensionar(canvas.clientWidth, canvas.clientHeight);

    const pintar = (t: number) => {
      cuadroId = requestAnimationFrame(pintar);
      if (!motor || !visible) return;
      // Ease toward the scroll position so the flight glides instead of jumping.
      actual += (objetivo - actual) * (quieto ? 1 : 0.075);
      punteroSuave.x += (puntero.x - punteroSuave.x) * 0.05;
      punteroSuave.y += (puntero.y - punteroSuave.y) * 0.05;
      motor.cuadro(actual, punteroSuave, t / 1000);
      capas.current.forEach((el, i) => {
        if (!el) return;
        const o = opacidad(actual, CAPITULOS[i].de, CAPITULOS[i].a);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(1 - o) * 18}px, 0)`;
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
      });
      for (const a of motor.anclas()) {
        const el = etiquetas.current[a.id];
        if (!el) continue;
        el.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)`;
        el.style.opacity = a.visible ? "1" : "0";
        el.style.pointerEvents = a.visible ? "auto" : "none";
        el.tabIndex = a.visible ? 0 : -1;
        el.dataset.activa = String(encima === a.id);
      }
    };

    (async () => {
      try {
        const { crearMotor } = await import("./motor");
        if (cancelado) return;
        motor = crearMotor(canvas, { movil, quieto });
        medir();
        leerProgreso();
        actual = objetivo;
        setListo(true);
        cuadroId = requestAnimationFrame(pintar);
      } catch {
        // No WebGL (old phone, blocked GPU): the text chapters still tell the story.
        setSinWebgl(true);
      }
    })();

    const alMover = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      puntero.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      puntero.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (motor && e.pointerType === "mouse") {
        const id = motor.elegir(e.clientX - r.left, e.clientY - r.top);
        if (id !== encima) {
          encima = id;
          motor.resaltar(id);
          canvas.style.cursor = id ? "pointer" : "";
        }
      }
    };
    const alTocar = (e: MouseEvent) => {
      if (!motor) return;
      const r = canvas.getBoundingClientRect();
      const id = motor.elegir(e.clientX - r.left, e.clientY - r.top);
      if (id) router.push(enlace(PIEZAS[id].sku));
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(cont);
    window.addEventListener("scroll", leerProgreso, { passive: true });
    window.addEventListener("resize", medir);
    window.addEventListener("pointermove", alMover, { passive: true });
    canvas.addEventListener("click", alTocar);
    return () => {
      cancelado = true;
      cancelAnimationFrame(cuadroId);
      io.disconnect();
      window.removeEventListener("scroll", leerProgreso);
      window.removeEventListener("resize", medir);
      window.removeEventListener("pointermove", alMover);
      canvas.removeEventListener("click", alTocar);
      motor?.destruir();
    };
  }, [router]);

  return (
    <section ref={seccion} aria-label="El vuelo de la gaviota sobre la vía" className="relative h-[560vh] bg-azul">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* The sky gradient shows at once; the 3D scene fades in over it. */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#0c2642_0%,#1d4469_45%,#c9d6e4_100%)]" />
        <canvas
          ref={lienzo}
          aria-hidden
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${listo ? "opacity-100" : "opacity-0"}`}
        />

        <div className="absolute inset-0 pointer-events-none">
          <div ref={(el) => { capas.current[0] = el; }} className={`absolute inset-0 flex ${CAPITULOS[0].clase} pb-[14vh] md:pb-0`}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <h1 className="text-white text-[44px] leading-[1.02] sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-4xl">
                Todo lo que la vía férrea necesita.
              </h1>
              <p className="mt-5 text-white/85 text-lg md:text-xl max-w-xl">
                Materiales, herramientas y servicios desde Barranquilla, para proyectos en todo el país.
              </p>
              <p className="mt-10 text-white/70 text-sm tracking-wide flex items-center gap-3">
                <span className="inline-block h-10 w-px bg-white/50 origin-top animate-[bajar_1.8s_ease-in-out_infinite]" aria-hidden />
                Sigue a la gaviota
              </p>
            </div>
          </div>

          <div ref={(el) => { capas.current[1] = el; }} className={`absolute inset-0 flex ${CAPITULOS[1].clase} pb-[10vh]`} style={{ opacity: 0 }}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <p className="text-white text-3xl md:text-5xl font-titulo font-bold max-w-2xl leading-tight drop-shadow-[0_2px_18px_rgba(12,38,66,0.6)]">
                Desde arriba se ve la vía completa.
              </p>
              <p className="mt-3 text-white/85 text-base md:text-lg max-w-lg drop-shadow-[0_1px_10px_rgba(12,38,66,0.7)]">
                Suministro, topografía con dron y mantenimiento para corredores férreos.
              </p>
            </div>
          </div>

          <div ref={(el) => { capas.current[2] = el; }} className={`absolute inset-0 flex ${CAPITULOS[2].clase} pb-[10vh]`} style={{ opacity: 0 }}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <p className="text-white text-3xl md:text-5xl font-titulo font-bold max-w-2xl leading-tight drop-shadow-[0_2px_18px_rgba(12,38,66,0.7)]">
                Y de cerca, cada pieza cuenta.
              </p>
            </div>
          </div>

          <div ref={(el) => { capas.current[3] = el; }} className={`absolute inset-0 flex ${CAPITULOS[3].clase} pt-[88px]`} style={{ opacity: 0 }}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <div className="inline-flex flex-col gap-3 items-start rounded bg-azul/85 backdrop-blur-sm p-5 md:p-6 max-w-md">
              <p className="text-white text-2xl md:text-4xl font-titulo font-bold leading-tight">
                Así se arma una vía.
              </p>
              <p className="text-white/85 text-base md:text-lg max-w-md">Toca una pieza para ver su ficha y agregarla a tu cotización.</p>
              <Link href="/catalogo" className="mt-1 inline-flex items-center min-h-12 px-6 rounded bg-white text-azul font-semibold hover:bg-azul-suave">
                Ver todo el catálogo
              </Link>
              </div>
            </div>
          </div>

          {(Object.keys(PIEZAS) as IdPieza[]).map((id) => (
            <Link
              key={id}
              href={enlace(PIEZAS[id].sku)}
              ref={(el) => { etiquetas.current[id] = el; }}
              tabIndex={-1}
              data-activa="false"
              className="group absolute left-0 top-0 -translate-y-1/2 opacity-0 transition-opacity duration-300 will-change-transform"
            >
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white ring-4 ring-white/25 group-data-[activa=true]:ring-white/60" />
                <span className="h-px w-6 bg-white/60" />
                <span className="rounded bg-white/95 text-azul px-2.5 py-1.5 text-xs shadow-lg group-hover:bg-white group-data-[activa=true]:bg-white">
                  <span className="block font-semibold text-[13px] leading-tight whitespace-nowrap">{PIEZAS[id].nombre}</span>
                  {PIEZAS[id].sku && <span className="block font-mono text-[10px] text-azul/70">{PIEZAS[id].sku}</span>}
                </span>
              </span>
            </Link>
          ))}
        </div>

        {sinWebgl && (
          <p className="absolute bottom-4 left-4 right-4 text-white/70 text-sm">Tu navegador no muestra la animación en 3D. Todo el catálogo está más abajo.</p>
        )}
      </div>
    </section>
  );
}
