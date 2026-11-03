"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowDown, Layers } from "lucide-react";
import BotonCotizar from "@/components/BotonCotizar";
import "./via.css";

/*
 * "Así se arma una vía": a cross-section of a rail joint drawn like an
 * engineering exploded view. Scrolling pulls it apart over the first half of
 * the track and then walks through the six parts in order; every part is a
 * real catalogue reference that can be pointed at or tapped to see its photo,
 * code and a quote button. Drawn in SVG on purpose: a clean technical drawing
 * reads as honest, where a fake 3D render read as AI. It is a schematic: no
 * dimensions, callouts with measures or to-scale profiles are ever shown.
 */

export interface PiezaVia {
  id: "eclisa" | "perno" | "clip" | "tirafondo" | "almohadilla" | "placa";
  nombre: string;
  sku: string;
  slug: string;
  imagen: string | null;
  resumen: string;
}

type Id = PiezaVia["id"];

// Exploded offsets (x, y) in drawing units, applied as the section opens.
const DESARME: Record<Id | "riel", [number, number]> = {
  placa: [0, -22],
  almohadilla: [0, -52],
  riel: [0, -108],
  eclisa: [118, -108],
  perno: [0, -262],
  clip: [62, -158],
  tirafondo: [0, -238],
};

// Rail section outline: base y = 492, centre x = 500.
const RIEL = [
  [-80.5, 0], [80.5, 0], [80.5, 13.8], [23, 34.5], [10.4, 51.8], [10.4, 138], [39.1, 149.5], [39.1, 193.2],
  [-39.1, 193.2], [-39.1, 149.5], [-10.4, 138], [-10.4, 51.8], [-23, 34.5], [-80.5, 13.8],
]
  .map(([x, h]) => `${500 + x},${492 - h}`)
  .join(" ");

// Desktop shows the whole sleeper; phones crop to the opened joint so the
// parts and labels are not shrunk to a 390 px strip.
const VISTA = { escritorio: "110 110 800 500", movil: "280 116 480 486" };

/*
 * Label of each part, in the part's own coordinates (it rides with it), per
 * layout: [x, y, anchor, leader x1, y1, x2, y2]. On phones there is no room
 * beside the joint, so labels sit in the gaps the opened joint leaves.
 */
type Etq = [number, number, "start" | "middle" | "end", number, number, number, number];
const ETIQUETAS: Record<Id, { texto: string; escritorio: Etq; movil: Etq }> = {
  placa: { texto: "Placa de asiento", escritorio: [682, 510, "start", 676, 505, 662, 505], movil: [500, 560, "middle", 500, 538, 500, 514] },
  almohadilla: { texto: "Almohadilla", escritorio: [682, 498, "start", 676, 493, 582, 495], movil: [588, 508, "start", 584, 502, 572, 498] },
  eclisa: { texto: "Eclisas", escritorio: [552, 372, "start", 556, 378, 540, 392], movil: [412, 304, "start", 446, 310, 470, 350] },
  perno: { texto: "Pernos", escritorio: [592, 410, "start", 588, 405, 582, 404], movil: [592, 410, "start", 588, 405, 582, 404] },
  clip: { texto: "Clips elásticos", escritorio: [640, 470, "start", 636, 465, 620, 470], movil: [690, 530, "end", 640, 512, 630, 492] },
  tirafondo: { texto: "Tirafondos", escritorio: [644, 464, "start", 640, 459, 634, 459], movil: [644, 466, "start", 640, 460, 634, 459] },
};

const suave = (t: number) => t * t * (3 - 2 * t);
const limitar = (t: number) => Math.min(1, Math.max(0, t));

// Phone layout and reduced motion are read with useSyncExternalStore so the
// server render (desktop, with motion) hydrates cleanly and then adapts.
const suscribir = (consulta: string) => (aviso: () => void) => {
  const mq = window.matchMedia(consulta);
  mq.addEventListener("change", aviso);
  return () => mq.removeEventListener("change", aviso);
};
const MOVIL = "(max-width: 640px)";
const QUIETO = "(prefers-reduced-motion: reduce)";
const suscribirMovil = suscribir(MOVIL);
const suscribirQuieto = suscribir(QUIETO);
const useConsulta = (consulta: string, sub: (aviso: () => void) => () => void) =>
  useSyncExternalStore(sub, () => window.matchMedia(consulta).matches, () => false);

