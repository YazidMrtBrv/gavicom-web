"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, MessageCircle, Pause, Play } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";

/*
 * Home hero: the seagull flight as a trailer. The 30 s clip plays on its own
 * at normal speed, in a loop, and the subtitle of each scene follows the
 * video's clock, not the scroll, so they can never drift apart and the page
 * scrolls freely. The headline itself never changes: it is what the visitor
 * must read in the first second, whatever the clip is showing.
 *
 * Loading: the server HTML only carries the poster (vertical or horizontal
 * through <picture>), so the first paint costs ~20 KB. The clip is attached
 * after the page has loaded and the browser is idle, and only plays on its
 * own when the visitor has not asked for less data or less motion and the
 * connection is not 3G or slower. Otherwise the poster stays with a button
 * that says how much the clip weighs.
 */

// One encoded file of the flight. `bytes` is read from disk on the server, so
// the "Ver el vuelo (X MB)" label always matches the real file.
export type FuenteVuelo = { src: string; tipo: string; vertical: boolean; bytes: number | null };

// Scenes of the clip, in seconds: sky, close-up, the railway from above, the
// landing and the gull perched on the rail.
const ESCENAS = [
  { de: 0, a: 4.4, nombre: "Cielo", texto: "Materiales, herramientas y servicios desde Barranquilla, para proyectos en todo el país." },
  { de: 4.4, a: 10, nombre: "De cerca", texto: "Del clip elástico al corredor completo: suministro, servicio técnico y topografía con dron." },
  { de: 10, a: 20, nombre: "La vía", texto: "Fijaciones, herramientas de vía, señalización y servicio técnico para construir y mantener corredores férreos." },
  { de: 20, a: 26.2, nombre: "Aterrizaje", texto: "Eclisas, clips, placas de asiento y tirafondos con ficha técnica y código." },
  { de: 26.2, a: 30, nombre: "En el riel", texto: "Suministro para la vía férrea y sistemas fotovoltaicos con GAVICOM Energy." },
];

const escenaEn = (t: number) => {
  for (let i = ESCENAS.length - 1; i >= 0; i--) if (t >= ESCENAS[i].de) return i;
  return 0;
};

const VERTICAL = "(max-aspect-ratio: 4/5)";
const WHATSAPP = `https://wa.me/${COMPANIA_INFO.whatsappSales.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hola GAVICOM, quiero cotizar materiales para vía férrea."
)}`;

const megas = (b: number) => `${(b / 1e6).toLocaleString("es-CO", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} MB`;

// Network Information API: Chromium only, so every field is optional.
type Conexion = { saveData?: boolean; effectiveType?: string };

// Autoplay only when it will not hurt: no reduced motion, no data saver and
// no slow connection. Browsers without the API (Safari, Firefox) are not
// penalised, since they give no signal either way.
function puedeReproducirSolo(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const c = (navigator as Navigator & { connection?: Conexion }).connection;
  if (c?.saveData === true) return false;
  if (c?.effectiveType && ["slow-2g", "2g", "3g"].includes(c.effectiveType)) return false;
  return true;
}

// The first file of the right orientation the browser can decode. Chosen here
// rather than with <source> so the weight shown on the button is the weight
// of the file that will actually download.
function elegirFuente(fuentes: FuenteVuelo[], v: HTMLVideoElement): FuenteVuelo | null {
  const vertical = window.matchMedia(VERTICAL).matches;
  return fuentes.find((f) => f.vertical === vertical && v.canPlayType(f.tipo) !== "") ?? null;
}

type Fase = "poster" | "cargando" | "video";

