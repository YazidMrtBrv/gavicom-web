"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/*
 * Home hero: the seagull flight as a trailer. The 30 s clip plays on its own
 * at normal speed, in a loop, and the text of each scene follows the video's
 * clock, not the scroll, so they can never drift apart and the page scrolls
 * freely. Scrubbing it with the scroll was tried and dropped: slowed down, a
 * generated video shows its flaws.
 */

// Scenes of the clip, in seconds: sky, close-up, the railway from above, the
// landing and the gull perched on the rail.
const ESCENAS = [
  { de: 0, a: 4.4, nombre: "Cielo" },
  { de: 4.4, a: 10, nombre: "De cerca" },
  { de: 10, a: 20, nombre: "La vía" },
  { de: 20, a: 26.2, nombre: "Aterrizaje" },
  { de: 26.2, a: 30, nombre: "En el riel" },
];

const escenaEn = (t: number) => {
  for (let i = ESCENAS.length - 1; i >= 0; i--) if (t >= ESCENAS[i].de) return i;
  return 0;
};

export default function VideoVuelo() {
  const seccion = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const capas = useRef<(HTMLDivElement | null)[]>([]);
  const barras = useRef<(HTMLSpanElement | null)[]>([]);
  // Set when the visitor pauses: scrolling away and back must not restart it.
  const pausadoPorUsuario = useRef(false);
  const [pausado, setPausado] = useState(false);
  const [escena, setEscena] = useState(0);

  useEffect(() => {
    const cont = seccion.current, v = video.current;
    if (!cont || !v) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let id = 0, visible = true, ultima = -1;

    // With reduced motion the clip waits for the play button.
    if (quieto) pausadoPorUsuario.current = true;
    else v.play().catch(() => {});

    const pintar = () => {
      id = requestAnimationFrame(pintar);
      if (!visible) return;
      const t = v.currentTime;
      const i = escenaEn(t);
      if (i !== ultima) {
        ultima = i;
        setEscena(i);
        capas.current.forEach((el, k) => {
          if (!el) return;
          const on = k === i;
          el.style.opacity = on ? "1" : "0";
          el.style.transform = on ? "none" : "translate3d(0, 16px, 0)";
          el.style.pointerEvents = on ? "auto" : "none";
        });
      }
      barras.current.forEach((el, k) => {
        if (!el) return;
        const { de, a } = ESCENAS[k];
        const p = k < i ? 1 : k > i ? 0 : Math.min(1, (t - de) / (a - de));
        el.style.transform = `scaleX(${p})`;
      });
    };
    const sync = () => setPausado(v.paused);
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);

    // Off screen it stops, saving battery and data; back on screen it carries
    // on unless the visitor paused it.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) v.pause();
      else if (!pausadoPorUsuario.current) v.play().catch(() => {});
    });
    io.observe(cont);
    id = requestAnimationFrame(pintar);
    return () => {
      cancelAnimationFrame(id);
      io.disconnect();
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
    };
  }, []);

  const alternar = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      pausadoPorUsuario.current = false;
      v.play().catch(() => {});
    } else {
      pausadoPorUsuario.current = true;
      v.pause();
    }
  };
  const irA = (i: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = ESCENAS[i].de + 0.05;
    if (!pausadoPorUsuario.current) v.play().catch(() => {});
  };

  return (
    <section ref={seccion} aria-label="La gaviota de GAVICOM en vuelo" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-azul">
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="auto"
        poster="/video/gaviota-poster.jpg"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* WebM first (lighter in Chrome and Android), MP4 for Safari. */}
        <source src="/video/gaviota-ida-v.webm" type="video/webm" media="(max-aspect-ratio: 4/5)" />
        <source src="/video/gaviota-ida-v.mp4" type="video/mp4" media="(max-aspect-ratio: 4/5)" />
        <source src="/video/gaviota-ida.webm" type="video/webm" />
        <source src="/video/gaviota-ida.mp4" type="video/mp4" />
      </video>
      {/* Fine film grain and a soft vignette: they hide compression and the
          small flaws of generated footage. Static, so they cost nothing. */}
      <div aria-hidden className="grano absolute inset-0 pointer-events-none" />
      <div aria-hidden className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(12,38,66,0)_55%,rgba(12,38,66,0.45)_100%)]" />
      {/* The railway shots have a pale sky: keep the white menu readable. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(12,38,66,0.65)_0%,rgba(12,38,66,0)_100%)]" />
      {/* Darkens the left and bottom just enough for white text on a bright sky. */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgba(12,38,66,0.8)_0%,rgba(12,38,66,0.15)_50%,rgba(12,38,66,0)_70%)] md:bg-[linear-gradient(90deg,rgba(12,38,66,0.7)_0%,rgba(12,38,66,0.25)_40%,rgba(12,38,66,0)_60%),linear-gradient(0deg,rgba(12,38,66,0.6)_0%,rgba(12,38,66,0)_35%)]" />

      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-6 sm:pb-8">
          {/* The scene texts share one slot and cross-fade with the video. */}
          <div className="relative h-[200px] sm:h-[220px]">
            <div ref={(el) => { capas.current[0] = el; }} className="capa-vuelo absolute inset-x-0 bottom-0">
              <h1 className="text-white text-[42px] leading-[1.02] sm:text-6xl md:text-7xl font-bold tracking-tight max-w-xl lg:max-w-2xl">
                Todo lo que la vía férrea necesita.
              </h1>
              <p className="mt-4 text-white/85 text-lg md:text-xl max-w-lg">
                Materiales, herramientas y servicios desde Barranquilla, para proyectos en todo el país.
              </p>
            </div>
            {[
              ["Mirada de cerca, visión de conjunto.", "Del clip elástico al corredor completo: suministro, servicio técnico y topografía con dron."],
              ["Desde arriba se ve la vía completa.", "Fijaciones, herramientas de vía, señalización y servicio técnico para construir y mantener corredores férreos."],
              ["Y de cerca, cada pieza cuenta.", "Eclisas, clips, placas de asiento y tirafondos con ficha técnica y código."],
              ["Ferroviario y energía solar.", "Suministro para la vía férrea y sistemas fotovoltaicos con GAVICOM Energy."],
            ].map(([titulo, texto], k) => (
              <div key={titulo} ref={(el) => { capas.current[k + 1] = el; }} className="capa-vuelo absolute inset-x-0 bottom-0" style={{ opacity: 0 }}>
                <p className="text-white font-titulo font-bold text-4xl md:text-6xl max-w-2xl leading-tight">{titulo}</p>
                <p className="mt-3 text-white/85 text-lg max-w-md">{texto}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/catalogo" className="boton-iman inline-flex items-center min-h-12 px-6 rounded bg-white text-azul font-semibold hover:bg-azul-suave">
              Ver catálogo
            </Link>
            <Link href="/energy" className="boton-iman inline-flex items-center min-h-12 px-6 rounded border border-white/70 text-white font-semibold hover:bg-white/10">
              GAVICOM Energy
            </Link>
          </div>

          {/* Scene bar: shows where the flight is and jumps to any scene. */}
          <div className="mt-6 flex items-center gap-3 pr-16 sm:pr-0">
            <button
              type="button"
              onClick={alternar}
              aria-label={pausado ? "Reproducir el vuelo" : "Pausar el vuelo"}
              className="grid place-items-center size-11 shrink-0 rounded-full border border-white/50 text-white hover:bg-white/15"
            >
              {pausado ? <Play size={18} aria-hidden /> : <Pause size={18} aria-hidden />}
            </button>
            <ol className="flex-1 grid grid-cols-5 gap-2" aria-label="Escenas del vuelo">
              {ESCENAS.map((e, i) => (
                <li key={e.nombre}>
                  <button
                    type="button"
                    onClick={() => irA(i)}
                    aria-current={escena === i ? "step" : undefined}
                    className="group w-full min-h-11 flex flex-col justify-center gap-1.5 text-left"
                  >
                    <span className="relative block h-[3px] w-full overflow-hidden rounded bg-white/25">
                      <span ref={(el) => { barras.current[i] = el; }} className="absolute inset-0 origin-left bg-white" style={{ transform: "scaleX(0)" }} />
                    </span>
                    <span className={`hidden sm:block text-xs tracking-wide transition-colors ${escena === i ? "text-white" : "text-white/55 group-hover:text-white/85"}`}>
                      {e.nombre}
                    </span>
                    <span className="sr-only sm:hidden">{e.nombre}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
