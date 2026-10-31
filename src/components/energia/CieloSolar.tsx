"use client";

import { useEffect, useRef } from "react";

/*
 * Energy hero: a row of solar modules under the sun's arc. Scrolling moves the
 * sun along its path and the light on the panels follows it; the same seagull
 * as the home page crosses the sky. Drawn in SVG so it stays sharp and light.
 */
const ANCHO = 1200;
const ALTO = 640;
const SUELO = 560;
const CENTRO = { x: 600, y: SUELO + 40 };
const RADIO = 520;

const polar = (grados: number, r = RADIO) => {
  const a = ((grados - 90) * Math.PI) / 180;
  return { x: CENTRO.x + r * Math.cos(a), y: CENTRO.y + r * Math.sin(a) };
};

// Modules in three receding rows, each a parallelogram tilted toward the sun.
const MODULOS = [0, 1, 2].flatMap((fila) => {
  const escala = 1 - fila * 0.22;
  const y = SUELO - 30 - fila * 70;
  const ancho = 120 * escala, fondo = 46 * escala, inclinacion = 34 * escala;
  const n = 7 + fila * 2;
  const total = n * (ancho + 10 * escala);
  const x0 = ANCHO / 2 - total / 2;
  return Array.from({ length: n }, (_, i) => {
    const x = x0 + i * (ancho + 10 * escala);
    return { x, y, ancho, fondo, inclinacion, fila, i };
  });
});

export default function CieloSolar() {
  const raiz = useRef<HTMLDivElement>(null);
  const sol = useRef<SVGGElement>(null);
  const brillo = useRef<SVGLinearGradientElement>(null);
  const ave = useRef<SVGGElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let id = 0, objetivo = 0.35, actual = 0.35;
    const leer = () => {
      const r = el.getBoundingClientRect();
      objetivo = Math.min(1, Math.max(0, 0.35 - r.top / (r.height * 1.4)));
    };
    const pintar = (t: number) => {
      id = requestAnimationFrame(pintar);
      actual += (objetivo - actual) * (quieto ? 1 : 0.08);
      // The sun sits right of the headline and sets toward the horizon as you scroll.
      const grados = 8 + actual * 90;
      const p = polar(grados);
      sol.current?.setAttribute("transform", `translate(${p.x} ${p.y})`);
      // Panels catch the light on the side facing the sun.
      const x = 50 + (p.x - ANCHO / 2) / 10;
      brillo.current?.setAttribute("x1", `${x - 30}%`);
      brillo.current?.setAttribute("x2", `${x + 30}%`);
      if (!quieto && ave.current) {
        const s = (t / 22000) % 1;
        const ax = -120 + s * (ANCHO + 240), ay = 170 + Math.sin(s * Math.PI * 2) * 30;
        const aleteo = 1 + Math.sin(t / 160) * 0.25;
        ave.current.setAttribute("transform", `translate(${ax} ${ay}) scale(1 ${aleteo})`);
      }
    };
    leer();
    id = requestAnimationFrame(pintar);
    window.addEventListener("scroll", leer, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", leer);
    };
  }, []);

  const arco = `M ${polar(-70).x} ${polar(-70).y} A ${RADIO} ${RADIO} 0 0 1 ${polar(70).x} ${polar(70).y}`;

  return (
    <div ref={raiz} className="absolute inset-0" aria-hidden>
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} preserveAspectRatio="xMidYMax slice" className="w-full h-full">
        <defs>
          <linearGradient id="cielo-energia" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0c2642" />
            <stop offset="0.7" stopColor="#1d4469" />
            <stop offset="1" stopColor="#3d6b93" />
          </linearGradient>
          <linearGradient ref={brillo} id="brillo-panel" x1="20%" y1="0" x2="80%" y2="0">
            <stop offset="0" stopColor="#102f4f" />
            <stop offset="0.5" stopColor="#5f8fbd" />
            <stop offset="1" stopColor="#102f4f" />
          </linearGradient>
          <radialGradient id="halo">
            <stop offset="0" stopColor="#fff6dc" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={ANCHO} height={ALTO} fill="url(#cielo-energia)" />
        <path d={arco} fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeDasharray="2 10" strokeWidth="2" />
        {[-60, -40, -20, 0, 20, 40, 60].map((g) => {
          const a = polar(g, RADIO - 8), b = polar(g, RADIO + 8);
          return <line key={g} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.5" />;
        })}
        <g ref={sol}>
          <circle r="120" fill="url(#halo)" />
          <circle r="26" fill="#fff4d6" />
        </g>
        <g ref={ave}>
          {/* Same gull silhouette as the home page: raised wing, dark tips. */}
          <path d="M0 0 C 18 -14 34 -22 52 -26 C 40 -14 28 -6 14 2 Z" fill="#e9eff5" />
          <path d="M0 0 C -18 -10 -34 -14 -50 -14 C -38 -6 -24 0 -12 4 Z" fill="#e9eff5" />
          <path d="M44 -24 L52 -26 L46 -19 Z M-44 -14 L-50 -14 L-44 -10 Z" fill="#16202b" />
          <ellipse cx="2" cy="2" rx="14" ry="5" fill="#ffffff" />
        </g>
        <rect y={SUELO} width={ANCHO} height={ALTO - SUELO} fill="#0a1f37" />
        {MODULOS.map((m) => (
          <g key={`${m.fila}-${m.i}`} opacity={1 - m.fila * 0.18}>
            <polygon
              points={`${m.x},${m.y} ${m.x + m.ancho},${m.y} ${m.x + m.ancho + m.inclinacion * 0.3},${m.y - m.fondo} ${m.x + m.inclinacion * 0.3},${m.y - m.fondo}`}
              fill="url(#brillo-panel)"
              stroke="#9ec0e2"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            <line x1={m.x + m.ancho * 0.25} y1={m.y} x2={m.x + m.ancho * 0.25 + m.inclinacion * 0.3} y2={m.y - m.fondo} stroke="#9ec0e2" strokeOpacity="0.3" />
            <line x1={m.x + m.ancho * 0.5} y1={m.y} x2={m.x + m.ancho * 0.5 + m.inclinacion * 0.3} y2={m.y - m.fondo} stroke="#9ec0e2" strokeOpacity="0.3" />
            <line x1={m.x + m.ancho * 0.75} y1={m.y} x2={m.x + m.ancho * 0.75 + m.inclinacion * 0.3} y2={m.y - m.fondo} stroke="#9ec0e2" strokeOpacity="0.3" />
            <line x1={m.x + 6} y1={m.y} x2={m.x + 6} y2={m.y + 14 * (1 - m.fila * 0.2)} stroke="#9ec0e2" strokeOpacity="0.5" strokeWidth="2" />
            <line x1={m.x + m.ancho - 6} y1={m.y} x2={m.x + m.ancho - 6} y2={m.y + 14 * (1 - m.fila * 0.2)} stroke="#9ec0e2" strokeOpacity="0.5" strokeWidth="2" />
          </g>
        ))}
      </svg>
    </div>
  );
}
