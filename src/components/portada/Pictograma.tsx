import type { JSX } from "react";
import { cn } from "@/lib/cn";
import estilos from "./portada.module.css";

export type TipoPictograma = "riel" | "troley" | "terraplen";

/*
 * Dibujos de línea en clave de plano para cada capacidad. Los trazos con
 * pathLength={1} se dibujan con el scroll (portada.module.css, .pictograma);
 * los ejes y rayados en gris son estáticos. Las cotas van en accent: es
 * decoración, nunca texto.
 */

const COLOR_COTA = "#E8920C";
const COLOR_AUXILIAR = "#a1a1aa";

function Trazo({ d, color = "currentColor", ancho = 1.5 }: { d: string; color?: string; ancho?: number }) {
  return (
    <path
      d={d}
      pathLength={1}
      stroke={color}
      strokeWidth={ancho}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={estilos.pictogramaTrazo}
    />
  );
}

function Riel() {
  return (
    <>
      <path d="M60 4V76" stroke={COLOR_AUXILIAR} strokeWidth="0.75" strokeDasharray="4 3" />
      <Trazo d="M46 14Q46 12 48 12H72Q74 12 74 14V24L64 30V52L86 60L88 66H32L34 60L56 52V30L46 24Z" />
      <Trazo d="M56 30H64M56 52H64" ancho={0.75} color={COLOR_AUXILIAR} />
      <Trazo d="M32 73H88M32 70V76M88 70V76" color={COLOR_COTA} ancho={1} />
      <Trazo d="M78 12H100M92 66H100M96 12V66M93 15L96 12L99 15M93 63L96 66L99 63" color={COLOR_COTA} ancho={1} />
    </>
  );
}

function Troley() {
  return (
    <>
      <path d="M16 66V70M36 66V70M56 66V70M76 66V70M96 66V70" stroke={COLOR_AUXILIAR} strokeWidth="1" />
      <Trazo d="M6 64H114" />
      <Trazo d="M22 40H98V47H22Z" />
      <Trazo d="M32 47L38 56L44 47M76 47L82 56L88 47" ancho={1.25} />
      <circle cx="38" cy="56" r="8" pathLength={1} stroke="currentColor" strokeWidth="1.5" className={estilos.pictogramaTrazo} />
      <circle cx="82" cy="56" r="8" pathLength={1} stroke="currentColor" strokeWidth="1.5" className={estilos.pictogramaTrazo} />
      <circle cx="38" cy="56" r="2" fill="currentColor" />
      <circle cx="82" cy="56" r="2" fill="currentColor" />
      <Trazo d="M98 40L110 20M106 18L114 22" />
      <Trazo d="M38 40V24H68V40" ancho={1.25} />
      <Trazo d="M38 17H68M38 14V20M68 14V20" color={COLOR_COTA} ancho={1} />
    </>
  );
}

function Terraplen() {
  return (
    <>
      <path
        d="M10 64L6 70M20 64L16 70M44 64L40 70M58 64L54 70M72 64L68 70M86 64L82 70M100 64L96 70M114 64L110 70"
        stroke={COLOR_AUXILIAR}
        strokeWidth="0.75"
      />
      <Trazo d="M4 60H116" />
      <Trazo d="M18 60L40 36H80L102 60" />
      <Trazo d="M44 36L50 28H70L76 36" ancho={1.25} />
      <Trazo d="M53 28V24M67 28V24" ancho={1.25} />
      <circle cx="30" cy="66" r="3.5" pathLength={1} stroke="currentColor" strokeWidth="1.25" className={estilos.pictogramaTrazo} />
      <Trazo d="M104 58L109 44L114 58M109 44V40" ancho={1.25} />
      <circle cx="109" cy="38" r="2" fill="currentColor" />
      <Trazo d="M40 20H80M40 17V23M80 17V23" color={COLOR_COTA} ancho={1} />
    </>
  );
}

const DIBUJOS: Record<TipoPictograma, () => JSX.Element> = {
  riel: Riel,
  troley: Troley,
  terraplen: Terraplen,
};

export default function Pictograma({ tipo, className }: { tipo: TipoPictograma; className?: string }) {
  const Dibujo = DIBUJOS[tipo];
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn(estilos.pictograma, "text-brand", className)}
    >
      <Dibujo />
    </svg>
  );
}
