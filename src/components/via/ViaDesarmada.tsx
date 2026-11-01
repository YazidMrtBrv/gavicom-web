"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BotonCotizar from "@/components/BotonCotizar";

/*
 * "Así se arma una vía": a cross-section of a rail joint drawn like an
 * engineering exploded view. Scrolling pulls it apart; every part is a real
 * catalogue reference that can be pointed at or tapped to see its photo,
 * code and a quote button. Drawn in SVG on purpose: a clean technical
 * drawing reads as honest, where a fake 3D render read as AI.
 */

export interface PiezaVia {
  id: "eclisa" | "perno" | "clip" | "tirafondo" | "almohadilla" | "placa";
  nombre: string;
  sku: string;
  slug: string;
  imagen: string | null;
  resumen: string;
}

// Exploded offsets (x, y) in drawing units, applied as the section opens.
const DESARME: Record<PiezaVia["id"] | "riel", [number, number]> = {
  placa: [0, -22],
  almohadilla: [0, -52],
  riel: [0, -108],
  eclisa: [118, -108],
  perno: [0, -262],
  clip: [62, -158],
  tirafondo: [0, -238],
};

// Rail 115 lb section, scaled: base y = 492, centre x = 500.
const RIEL = [
  [-80.5, 0], [80.5, 0], [80.5, 13.8], [23, 34.5], [10.4, 51.8], [10.4, 138], [39.1, 149.5], [39.1, 193.2],
  [-39.1, 193.2], [-39.1, 149.5], [-10.4, 138], [-10.4, 51.8], [-23, 34.5], [-80.5, 13.8],
]
  .map(([x, h]) => `${500 + x},${492 - h}`)
  .join(" ");

const suave = (t: number) => t * t * (3 - 2 * t);

