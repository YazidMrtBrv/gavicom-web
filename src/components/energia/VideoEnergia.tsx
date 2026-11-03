"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

/*
 * Energy hero: the seagull glides over a solar farm on the coast and lands on
 * the electrical cabinet.
 *
 * The server only renders a <picture>, so the first paint is a light WebP and
 * nothing heavy is requested before the page is usable. With reduced motion
 * the picture shows the last frame (the gull perched) through a media query,
 * without waiting for script. The <video> is mounted on the client only when
 * motion is allowed and the connection can afford it: Save-Data on, or a
 * 2G/3G effective type, keeps the still image, which on a phone plan in
 * Colombia is the difference between a page that loads and one that doesn't.
 */

// Network Information API is not in the TS DOM lib (Chromium only).
type Conexion = { saveData?: boolean; effectiveType?: string };

function puedeVideo(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const c = (navigator as Navigator & { connection?: Conexion }).connection;
  if (c?.saveData) return false;
  if (c?.effectiveType && ["slow-2g", "2g", "3g"].includes(c.effectiveType)) return false;
  return true;
}

const ENCUADRE = "absolute inset-0 w-full h-full object-cover object-center md:object-left";

export default function VideoEnergia() {
  const video = useRef<HTMLVideoElement>(null);
  const [montar, setMontar] = useState(false);
  const [listo, setListo] = useState(false);
  // Once the cross-fade is over the poster is taken out of the layout, so
  // the phone is not compositing a full-screen image under a playing video.
  const [posterFuera, setPosterFuera] = useState(false);
  const [termino, setTermino] = useState(false);

  useEffect(() => {
    // The decision depends on browser-only facts; taking it after hydration
    // keeps the server render and the first client render identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (puedeVideo()) setMontar(true);
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!montar || !v) return;
    const fin = () => setTermino(true);
    v.addEventListener("ended", fin);
    // If autoplay is refused the still image simply stays.
    v.play().catch(() => {});
    return () => v.removeEventListener("ended", fin);
  }, [montar]);

  const repetir = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    setTermino(false);
    v.play().catch(() => {});
  };

  return (
    <>
      <picture className={posterFuera ? "hidden" : undefined}>
        <source media="(prefers-reduced-motion: reduce) and (max-aspect-ratio: 4/5)" srcSet="/video/energia-final-v.webp" type="image/webp" />
        <source media="(prefers-reduced-motion: reduce)" srcSet="/video/energia-final.webp" type="image/webp" />
        <source media="(max-aspect-ratio: 4/5)" srcSet="/video/energia-poster-v.webp" type="image/webp" />
        <img
          src="/video/energia-poster.webp"
          alt=""
          aria-hidden
          fetchPriority="high"
          decoding="async"
          width={1280}
          height={720}
          className={ENCUADRE}
        />
      </picture>
      {montar && (
        <video
          ref={video}
          muted
          playsInline
          preload="metadata"
          aria-hidden
          onCanPlay={() => setListo(true)}
          onTransitionEnd={() => listo && setPosterFuera(true)}
          className={`energia-video ${ENCUADRE} ${listo ? "opacity-100" : "opacity-0"}`}
        >
          {/* Lighter VP9 encodes first; the originals stay as fallback. */}
          <source src="/video/energia-v-ligero.webm" type="video/webm" media="(max-aspect-ratio: 4/5)" />
          <source src="/video/energia-v.mp4" type="video/mp4" media="(max-aspect-ratio: 4/5)" />
          <source src="/video/energia-ligero.webm" type="video/webm" />
          <source src="/video/energia.mp4" type="video/mp4" />
        </video>
      )}
      <div aria-hidden className="grano absolute inset-0 pointer-events-none" />
      {termino && (
        <button
          type="button"
          onClick={repetir}
          className="aparecer-rapido absolute z-20 right-4 top-24 md:top-auto md:right-auto md:left-6 md:bottom-6 inline-flex items-center gap-2 min-h-11 px-4 rounded-full border border-white/50 bg-azul/60 text-white text-sm font-semibold hover:bg-azul/80"
        >
          <RotateCcw size={16} aria-hidden /> Ver de nuevo
        </button>
      )}
    </>
  );
}
