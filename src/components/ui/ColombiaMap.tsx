"use client";

import type { CSSProperties, PointerEvent } from "react";
import { CONTOUR_LINES, DEPTO_ELEVACION, DEPTO_PATHS, type ElevationBand } from "@/data/colombia-paths";
import { ZONAS_COBERTURA, type ClaveZona } from "@/components/portada/zonasCobertura";
import estilos from "@/components/portada/portada.module.css";
import { cn } from "@/lib/cn";

type Punto = [x: number, y: number];
type ConVariables = CSSProperties & Record<`--${string}`, string | number>;

// Tintes del azul de marca por altitud: conservan la lectura topográfica del
// mapa anterior sin salirse de la paleta del manual.
const BRAND = "20 59 100";
const RELLENO_ALTITUD: Record<ElevationBand, string> = {
  baja: `rgb(${BRAND} / 0.10)`,
  media: `rgb(${BRAND} / 0.25)`,
  alta: `rgb(${BRAND} / 0.45)`,
};
const RELLENO_ATENUADO = `rgb(${BRAND} / 0.08)`;
// En hex y no var(--brand): no todos los navegadores resuelven var() en los
// atributos de presentación de SVG.
const COLOR = { brand: "#143B64", brandDeep: "#0C2642", accent: "#E8920C", blanco: "#ffffff" } as const;
const RELLENO_SIN_COBERTURA = COLOR.blanco;
const CONTORNO = "#d4d4d8";

export const LEYENDA_ALTITUD: { banda: ElevationBand; rotulo: string; relleno: string }[] = [
  { banda: "baja", rotulo: "0–500 m", relleno: RELLENO_ALTITUD.baja },
  { banda: "media", rotulo: "500–2.000 m", relleno: RELLENO_ALTITUD.media },
  { banda: "alta", rotulo: "+2.000 m", relleno: RELLENO_ALTITUD.alta },
];

// Centroide del anillo más grande de cada departamento. Los trazados son
// polilíneas absolutas (M/L/Z), así que basta la fórmula del polígono.
function centroide(d: string): Punto {
  let mejor = { area: 0, x: 0, y: 0 };
  for (const anillo of d.split("M")) {
    const puntos = Array.from(anillo.matchAll(/(-?[\d.]+),(-?[\d.]+)/g), (m) => [Number(m[1]), Number(m[2])]);
    if (puntos.length < 3) continue;
    let area = 0;
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < puntos.length; i++) {
      const [x1, y1] = puntos[i];
      const [x2, y2] = puntos[(i + 1) % puntos.length];
      const cruz = x1 * y2 - x2 * y1;
      area += cruz;
      cx += (x1 + x2) * cruz;
      cy += (y1 + y2) * cruz;
    }
    if (Math.abs(area) > Math.abs(mejor.area)) mejor = { area, x: cx / (3 * area), y: cy / (3 * area) };
  }
  return [mejor.x, mejor.y];
}

const CENTROIDES: Record<string, Punto> = Object.fromEntries(
  DEPTO_PATHS.map((depto) => [depto.codigo, centroide(depto.d)])
);

const ZONA_DE_DEPTO: Record<string, ClaveZona> = Object.fromEntries(
  ZONAS_COBERTURA.flatMap((zona) => zona.codigos.map((codigo) => [codigo, zona.clave]))
);

function fijo(n: number): string {
  return n.toFixed(1);
}

interface Corredor {
  clave: ClaveZona;
  zona: string;
  d: string;
  nodos: { codigo: string; punto: Punto; fraccion: number }[];
  etiqueta: Punto;
}

// Cada corredor une los departamentos de su zona en el orden de
// ZONAS_COBERTURA. La fracción de cada nodo (por longitud) sirve para que
// aparezca justo cuando el trazo llega a él.
const CORREDORES: Corredor[] = ZONAS_COBERTURA.map((zona) => {
  const puntos = zona.codigos.map((codigo) => CENTROIDES[codigo]);
  const tramos = puntos.slice(1).map((p, i) => Math.hypot(p[0] - puntos[i][0], p[1] - puntos[i][1]));
  const largo = tramos.reduce((suma, tramo) => suma + tramo, 0) || 1;
  let recorrido = 0;
  const nodos = zona.codigos.map((codigo, i) => {
    if (i > 0) recorrido += tramos[i - 1];
    return { codigo, punto: puntos[i], fraccion: recorrido / largo };
  });
  const cx = puntos.reduce((s, p) => s + p[0], 0) / puntos.length;
  const cy = puntos.reduce((s, p) => s + p[1], 0) / puntos.length;
  return {
    clave: zona.clave,
    zona: zona.zona,
    d: `M${puntos.map(([x, y]) => `${fijo(x)},${fijo(y)}`).join("L")}`,
    nodos,
    etiqueta: [cx + zona.etiqueta.dx, cy + zona.etiqueta.dy],
  };
});

// Atlántico: la sede está en Barranquilla.
const SEDE = CENTROIDES["08"];

interface ColombiaMapProps {
  /** Zona resaltada (vista previa o fijada); null para ninguna. */
  activa: ClaveZona | null;
  /** Al pasar el cursor por un departamento (null al salir del mapa o de la cobertura). */
  alPrevisualizar: (zona: ClaveZona | null) => void;
  /** Al tocar o hacer clic en un departamento con cobertura. */
  alFijar: (zona: ClaveZona | null) => void;
  className?: string;
}

/*
 * Mapa de cobertura operativa (no de clientes ni proyectos). Es controlado:
 * la lista de zonas que lo acompaña y el propio mapa comparten la zona activa.
 * Los departamentos no reciben foco (serían 33 paradas de tabulador): el
 * teclado y los lectores de pantalla usan la lista, que dice lo mismo.
 */