export default function ViaDesarmada({ piezas }: { piezas: PiezaVia[] }) {
  const seccion = useRef<HTMLElement>(null);
  const grupos = useRef<Partial<Record<keyof typeof DESARME, SVGGElement | null>>>({});
  const lienzo = useRef<SVGSVGElement>(null);
  const [activa, setActiva] = useState<PiezaVia["id"]>("clip");
  const [encima, setEncima] = useState<PiezaVia["id"] | null>(null);
  const actual = piezas.find((p) => p.id === (encima ?? activa)) ?? piezas[0];

  useEffect(() => {
    const cont = seccion.current;
    if (!cont) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let id = 0, objetivo = 0, e = 0;
    const leer = () => {
      const r = cont.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      // Opens over the first 60 % of the section, then stays open to explore.
      objetivo = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / (recorrido * 0.6))) : 1;
    };
    const pintar = () => {
      id = requestAnimationFrame(pintar);
      e += (objetivo - e) * (quieto ? 1 : 0.1);
      const k = suave(e);
      for (const [clave, [dx, dy]] of Object.entries(DESARME) as [keyof typeof DESARME, [number, number]][]) {
        const g = grupos.current[clave];
        if (!g) continue;
        if (clave === "eclisa" || clave === "clip") {
          // Pairs open outward from the rail on each side.
          g.querySelectorAll<SVGGElement>("[data-lado]").forEach((lado) => {
            const s = Number(lado.dataset.lado);
            lado.setAttribute("transform", `translate(${s * dx * k} 0)`);
          });
          g.setAttribute("transform", `translate(0 ${dy * k})`);
        } else {
          g.setAttribute("transform", `translate(${dx * k} ${dy * k})`);
        }
      }
      // Labels ride inside each part's group and fade in as the joint opens.
      lienzo.current?.style.setProperty("--etq", String(Math.max(0, (k - 0.7) / 0.3)));
    };
    leer();
    id = requestAnimationFrame(pintar);
    window.addEventListener("scroll", leer, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", leer);
    };
  }, []);

  // Each part: hover/focus highlights it and previews its card; click pins it.
  const pieza = (pid: PiezaVia["id"]) => {
    const p = piezas.find((x) => x.id === pid);
    const resaltada = (encima ?? activa) === pid;
    return {
      role: "button" as const,
      tabIndex: 0,
      "aria-label": p ? `${p.nombre}, ${p.sku}` : pid,
      "aria-pressed": activa === pid,
      className: `cursor-pointer outline-none transition-[filter] ${resaltada ? "via-activa" : ""}`,
      onMouseEnter: () => setEncima(pid),
      onMouseLeave: () => setEncima(null),
      onFocus: () => setEncima(pid),
      onBlur: () => setEncima(null),
      onClick: () => setActiva(pid),
      onKeyDown: (ev: React.KeyboardEvent) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          setActiva(pid);
        }
      },
    };
  };

  return (
    <section ref={seccion} aria-labelledby="h-via" className="relative h-[220vh] bg-[#f4f4f5]">
      <div className="sticky top-0 min-h-[100svh] flex flex-col justify-center pt-20 pb-4 md:py-10">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 grid gap-6 lg:grid-cols-[1.5fr_1fr] items-center">
          <div className="flex flex-col gap-3 min-w-0">
            <div>
              <h2 id="h-via" className="text-3xl md:text-5xl font-bold">
                Así se arma una vía
              </h2>
              <p className="text-tenue mt-2 max-w-xl">Cada pieza de esta junta la suministra GAVICOM. Tócala para ver su ficha.</p>
            </div>
            <svg ref={lienzo} viewBox="110 120 800 490" className="w-full h-auto select-none [--etq:0]" role="group" aria-label="Sección de una junta de riel desarmada">
              <defs>
                <pattern id="concreto" width="14" height="14" patternUnits="userSpaceOnUse">
                  <rect width="14" height="14" fill="#c9ced6" />
                  <circle cx="3" cy="4" r="1.1" fill="#aeb4be" />
                  <circle cx="10" cy="9" r="0.9" fill="#b6bcc5" />
                </pattern>
                <linearGradient id="acero" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#7d8794" />
                  <stop offset="0.5" stopColor="#c7ced6" />
                  <stop offset="1" stopColor="#7d8794" />
                </linearGradient>
              </defs>
              {/* Ground line and construction marks, like a drawing sheet. */}
              <line x1="100" y1="604" x2="900" y2="604" stroke="#0c2642" strokeOpacity="0.25" strokeDasharray="6 6" />
              <line x1="500" y1="130" x2="500" y2="612" stroke="#0c2642" strokeOpacity="0.12" strokeDasharray="2 8" />

              {/* Sleeper: not sold as a part here, so it is not interactive. */}
              <polygon points="140,512 860,512 878,600 122,600" fill="url(#concreto)" stroke="#0c2642" strokeOpacity="0.35" />
              <text x="852" y="590" textAnchor="end" className="fill-[#5b5f68] text-[13px]">Traviesa</text>

              <g ref={(el) => { grupos.current.placa = el; }} {...pieza("placa")}>
                <path d="M330 512 V499 H430 V490 H442 V499 H558 V490 H570 V499 H670 V512 Z" fill="#3a424c" stroke="#0c2642" strokeWidth="1.5" />
                <text x="682" y="510" className="etq">Placa de asiento</text>
              </g>
              <g ref={(el) => { grupos.current.almohadilla = el; }} {...pieza("almohadilla")}>
                <rect x="420" y="492" width="160" height="7" rx="1.5" fill="#151a20" />
                <text x="682" y="500" className="etq">Almohadilla</text>
              </g>

              <g ref={(el) => { grupos.current.riel = el; }}>
                <polygon points={RIEL} fill="url(#acero)" stroke="#0c2642" strokeWidth="1.5" />
                <text x="500" y="286" textAnchor="middle" className="fill-[#5b5f68] text-[13px]">Riel</text>
              </g>

              <g ref={(el) => { grupos.current.eclisa = el; }} {...pieza("eclisa")}>
                <g data-lado="-1">
                  <polygon points="458,350 489,356 489,437 476,452 455,447" fill="#2c333b" stroke="#0c2642" strokeWidth="1.5" />
                </g>
                <g data-lado="1">
                  <polygon points="542,350 511,356 511,437 524,452 545,447" fill="#2c333b" stroke="#0c2642" strokeWidth="1.5" />
                  <text x="552" y="372" className="etq">Eclisas</text>
                </g>
              </g>

              <g ref={(el) => { grupos.current.perno = el; }} {...pieza("perno")}>
                <rect x="432" y="398" width="136" height="11" fill="#4a535e" stroke="#0c2642" />
                {Array.from({ length: 9 }, (_, i) => (
                  <line key={i} x1={530 + i * 4} y1="398" x2={532 + i * 4} y2="409" stroke="#0c2642" strokeOpacity="0.5" />
                ))}
                <rect x="418" y="386" width="16" height="35" rx="2" fill="#2c333b" stroke="#0c2642" />
                <rect x="566" y="388" width="14" height="31" rx="2" fill="#2c333b" stroke="#0c2642" />
                <text x="592" y="410" className="etq">Pernos</text>
              </g>

              <g ref={(el) => { grupos.current.clip = el; }} {...pieza("clip")}>
                {[-1, 1].map((s) => (
                  <g key={s} data-lado={s}>
                    <path
                      transform={s === 1 ? "translate(1000 0) scale(-1 1)" : undefined}
                      d="M426 486 C 414 462, 392 452, 376 462 C 360 472, 366 492, 382 490 C 398 488, 398 470, 384 468"
                      fill="none"
                      stroke="#1f262e"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                    {s === 1 && (
                      <text x="640" y="470" className="etq">
                        Clips elásticos
                      </text>
                    )}
                  </g>
                ))}
              </g>

              <g ref={(el) => { grupos.current.tirafondo = el; }} {...pieza("tirafondo")}>
                {[380, 620].map((x) => (
                  <g key={x}>
                    <rect x={x - 5} y="466" width="10" height="126" fill="#4a535e" stroke="#0c2642" />
                    {Array.from({ length: 12 }, (_, i) => (
                      <line key={i} x1={x - 5} y1={500 + i * 7} x2={x + 5} y2={504 + i * 7} stroke="#0c2642" strokeOpacity="0.55" />
                    ))}
                    <rect x={x - 14} y="452" width="28" height="15" rx="2" fill="#2c333b" stroke="#0c2642" />
                    {x === 620 && (
                      <text x="644" y="464" className="etq">
                        Tirafondos
                      </text>
                    )}
                  </g>
                ))}
              </g>

            </svg>
            <ul className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 md:mx-0 md:px-0 md:flex-wrap" aria-label="Piezas de la junta">
              {piezas.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setActiva(p.id)}
                    aria-pressed={activa === p.id}
                    className={`min-h-10 px-3 rounded border text-sm font-medium whitespace-nowrap transition-colors ${activa === p.id ? "bg-azul text-white border-azul" : "bg-white border-linea hover:border-azul"}`}
                  >
                    {p.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* The card of the part being pointed at, or the last one tapped. */}
          <article aria-live="polite" className="bg-white border border-linea rounded p-4 md:p-5 flex gap-4 lg:flex-col shadow-[0_10px_40px_-20px_rgba(12,38,66,0.35)]">
            <div className="relative w-28 h-28 lg:w-full lg:h-56 shrink-0 bg-white">
              {actual.imagen && <Image key={actual.sku} src={actual.imagen} alt={actual.nombre} fill sizes="(min-width:1024px) 360px, 112px" className="object-contain" />}
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <p className="font-mono text-xs text-azul">{actual.sku}</p>
              <h3 className="font-sans text-lg font-semibold text-tinta leading-snug">{actual.nombre}</h3>
              <p className="text-sm text-tenue line-clamp-3">{actual.resumen}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <BotonCotizar sku={actual.sku} nombre={actual.nombre} />
                <Link href={`/catalogo/${actual.slug}`} className="inline-flex items-center min-h-11 px-3 rounded border border-linea text-sm font-semibold hover:border-azul hover:text-azul">
                  Ver ficha
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
