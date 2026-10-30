import type { ReactNode } from "react";
import { linea, mas, pct, poligono, por, rect, Trazo, type Punto } from "./trazos";
import type { CodigoServicio } from "./datos";
import "./energia.css";

/*
 * Un pictograma técnico por servicio, en el mismo lenguaje de líneas del
 * esquema del hero. Se dibujan con el scroll (energia.css, .energia-lienzo).
 * Las etiquetas son HTML encima del dibujo; el dibujo es decorativo porque la
 * tarjeta ya dice lo mismo en texto.
 */

const ANCHO = 320;
const ALTO = 180;

function Lienzo({ children, etiquetas = [] }: { children: ReactNode; etiquetas?: { texto: string; punto: Punto }[] }) {
  return (
    <div className="absolute inset-0">
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 size-full text-brand"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
      >
        {children}
      </svg>
      {etiquetas.map(({ texto, punto }) => (
        <span
          key={texto}
          aria-hidden="true"
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold uppercase leading-none tracking-[0.18em] text-zinc-600"
          style={{ left: pct(punto[0], ANCHO), top: pct(punto[1], ALTO) }}
        >
          {texto}
        </span>
      ))}
    </div>
  );
}

/** Cota con remates oblicuos, como en un plano. */
function cota(a: Punto, b: Punto): string {
  const remate = (p: Punto) => linea([p[0] - 3, p[1] + 3], [p[0] + 3, p[1] - 3]);
  return linea(a, b) + remate(a) + remate(b);
}

/* ---------- GVC-ENR-01 · Cofre fotovoltaico metálico rígido ---------- */
function PictogramaCofre() {
  const x = 112;
  const y = 38;
  const w = 72;
  const h = 108;
  const prof: Punto = [26, -16];
  const der = x + w;
  const abajo = y + h;
  const tapa = poligono([x, y], mas([x, y], prof), mas([der, y], prof), [der, y]);
  const lateral = poligono([der, y], mas([der, y], prof), mas([der, abajo], prof), [der, abajo]);
  // Rayado de corte en la cara lateral: convención de material metálico.
  const rayado = [62, 82, 102, 122, 142].map((y0) => linea([der, y0], [der + prof[0], y0 - 30])).join("");
  const puerta = rect(x + 6, y + 6, w - 12, h - 12);
  const herrajes = rect(x - 3, y + 16, 4, 14) + rect(x - 3, abajo - 30, 4, 14) + rect(der - 16, y + 46, 5, 16);
  const placa = rect(x + 16, y + 16, 30, 10);
  const rejilla = [0, 1, 2].map((i) => linea([x + 16, abajo - 30 + i * 6], [x + 40, abajo - 30 + i * 6])).join("");
  const prensaestopas = rect(x + 14, abajo, 8, 5) + rect(der - 22, abajo, 8, 5);
  const cables =
    linea([x + 18, abajo + 5], [x + 18, 164], [40, 164]) + linea([der - 18, abajo + 5], [der - 18, 164], [276, 164]);

  return (
    <Lienzo>
      <path d={tapa + lateral} className="fill-white" stroke="none" />
      <Trazo d={tapa + lateral} orden={1} strokeOpacity={0.6} />
      <Trazo d={rayado} orden={3} strokeOpacity={0.3} strokeWidth={1} />
      <path d={rect(x, y, w, h)} className="fill-white" stroke="none" />
      <Trazo d={rect(x, y, w, h)} orden={0} strokeWidth={1.8} />
      <Trazo d={puerta + herrajes} orden={2} strokeOpacity={0.7} strokeWidth={1.1} />
      <Trazo d={placa + rejilla} orden={3} strokeOpacity={0.5} strokeWidth={1} />
      <Trazo d={prensaestopas} orden={4} strokeOpacity={0.7} />
      <Trazo d={cables} orden={5} className="stroke-accent" strokeWidth={1.8} />
      <Trazo d={cota([92, y], [92, abajo]) + cota([x, 18], [der, 18])} orden={6} strokeOpacity={0.45} strokeWidth={1} />
    </Lienzo>
  );
}

