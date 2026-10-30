import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { arco, linea, mas, pct, polar, poligono, por, rect, Trazo, type Punto } from "./trazos";
import { PIEZA_SERVICIO } from "./datos";
import "./energia.css";

/*
 * Esquema de una planta fotovoltaica en líneas: módulos → cofre → gabinete de
 * protecciones, con la trayectoria del sol encima. Es ilustración, no foto:
 * GAVICOM aún no tiene material gráfico propio de Energy. Cada pieza lleva el
 * código del servicio que la cubre; la leyenda del hero la resalta (energia.css).
 */

const ANCHO = 640;
const ALTO = 450;
const SUELO = 392;

const CENTRO_SOL: Punto = [320, SUELO];
const RADIO_SOL = 330;
const RECORRIDO_SOL = 62;

// Arreglo de 4 × 2 módulos en proyección oblicua: U es el ancho de un módulo
// y V su fondo inclinado hacia atrás.
const ORIGEN: Punto = [48, 340];
const U: Punto = [60, 0];
const V: Punto = [26, -34];
const PASO_U: Punto = [64, 0];
const PASO_V = por(V, 1.08);
// Fondo de la huella sobre el suelo (las patas traseras quedan más atrás).
const FONDO_SUELO: Punto = [54, -30];

const MODULOS = [0, 1].flatMap((fila) =>
  [0, 1, 2, 3].map((columna) => mas(mas(ORIGEN, por(PASO_U, columna)), por(PASO_V, fila)))
);

function contornoModulo(p0: Punto) {
  return poligono(p0, mas(p0, U), mas(mas(p0, U), V), mas(p0, V));
}

function celdasModulo(p0: Punto) {
  const lineas: string[] = [];
  for (let k = 1; k < 4; k++) {
    const a = mas(p0, por(U, k / 4));
    lineas.push(linea(a, mas(a, V)));
  }
  for (let k = 1; k < 3; k++) {
    const a = mas(p0, por(V, k / 3));
    lineas.push(linea(a, mas(a, U)));
  }
  return lineas.join("");
}

const PATAS_DELANTERAS = [78, 270];
const ALTO_FILAS = PASO_V[1] + V[1]; // negativo: sube
const PATAS = PATAS_DELANTERAS.map((x) => {
  const atras = x + PASO_V[0] + V[0];
  return linea([x, ORIGEN[1]], [x, SUELO]) + linea([atras, ORIGEN[1] + ALTO_FILAS], [atras, SUELO + FONDO_SUELO[1]]);
}).join("");
const FRENTE_DERECHO = ORIGEN[0] + PASO_U[0] * 3 + U[0];
const HUELLA = poligono(
  [ORIGEN[0], SUELO],
  [FRENTE_DERECHO, SUELO],
  mas([FRENTE_DERECHO, SUELO], FONDO_SUELO),
  mas([ORIGEN[0], SUELO], FONDO_SUELO)
);
const RIOSTRA = linea([PATAS_DELANTERAS[0], SUELO], [PATAS_DELANTERAS[0] + PASO_V[0] + V[0], ORIGEN[1] - 34]);

// Cofre fotovoltaico: cara frontal + lateral y tapa en perspectiva.
const COFRE = { x: 388, y: 286, ancho: 56, alto: 64 };
const PROF: Punto = [10, -8];
const cofreDer = COFRE.x + COFRE.ancho;
const cofreAbajo = COFRE.y + COFRE.alto;
const COFRE_FRENTE = rect(COFRE.x, COFRE.y, COFRE.ancho, COFRE.alto);
const COFRE_VOLUMEN =
  poligono([COFRE.x, COFRE.y], mas([COFRE.x, COFRE.y], PROF), mas([cofreDer, COFRE.y], PROF), [cofreDer, COFRE.y]) +
  poligono([cofreDer, COFRE.y], mas([cofreDer, COFRE.y], PROF), mas([cofreDer, cofreAbajo], PROF), [cofreDer, cofreAbajo]);
const COFRE_DETALLE =
  rect(COFRE.x + 5, COFRE.y + 5, COFRE.ancho - 10, COFRE.alto - 10) +
  rect(COFRE.x - 2, COFRE.y + 10, 3, 9) +
  rect(COFRE.x - 2, cofreAbajo - 19, 3, 9) +
  rect(cofreDer - 12, COFRE.y + 26, 3, 12) +
  rect(COFRE.x + 12, COFRE.y + 12, 22, 7) +
  [0, 1, 2].map((i) => linea([COFRE.x + 12, cofreAbajo - 16 + i * 4], [COFRE.x + 30, cofreAbajo - 16 + i * 4])).join("");
