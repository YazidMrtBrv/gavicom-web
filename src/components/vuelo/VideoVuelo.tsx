"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/*
 * Home hero: a real-looking seagull flight, scrubbed by scroll. Instead of
 * seeking a <video> (which stutters, above all on iPhone, because every seek
 * makes the browser decode again), the clip is a sequence of WebP frames drawn
 * on a canvas. Between two frames the next one is blended in by the fraction
 * left over, so the motion stays continuous however slowly the page scrolls.
 */

const TOTAL = 450; // 30 s at 15 fps
const SERIES = { h: "/video/cuadros/h/", v: "/video/cuadros/v/" };
const nombre = (i: number) => String(i + 1).padStart(3, "0") + ".webp";

// Coarse frames first (every 16th, then 8th...) so the whole flight can be
// scrubbed early and the gaps fill in while the visitor reads the headline.
const ordenCarga = () => {
  const visto = new Set<number>(), orden: number[] = [];
  for (const paso of [16, 8, 4, 2, 1])
    for (let i = 0; i < TOTAL; i += paso) if (!visto.has(i)) { visto.add(i); orden.push(i); }
  if (!visto.has(TOTAL - 1)) orden.splice(1, 0, TOTAL - 1);
  return orden;
};

// Windows of scroll progress, matched to the 30 s clip: sky (0-10 s, with a
// close-up at 4-7 s), the flight over the railway (10-20 s) and the landing
// on the rail (20-30 s), where it stays perched for the last chapter.
const CAPITULOS = [
  { de: 0, a: 0.1 },
  { de: 0.15, a: 0.22 },
  { de: 0.4, a: 0.6 },
  { de: 0.72, a: 0.84 },
  { de: 0.9, a: 1.01 },
];

const opacidad = (p: number, de: number, a: number) => {
  const borde = 0.03;
  if (p < de - borde || p > a + borde) return 0;
  if (p < de) return (p - (de - borde)) / borde;
  if (p > a) return 1 - (p - a) / borde;
  return 1;
};

