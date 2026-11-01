"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/*
 * Home hero: a real-looking seagull flight, scrubbed by scroll. The clips are
 * encoded with a keyframe on every frame (-g 1) so seeking to any point is
 * instant; without that, scrubbing stutters on phones.
 */

// Windows of scroll progress, matched to the 20 s clip: wide shot (0-4 s),
// close-up (4-7 s), wide again, then the flight over the railway (10-20 s).
const CAPITULOS = [
  { de: 0, a: 0.15 },
  { de: 0.21, a: 0.33 },
  { de: 0.56, a: 0.78 },
  { de: 0.86, a: 1.01 },
];

const opacidad = (p: number, de: number, a: number) => {
  const borde = 0.05;
  if (p < de - borde || p > a + borde) return 0;
  if (p < de) return (p - (de - borde)) / borde;
  if (p > a) return 1 - (p - a) / borde;
  return 1;
};

export default function VideoVuelo() {
  const seccion = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const capas = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cont = seccion.current, v = video.current;
    if (!cont || !v) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let id = 0, objetivo = 0, actual = 0, visible = true;

    // iOS only lets a muted inline video seek once it has started playing.
    const desbloquear = () => {
      v.play().then(() => v.pause()).catch(() => {});
    };
    desbloquear();

    const leer = () => {
      const r = cont.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      objetivo = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 0;
    };
    const pintar = () => {
      id = requestAnimationFrame(pintar);
      if (!visible) return;
      actual += (objetivo - actual) * (quieto ? 1 : 0.12);
      if (v.duration && Number.isFinite(v.duration)) {
        const t = actual * (v.duration - 0.05);
        if (Math.abs(v.currentTime - t) > 1 / 30) v.currentTime = t;
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
    leer();
    id = requestAnimationFrame(pintar);
    window.addEventListener("scroll", leer, { passive: true });
    window.addEventListener("touchstart", desbloquear, { once: true, passive: true });
    return () => {
      cancelAnimationFrame(id);
      io.disconnect();
      window.removeEventListener("scroll", leer);
    };
  }, []);

  return (
    <section ref={seccion} aria-label="La gaviota de GAVICOM en vuelo" className="relative h-[640vh] bg-azul">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <video
          ref={video}
          muted
          playsInline
          preload="auto"
          poster="/video/gaviota-poster.jpg"
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* WebM first (lighter in Chrome and Android), MP4 for Safari. */}
          <source src="/video/gaviota-vertical.webm" type="video/webm" media="(max-aspect-ratio: 4/5)" />
          <source src="/video/gaviota-vertical.mp4" type="video/mp4" media="(max-aspect-ratio: 4/5)" />
          <source src="/video/gaviota-1280.webm" type="video/webm" />
          <source src="/video/gaviota-1280.mp4" type="video/mp4" />
        </video>
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
