"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { PARADAS } from "./RecorridoSolar";

/*
 * Energy hero: a line drawing of a photovoltaic system, from the sun to the
 * load, in the same six stops as RecorridoSolar. It replaces a generated video:
 * a drawing of the real chain says what GAVICOM does (cofre, protections,
 * cabinets) better than footage, weighs a few KB and stays sharp at any size.
 *
 * Each stop lights up in turn and the cables behind it start to carry
 * current, DC as long dashes and AC as short ones, so the change of current
 * type is told by the dash shape and not only by position. After the last
 * stop the whole system stays lit for a moment, which is also the state the
 * server renders: without script, with reduced motion or before hydration the
 * visitor sees the complete, static drawing.
 *
 * Every stop is a link to the matching tab of the path further down
 * (#paso-<id>), so the hero works as an index of the page.
 */

// Index 6 is "the whole system lit": the resting state between cycles.
const TODO = PARADAS.length;
const PASO_MS = 1500;
const TODO_MS = 3200;

// Which cable carries energy once a stop has been passed: k joins stop k to k+1.
const encendido = (etapa: number, k: number) => etapa === TODO || etapa > k;

// Short names for narrow drawings, where the long ones would not fit at a
// readable size. The long ones come from the path so both always agree.
const CORTO: Record<string, string> = {
  sol: "SOL",
  paneles: "PANELES",
  cofre: "COFRE FV",
  inversor: "INVERSOR",
  gabinete: "GABINETE AC",
  carga: "OPERACIÓN",
};

interface Geometria {
  // Hit and focus box: at least 84 units, 47 px at the narrowest phone scale.
  caja: [number, number, number, number];
  // Label anchor (centre, baseline).
  rotulo: [number, number];
  dibujo: ReactNode;
}

// Four tilted modules on a rack; x0 is the lower left corner of each.
const MODULOS = [176, 248, 320, 392];

function modulo(x0: number) {
  const cara = `M${x0} 150 L${x0 + 60} 150 L${x0 + 78} 100 L${x0 + 18} 100 Z`;
  // Cell lines: two along the module, two across it.
  const celdas = `M${x0 + 6} 133.3 L${x0 + 66} 133.3 M${x0 + 12} 116.7 L${x0 + 72} 116.7 M${x0 + 20} 150 L${x0 + 38} 100 M${x0 + 40} 150 L${x0 + 58} 100`;
  return (
    <g key={x0}>
      <path d={cara} className="esq-cara" />
      <path d={celdas} className="esq-fino" />
      <path d={`M${x0 + 8} 150 V176 M${x0 + 72} 116 V176`} className="esq-fino" />
    </g>
  );
}

