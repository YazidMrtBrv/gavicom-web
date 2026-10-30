import { cn } from "@/lib/cn";
import estilos from "./servicios.module.css";

/*
 * Sección transversal de un riel Vignole (cabeza, alma y patín) dentro de dos
 * anillos que giran despacio: el sello "AREMA / UIC" de la página anterior,
 * ahora con algo que mirar. Es un esquema sin escala: las cotas no llevan
 * medidas porque no corresponden a ningún perfil suministrado.
 *
 * El perfil se dibuja en su propio sistema (0–200) y se coloca centrado en el
 * lienzo de 240 × 240 con translate(40 45) scale(0.8).
 */
const PERFIL =
  "M66,24 C66,18 72,15 100,15 C128,15 134,18 134,24 L134,52 L128,58 L110,64 Q108,65 108,72 L108,138 " +
  "Q108,146 116,148 L166,158 Q170,159 170,163 L170,172 L30,172 L30,163 Q30,159 34,158 L84,148 " +
  "Q92,146 92,138 L92,72 Q92,65 90,64 L72,58 L66,52 Z";

// Cotas: líneas de referencia, línea de cota y trazos oblicuos en los extremos.
const COTA_ALTO = "M10,15 H58 M10,172 H26 M14,15 V172 M10,19 L18,11 M10,176 L18,168";
const COTA_PATIN = "M30,176 V192 M170,176 V192 M30,188 H170 M26,192 L34,184 M166,192 L174,184";
const COTA_CABEZA = "M66,1 V11 M134,1 V11 M66,5 H134 M62,9 L70,1 M130,9 L138,1";

// Marcas del limbo cada 10°, más largas cada 30°.
const LIMBO = Array.from({ length: 36 }, (_, i) => {
  const angulo = (i * 10 * Math.PI) / 180;
  const interior = i % 3 === 0 ? 112 : 114;
  const x1 = 120 + interior * Math.cos(angulo);
  const y1 = 120 + interior * Math.sin(angulo);
  const x2 = 120 + 118 * Math.cos(angulo);
  const y2 = 120 + 118 * Math.sin(angulo);
  return `M${x1.toFixed(2)},${y1.toFixed(2)} L${x2.toFixed(2)},${y2.toFixed(2)}`;
}).join(" ");

// Guías hacia los rótulos (coordenadas del lienzo de 240).
const GUIAS = ["M147,72 L170,58 H186", "M126,129 H186", "M160,168 L172,180 H186"];

const ANILLOS = [
  {
    giro: estilos.anilloHorario,
    color: "stroke-white",
    r: 108,
    strokeOpacity: 0.35,
    strokeWidth: 0.8,
    strokeDasharray: "2 6",
  },
  {
    giro: estilos.anilloAntihorario,
    color: "stroke-accent",
    r: 100,
    strokeOpacity: 0.45,
    strokeWidth: 1.2,
    strokeDasharray: "40 14 4 14",
  },
];

/** Rótulos en HTML sobre el dibujo: posición en % del lienzo cuadrado. */
const ROTULOS: { texto: string; y: number }[] = [
  { texto: "Cabeza", y: 58 },
  { texto: "Alma", y: 129 },
  { texto: "Patín", y: 180 },
];
const X_ROTULOS = 188;

export default function PerfilRiel({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-square w-full", className)}>
      {/* Cada anillo gira en su propio <div>: el giro de un elemento HTML lo
          hace el compositor; el de un hijo de <svg> repintaría el dibujo en
          cada fotograma mientras la sección está en pantalla. */}
      {ANILLOS.map(({ giro, color, ...trazo }) => (
        <div key={giro} aria-hidden="true" className={cn(giro, "pointer-events-none absolute inset-0")}>
          <svg viewBox="0 0 240 240" fill="none" focusable="false" className="size-full">
            <circle cx={120} cy={120} className={color} {...trazo} />
          </svg>
        </div>
      ))}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 240 240"
        fill="none"
        className={cn(estilos.dibujo, "absolute inset-0 size-full overflow-visible text-white")}
      >
        <path d={LIMBO} stroke="currentColor" strokeOpacity={0.3} strokeWidth={0.8} />

        {/* Ejes del perfil, en trazo y punto como en un plano. */}
        <path
          d="M120,30 V214 M44,120 H196"
          stroke="currentColor"
          strokeOpacity={0.22}
          strokeWidth={0.6}
          strokeDasharray="10 3 1.5 3"
          className={estilos.aparece}
        />

        <g transform="translate(40 45) scale(0.8)">
          <path d={PERFIL} fill="currentColor" fillOpacity={0.05} className={estilos.aparece} />
          <path
            d={PERFIL}
            pathLength={1}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinejoin="round"
            className={estilos.trazo}
          />
          <path
            d={`${COTA_ALTO} ${COTA_PATIN} ${COTA_CABEZA}`}
            className={cn(estilos.aparece, "stroke-accent")}
            strokeOpacity={0.8}
            strokeWidth={1.2}
          />
        </g>

        {GUIAS.map((guia) => (
          <path
            key={guia}
            d={guia}
            pathLength={1}
            stroke="currentColor"
            strokeOpacity={0.55}
            strokeWidth={0.8}
            className={cn(estilos.trazo, estilos.trazoTarde)}
          />
        ))}
        <g className={estilos.aparece} fill="currentColor">
          <circle cx={147} cy={72} r={1.6} />
          <circle cx={126} cy={129} r={1.6} />
          <circle cx={160} cy={168} r={1.6} />
        </g>
      </svg>

      {ROTULOS.map(({ texto, y }) => (
        <span
          key={texto}
          aria-hidden="true"
          className="absolute -translate-y-1/2 whitespace-nowrap bg-brand-deep px-1 text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-zinc-300"
          style={{ left: `${(X_ROTULOS / 240) * 100}%`, top: `${(y / 240) * 100}%` }}
        >
          {texto}
        </span>
      ))}
    </div>
  );
}