export default function VideoVuelo() {
  const seccion = useRef<HTMLElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const capas = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cont = seccion.current, cv = lienzo.current;
    const ctx = cv?.getContext("2d");
    if (!cont || !cv || !ctx) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const serie = window.matchMedia("(max-aspect-ratio: 4/5)").matches ? SERIES.v : SERIES.h;
    const cuadros: (HTMLImageElement | null)[] = new Array(TOTAL).fill(null);
    let id = 0, objetivo = 0, actual = -1, pintado = -1, visible = true, vivo = true;

    // Up to six downloads at a time; each frame is decoded before it is used
    // so drawing never waits on the decoder.
    const cola = ordenCarga();
    const bajar = () => {
      const i = cola.shift();
      if (i === undefined || !vivo) return;
      const img = new Image();
      img.src = serie + nombre(i);
      img.decode().then(() => { cuadros[i] = img; pintado = -1; }).catch(() => {}).finally(bajar);
    };
    for (let k = 0; k < 6; k++) bajar();

    // Nearest frame already loaded, looking back first so the motion never
    // jumps ahead of the scroll.
    const cercano = (i: number) => {
      for (let d = 0; d < TOTAL; d++) {
        if (i - d >= 0 && cuadros[i - d]) return i - d;
        if (i + d < TOTAL && cuadros[i + d]) return i + d;
      }
      return -1;
    };

    const ajustar = () => {
      // Never draw at more pixels than the frames have: past that it only
      // costs GPU time on large screens without adding detail.
      const tope = serie === SERIES.v ? 840 : 1280;
      const dpr = Math.min(window.devicePixelRatio || 1, 2, tope / Math.max(1, cv.clientWidth));
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      pintado = -1;
    };
    // Like object-fit: cover.
    const dibujar = (img: HTMLImageElement) => {
      const e = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
      const w = img.naturalWidth * e, h = img.naturalHeight * e;
      ctx.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
    };

    const leer = () => {
      const r = cont.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      objetivo = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 0;
    };
    const pintar = () => {
      id = requestAnimationFrame(pintar);
      if (!visible) return;
      actual = actual < 0 || quieto ? objetivo : actual + (objetivo - actual) * 0.14;
      if (Math.abs(objetivo - actual) < 0.00005) actual = objetivo;

      const pos = actual * (TOTAL - 1);
      const llave = Math.round(pos * 100);
      if (llave !== pintado) {
        const base = Math.floor(pos), frac = pos - base;
        const a = cercano(base);
        if (a >= 0) {
          ctx.globalAlpha = 1;
          dibujar(cuadros[a]!);
          const sig = cuadros[base + 1];
          if (a === base && sig && frac > 0.01) {
            ctx.globalAlpha = frac;
            dibujar(sig);
            ctx.globalAlpha = 1;
          }
          pintado = llave;
        }
      }

      capas.current.forEach((el, i) => {
        if (!el) return;
        const o = opacidad(actual, CAPITULOS[i].de, CAPITULOS[i].a);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(1 - o) * 24}px, 0)`;
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
      });
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cont);
    ajustar();
    leer();
    id = requestAnimationFrame(pintar);
    window.addEventListener("scroll", leer, { passive: true });
    window.addEventListener("resize", ajustar);
    return () => {
      vivo = false;
      cancelAnimationFrame(id);
      io.disconnect();
      window.removeEventListener("scroll", leer);
      window.removeEventListener("resize", ajustar);
    };
  }, []);

  return (
    <section ref={seccion} aria-label="La gaviota de GAVICOM en vuelo" className="relative h-[900vh] bg-azul">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* The poster shows until the first frames arrive. */}
        <picture>
          <source srcSet="/video/gaviota-poster-vertical.jpg" media="(max-aspect-ratio: 4/5)" />
          <img src="/video/gaviota-poster.jpg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
        </picture>
        <canvas ref={lienzo} aria-hidden className="absolute inset-0 w-full h-full" />
        {/* The railway shots have a pale sky: keep the white menu readable. */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(12,38,66,0.65)_0%,rgba(12,38,66,0)_100%)]" />
        {/* Darkens the left and bottom just enough for white text on a bright sky. */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgba(12,38,66,0.75)_0%,rgba(12,38,66,0.1)_45%,rgba(12,38,66,0)_70%)] md:bg-[linear-gradient(90deg,rgba(12,38,66,0.7)_0%,rgba(12,38,66,0.25)_40%,rgba(12,38,66,0)_60%)]" />

        <div className="absolute inset-0 pointer-events-none">
          {/* At the start the gull fills the lower left, so on wide screens the
              headline sits top right, over open sky. */}
          <div ref={(el) => { capas.current[0] = el; }} className="absolute inset-0 flex items-end md:items-start pb-[12vh] md:pb-0 md:pt-[17vh]">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:flex md:flex-col md:items-end md:text-right">
              <h1 className="text-white text-[44px] leading-[1.02] sm:text-6xl md:text-7xl font-bold tracking-tight max-w-xl lg:max-w-2xl">
                Todo lo que la vía férrea necesita.
              </h1>
              <p className="mt-5 text-white/85 text-lg md:text-xl max-w-lg">
                Materiales, herramientas y servicios desde Barranquilla, para proyectos en todo el país.
              </p>
              <p className="mt-10 text-white/70 text-sm tracking-wide flex items-center gap-3 md:flex-row-reverse">
                <span className="inline-block h-10 w-px bg-white/60 animate-[bajar_1.8s_ease-in-out_infinite]" aria-hidden />
                Sigue a la gaviota
              </p>
            </div>
          </div>

          <div ref={(el) => { capas.current[1] = el; }} className="absolute inset-0 flex items-end pb-[12vh]" style={{ opacity: 0 }}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <p className="text-white font-titulo font-bold text-4xl md:text-6xl max-w-2xl leading-tight">Mirada de cerca, visión de conjunto.</p>
              <p className="mt-3 text-white/85 text-lg max-w-md">Del clip elástico al corredor completo: suministro, servicio técnico y topografía con dron.</p>
            </div>
          </div>

          <div ref={(el) => { capas.current[2] = el; }} className="absolute inset-0 flex items-end pb-[12vh]" style={{ opacity: 0 }}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <p className="text-white font-titulo font-bold text-4xl md:text-6xl max-w-2xl leading-tight">Desde arriba se ve la vía completa.</p>
              <p className="mt-3 text-white/85 text-lg max-w-md">Fijaciones, herramientas de vía, señalización y servicio técnico para construir y mantener corredores férreos.</p>
            </div>
          </div>

          <div ref={(el) => { capas.current[3] = el; }} className="absolute inset-0 flex items-end pb-[12vh]" style={{ opacity: 0 }}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <p className="text-white font-titulo font-bold text-4xl md:text-6xl max-w-2xl leading-tight">Y de cerca, cada pieza cuenta.</p>
              <p className="mt-3 text-white/85 text-lg max-w-md">Eclisas, clips, placas de asiento y tirafondos con ficha técnica y código.</p>
            </div>
          </div>

          <div ref={(el) => { capas.current[4] = el; }} className="absolute inset-0 flex items-end pb-[12vh]" style={{ opacity: 0 }}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 flex flex-col items-start gap-5">
              <p className="text-white font-titulo font-bold text-4xl md:text-6xl max-w-2xl leading-tight">Ferroviario y energía solar.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/catalogo" className="inline-flex items-center min-h-12 px-6 rounded bg-white text-azul font-semibold hover:bg-azul-suave">
                  Ver catálogo
                </Link>
                <Link href="/energy" className="inline-flex items-center min-h-12 px-6 rounded border border-white/70 text-white font-semibold hover:bg-white/10">
                  GAVICOM Energy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