const GEOMETRIA: Record<string, Geometria> = {
  sol: {
    caja: [38, 46, 92, 104],
    rotulo: [84, 140],
    dibujo: (
      <g>
        <circle cx={84} cy={90} r={20} className="esq-cara" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          const c = Math.cos(a);
          const s = Math.sin(a);
          return <line key={i} x1={84 + 28 * c} y1={90 + 28 * s} x2={84 + 37 * c} y2={90 + 37 * s} />;
        })}
      </g>
    ),
  },
  paneles: {
    caja: [168, 90, 314, 96],
    rotulo: [320, 204],
    dibujo: (
      <g>
        {MODULOS.map(modulo)}
        {/* Ground with drafting hatch. */}
        <path d="M164 176 H484" />
        <path
          d={Array.from({ length: 27 }, (_, i) => `M${170 + i * 12} 176 l-6 7`).join(" ")}
          className="esq-fino"
        />
      </g>
    ),
  },
  cofre: {
    caja: [44, 284, 104, 114],
    rotulo: [96, 422],
    dibujo: (
      <g>
        <rect x={50} y={290} width={92} height={102} rx={2} className="esq-cara" />
        <rect x={57} y={297} width={78} height={88} className="esq-fino" />
        {/* DC fuse holders behind the door. */}
        {[70, 90, 110].map((x) => (
          <g key={x}>
            <rect x={x} y={310} width={12} height={28} />
            <path d={`M${x + 6} 304 V310 M${x + 6} 338 V344`} className="esq-fino" />
          </g>
        ))}
        <rect x={72} y={356} width={48} height={12} className="esq-fino" />
        <path d="M131 330 V348" />
      </g>
    ),
  },
  inversor: {
    caja: [208, 278, 100, 124],
    rotulo: [258, 422],
    dibujo: (
      <g>
        <rect x={214} y={284} width={88} height={112} rx={2} className="esq-cara" />
        {/* The drafting symbol for an inverter: DC above the diagonal, AC below. */}
        <rect x={230} y={298} width={56} height={56} />
        <path d="M230 354 L286 298" />
        <path d="M238 310 H256 M238 316 h4 m3 0 h4 m3 0 h4" className="esq-fino" />
        <path d="M262 340 q4.5 -8 9 0 t9 0" className="esq-fino" />
        <path d="M226 366 H290 M226 373 H290 M226 380 H290 M226 387 H290" className="esq-fino" />
      </g>
    ),
  },
  gabinete: {
    caja: [368, 278, 104, 124],
    rotulo: [420, 422],
    dibujo: (
      <g>
        <rect x={374} y={284} width={92} height={112} rx={2} className="esq-cara" />
        <path d="M420 284 V396" />
        {/* Two rows of breakers on DIN rail in each door. */}
        {[300, 334].map((y) => (
          <g key={y}>
            <path d={`M380 ${y + 9} H414 M426 ${y + 9} H460`} className="esq-fino" />
            {[383, 394, 405, 429, 440, 451].map((x) => (
              <rect key={x} x={x} y={y} width={7} height={18} />
            ))}
          </g>
        ))}
        <path d="M414 368 V380 M426 368 V380" />
      </g>
    ),
  },
  carga: {
    caja: [522, 262, 104, 140],
    rotulo: [574, 422],
    dibujo: (
      <g>
        {/* Sawtooth roof: plant, warehouse or shop alike. */}
        <path d="M528 396 V300 L551 280 V300 L574 280 V300 L597 280 V300 L620 280 V396 Z" className="esq-cara" />
        <rect x={562} y={358} width={24} height={38} />
        <rect x={538} y={316} width={16} height={14} className="esq-fino" />
        <rect x={566} y={316} width={16} height={14} className="esq-fino" />
        <rect x={594} y={316} width={16} height={14} className="esq-fino" />
      </g>
    ),
  },
};

// Cable k leaves stop k. Sunlight is drawn as rays, the rest as conductors.
const CABLES: { k: number; d: string; tipo: "luz" | "dc" | "ac" }[] = [
  { k: 0, tipo: "luz", d: "M122 76 L190 96 M124 96 L262 106 M120 114 L176 126" },
  { k: 1, tipo: "dc", d: "M206 150 V162 M278 150 V162 M350 150 V162 M422 150 V162 M206 162 H422 M206 162 H182 V240 H96 V290" },
  { k: 2, tipo: "dc", d: "M142 340 H214" },
  { k: 3, tipo: "ac", d: "M302 340 H374" },
  { k: 4, tipo: "ac", d: "M466 340 H528" },
];

