"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/*
 * Home hero: the seagull flight told in five scenes. The clip never follows
 * the scroll frame by frame: scrubbed slowly, an AI-generated video shows its
 * flaws. Instead each scene holds still on a clean frame while its text is
 * read, and scrolling on plays the stretch to the next scene at normal speed.
 * Going back plays a reversed copy of the clip, because browsers cannot play
 * a video backwards. Both copies have a keyframe on every stop, so starting
 * from one is instant.
 */

// Seconds of the clip where each scene stops: sky, close-up, the railway
// from above, the landing and the gull perched on the rail.
const PARADAS = [2, 5.5, 13.5, 24.5, 29.5];
// Horizontal framing per scene. On phones the vertical crop would cut the
// perched gull's beak, so the last scene slides the frame to the left.
const ENCUADRE = ["50%", "50%", "50%", "50%", "22%"];
// Time of the last frame; the reversed clip at time r shows FIN - r.
const FIN = 29.958;
// A stretch never takes much longer than this, however far apart the stops.
const TRAMO_MAX = 2.8;

export default function VideoVuelo() {
  const seccion = useRef<HTMLElement>(null);
  const marco = useRef<HTMLDivElement>(null);
  const idaRef = useRef<HTMLVideoElement>(null);
  const vueltaRef = useRef<HTMLVideoElement>(null);
  const capas = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cont = seccion.current, caja = marco.current, ida = idaRef.current, vuelta = vueltaRef.current;
    if (!cont || !caja || !ida || !vuelta) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let id = 0, meta = 0, en = -1, destino: number | null = null, visible = true, ocupado = false, arrancado = false;
    let activo = ida, quietoAntes: boolean | null = null;

    const tVis = () => (activo === ida ? ida.currentTime : FIN - vuelta.currentTime);
    const mostrar = (el: HTMLVideoElement) => {
      ida.style.opacity = el === ida ? "1" : "0";
      vuelta.style.opacity = el === vuelta ? "1" : "0";
    };

    // Lands on a stop with a still, exact frame.
    const llegar = () => {
      if (destino === null) return;
      activo.pause();
      en = destino;
      destino = null;
      if (activo === ida) ida.currentTime = PARADAS[en];
      else vuelta.currentTime = FIN - PARADAS[en];
    };
    // Without playback (reduced motion, iOS low-power mode, reversed copy not
    // loaded yet) the scene changes by cutting straight to its stop.
    const saltar = (k: number) => {
      activo.pause();
      ida.currentTime = PARADAS[k];
      activo = ida;
      mostrar(ida);
      destino = k;
      llegar();
    };

    const iniciar = (k: number) => {
      const t = tVis();
      const adelante = PARADAS[k] > t;
      const el = adelante ? ida : vuelta;
      if (quieto || el.readyState < 2) {
        if (el.readyState < 2 && el.preload !== "auto") { el.preload = "auto"; el.load(); }
        saltar(k);
        return;
      }
      destino = k;
      const pendientes = Math.abs(meta - k);
      el.playbackRate = Math.min(4, Math.max(1, Math.abs(PARADAS[k] - t) / TRAMO_MAX) * (pendientes > 0 ? 1.6 : 1));
      const reproducir = () => el.play().catch(() => saltar(k));
      if (el === activo) { reproducir(); return; }
      // Switch copies on the same frame, so the swap cannot be seen.
      ocupado = true;
      activo.pause();
      el.currentTime = el === ida ? t : FIN - t;
      el.addEventListener("seeked", () => {
        activo = el;
        mostrar(el);
        ocupado = false;
        reproducir();
      }, { once: true });
    };

    const leer = () => {
      const r = cont.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      const p = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 0;
      meta = Math.min(PARADAS.length - 1, Math.floor(p * PARADAS.length));
    };

    // The intro plays from the first frame to the first stop, unless the page
    // opens already scrolled down, where it cuts to that scene.
    const arrancar = () => {
      if (arrancado) return;
      arrancado = true;
      if (meta === 0 && !quieto) {
        destino = 0;
        ida.play().catch(() => saltar(0));
      } else saltar(meta);
    };
    if (ida.readyState >= 1) arrancar();
    else ida.addEventListener("loadedmetadata", arrancar, { once: true });

    // The reversed copy is only needed once the visitor scrolls back up, so
    // it downloads after the forward clip.
    const cargarVuelta = () => {
      if (vuelta.preload !== "auto") { vuelta.preload = "auto"; vuelta.load(); }
    };
    ida.addEventListener("canplaythrough", cargarVuelta, { once: true });
    const espera = window.setTimeout(cargarVuelta, 6000);

    // With a mouse wheel, trackpad or keyboard, each gesture moves exactly one
    // scene and the page holds still until the flight gets there. Otherwise
    // the scroll runs ahead of the video: the text and the next section show
    // up before the gull does. Touch scrolling keeps the plain scroll mapping.
    const ultima = PARADAS.length - 1;
    const anclaje = (k: number) => {
      const recorrido = cont.offsetHeight - window.innerHeight;
      const inicio = cont.getBoundingClientRect().top + window.scrollY;
      return inicio + (k === 0 ? 0 : k === ultima ? recorrido : (recorrido * (k + 0.5)) / PARADAS.length);
    };
    const enPista = () => {
      const r = cont.getBoundingClientRect();
      return r.top <= 1 && r.bottom >= window.innerHeight - 1;
    };
    const irEscena = (k: number) => {
      window.scrollTo({ top: Math.round(anclaje(k)), behavior: "instant" });
      leer();
    };
    let ultimoEvento = 0, gestoUsado = false, acumulado = 0;
    // Returns true when the event was used to move between scenes.
    const gesto = (dir: number, delta: number) => {
      const ahora = performance.now();
      // A trackpad keeps sending wheel events for a second after the swipe;
      // a pause marks the start of a new gesture.
      const nuevo = ahora - ultimoEvento > 200;
      ultimoEvento = ahora;
      if (nuevo) { gestoUsado = false; acumulado = 0; }
      if (gestoUsado) return true;
      const k = meta + dir;
      // Past the first or last scene the page scrolls on as usual, but never
      // while the flight is still on its way.
      if (k < 0 || k > ultima) return destino !== null;
      acumulado += delta;
      if (Math.abs(acumulado) >= 30) { gestoUsado = true; irEscena(k); }
      return true;
    };
    const rueda = (e: WheelEvent) => {
      if (quieto || e.ctrlKey || !e.deltaY || !enPista()) return;
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      if (gesto(Math.sign(e.deltaY), delta)) e.preventDefault();
    };
    const tecla = (e: KeyboardEvent) => {
      if (quieto || e.altKey || e.ctrlKey || e.metaKey || !enPista()) return;
      const t = e.target as HTMLElement | null;
      if (t && t.closest("input, textarea, select, button, [contenteditable]")) return;
      const abajo = ["ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey);
      const arriba = ["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey);
      if (!abajo && !arriba) return;
      ultimoEvento = 0; // every key press is its own gesture
      if (gesto(abajo ? 1 : -1, abajo ? 100 : -100)) e.preventDefault();
    };

    const pintar = () => {
      id = requestAnimationFrame(pintar);
      if (!visible || !arrancado) return;
      if (!ocupado) {
        if (destino !== null) {
          const t = tVis(), adelante = activo === ida;
          if ((adelante ? t >= PARADAS[destino] - 0.02 : t <= PARADAS[destino] + 0.02) || activo.ended) llegar();
          // Scrolled back the other way mid-stretch: return to where it left.
          else if (en >= 0 && ((destino > en && meta <= en) || (destino < en && meta >= en))) iniciar(en);
          // Paused while off screen: carry on from where it stopped.
          else if (activo.paused) {
            const k = destino;
            activo.play().catch(() => saltar(k));
          }
        } else if (meta !== en) iniciar(en + Math.sign(meta - en));
      }

      // Text shows while its scene holds still; the headline also shows during
      // the intro.
      const escena = destino === null ? en : en === -1 ? 0 : -1;
      capas.current.forEach((el, i) => {
        if (!el) return;
        const on = i === escena;
        el.style.opacity = on ? "1" : "0";
        el.style.transform = on ? "none" : "translate3d(0, 24px, 0)";
        el.style.pointerEvents = on ? "auto" : "none";
      });
      // A slow push-in keeps a held scene alive without moving the footage.
      const encuadre = ENCUADRE[destino ?? Math.max(0, en)] + " 50%";
      if (ida.style.objectPosition !== encuadre) {
        ida.style.objectPosition = encuadre;
        vuelta.style.objectPosition = encuadre;
      }
      const sosten = destino === null;
      if (!quieto && sosten !== quietoAntes) {
        quietoAntes = sosten;
        caja.style.transition = sosten ? "transform 9s cubic-bezier(.2,.6,.3,1)" : "transform 1.2s ease-out";
        caja.style.transform = sosten ? "scale(1.04)" : "scale(1)";
      }
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) activo.pause();
    });
    io.observe(cont);
    leer();
    id = requestAnimationFrame(pintar);
    window.addEventListener("scroll", leer, { passive: true });
    window.addEventListener("wheel", rueda, { passive: false });
    window.addEventListener("keydown", tecla);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(espera);
      io.disconnect();
      window.removeEventListener("scroll", leer);
      window.removeEventListener("wheel", rueda);
      window.removeEventListener("keydown", tecla);
    };
  }, []);

  return (
    <section ref={seccion} aria-label="La gaviota de GAVICOM en vuelo" className="relative h-[560vh] bg-azul">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div ref={marco} aria-hidden className="absolute inset-0 will-change-transform">
          <video ref={idaRef} muted playsInline preload="auto" poster="/video/gaviota-poster.jpg" className="absolute inset-0 w-full h-full object-cover transition-[object-position] duration-[1500ms] ease-out">
            {/* WebM first (lighter in Chrome and Android), MP4 for Safari. */}
            <source src="/video/gaviota-ida-v.webm" type="video/webm" media="(max-aspect-ratio: 4/5)" />
            <source src="/video/gaviota-ida-v.mp4" type="video/mp4" media="(max-aspect-ratio: 4/5)" />
            <source src="/video/gaviota-ida.webm" type="video/webm" />
            <source src="/video/gaviota-ida.mp4" type="video/mp4" />
          </video>
          <video ref={vueltaRef} muted playsInline preload="none" className="absolute inset-0 w-full h-full object-cover transition-[object-position] duration-[1500ms] ease-out" style={{ opacity: 0 }}>
            <source src="/video/gaviota-vuelta-v.webm" type="video/webm" media="(max-aspect-ratio: 4/5)" />
            <source src="/video/gaviota-vuelta-v.mp4" type="video/mp4" media="(max-aspect-ratio: 4/5)" />
            <source src="/video/gaviota-vuelta.webm" type="video/webm" />
            <source src="/video/gaviota-vuelta.mp4" type="video/mp4" />
          </video>
        </div>
        {/* Fine film grain and a soft vignette: they hide compression and the
            small flaws of generated footage. Static, so they cost nothing. */}
        <div aria-hidden className="grano absolute inset-0 pointer-events-none" />
        <div aria-hidden className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(12,38,66,0)_55%,rgba(12,38,66,0.45)_100%)]" />
        {/* The railway shots have a pale sky: keep the white menu readable. */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(12,38,66,0.65)_0%,rgba(12,38,66,0)_100%)]" />
        {/* Darkens the left and bottom just enough for white text on a bright sky. */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgba(12,38,66,0.75)_0%,rgba(12,38,66,0.1)_45%,rgba(12,38,66,0)_70%)] md:bg-[linear-gradient(90deg,rgba(12,38,66,0.7)_0%,rgba(12,38,66,0.25)_40%,rgba(12,38,66,0)_60%)]" />

        <div className="absolute inset-0 pointer-events-none">
          {/* At the start the gull fills the lower left, so on wide screens the
              headline sits top right, over open sky. */}
          <div ref={(el) => { capas.current[0] = el; }} className="capa-vuelo absolute inset-0 flex items-end md:items-start pb-[12vh] md:pb-0 md:pt-[17vh]">
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

          <div ref={(el) => { capas.current[1] = el; }} className="capa-vuelo absolute inset-0 flex items-end pb-[12vh]" style={{ opacity: 0 }}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <p className="text-white font-titulo font-bold text-4xl md:text-6xl max-w-2xl leading-tight">Mirada de cerca, visión de conjunto.</p>
              <p className="mt-3 text-white/85 text-lg max-w-md">Del clip elástico al corredor completo: suministro, servicio técnico y topografía con dron.</p>
            </div>
          </div>

          <div ref={(el) => { capas.current[2] = el; }} className="capa-vuelo absolute inset-0 flex items-end pb-[12vh]" style={{ opacity: 0 }}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <p className="text-white font-titulo font-bold text-4xl md:text-6xl max-w-2xl leading-tight">Desde arriba se ve la vía completa.</p>
              <p className="mt-3 text-white/85 text-lg max-w-md">Fijaciones, herramientas de vía, señalización y servicio técnico para construir y mantener corredores férreos.</p>
            </div>
          </div>

          <div ref={(el) => { capas.current[3] = el; }} className="capa-vuelo absolute inset-0 flex items-end pb-[12vh]" style={{ opacity: 0 }}>
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <p className="text-white font-titulo font-bold text-4xl md:text-6xl max-w-2xl leading-tight">Y de cerca, cada pieza cuenta.</p>
              <p className="mt-3 text-white/85 text-lg max-w-md">Eclisas, clips, placas de asiento y tirafondos con ficha técnica y código.</p>
            </div>
          </div>

          <div ref={(el) => { capas.current[4] = el; }} className="capa-vuelo absolute inset-0 flex items-end pb-[12vh]" style={{ opacity: 0 }}>
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