export default function VideoVuelo({ fuentes }: { fuentes: FuenteVuelo[] }) {
  const seccion = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const barras = useRef<(HTMLSpanElement | null)[]>([]);
  // Set when the visitor pauses: scrolling away and back must not restart it.
  const pausadoPorUsuario = useRef(false);
  const visible = useRef(true);
  const [pausado, setPausado] = useState(true);
  const [escena, setEscena] = useState(0);
  const [fase, setFase] = useState<Fase>("poster");
  // The file that will play, once known; null until the page is idle.
  const [fuente, setFuente] = useState<FuenteVuelo | null>(null);
  // True when the clip waits for a tap instead of playing on its own.
  const [aMano, setAMano] = useState(false);
  // The poster leaves the layout once the fade ends, so the browser does not
  // keep compositing an image nobody can see under the playing video.
  const [sinPoster, setSinPoster] = useState(false);

  // Attach the clip only after load and idle: the poster and the headline
  // own the first seconds of a slow phone connection.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    let cancelado = false, idle = 0, timer = 0;
    const decidir = () => {
      if (cancelado) return;
      const f = elegirFuente(fuentes, v);
      if (!f) return;
      setFuente(f);
      if (!puedeReproducirSolo()) {
        setAMano(true);
        return;
      }
      cargarYReproducir(v, f);
    };
    const enReposo = () => {
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(decidir, { timeout: 2500 });
      else timer = window.setTimeout(decidir, 300);
    };
    if (document.readyState === "complete") enReposo();
    else window.addEventListener("load", enReposo, { once: true });
    return () => {
      cancelado = true;
      window.removeEventListener("load", enReposo);
      if (idle) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
    };
  }, [fuentes]);

  function cargarYReproducir(v: HTMLVideoElement, f: FuenteVuelo) {
    if (v.getAttribute("src") !== f.src) {
      v.preload = "auto";
      v.src = f.src;
    }
    setFase((x) => (x === "video" ? x : "cargando"));
    pausadoPorUsuario.current = false;
    v.play().catch(() => {
      // Autoplay refused by the browser: fall back to the explicit button.
      setAMano(true);
      setFase((x) => (x === "cargando" ? "poster" : x));
    });
  }

  // Cross-fade from the poster once the first frames are really playing.
  useEffect(() => {
    if (fase !== "video") return;
    const t = window.setTimeout(() => setSinPoster(true), 320);
    return () => window.clearTimeout(t);
  }, [fase]);

  useEffect(() => {
    const cont = seccion.current, v = video.current;
    if (!cont || !v) return;
    let id = 0, ultima = -1;

    const pintar = () => {
      id = requestAnimationFrame(pintar);
      if (!visible.current || v.paused) return;
      const t = v.currentTime;
      const i = escenaEn(t);
      if (i !== ultima) {
        ultima = i;
        setEscena(i);
      }
      barras.current.forEach((el, k) => {
        if (!el) return;
        const { de, a } = ESCENAS[k];
        const p = k < i ? 1 : k > i ? 0 : Math.min(1, (t - de) / (a - de));
        el.style.transform = `scaleX(${p})`;
      });
    };
    const sync = () => setPausado(v.paused);
    const listo = () => {
      setAMano(false);
      setFase("video");
    };
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    v.addEventListener("playing", listo);

    // Off screen it stops, saving battery and data; back on screen it carries
    // on unless the visitor paused it or it never started.
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (!v.getAttribute("src")) return;
      if (!visible.current) v.pause();
      else if (!pausadoPorUsuario.current) v.play().catch(() => {});
    });
    io.observe(cont);
    id = requestAnimationFrame(pintar);
    return () => {
      cancelAnimationFrame(id);
      io.disconnect();
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
      v.removeEventListener("playing", listo);
    };
  }, []);

  const alternar = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      if (fuente) cargarYReproducir(v, fuente);
    } else {
      pausadoPorUsuario.current = true;
      v.pause();
    }
  };
  const irA = (i: number) => {
    const v = video.current;
    if (!v || !v.getAttribute("src")) return;
    v.currentTime = ESCENAS[i].de + 0.05;
    setEscena(i);
    if (!pausadoPorUsuario.current) v.play().catch(() => {});
  };

  const conVideo = fase !== "poster" || (fuente !== null && !aMano);

  return (
    <section ref={seccion} aria-label="La gaviota de GAVICOM en vuelo" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-azul">
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />
      {!sinPoster && (
        <picture
          className={`absolute inset-0 transition-opacity duration-300 ease-out ${fase === "video" ? "opacity-0" : "opacity-100"}`}
        >
          <source media={VERTICAL} srcSet="/video/gaviota-poster-vertical.jpg" />
          {/* Decorative: the headline carries the message. */}
          <img src="/video/gaviota-poster.jpg" alt="" fetchPriority="high" decoding="async" className="w-full h-full object-cover" />
        </picture>
      )}
      {/* Fine film grain and a soft vignette: they hide compression and the
          small flaws of generated footage. Static, so they cost nothing. */}
      <div aria-hidden className="grano absolute inset-0 pointer-events-none" />
      <div aria-hidden className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(12,38,66,0)_55%,rgba(12,38,66,0.45)_100%)]" />
      {/* The railway shots have a pale sky: keep the white menu readable. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(12,38,66,0.65)_0%,rgba(12,38,66,0)_100%)]" />
      {/* Darkens the left and bottom just enough for white text on a bright sky. */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgba(12,38,66,0.85)_0%,rgba(12,38,66,0.35)_55%,rgba(12,38,66,0)_75%)] md:bg-[linear-gradient(90deg,rgba(12,38,66,0.75)_0%,rgba(12,38,66,0.3)_42%,rgba(12,38,66,0)_62%),linear-gradient(0deg,rgba(12,38,66,0.6)_0%,rgba(12,38,66,0)_35%)]" />

      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-5 sm:pb-8">
          <p className="font-mono text-[11px] sm:text-sm uppercase tracking-[0.06em] sm:tracking-[0.14em] text-white/85">
            Suministro ferroviario · Barranquilla, Colombia
          </p>
          <h1 className="mt-3 text-white text-[40px] leading-[1.04] sm:text-6xl md:text-7xl font-bold tracking-tight max-w-xl lg:max-w-3xl">
            Todo lo que la vía férrea necesita.
          </h1>

          {/* Scene subtitles share one grid cell, so the slot takes the height
              of the longest one and nothing below jumps when they swap. */}
          <div className="mt-4 grid max-w-lg">
            {ESCENAS.map((e, k) => {
              const activa = k === escena;
              return (
                <p
                  key={e.nombre}
                  aria-hidden={activa ? undefined : true}
                  inert={!activa}
                  className="capa-vuelo [grid-area:1/1] text-white/90 text-base sm:text-lg md:text-xl"
                  style={{ opacity: activa ? 1 : 0, transform: activa ? "none" : "translate3d(0, 12px, 0)" }}
                >
                  {e.texto}
                </p>
              );
            })}
          </div>

          <div data-hero-cta className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="boton-iman inline-flex items-center gap-2 min-h-12 px-5 sm:px-6 rounded bg-white text-azul font-semibold hover:bg-azul-suave"
            >
              <MessageCircle size={20} aria-hidden />
              Cotizar por WhatsApp
            </a>
            <Link href="/catalogo" className="boton-iman inline-flex items-center min-h-12 px-5 sm:px-6 rounded border border-white text-white font-semibold hover:bg-white/10">
              Ver catálogo
            </Link>
            <Link href="/energy" className="inline-flex items-center gap-1.5 min-h-11 px-1 text-sm font-semibold text-white/90 hover:text-white hover:underline underline-offset-4">
              GAVICOM Energy <ArrowRight size={16} aria-hidden />
            </Link>
          </div>

          {/* Scene bar while the clip is attached; before that, the explicit
              button that tells what pressing it will cost. Same height in both
              so the hero does not jump. */}
          <div className="mt-4 sm:mt-6 min-h-11">
            {conVideo ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={alternar}
                  aria-label={pausado ? "Reproducir el vuelo" : "Pausar el vuelo"}
                  className="grid place-items-center size-11 shrink-0 rounded-full border border-white/60 text-white hover:bg-white/15"
                >
                  {pausado ? <Play size={18} aria-hidden /> : <Pause size={18} aria-hidden />}
                </button>
                <ol className="flex-1 grid grid-cols-5 gap-1 sm:gap-2" aria-label="Escenas del vuelo">
                  {ESCENAS.map((e, i) => (
                    <li key={e.nombre}>
                      <button
                        type="button"
                        onClick={() => irA(i)}
                        aria-current={escena === i ? "step" : undefined}
                        className="group w-full min-w-11 min-h-11 flex flex-col justify-center gap-1.5 text-left"
                      >
                        <span className="relative block h-[3px] w-full overflow-hidden rounded bg-white/25">
                          <span ref={(el) => { barras.current[i] = el; }} className="absolute inset-0 origin-left bg-white" style={{ transform: "scaleX(0)" }} />
                        </span>
                        <span className={`hidden sm:block text-xs tracking-wide transition-colors ${escena === i ? "text-white" : "text-white/70 group-hover:text-white/90"}`}>
                          {e.nombre}
                        </span>
                        <span className="sr-only sm:hidden">{e.nombre}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ) : aMano && fuente ? (
              <button
                type="button"
                onClick={() => video.current && cargarYReproducir(video.current, fuente)}
                className="inline-flex items-center gap-2 min-h-11 px-4 rounded-full border border-white/60 text-sm font-semibold text-white hover:bg-white/15"
              >
                <Play size={16} aria-hidden />
                {fuente.bytes ? `Ver el vuelo (${megas(fuente.bytes)})` : "Ver el vuelo"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
