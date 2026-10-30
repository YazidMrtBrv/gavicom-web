import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cn } from "@/lib/cn";

/*
 * Utilidades para las ilustraciones técnicas de GAVICOM Energy. Las figuras
 * se describen con coordenadas en el viewBox y se convierten a trazos <path>:
 * así cada línea puede "dibujarse" con stroke-dashoffset (energia.css).
 */

export type Punto = readonly [number, number];

// Un decimal basta para el trazo y deja el HTML del servidor más liviano.
const r = (n: number) => Math.round(n * 10) / 10;
const par = ([x, y]: Punto) => `${r(x)} ${r(y)}`;

export const mas = (a: Punto, b: Punto): Punto => [a[0] + b[0], a[1] + b[1]];
export const por = (a: Punto, k: number): Punto => [a[0] * k, a[1] * k];

export function rect(x: number, y: number, ancho: number, alto: number): string {
  return `M${r(x)} ${r(y)}h${r(ancho)}v${r(alto)}h${r(-ancho)}Z`;
}

export function poligono(...puntos: Punto[]): string {
  return `M${puntos.map(par).join("L")}Z`;
}

export function linea(...puntos: Punto[]): string {
  return `M${puntos.map(par).join("L")}`;
}

/** Arco de circunferencia entre dos ángulos (grados, 0 = arriba, sentido horario). */
export function arco(centro: Punto, radio: number, desde: number, hasta: number): string {
  const punto = (grados: number): Punto => {
    const rad = (grados * Math.PI) / 180;
    return [centro[0] + radio * Math.sin(rad), centro[1] - radio * Math.cos(rad)];
  };
  const grande = Math.abs(hasta - desde) > 180 ? 1 : 0;
  const barrido = hasta > desde ? 1 : 0;
  return `M${par(punto(desde))}A${r(radio)} ${r(radio)} 0 ${grande} ${barrido} ${par(punto(hasta))}`;
}

/** Punto sobre una circunferencia (grados, 0 = arriba, sentido horario). */
export function polar(centro: Punto, radio: number, grados: number): Punto {
  const rad = (grados * Math.PI) / 180;
  return [centro[0] + radio * Math.sin(rad), centro[1] - radio * Math.cos(rad)];
}

/** Porcentaje para ubicar una etiqueta HTML sobre el SVG (mismo aspecto que el viewBox). */
export const pct = (valor: number, total: number) => `${r((valor / total) * 1000) / 10}%`;

type TrazoProps = { d: string; orden?: number } & Omit<
  ComponentPropsWithoutRef<"path">,
  "d" | "pathLength"
>;

/**
 * Línea que se dibuja. pathLength=100 normaliza el largo de cualquier trazo
 * para que el mismo stroke-dasharray sirva a todos. `orden` escalona la entrada.
 */
export function Trazo({ d, orden = 0, className, style, ...resto }: TrazoProps) {
  return (
    <path
      d={d}
      pathLength={100}
      className={cn("energia-trazo", className)}
      style={{ "--orden": orden, ...style } as CSSProperties}
      {...resto}
    />
  );
}