/* ---------- GVC-ENR-02 · Montaje residencial, comercial e industrial ---------- */

/** Módulos apoyados sobre un plano inclinado (vista lateral), de t0 a t1 a lo largo de la pendiente. */
function modulosEnPendiente(inicio: Punto, fin: Punto, tramos: [number, number][], grosor = 4): string {
  const dx = fin[0] - inicio[0];
  const dy = fin[1] - inicio[1];
  const largo = Math.hypot(dx, dy);
  const u: Punto = [dx / largo, dy / largo];
  // Normal hacia arriba de la pendiente.
  const n: Punto = u[0] >= 0 ? [u[1], -u[0]] : [-u[1], u[0]];
  return tramos
    .map(([t0, t1]) => {
      const a = mas(mas(inicio, por(u, t0)), por(n, 2));
      const b = mas(mas(inicio, por(u, t1)), por(n, 2));
      return poligono(a, b, mas(b, por(n, grosor)), mas(a, por(n, grosor)));
    })
    .join("");
}

function PictogramaMontaje() {
  const suelo = 150;
  // Vivienda (todo el conjunto sube 14 al final para centrarlo con sus etiquetas)
  const casaTecho: Punto[] = [[20, 104], [60, 68], [100, 104]];
  const casa = rect(28, 100, 64, suelo - 100) + rect(52, 124, 14, suelo - 124) + rect(34, 112, 12, 10) + rect(74, 112, 12, 10);
  const casaModulos = modulosEnPendiente(casaTecho[1], casaTecho[2], [[6, 17], [18, 29], [30, 41]]);
  // Local comercial
  const local =
    rect(124, 88, 76, suelo - 88) +
    linea([120, 88], [204, 88]) +
    poligono([120, 106], [204, 106], [198, 116], [126, 116]) +
    rect(132, 122, 26, suelo - 122) +
    rect(166, 122, 26, 16);
  const localModulos = [0, 1, 2]
    .map((i) => {
      const x0 = 130 + i * 24;
      return poligono([x0, 84], [x0 + 18, 74], [x0 + 18, 77], [x0, 87]) + linea([x0 + 15, 76], [x0 + 15, 88]);
    })
    .join("");
  // Nave industrial con cubierta en diente de sierra
  const nave = rect(220, 96, 84, suelo - 96) + rect(246, 120, 32, suelo - 120);
  const sierra = linea([220, 96], [220, 76], [248, 96], [248, 76], [276, 96], [276, 76], [304, 96]);
  const persiana = [0, 1, 2, 3, 4].map((i) => linea([246, 126 + i * 5], [278, 126 + i * 5])).join("");
  const naveModulos = [0, 1, 2]
    .map((i) => modulosEnPendiente([220 + i * 28, 76], [248 + i * 28, 96], [[5, 16], [17, 28]], 3))
    .join("");

  return (
    <Lienzo
      etiquetas={[
        { texto: "Residencial", punto: [60, 152] },
        { texto: "Comercial", punto: [162, 152] },
        { texto: "Industrial", punto: [262, 152] },
      ]}
    >
      <g transform="translate(0 -14)">
      <Trazo d={linea([10, suelo], [310, suelo])} orden={0} strokeOpacity={0.45} />
      <path d={casa + poligono(...casaTecho)} className="fill-white" stroke="none" />
      <Trazo d={linea(...casaTecho) + casa} orden={1} strokeWidth={1.6} />
      <path d={local} className="fill-white" stroke="none" />
      <Trazo d={local} orden={2} strokeWidth={1.6} />
      <path d={nave} className="fill-white" stroke="none" />
      <Trazo d={sierra + nave} orden={3} strokeWidth={1.6} />
      <Trazo d={persiana} orden={4} strokeOpacity={0.4} strokeWidth={1} />
      <path d={casaModulos + localModulos + naveModulos} className="fill-accent/15" stroke="none" />
      <Trazo d={casaModulos + localModulos + naveModulos} orden={5} className="stroke-accent" strokeWidth={1.4} />
      </g>
    </Lienzo>
  );
}