const COFRE_POSTE = linea([COFRE.x + 28, cofreAbajo], [COFRE.x + 28, SUELO]) + rect(COFRE.x + 20, SUELO - 3, 16, 3);

// Gabinete de protecciones de pie, con placa de montaje, rieles y canaleta.
const GAB = { x: 492, y: 236, ancho: 94, alto: SUELO - 236 };
const gabDer = GAB.x + GAB.ancho;
const GAB_FRENTE = rect(GAB.x, GAB.y, GAB.ancho, GAB.alto);
const GAB_VOLUMEN =
  poligono([GAB.x, GAB.y], mas([GAB.x, GAB.y], PROF), mas([gabDer, GAB.y], PROF), [gabDer, GAB.y]) +
  poligono([gabDer, GAB.y], mas([gabDer, GAB.y], PROF), mas([gabDer, SUELO], PROF), [gabDer, SUELO]);
const GAB_INTERIOR =
  rect(GAB.x + 8, GAB.y + 8, GAB.ancho - 16, GAB.alto - 28) +
  linea([GAB.x, SUELO - 12], [gabDer, SUELO - 12]);
const RIEL_DC = 272;
const RIEL_AC = 318;
const GAB_RIELES = [RIEL_DC, RIEL_AC].map((y) => linea([GAB.x + 12, y], [gabDer - 12, y])).join("");
const GAB_CANALETA =
  rect(GAB.x + 12, 336, GAB.ancho - 24, 8) +
  [0, 1, 2, 3, 4, 5, 6].map((i) => linea([GAB.x + 20 + i * 9, 336], [GAB.x + 20 + i * 9, 340])).join("");
const GAB_BORNES = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => rect(GAB.x + 14 + i * 7.6, 352, 5, 8)).join("");

// Protecciones sobre los rieles: DC arriba, AC abajo (el último, diferencial, más ancho).
const BREAKERS: { x: number; y: number; ancho: number }[] = [
  ...[0, 1, 2, 3].map((i) => ({ x: GAB.x + 16 + i * 14, y: RIEL_DC, ancho: 12 })),
  ...[0, 1, 2].map((i) => ({ x: GAB.x + 16 + i * 14, y: RIEL_AC, ancho: 12 })),
  { x: GAB.x + 58, y: RIEL_AC, ancho: 20 },
];
const PROTECCIONES = BREAKERS.map(({ x, y, ancho }) => rect(x, y - 13, ancho, 26)).join("");
const PALANCAS = BREAKERS.map(({ x, y, ancho }) => rect(x + ancho / 2 - 2, y - 6, 4, 6)).join("");

// Cableado: DC del arreglo al cofre y del cofre al gabinete; AC sale enterrado.
const PUNTO_ARREGLO: Punto = [ORIGEN[0] + PASO_U[0] * 3 + U[0] + V[0] / 2, ORIGEN[1] + V[1] / 2];
const DC_1 = linea(PUNTO_ARREGLO, [COFRE.x, PUNTO_ARREGLO[1]]);
const Y_DC_2 = 318;
const DC_2 = linea([cofreDer + PROF[0], Y_DC_2], [GAB.x, Y_DC_2]);
const X_AC = 560;
const Y_AC = 420;
const AC = linea([X_AC, SUELO], [X_AC, Y_AC], [624, Y_AC]) + linea([618, Y_AC - 5], [624, Y_AC], [618, Y_AC + 5]);
// Un solo recorrido continuo para el pulso: donde pasa por dentro del cofre o
// del gabinete lo tapa el relleno de la caja.
const FLUJO = linea(
  PUNTO_ARREGLO,
  [COFRE.x + 28, PUNTO_ARREGLO[1]],
  [COFRE.x + 28, Y_DC_2],
  [X_AC, Y_DC_2],
  [X_AC, Y_AC],
  [624, Y_AC]
);

const SUELO_LINEA = linea([20, SUELO], [ANCHO - 20, SUELO]);
const SUELO_MARCAS = Array.from({ length: 38 }, (_, i) => {
  const x = 24 + i * 16;
  return linea([x, SUELO], [x, SUELO + (i % 5 === 0 ? 8 : 4)]);
}).join("");
const COTA =
  linea([ORIGEN[0], SUELO + 14], [FRENTE_DERECHO, SUELO + 14]) +
  linea([ORIGEN[0] - 4, SUELO + 18], [ORIGEN[0] + 4, SUELO + 10]) +
  linea([FRENTE_DERECHO - 4, SUELO + 18], [FRENTE_DERECHO + 4, SUELO + 10]);

