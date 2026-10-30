import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import estilos from "./portada.module.css";

/*
 * Plano en líneas de un arreglo fotovoltaico con la trayectoria solar encima.
 * Es una ilustración, no una foto: GAVICOM Energy todavía no tiene fotos
 * propias y una foto ajena sería engañosa. La geometría se calcula aquí con una
 * perspectiva simple (cámara a 3,4 m mirando al horizonte) para que las filas
 * de módulos fuguen de verdad hacia el mismo punto.
 */

type Punto3D = [x: number, y: number, z: number];

const FOCAL = 400;
const ALTURA_CAMARA = 3.4;
const CENTRO_X = 300;
const HORIZONTE_Y = 280;
// La cámara mira un poco a la derecha del arreglo para que el conjunto
// arreglo + cofre quede centrado en el dibujo.
const DESPLAZAMIENTO_X = -0.45;

function proyectar([x, y, z]: Punto3D): [number, number] {
  return [
    CENTRO_X + (FOCAL * (x + DESPLAZAMIENTO_X)) / z,
    HORIZONTE_Y + (FOCAL * (ALTURA_CAMARA - y)) / z,
  ];
}

function punto(p: Punto3D): string {
  const [x, y] = proyectar(p);
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}

function interpolar(a: Punto3D, b: Punto3D, t: number): Punto3D {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function linea(a: Punto3D, b: Punto3D): string {
  return `M${punto(a)}L${punto(b)}`;
}

const MODULOS_POR_FILA = 5;
const ANCHO_MODULO = 1.1;
const X_INICIAL = -(MODULOS_POR_FILA * ANCHO_MODULO) / 2;
const FONDO_MODULO = 1.5;
const ALTURA_FRENTE = 0.5;
const ALTURA_FONDO = 1.5;

interface Fila {
  contorno: string;
  celdas: string;
  soportes: string;
}

function trazarFila(z: number): Fila {
  let contorno = "";
  let celdas = "";
  for (let m = 0; m < MODULOS_POR_FILA; m++) {
    const x1 = X_INICIAL + m * ANCHO_MODULO;
    const x2 = x1 + ANCHO_MODULO;
    const a: Punto3D = [x1, ALTURA_FRENTE, z];
    const b: Punto3D = [x2, ALTURA_FRENTE, z];
    const c: Punto3D = [x2, ALTURA_FONDO, z + FONDO_MODULO];
    const d: Punto3D = [x1, ALTURA_FONDO, z + FONDO_MODULO];
    contorno += `M${punto(a)}L${punto(b)}L${punto(c)}L${punto(d)}Z`;
    // Celdas del módulo vertical: 2 columnas por 4 filas.
    celdas += linea(interpolar(a, b, 0.5), interpolar(d, c, 0.5));
    for (const t of [0.25, 0.5, 0.75]) celdas += linea(interpolar(a, d, t), interpolar(b, c, t));
  }
  let soportes = "";
  for (const x of [X_INICIAL, 0, -X_INICIAL]) {
    soportes += linea([x, ALTURA_FRENTE, z], [x, 0, z]);
  }
  return { contorno, celdas, soportes };
}

// De la más lejana a la más cercana: así las cercanas tapan a las lejanas.
const PROFUNDIDADES = [14, 11.2, 8.4, 5.6];
const FILAS = PROFUNDIDADES.map(trazarFila);

function trazarSuelo(): string {
  let d = "";
  for (let x = -7.5; x <= 7.5; x += 1.5) d += linea([x, 0, 4.2], [x, 0, 40]);
  for (const z of [4.6, 6.2, 8.4, 11.5, 16, 24]) d += linea([-9, 0, z], [9, 0, z]);
  return d;
}

const SUELO = trazarSuelo();

const RADIO_ARCO = 210;
const ARCO = `M${CENTRO_X - RADIO_ARCO},${HORIZONTE_Y}A${RADIO_ARCO},${RADIO_ARCO} 0 0 1 ${CENTRO_X + RADIO_ARCO},${HORIZONTE_Y}`;

// Marcas horarias cada 15° sobre el arco, como un transportador.
const MARCAS_ARCO = Array.from({ length: 13 }, (_, i) => {
  const angulo = Math.PI - (i * Math.PI) / 12;
  const largo = i % 3 === 0 ? 12 : 6;
  const r1 = RADIO_ARCO - largo / 2;
  const r2 = RADIO_ARCO + largo / 2;
  const x1 = CENTRO_X + r1 * Math.cos(angulo);
  const y1 = HORIZONTE_Y - r1 * Math.sin(angulo);
  const x2 = CENTRO_X + r2 * Math.cos(angulo);
  const y2 = HORIZONTE_Y - r2 * Math.sin(angulo);
  return `M${x1.toFixed(1)},${y1.toFixed(1)}L${x2.toFixed(1)},${y2.toFixed(1)}`;
}).join("");

// Cota bajo la fila delantera: el detalle de plano que remata el dibujo.
const Z_COTA = PROFUNDIDADES[PROFUNDIDADES.length - 1];
const [COTA_X1, COTA_Y] = proyectar([X_INICIAL, 0, Z_COTA]);
const [COTA_X2] = proyectar([-X_INICIAL, 0, Z_COTA]);
const COTA_Y_LINEA = COTA_Y + 18;
const COTA = `M${COTA_X1.toFixed(1)},${COTA_Y_LINEA}L${COTA_X2.toFixed(1)},${COTA_Y_LINEA}M${COTA_X1.toFixed(1)},${COTA_Y_LINEA - 6}L${COTA_X1.toFixed(1)},${COTA_Y_LINEA + 6}M${COTA_X2.toFixed(1)},${COTA_Y_LINEA - 6}L${COTA_X2.toFixed(1)},${COTA_Y_LINEA + 6}`;

// Cofre metálico junto al arreglo, con su cable hasta la fila delantera: el
// resto de los servicios de la línea (cofres, protecciones, ensamble).
const COFRE_X1 = -X_INICIAL + 0.35;
const COFRE_X2 = COFRE_X1 + 0.6;
const COFRE_Z1 = Z_COTA - 0.2;
const COFRE_Z2 = COFRE_Z1 + 0.4;
const COFRE_ALTO = 1.1;

function poligono(puntos: Punto3D[]): string {
  return `M${puntos.map(punto).join("L")}Z`;
}

const COFRE_FRENTE = poligono([
  [COFRE_X1, 0, COFRE_Z1],
  [COFRE_X2, 0, COFRE_Z1],
  [COFRE_X2, COFRE_ALTO, COFRE_Z1],
  [COFRE_X1, COFRE_ALTO, COFRE_Z1],
]);
const COFRE_LADO = poligono([
  [COFRE_X1, 0, COFRE_Z1],
  [COFRE_X1, 0, COFRE_Z2],
  [COFRE_X1, COFRE_ALTO, COFRE_Z2],
  [COFRE_X1, COFRE_ALTO, COFRE_Z1],
]);
const COFRE_TAPA = poligono([
  [COFRE_X1, COFRE_ALTO, COFRE_Z1],
  [COFRE_X2, COFRE_ALTO, COFRE_Z1],
  [COFRE_X2, COFRE_ALTO, COFRE_Z2],
  [COFRE_X1, COFRE_ALTO, COFRE_Z2],
]);
const COFRE_PUERTA =
  poligono([
    [COFRE_X1 + 0.08, 0.1, COFRE_Z1],
    [COFRE_X2 - 0.08, 0.1, COFRE_Z1],
    [COFRE_X2 - 0.08, COFRE_ALTO - 0.1, COFRE_Z1],
    [COFRE_X1 + 0.08, COFRE_ALTO - 0.1, COFRE_Z1],
  ]) + linea([COFRE_X2 - 0.16, 0.5, COFRE_Z1], [COFRE_X2 - 0.16, 0.66, COFRE_Z1]);
const CABLE =
  linea([-X_INICIAL, 0.2, Z_COTA], [-X_INICIAL, 0.02, Z_COTA]) +
  `L${punto([COFRE_X1, 0.02, Z_COTA])}L${punto([COFRE_X1, 0.35, Z_COTA])}`;

function retardo(segundos: number): CSSProperties {
  return { "--retardo": `${segundos}s` } as CSSProperties;
}

export default function IlustracionSolar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 560"
      fill="none"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      className={cn("block", className)}
    >
      <defs>
        <clipPath id="solar-bajo-horizonte">
          <rect x="0" y={HORIZONTE_Y} width="600" height={560 - HORIZONTE_Y} />
        </clipPath>
        <linearGradient id="solar-suelo-desvanece" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.55" stopColor="white" stopOpacity="0.08" />
          <stop offset="1" stopColor="white" stopOpacity="0.14" />
        </linearGradient>
      </defs>

      {/* Suelo en perspectiva */}
      <path
        d={SUELO}
        pathLength={1}
        clipPath="url(#solar-bajo-horizonte)"
        stroke="url(#solar-suelo-desvanece)"
        strokeWidth="1"
        className={estilos.solarTrazo}
        style={retardo(0.2)}
      />
      <path
        d={`M0,${HORIZONTE_Y}L600,${HORIZONTE_Y}`}
        pathLength={1}
        stroke="white"
        strokeOpacity="0.28"
        strokeWidth="1"
        className={estilos.solarTrazo}
        style={retardo(0.1)}
      />

      {/* Trayectoria solar */}
      <path
        d={ARCO}
        pathLength={1}
        stroke="white"
        strokeOpacity="0.32"
        strokeWidth="1"
        className={estilos.solarTrazo}
        style={retardo(0.5)}
      />
      <path
        d={MARCAS_ARCO}
        pathLength={1}
        stroke="white"
        strokeOpacity="0.4"
        strokeWidth="1"
        className={estilos.solarTrazo}
        style={retardo(0.9)}
      />

      <g className={estilos.solOrbita} style={{ transformOrigin: `${CENTRO_X}px ${HORIZONTE_Y}px` }}>
        <path
          d={`M${CENTRO_X},${HORIZONTE_Y - RADIO_ARCO + 26}L${CENTRO_X},${HORIZONTE_Y - 8}`}
          stroke="white"
          strokeOpacity="0.14"
          strokeWidth="1"
          strokeDasharray="3 6"
        />
        <g className={estilos.solAstro}>
          <circle cx={CENTRO_X} cy={HORIZONTE_Y - RADIO_ARCO} r="24" stroke="#F5A623" strokeOpacity="0.35" strokeWidth="1" />
          <circle cx={CENTRO_X} cy={HORIZONTE_Y - RADIO_ARCO} r="12" fill="#E8920C" />
        </g>
      </g>

      {/* Filas de módulos, de atrás hacia delante */}
      {FILAS.map((fila, i) => {
        const inicio = 0.7 + i * 0.22;
        return (
          <g key={PROFUNDIDADES[i]}>
            <path
              d={fila.soportes}
              pathLength={1}
              stroke="white"
              strokeOpacity="0.35"
              strokeWidth="1.2"
              className={estilos.solarTrazo}
              style={retardo(inicio)}
            />
            <path d={fila.contorno} fill="#143B64" className={estilos.solarRelleno} style={retardo(inicio + 0.35)} />
            <path
              d={fila.celdas}
              pathLength={1}
              stroke="white"
              strokeOpacity="0.16"
              strokeWidth="0.8"
              className={estilos.solarTrazo}
              style={retardo(inicio + 0.45)}
            />
            <path
              d={fila.contorno}
              pathLength={1}
              stroke="white"
              strokeOpacity="0.62"
              strokeWidth="1.1"
              strokeLinejoin="round"
              className={estilos.solarTrazo}
              style={retardo(inicio)}
            />
          </g>
        );
      })}

      <g>
        <path d={`${COFRE_LADO}${COFRE_TAPA}`} fill="#0C2642" className={estilos.solarRelleno} style={retardo(1.7)} />
        <path d={COFRE_FRENTE} fill="#143B64" className={estilos.solarRelleno} style={retardo(1.7)} />
        <path
          d={`${COFRE_FRENTE}${COFRE_LADO}${COFRE_TAPA}`}
          pathLength={1}
          stroke="white"
          strokeOpacity="0.62"
          strokeWidth="1.1"
          strokeLinejoin="round"
          className={estilos.solarTrazo}
          style={retardo(1.5)}
        />
        <path
          d={COFRE_PUERTA}
          pathLength={1}
          stroke="white"
          strokeOpacity="0.3"
          strokeWidth="0.9"
          className={estilos.solarTrazo}
          style={retardo(1.9)}
        />
        <path
          d={CABLE}
          pathLength={1}
          stroke="#E8920C"
          strokeWidth="1.4"
          strokeLinejoin="round"
          className={estilos.solarTrazo}
          style={retardo(2.1)}
        />
      </g>

      <path
        d={COTA}
        pathLength={1}
        stroke="#F5A623"
        strokeOpacity="0.7"
        strokeWidth="1"
        className={estilos.solarTrazo}
        style={retardo(1.8)}
      />
    </svg>
  );
}