export default function ViaDesarmada({ piezas }: { piezas: PiezaVia[] }) {
  const pista = useRef<HTMLDivElement>(null);
  const banda = useRef<HTMLDivElement>(null);
  const foto = useRef<HTMLPictureElement>(null);
  const grupos = useRef<Partial<Record<keyof typeof DESARME, SVGGElement | null>>>({});
  const lienzo = useRef<SVGSVGElement>(null);
  const chips = useRef<HTMLUListElement>(null);
  const movil = useConsulta(MOVIL, suscribirMovil);
  const quieto = useConsulta(QUIETO, suscribirQuieto);
  const [activa, setActiva] = useState<Id>(piezas[0]?.id ?? "clip");
  const [encima, setEncima] = useState<Id | null>(null);
  // null follows the scroll; 0/1 is what the Armar/Desarmar button chose.
  const [forzado, setForzado] = useState<0 | 1 | null>(null);
  const [abierta, setAbierta] = useState(false);
  const [empezo, setEmpezo] = useState(false);
  // Read out only when the visitor picks a part, never on scroll or hover.
  const [anuncio, setAnuncio] = useState("");
  const forzadoRef = useRef(forzado);
  // Openness survives effect restarts, so a re-run never snaps the joint shut.
  const apertura = useRef<number | null>(null);
  const releer = useRef<(() => void) | null>(null);
  const actual = piezas.find((p) => p.id === (encima ?? activa)) ?? piezas[0];
  const indice = Math.max(0, piezas.findIndex((p) => p.id === activa));
  const elegir = (pid: Id) => {
    setActiva(pid);
    const p = piezas.find((x) => x.id === pid);
    if (p) setAnuncio(`${p.nombre}, ${p.sku}`);
  };

  useEffect(() => {
    const cont = pista.current;
    if (!cont) return;
    let id = 0, objetivo = quieto ? 1 : 0, paso = -1, abiertaAntes = false, empezoAntes = false;
    let e = apertura.current ?? objetivo;
    // Frames are only requested while the joint is still moving: a settled
    // drawing costs nothing on a phone, off screen or with reduced motion.
    const arrancar = () => {
      if (!id) id = requestAnimationFrame(pintar);
    };
    const leer = () => {
      const r = cont.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      const p = recorrido > 0 ? limitar(-r.top / recorrido) : 1;
      // Leaving the section hands control back to the scroll.
      if (forzadoRef.current !== null && (r.bottom < 0 || r.top > window.innerHeight)) setForzado(null);
      const desarme = quieto ? 1 : suave(limitar(p / 0.5));
      objetivo = forzadoRef.current ?? desarme;
      if (!quieto) {
        if (p > 0.05 !== empezoAntes) setEmpezo((empezoAntes = p > 0.05));
        // Second half of the track: one part after another, in order.
        const n = p >= 0.5 ? Math.min(piezas.length - 1, Math.floor(((p - 0.5) / 0.5) * piezas.length)) : -1;
        if (n !== paso) {
          paso = n;
          if (n >= 0) setActiva(piezas[n].id);
        }
      }
      // The photo band fades into the drawing as it leaves the screen.
      const b = banda.current, f = foto.current;
      if (b && f && !quieto) {
        const rb = b.getBoundingClientRect();
        f.style.opacity = String(1 - 0.85 * limitar(-rb.top / Math.max(1, rb.height)));
      }
      arrancar();
    };
    const pintar = () => {
      id = 0;
      e += (objetivo - e) * (quieto ? 1 : 0.12);
      if (Math.abs(objetivo - e) < 0.001) e = objetivo;
      else id = requestAnimationFrame(pintar);
      apertura.current = e;
      const k = e;
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
      lienzo.current?.style.setProperty("--etq", String(limitar((k - 0.7) / 0.3)));
      const ab = k > 0.6;
      if (ab !== abiertaAntes) {
        abiertaAntes = ab;
        lienzo.current?.toggleAttribute("data-abierta", ab);
        setAbierta(ab);
      }
    };
    releer.current = leer;
    leer();
    // First paint even when the target equals the stored openness.
    arrancar();
    window.addEventListener("scroll", leer, { passive: true });
    window.addEventListener("resize", leer, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", leer);
      window.removeEventListener("resize", leer);
    };
  }, [quieto, piezas]);

  // The button overrides the scroll until the visitor leaves the section.
  useEffect(() => {
    forzadoRef.current = forzado;
    releer.current?.();
  }, [forzado]);

  // Keep the active chip in view inside the horizontal carousel without
  // scrolling the page (scrollIntoView would also move it vertically).
  useEffect(() => {
    const ul = chips.current;
    const li = ul?.children[indice] as HTMLElement | undefined;
    if (!ul || !li || ul.scrollWidth <= ul.clientWidth) return;
    // A keyboard user tabbing through other chips keeps the row where focus is.
    if (ul.contains(document.activeElement) && !li.contains(document.activeElement)) return;
    ul.scrollTo({ left: li.offsetLeft - ul.offsetLeft - 16, behavior: quieto ? "auto" : "smooth" });
  }, [indice, quieto]);

  // Each part: hover/focus highlights it and previews its card; click pins it.
  const pieza = (pid: Id) => {
    const p = piezas.find((x) => x.id === pid);
    const resaltada = (encima ?? activa) === pid;
    return {
      role: "button" as const,
      tabIndex: 0,
      "data-pieza": pid,
      "aria-label": p ? `${p.nombre}, ${p.sku}` : pid,
      "aria-pressed": activa === pid,
      className: `cursor-pointer outline-none ${resaltada ? "via-pieza-activa" : ""}`,
      onMouseEnter: () => setEncima(pid),
      onMouseLeave: () => setEncima(null),
      onFocus: () => setEncima(pid),
      onBlur: () => setEncima(null),
      onClick: () => elegir(pid),
      onKeyDown: (ev: React.KeyboardEvent) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          elegir(pid);
        }
      },
    };
  };

  const modo = movil ? "movil" : "escritorio";
  const etiqueta = (pid: Id) => {
    const { texto } = ETIQUETAS[pid];
    const [x, y, ancla, x1, y1, x2, y2] = ETIQUETAS[pid][modo];
    return (
      <>
        <line className="via-guia" x1={x1} y1={y1} x2={x2} y2={y2} />
        <text x={x} y={y} textAnchor={ancla} className="etq">
          {texto}
        </text>
      </>
    );
  };

  return (
    <section aria-labelledby="h-via" className="relative bg-[#f4f4f5] scroll-mt-[88px]">
      {/* Where the home flight ends: the same seagull, now standing on the
          rail. It is footage, not the logo's seagull. */}
      <div ref={banda} className="relative h-[46svh] min-h-[280px] md:h-[56vh] overflow-hidden bg-[#f4f4f5]">
        <picture ref={foto} className="via-foto absolute inset-0 block">
          <source media={MOVIL} srcSet="/video/gaviota-riel-v.webp" type="image/webp" />
          <img
            src="/video/gaviota-riel.webp"
            alt="Gaviota posada sobre un riel de vía férrea"
            loading="lazy"
            decoding="async"
            sizes="100vw"
            width={1280}
            height={720}
            className="h-full w-full object-cover object-[50%_60%]"
          />
        </picture>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.15)_45%,rgba(244,244,245,0)_70%,#f4f4f5_100%)]" />
        <div className="absolute inset-x-0 top-0 mx-auto max-w-6xl px-4 sm:px-6 pt-10 md:pt-14">
          <p className="max-w-[24ch] md:max-w-[30ch] text-white text-xl md:text-3xl font-semibold leading-snug [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">
            Donde se posa la gaviota empieza la vía. Desármala pieza por pieza.
          </p>
        </div>
      </div>

      <div ref={pista} className="relative h-[170vh]">
        <div className="sticky top-0 min-h-[100svh] flex flex-col justify-center pt-[76px] pb-3 md:pt-20 md:pb-8">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 grid gap-3 md:gap-6 lg:grid-cols-[1.5fr_1fr] items-center">
            <div className="flex flex-col gap-2 md:gap-3 min-w-0">
              <div>
                <p className="font-mono text-xs md:text-sm text-tenue tracking-wider">02 / La vía</p>
                <h2 id="h-via" className="text-3xl md:text-5xl font-bold tracking-tight scroll-mt-[88px] mt-1">
                  Así se arma una vía
                </h2>
                {/* Phones get the one-line version so the whole stage fits one screen. */}
                <p className="text-tenue mt-1 md:mt-2 max-w-xl text-sm md:text-base">
                  <span className="hidden sm:inline">Las piezas que puedes tocar están en el catálogo de GAVICOM. </span>Toca una pieza para ver su ficha.
                </p>
              </div>

              <div className="relative">
                <svg
                  ref={lienzo}
                  viewBox={VISTA[modo]}
                  data-movil={movil ? "" : undefined}
                  className="via-lienzo w-full h-auto select-none [--etq:0]"
                  role="group"
                  aria-label="Sección de una junta de riel desarmada"
                >
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
                  <line x1="500" y1="110" x2="500" y2="612" stroke="#0c2642" strokeOpacity="0.12" strokeDasharray="2 8" />

                  {/* Sleeper: not sold as a part here, so it is not interactive. */}
                  <polygon points="140,512 860,512 878,600 122,600" fill="url(#concreto)" stroke="#0c2642" strokeOpacity="0.35" />
                  <text x={movil ? 292 : 852} y="592" textAnchor={movil ? "start" : "end"} className={movil ? "fill-[#5b5f68] text-[19px]" : "fill-[#5b5f68] text-[13px]"}>
                    Traviesa
                  </text>

                  <g ref={(el) => { grupos.current.placa = el; }} {...pieza("placa")}>
                    <rect className="via-toque" x="326" y="466" width="348" height="76" />
                    <path d="M330 512 V499 H430 V490 H442 V499 H558 V490 H570 V499 H670 V512 Z" fill="#3a424c" stroke="#0c2642" strokeWidth="1.5" />
                    {etiqueta("placa")}
                  </g>
                  <g ref={(el) => { grupos.current.almohadilla = el; }} {...pieza("almohadilla")}>
                    {/* Hit areas are at least 74 units on each side: the drawing renders
                        at about 0.6 px per unit on a short phone, and 44 px is the minimum. */}
                    <rect className="via-toque" x="416" y="426" width="168" height="100" />
                    <rect x="420" y="492" width="160" height="7" rx="1.5" fill="#151a20" />
                    {etiqueta("almohadilla")}
                  </g>

                  <g ref={(el) => { grupos.current.riel = el; }}>
                    <polygon points={RIEL} fill="url(#acero)" stroke="#0c2642" strokeWidth="1.5" />
                    <text x="500" y="286" textAnchor="middle" className={movil ? "fill-[#5b5f68] text-[19px]" : "fill-[#5b5f68] text-[13px]"}>
                      Riel
                    </text>
                  </g>

                  <g ref={(el) => { grupos.current.eclisa = el; }} {...pieza("eclisa")}>
                    <g data-lado="-1">
                      <rect className="via-toque" x="428" y="346" width="74" height="110" />
                      <polygon points="458,350 489,356 489,437 476,452 455,447" fill="#2c333b" stroke="#0c2642" strokeWidth="1.5" />
                      {movil && etiqueta("eclisa")}
                    </g>
                    <g data-lado="1">
                      <rect className="via-toque" x="498" y="346" width="74" height="110" />
                      <polygon points="542,350 511,356 511,437 524,452 545,447" fill="#2c333b" stroke="#0c2642" strokeWidth="1.5" />
                      {!movil && etiqueta("eclisa")}
                    </g>
                  </g>

                  <g ref={(el) => { grupos.current.perno = el; }} {...pieza("perno")}>
                    <rect className="via-toque" x="412" y="360" width="176" height="88" />
                    <rect x="432" y="398" width="136" height="11" fill="#4a535e" stroke="#0c2642" />
                    {Array.from({ length: 9 }, (_, i) => (
                      <line key={i} x1={530 + i * 4} y1="398" x2={532 + i * 4} y2="409" stroke="#0c2642" strokeOpacity="0.5" />
                    ))}
                    <rect x="418" y="386" width="16" height="35" rx="2" fill="#2c333b" stroke="#0c2642" />
                    <rect x="566" y="388" width="14" height="31" rx="2" fill="#2c333b" stroke="#0c2642" />
                    {etiqueta("perno")}
                  </g>

                  <g ref={(el) => { grupos.current.clip = el; }} {...pieza("clip")}>
                    {[-1, 1].map((s) => (
                      <g key={s} data-lado={s}>
                        <rect className="via-toque" x={s === 1 ? 566 : 354} y="430" width="80" height="76" />
                        <path
                          transform={s === 1 ? "translate(1000 0) scale(-1 1)" : undefined}
                          d="M426 486 C 414 462, 392 452, 376 462 C 360 472, 366 492, 382 490 C 398 488, 398 470, 384 468"
                          fill="none"
                          stroke="#1f262e"
                          strokeWidth="9"
                          strokeLinecap="round"
                        />
                        {s === 1 && etiqueta("clip")}
                      </g>
                    ))}
                  </g>

                  <g ref={(el) => { grupos.current.tirafondo = el; }} {...pieza("tirafondo")}>
                    {[380, 620].map((x) => (
                      <g key={x}>
                        <rect className="via-toque" x={x - 37} y="448" width="74" height="148" />
                        <rect x={x - 5} y="466" width="10" height="126" fill="#4a535e" stroke="#0c2642" />
                        {Array.from({ length: 12 }, (_, i) => (
                          <line key={i} x1={x - 5} y1={500 + i * 7} x2={x + 5} y2={504 + i * 7} stroke="#0c2642" strokeOpacity="0.55" />
                        ))}
                        <rect x={x - 14} y="452" width="28" height="15" rx="2" fill="#2c333b" stroke="#0c2642" />
                        {x === 620 && etiqueta("tirafondo")}
                      </g>
                    ))}
                  </g>
                </svg>

                {/* Scroll hint: only until the joint starts to open. */}
                {!quieto && (
                  <div
                    aria-hidden
                    data-oculta={empezo || forzado !== null ? "" : undefined}
                    className="via-pista pointer-events-none absolute inset-x-0 bottom-1 flex justify-center"
                  >
                    <span className="inline-flex items-center gap-2 rounded bg-white/95 border border-linea px-3 py-1.5 text-sm font-semibold text-azul shadow-sm">
                      <ArrowDown size={16} className="via-pista-flecha" aria-hidden />
                      Desliza para desarmar
                    </span>
                  </div>
                )}
              </div>

              {/* Tour position: which of the six parts is on, by name. */}
              <div className="flex items-center gap-3">
                <div aria-hidden className="flex gap-1 flex-1 max-w-[220px]">
                  {piezas.map((p, i) => (
                    <span key={p.id} className={`via-paso h-1.5 flex-1 rounded-sm ${i === indice && abierta ? "bg-azul" : i < indice && abierta ? "bg-[#9aa6b5]" : "bg-[#d4d7dd]"}`} />
                  ))}
                </div>
                <p className="text-sm text-tinta min-w-0 truncate" aria-hidden>
                  <span className="font-mono text-tenue">{indice + 1}/{piezas.length}</span>{" "}
                  <span className="font-semibold">{piezas[indice]?.nombre}</span>
                </p>
                <button
                  type="button"
                  aria-pressed={abierta}
                  onClick={() => setForzado(abierta ? 0 : 1)}
                  className="ml-auto shrink-0 inline-flex items-center gap-2 min-h-11 min-w-11 px-3 rounded border border-azul text-azul bg-white aria-pressed:bg-azul-suave text-sm font-semibold hover:bg-azul-suave"
                >
                  <Layers size={16} aria-hidden />
                  {/* Fixed label: aria-pressed already says whether it is open. */}
                  Desarmar<span className="sr-only"> la junta</span>
                </button>
              </div>

              <ul
                ref={chips}
                className="flex gap-2 overflow-x-auto snap-x snap-proximity scroll-px-4 -mx-4 px-4 pb-1 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible"
                aria-label="Piezas de la junta"
              >
                {piezas.map((p) => (
                  <li key={p.id} className="snap-start shrink-0">
                    <button
                      type="button"
                      onClick={() => elegir(p.id)}
                      // Mandatory snap would pull a focused chip back off screen.
                      onFocus={(ev) => ev.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" })}
                      aria-pressed={activa === p.id}
                      className={`min-h-11 px-3 rounded border text-sm font-medium whitespace-nowrap transition-colors ${activa === p.id ? "bg-azul text-white border-azul" : "bg-white border-linea hover:border-azul"}`}
                    >
                      {p.nombre}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* The card of the part being pointed at, or the last one tapped. */}
            <p className="sr-only" aria-live="polite">
              {anuncio}
            </p>
            <article data-tapa-flotante className="bg-white border border-linea rounded p-3 md:p-5 flex gap-3 md:gap-4 lg:flex-col shadow-[0_10px_40px_-20px_rgba(12,38,66,0.35)]">
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-full lg:h-56 shrink-0 bg-white">
                {actual.imagen && <Image key={actual.sku} src={actual.imagen} alt={actual.nombre} fill sizes="(min-width:1024px) 360px, 112px" className="object-contain" />}
              </div>
              <div className="flex flex-col gap-1.5 md:gap-2 min-w-0">
                <p className="font-mono text-xs text-azul">{actual.sku}</p>
                <h3 className="font-sans text-base md:text-lg font-semibold text-tinta leading-snug">{actual.nombre}</h3>
                <p className="via-resumen text-sm text-tenue line-clamp-2 md:line-clamp-3">{actual.resumen}</p>
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
      </div>
    </section>
  );
}
