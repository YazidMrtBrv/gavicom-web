"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

/*
 * Energy hero: the seagull glides over a solar farm on the coast and lands on
 * the electrical cabinet. It plays once and stays on the last frame, the gull
 * perched, so the headline sits over a still image. With reduced motion it
 * shows that last frame straight away.
 */
export default function VideoEnergia() {
  const video = useRef<HTMLVideoElement>(null);
  const [termino, setTermino] = useState(false);
  const [quieto, setQuieto] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Reading the preference is a browser-only fact; deciding on it here
      // keeps the server render and the first client render the same.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuieto(true);
      return;
    }
    v.play().catch(() => setQuieto(true));
    const fin = () => setTermino(true);
    v.addEventListener("ended", fin);
    return () => v.removeEventListener("ended", fin);
  }, []);

  const repetir = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    setTermino(false);
    v.play().catch(() => {});
  };

  return (
    <>
      {quieto ? (
        <picture>
          <img src="/video/energia-final.jpg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover object-center md:object-left" />
        </picture>
      ) : (
        <video
          ref={video}
          muted
          playsInline
          preload="auto"
          poster="/video/energia-poster.jpg"
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center md:object-left"
        >
          <source src="/video/energia-v.webm" type="video/webm" media="(max-aspect-ratio: 4/5)" />
          <source src="/video/energia-v.mp4" type="video/mp4" media="(max-aspect-ratio: 4/5)" />
          <source src="/video/energia.webm" type="video/webm" />
          <source src="/video/energia.mp4" type="video/mp4" />
        </video>
      )}
      <div aria-hidden className="grano absolute inset-0 pointer-events-none" />
      {termino && (
        <button
          type="button"
          onClick={repetir}
          className="aparecer-rapido absolute z-20 right-4 top-20 md:top-auto md:right-auto md:left-6 md:bottom-6 inline-flex items-center gap-2 min-h-11 px-4 rounded-full border border-white/50 bg-azul/40 backdrop-blur text-white text-sm font-semibold hover:bg-azul/60"
        >
          <RotateCcw size={16} aria-hidden /> Ver de nuevo
        </button>
      )}
    </>
  );
}