/* ---------- GVC-ENR-03 · Protecciones AC y DC sobre riel DIN ---------- */
function PictogramaProtecciones() {
  const arriba = 62;
  const alto = 70;
  const riel = 97;
  // [x, polos]: ancho de 18 por polo; el último de AC es el diferencial.
  const dc: [number, number][] = [[34, 2], [78, 2]];
  const ac: [number, number][] = [[150, 2], [192, 1], [214, 1], [236, 2]];
  const cuerpo = (x: number, polos: number) => {
    const w = polos * 18;
    return (
      rect(x, arriba, w, alto) +
      rect(x + 3, arriba + 14, w - 6, alto - 28) +
      rect(x + w / 2 - 5, riel - 9, 10, 16)
    );
  };
  const palanca = (x: number, polos: number) => rect(x + polos * 9 - 3, riel - 8, 6, 7);
  const bornes = (x: number, polos: number) =>
    Array.from({ length: polos }, (_, p) => {
      const cx = x + 9 + p * 18;
      return rect(cx - 2.5, arriba + 4, 5, 5) + rect(cx - 2.5, arriba + alto - 9, 5, 5);
    }).join("");
  const cables = (x: number, polos: number) =>
    Array.from({ length: polos }, (_, p) => {
      const cx = x + 9 + p * 18;
      return linea([cx, arriba + 4], [cx, 44]) + linea([cx, arriba + alto - 4], [cx, 166]);
    }).join("");
  const todos = [...dc, ...ac];
  const rielDin =
    rect(16, riel - 4, 288, 8) +
    Array.from({ length: 17 }, (_, i) => linea([22 + i * 17, riel - 1], [30 + i * 17, riel - 1])).join("");
  // Símbolos de corriente: + y − sobre DC, onda sobre AC (dibujo, no texto).
  const simbolos =
    linea([45, 30], [53, 30]) + linea([49, 26], [49, 34]) + linea([99, 30], [107, 30]) +
    "M200 30c4-7 8-7 12 0s8 7 12 0";

  return (
    <Lienzo
      etiquetas={[
        { texto: "DC", punto: [76, 30] },
        { texto: "AC", punto: [254, 30] },
      ]}
    >
      <Trazo d={cables(dc[0][0], 2) + cables(dc[1][0], 2)} orden={4} className="stroke-accent" strokeWidth={1.4} />
      <Trazo d={ac.map(([x, p]) => cables(x, p)).join("")} orden={4} strokeOpacity={0.5} strokeWidth={1.2} />
      <path d={rielDin} className="fill-white" stroke="none" />
      <Trazo d={rielDin} orden={0} strokeOpacity={0.5} strokeWidth={1} />
      <path d={todos.map(([x, p]) => rect(x, arriba, p * 18, alto)).join("")} className="fill-white" stroke="none" />
      <Trazo d={todos.map(([x, p]) => cuerpo(x, p)).join("")} orden={1} strokeWidth={1.4} />
      <Trazo d={todos.map(([x, p]) => bornes(x, p)).join("")} orden={2} strokeOpacity={0.55} strokeWidth={1} />
      <path d={todos.map(([x, p]) => palanca(x, p)).join("")} className="fill-accent stroke-accent energia-aparece" strokeWidth={0.8} />
      <Trazo d={rect(266, arriba + 20, 4, 6)} orden={3} strokeOpacity={0.6} strokeWidth={1} />
      <path d={linea([134, 22], [134, 168])} strokeOpacity={0.35} strokeDasharray="3 4" strokeWidth={1} className="energia-aparece" />
      <Trazo d={simbolos} orden={5} strokeOpacity={0.7} strokeWidth={1.2} />
    </Lienzo>
  );
}