const ARCO_SOL = arco(CENTRO_SOL, RADIO_SOL, -RECORRIDO_SOL, RECORRIDO_SOL);
const MARCAS_SOL = [-60, -45, -30, -15, 0, 15, 30, 45, 60]
  .map((g) => linea(polar(CENTRO_SOL, RADIO_SOL - 5, g), polar(CENTRO_SOL, RADIO_SOL + 5, g)))
  .join("");
const SOL: Punto = [CENTRO_SOL[0], CENTRO_SOL[1] - RADIO_SOL];
const RAYOS = Array.from({ length: 8 }, (_, i) => linea(polar(SOL, 15, i * 45), polar(SOL, 20, i * 45))).join("");
const RAYO_INCIDENTE = linea([SOL[0], SOL[1] + 26], [SOL[0], CENTRO_SOL[1] - 168]);

type Llamada = { pieza: string; codigo: string; punto: Punto; chip: Punto };

// Llamadas (líneas guía) de cada pieza al código de su servicio.
const LLAMADAS: Llamada[] = [
  { pieza: PIEZA_SERVICIO["GVC-ENR-02"], codigo: "ENR-02", punto: [150, 322], chip: [150, 246] },
  { pieza: PIEZA_SERVICIO["GVC-ENR-01"], codigo: "ENR-01", punto: [420, COFRE.y - 4], chip: [420, 244] },
  // Las dos del gabinete van a distinta altura para que sus códigos no se toquen.
  { pieza: PIEZA_SERVICIO["GVC-ENR-03"], codigo: "ENR-03", punto: [GAB.x + 22, RIEL_DC - 4], chip: [GAB.x + 22, 214] },
  { pieza: PIEZA_SERVICIO["GVC-ENR-04"], codigo: "ENR-04", punto: [gabDer + 5, GAB.y - 4], chip: [gabDer + 5, 182] },
];

const ETIQUETAS: { texto: string; punto: Punto }[] = [
  { texto: "DC", punto: [(PUNTO_ARREGLO[0] + COFRE.x) / 2, PUNTO_ARREGLO[1] - 4] },
  { texto: "DC", punto: [(cofreDer + PROF[0] + GAB.x) / 2, Y_DC_2 - 4] },
  { texto: "AC", punto: [596, Y_AC - 4] },
];

const estiloOrden = (orden: number) => ({ "--orden": orden }) as CSSProperties;

// Lo que un lector de pantalla oye en lugar del dibujo (el SVG y los códigos van ocultos).
const DESCRIPCION =
  "Esquema en líneas de un sistema fotovoltaico: arreglo de módulos (ENR-02) conectado en corriente continua a un cofre fotovoltaico (ENR-01) y a un gabinete eléctrico (ENR-04) con protecciones DC y AC (ENR-03), del que sale la corriente alterna.";