export default function EsquemaSolar() {
  const raiz = useRef<HTMLDivElement>(null);
  const [etapa, setEtapa] = useState(TODO);
  const [animado, setAnimado] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pausado, setPausado] = useState(false);
  const [foco, setFoco] = useState<number | null>(null);

  // Motion is a browser-only fact, so it is decided after hydration and the
  // first client render matches the server's static drawing.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decidir = () => setAnimado(!mq.matches);
    decidir();
    mq.addEventListener("change", decidir);
    return () => mq.removeEventListener("change", decidir);
  }, []);

  // Nothing runs while the hero is off screen: no timers, no dash animation.
  useEffect(() => {
    const nodo = raiz.current;
    if (!nodo) return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    obs.observe(nodo);
    return () => obs.disconnect();
  }, []);

  const corriendo = animado && visible && !pausado && foco === null;

  useEffect(() => {
    if (!corriendo) return;
    const t = window.setTimeout(() => setEtapa((e) => (e + 1) % (TODO + 1)), etapa === TODO ? TODO_MS : PASO_MS);
    return () => window.clearTimeout(t);
  }, [corriendo, etapa]);

  const mostrada = foco ?? (animado ? etapa : TODO);
  const actual = mostrada === TODO ? null : PARADAS[mostrada];

  // Same-hash clicks do not fire hashchange, so the path is told explicitly:
  // otherwise a second click on a stop would scroll but not select it.
  const alIr = (e: MouseEvent<Element>) => {
    const href = e.currentTarget.getAttribute("href");
    if (href && window.location.hash === href) window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <div ref={raiz} className="esquema" data-pausa={corriendo ? undefined : "si"}>
      <svg
        viewBox="0 0 640 480"
        role="group"
        aria-label="Esquema de un sistema solar fotovoltaico, del sol a tu operación. Cada etapa lleva a su explicación."
        className="block w-full h-auto overflow-visible"
      >
        {/* Title block, as on a drawing sheet; it states the drawing is not a project. */}
        <g aria-hidden className="esq-cajetin">
          <rect x={450} y={8} width={182} height={46} />
          <path d="M450 31 H632" />
          <text x={458} y={24}>ESQUEMA FV · DC/AC</text>
          <text x={458} y={47}>ILUSTRATIVO · SIN ESCALA</text>
        </g>

        <g aria-hidden>
          {CABLES.map((c) => (
            <g key={c.k} className={`esq-cable esq-${c.tipo}`} data-on={encendido(mostrada, c.k) ? "si" : undefined}>
              <path d={c.d} className="esq-guia" />
              <path d={c.d} className="esq-flujo" />
            </g>
          ))}
        </g>

        {/* Dimension lines: where the current is DC and where it is AC. The
            split falls on the inverter, the stop that changes it. */}
        <g aria-hidden className="esq-cota">
          <path d="M50 444 H254 M262 444 H620 M50 438 V450 M258 436 V452 M620 438 V450" />
          <text x={154} y={470} className="esq-largo">DC · CORRIENTE CONTINUA</text>
          <text x={439} y={470} className="esq-largo">AC · CORRIENTE ALTERNA</text>
          <text x={154} y={472} className="esq-corto">DC</text>
          <text x={439} y={472} className="esq-corto">AC</text>
        </g>

        {PARADAS.map((p, i) => {
          const g = GEOMETRIA[p.id];
          const [x, y, w, h] = g.caja;
          const estado = mostrada === TODO ? "hecho" : i === mostrada ? "activa" : i < mostrada ? "hecho" : "espera";
          return (
            <a
              key={p.id}
              href={`#paso-${p.id}`}
              aria-label={`${i + 1}. ${p.nombre}: ver qué hacemos en esta etapa`}
              className="esq-etapa"
              data-estado={estado}
              style={{ "--i": i } as CSSProperties}
              onClick={alIr}
              onPointerEnter={() => setFoco(i)}
              onPointerLeave={() => setFoco(null)}
              onFocus={() => setFoco(i)}
              onBlur={() => setFoco(null)}
            >
              <rect x={x} y={y} width={w} height={h} rx={2} className="esq-marco" />
              <g className="esq-dibujo">{g.dibujo}</g>
              <text x={g.rotulo[0]} y={g.rotulo[1]} className="esq-rotulo esq-largo">
                <tspan className="esq-num">{String(i + 1).padStart(2, "0")}</tspan> {p.nombre.toUpperCase()}
              </text>
              <text x={g.rotulo[0]} y={g.rotulo[1] + 2} className="esq-rotulo esq-corto">
                {CORTO[p.id]}
              </text>
            </a>
          );
        })}
      </svg>

      {/* Readout: what the drawing shows right now. Visual only, since the
          stops themselves are the accessible links. */}
      <div className="mt-3 flex items-center gap-3 min-h-11">
        <ol aria-hidden className="grid grid-cols-6 gap-1 w-24 shrink-0">
          {PARADAS.map((p, i) => (
            <li key={p.id} className="esq-tic" data-on={mostrada === TODO || i <= mostrada ? "si" : undefined} />
          ))}
        </ol>
        <p aria-hidden className="flex-1 min-w-0 truncate t-dato tracking-wide text-white/85">
          {actual ? (
            <>
              <span className="text-white font-semibold">{String(mostrada + 1).padStart(2, "0")}</span> · {actual.nombre}
              {actual.corriente && <span className="text-white/70"> · {actual.corriente}</span>}
            </>
          ) : (
            <>
              <span className="sm:hidden">Toca una etapa</span>
              <span className="hidden sm:inline">Toca una etapa para ver qué hacemos ahí</span>
            </>
          )}
        </p>
        {animado && (
          <button
            type="button"
            onClick={() => setPausado((v) => !v)}
            aria-label={pausado ? "Reanudar la animación del esquema" : "Pausar la animación del esquema"}
            className="grid place-items-center size-11 shrink-0 rounded-full border border-white/50 text-white hover:bg-white/10"
          >
            {pausado ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
          </button>
        )}
      </div>
    </div>
  );
}