/* ---------- GVC-ENR-04 · Ensamble de gabinete eléctrico ---------- */
function PictogramaEnsamble() {
  const x = 122;
  const y = 18;
  const w = 112;
  const h = 140;
  const der = x + w;
  const abajo = y + h;
  const puerta = poligono([x, y], [x - 46, y + 14], [x - 46, abajo - 12], [x, abajo]);
  const puertaDetalle =
    poligono([x - 5, y + 8], [x - 41, y + 19], [x - 41, abajo - 17], [x - 5, abajo - 6]) +
    linea([x - 36, y + 64], [x - 36, y + 82]);
  const placa = rect(x + 8, y + 8, w - 16, h - 16);
  const canaletas =
    rect(x + 12, y + 14, w - 24, 8) +
    rect(x + 12, y + 78, w - 24, 8) +
    rect(der - 20, y + 22, 8, 56) +
    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => linea([x + 20 + i * 10, y + 14], [x + 20 + i * 10, y + 18])).join("");
  const rieles = linea([x + 14, y + 48], [der - 26, y + 48]) + linea([x + 14, y + 112], [der - 14, y + 112]);
  const breakers = [0, 1, 2, 3, 4].map((i) => rect(x + 16 + i * 14, y + 36, 12, 24)).join("");
  const palancas = [0, 1, 2, 3, 4].map((i) => rect(x + 20 + i * 14, y + 42, 4, 6)).join("");
  const bornera = Array.from({ length: 11 }, (_, i) => rect(x + 16 + i * 7.6, y + 104, 5, 16)).join("");
  const cableado =
    [0, 1, 2, 3, 4].map((i) => linea([x + 22 + i * 14, y + 60], [x + 22 + i * 14, y + 78])).join("") +
    Array.from({ length: 6 }, (_, i) => linea([x + 18.5 + i * 15.2, y + 120], [x + 18.5 + i * 15.2, abajo - 8])).join("");
  const base = rect(x + 4, abajo, 12, 6) + rect(der - 16, abajo, 12, 6);

  return (
    <Lienzo>
      <path d={puerta} className="fill-white" stroke="none" />
      <Trazo d={puerta} orden={1} strokeOpacity={0.7} />
      <Trazo d={puertaDetalle} orden={2} strokeOpacity={0.35} strokeWidth={1} />
      <path d={rect(x, y, w, h)} className="fill-white" stroke="none" />
      <Trazo d={rect(x, y, w, h) + base} orden={0} strokeWidth={1.8} />
      <Trazo d={placa} orden={1} strokeOpacity={0.35} strokeWidth={1} />
      <Trazo d={canaletas} orden={2} strokeOpacity={0.55} strokeWidth={1} />
      <Trazo d={rieles} orden={3} strokeOpacity={0.6} strokeWidth={1.2} />
      <Trazo d={cableado} orden={3} className="stroke-accent" strokeWidth={1.3} />
      <path d={breakers + bornera} className="fill-white" stroke="none" />
      <Trazo d={breakers} orden={4} strokeWidth={1.3} />
      <Trazo d={bornera} orden={5} strokeOpacity={0.7} strokeWidth={1} />
      <path d={palancas} className="fill-accent stroke-accent energia-aparece" strokeWidth={0.8} />
      <Trazo d={cota([der + 18, y], [der + 18, abajo])} orden={6} strokeOpacity={0.45} strokeWidth={1} />
    </Lienzo>
  );
}

const PICTOGRAMAS: Record<CodigoServicio, () => ReactNode> = {
  "GVC-ENR-01": PictogramaCofre,
  "GVC-ENR-02": PictogramaMontaje,
  "GVC-ENR-03": PictogramaProtecciones,
  "GVC-ENR-04": PictogramaEnsamble,
};

export default function Pictograma({ codigo }: { codigo: CodigoServicio }) {
  const Dibujo = PICTOGRAMAS[codigo];
  return <Dibujo />;
}