export default function EsquemaFotovoltaico({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label={DESCRIPCION}
      className={cn("energia-esquema relative w-full", className)}
      style={{ aspectRatio: `${ANCHO} / ${ALTO}` }}
    >
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 size-full overflow-visible text-white"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
      >
        {/* Trayectoria del sol: el sol la recorre mientras el hero sale de pantalla. */}
        <g className="energia-pieza">
          <path d={ARCO_SOL} strokeOpacity={0.28} strokeDasharray="2 7" className="energia-aparece" />
          <path d={MARCAS_SOL} strokeOpacity={0.3} className="energia-aparece" />
          <g className="energia-sol">
            <path d={RAYO_INCIDENTE} className="stroke-accent" strokeOpacity={0.55} strokeDasharray="3 6" />
            <circle cx={SOL[0]} cy={SOL[1]} r={10} className="fill-accent/20 stroke-accent" strokeWidth={1.6} />
            <path d={RAYOS} className="stroke-accent" strokeWidth={1.6} />
          </g>
        </g>

        {/* Suelo con marcas de escala y cota del arreglo. */}
        <g className="energia-pieza" strokeOpacity={0.4}>
          <Trazo d={SUELO_LINEA} orden={0} />
          <path d={SUELO_MARCAS} className="energia-aparece" />
          <Trazo d={COTA} orden={14} strokeOpacity={0.5} />
        </g>

        {/* Cableado y pulso de energía (detrás de las cajas). */}
        <g className="energia-pieza" strokeOpacity={0.75}>
          <Trazo d={DC_1} orden={8} />
          <Trazo d={DC_2} orden={11} />
          <Trazo d={AC} orden={15} />
        </g>
        <path
          d={FLUJO}
          pathLength={100}
          className="energia-flujo stroke-accent-strong"
          strokeWidth={2.6}
          strokeDasharray="3 47"
        />

        {/* GVC-ENR-02 · Montaje: módulos y estructura. */}
        <g data-pieza={PIEZA_SERVICIO["GVC-ENR-02"]} className="energia-pieza">
          <path d={HUELLA} strokeOpacity={0.3} strokeDasharray="3 5" className="energia-aparece" />
          <Trazo d={PATAS + RIOSTRA} orden={2} strokeOpacity={0.7} />
          {MODULOS.map((p0, i) => (
            <g key={i}>
              <path d={contornoModulo(p0)} className="energia-caja" stroke="none" />
              <Trazo d={contornoModulo(p0)} orden={3 + (i % 4) + Math.floor(i / 4)} strokeWidth={1.6} />
              <path d={celdasModulo(p0)} strokeOpacity={0.35} strokeWidth={1} className="energia-aparece" style={estiloOrden(4 + i)} />
            </g>
          ))}
        </g>

        {/* GVC-ENR-01 · Cofre fotovoltaico metálico. */}
        <g data-pieza={PIEZA_SERVICIO["GVC-ENR-01"]} className="energia-pieza">
          <Trazo d={COFRE_POSTE} orden={9} strokeOpacity={0.7} />
          <path d={COFRE_VOLUMEN} className="energia-caja" stroke="none" />
          <Trazo d={COFRE_VOLUMEN} orden={9} strokeOpacity={0.6} />
          <path d={COFRE_FRENTE} className="energia-caja" stroke="none" />
          <Trazo d={COFRE_FRENTE} orden={9} strokeWidth={1.6} />
          <Trazo d={COFRE_DETALLE} orden={10} strokeOpacity={0.55} strokeWidth={1.1} />
        </g>

        {/* GVC-ENR-04 · Gabinete: envolvente, placa, rieles, canaleta y borneras. */}
        <g data-pieza={PIEZA_SERVICIO["GVC-ENR-04"]} className="energia-pieza">
          <path d={GAB_VOLUMEN} className="energia-caja" stroke="none" />
          <Trazo d={GAB_VOLUMEN} orden={12} strokeOpacity={0.6} />
          <path d={GAB_FRENTE} className="energia-caja" stroke="none" />
          <Trazo d={GAB_FRENTE} orden={12} strokeWidth={1.6} />
          <Trazo d={GAB_INTERIOR + GAB_RIELES} orden={13} strokeOpacity={0.5} strokeWidth={1.1} />
          <Trazo d={GAB_CANALETA + GAB_BORNES} orden={14} strokeOpacity={0.45} strokeWidth={1} />
        </g>

        {/* GVC-ENR-03 · Protecciones AC y DC sobre los rieles. */}
        <g data-pieza={PIEZA_SERVICIO["GVC-ENR-03"]} className="energia-pieza">
          <path d={PROTECCIONES} className="energia-caja" stroke="none" />
          <Trazo d={PROTECCIONES} orden={14} strokeWidth={1.2} />
          <path d={PALANCAS} className="fill-accent stroke-accent energia-aparece" strokeWidth={0.8} style={estiloOrden(16)} />
        </g>

        {/* Líneas guía hacia los códigos de servicio. */}
        <g className="energia-pieza" strokeOpacity={0.55} strokeWidth={1}>
          {LLAMADAS.map(({ pieza, punto, chip }) => (
            <g key={pieza}>
              <Trazo d={linea(punto, [punto[0], chip[1]])} orden={16} />
              <circle cx={punto[0]} cy={punto[1]} r={2.4} className="fill-white energia-aparece" stroke="none" style={estiloOrden(16)} />
            </g>
          ))}
        </g>
      </svg>

      {/* Textos en HTML, encima del dibujo: códigos de servicio y tipo de corriente. */}
      {LLAMADAS.map(({ pieza, codigo, chip }, i) => (
        <span
          key={pieza}
          aria-hidden="true"
          data-chip={pieza}
          className="energia-chip absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-[2px] border border-white/30 bg-brand-deep px-1.5 py-1 text-[10px] font-semibold leading-none tracking-[0.14em] text-white tabular-nums"
          style={{ left: pct(chip[0], ANCHO), top: pct(chip[1], ALTO), ...estiloOrden(i) }}
        >
          <span className="sm:hidden">{codigo.slice(-2)}</span>
          <span className="hidden sm:inline">{codigo}</span>
        </span>
      ))}
      {ETIQUETAS.map(({ texto, punto }, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="energia-etiqueta absolute hidden -translate-x-1/2 -translate-y-full text-[9px] font-semibold leading-none tracking-[0.2em] text-zinc-300 sm:block"
          style={{ left: pct(punto[0], ANCHO), top: pct(punto[1], ALTO) }}
        >
          {texto}
        </span>
      ))}
    </div>
  );
}