export default function ColombiaMap({ activa, alPrevisualizar, alFijar, className }: ColombiaMapProps) {
  const alEntrar = (codigo: string) => (evento: PointerEvent<SVGPathElement>) => {
    if (evento.pointerType !== "mouse") return;
    alPrevisualizar(ZONA_DE_DEPTO[codigo] ?? null);
  };

  return (
    <svg
      viewBox="0 0 400 550"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn(estilos.mapa, "block h-auto w-full select-none", className)}
      onPointerLeave={(evento) => evento.pointerType === "mouse" && alPrevisualizar(null)}
    >
      {DEPTO_PATHS.map((depto) => {
        const zona = ZONA_DE_DEPTO[depto.codigo];
        const elevacion = DEPTO_ELEVACION[depto.codigo] as ElevationBand | undefined;
        const enZonaActiva = zona !== undefined && zona === activa;

        let relleno: string = RELLENO_SIN_COBERTURA;
        if (zona && enZonaActiva) relleno = COLOR.brand;
        else if (zona && activa) relleno = RELLENO_ATENUADO;
        else if (zona) relleno = RELLENO_ALTITUD[elevacion ?? "baja"];

        return (
          <path
            key={depto.codigo}
            d={depto.d}
            style={{ fill: relleno }}
            stroke={CONTORNO}
            strokeWidth={0.6}
            strokeLinejoin="round"
            className={cn(
              "transition-[fill] duration-300 ease-out",
              zona ? "cursor-pointer" : "cursor-default"
            )}
            onPointerEnter={alEntrar(depto.codigo)}
            onClick={() => alFijar(zona ?? null)}
          />
        );
      })}

      {/* Borde accent de la zona activa, encima de sus vecinos para que no lo tapen. */}
      {activa &&
        DEPTO_PATHS.filter((depto) => ZONA_DE_DEPTO[depto.codigo] === activa).map((depto) => (
          <path
            key={`borde-${depto.codigo}`}
            d={depto.d}
            stroke={COLOR.accent}
            strokeWidth={1.2}
            strokeLinejoin="round"
            className="pointer-events-none"
          />
        ))}

      {/* Curvas de nivel: textura de plano, sin interacción. */}
      <g className="pointer-events-none" stroke={COLOR.brand} strokeLinecap="round">
        {CONTOUR_LINES.map((d, i) => (
          <path key={i} d={d} strokeWidth={i < 72 ? 0.5 : 0.4} strokeOpacity={i < 72 ? 0.14 : 0.08} />
        ))}
      </g>

      {/* Corredores de las cinco zonas: se dibujan uno tras otro al entrar en pantalla. */}
      <g className="pointer-events-none">
        {CORREDORES.map((corredor, i) => {
          const resaltado = corredor.clave === activa;
          const atenuado = activa !== null && !resaltado;
          return (
            <g
              key={corredor.clave}
              style={{ "--i": i } as ConVariables}
              className={cn("transition-opacity duration-300", atenuado && "opacity-35")}
            >
              <path
                d={corredor.d}
                pathLength={1}
                style={{ stroke: resaltado ? COLOR.accent : COLOR.brandDeep, strokeWidth: resaltado ? 2.4 : 1.5 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(estilos.corredor, "transition-[stroke,stroke-width] duration-300")}
              />
              {corredor.nodos.map((nodo) => (
                <circle
                  key={nodo.codigo}
                  cx={fijo(nodo.punto[0])}
                  cy={fijo(nodo.punto[1])}
                  r={resaltado ? 4 : 3.2}
                  fill={resaltado ? COLOR.accent : COLOR.blanco}
                  stroke={COLOR.brandDeep}
                  strokeWidth={1.4}
                  style={{ "--f": nodo.fraccion.toFixed(3) } as ConVariables}
                  className={estilos.nodoCorredor}
                />
              ))}
              <text
                x={fijo(corredor.etiqueta[0])}
                y={fijo(corredor.etiqueta[1])}
                textAnchor="middle"
                fontSize={8.5}
                fontWeight={600}
                letterSpacing={1.4}
                fill={COLOR.brandDeep}
                stroke={COLOR.blanco}
                strokeWidth={3}
                strokeLinejoin="round"
                paintOrder="stroke"
                style={{ "--f": 1 } as ConVariables}
                className={cn(estilos.nodoCorredor, "hidden uppercase sm:inline")}
              >
                {corredor.zona}
              </text>
            </g>
          );
        })}
      </g>

      {/* Sede en Barranquilla. */}
      <g className="pointer-events-none">
        <circle cx={fijo(SEDE[0])} cy={fijo(SEDE[1])} r={10} stroke={COLOR.accent} strokeWidth={1.2} className={estilos.sedePulso} />
        <rect
          x={fijo(SEDE[0] - 4.5)}
          y={fijo(SEDE[1] - 4.5)}
          width={9}
          height={9}
          fill={COLOR.brandDeep}
          stroke={COLOR.blanco}
          strokeWidth={1.5}
        />
        <text
          x={fijo(SEDE[0] - 14)}
          y={fijo(SEDE[1] - 10)}
          textAnchor="end"
          fontSize={8}
          fontWeight={600}
          letterSpacing={1.2}
          fill={COLOR.brandDeep}
          stroke={COLOR.blanco}
          strokeWidth={3}
          strokeLinejoin="round"
          paintOrder="stroke"
          className="hidden uppercase sm:inline"
        >
          Sede
        </text>
      </g>
    </svg>
  );
}
