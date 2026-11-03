import type { ReactNode } from "react";
import type { IconoBeneficio } from "@/constants/energy";

/*
 * Line icons drawn for this page, in the same stroke as the hero drawing, so
 * the benefits read as part of one technical set instead of a stock icon
 * pack. 40-unit grid, 1.5 stroke, color from the text.
 */
const TRAZOS: Record<IconoBeneficio, ReactNode> = {
  // A bill whose amount line steps down.
  factura: (
    <>
      <path d="M10 5 H30 V35 l-3.3 -2.5 -3.4 2.5 -3.3 -2.5 -3.3 2.5 -3.4 -2.5 L10 35 Z" />
      <path d="M15 12 H25 M15 17 H22" />
      <path d="M15 24 H19 V27 H23 V30" />
    </>
  ),
  // Tariff climbing; your own generation stays flat.
  tarifa: (
    <>
      <path d="M5 34 H35 M5 34 V6" />
      <path d="M8 29 L15 23 L21 25 L33 10" strokeDasharray="3 3" />
      <path d="M8 22 H33" strokeWidth={2.25} />
      <path d="M29 10 H33 V14" />
    </>
  ),
  // Sun above an open storefront.
  dia: (
    <>
      <circle cx={28} cy={10} r={4} />
      <path d="M28 2 V3.5 M36 10 H34.5 M33.7 4.3 l-1 1 M33.7 15.7 l-1 -1 M22.3 4.3 l1 1" />
      <path d="M5 35 H35 M8 35 V20 H26 V35 M5 20 H29 L26 15 H8 Z" />
      <path d="M13 35 V27 H21 V35" />
    </>
  ),
  // A module with a drop: cleaning is the main upkeep.
  mantenimiento: (
    <>
      <path d="M6 30 L11 12 H34 L29 30 Z" />
      <path d="M8.5 21 H31.5 M17 12 L13 30 M24 12 L20 30" />
      <path d="M33 31 c0 -3 3 -6 3 -6 s3 3 3 6 a3 3 0 0 1 -6 0 Z" />
    </>
  ),
  // A module under a long arc of days.
  largo: (
    <>
      <path d="M8 34 L12 22 H32 L28 34 Z" />
      <path d="M10 28 H30 M19 22 L17 34" />
      <path d="M5 16 A15 12 0 0 1 35 16" strokeDasharray="2 3" />
      <circle cx={20} cy={4.5} r={2} />
    </>
  ),
  // A law document with a section mark.
  ley: (
    <>
      <path d="M9 5 H25 L31 11 V35 H9 Z M25 5 V11 H31" />
      <path d="M14 30 H26" />
      <path d="M22.5 15.5 c-1 -1.5 -5 -1.5 -5 0.8 c0 2.4 5 1.5 5 4.2 c0 2.6 -5 2.6 -5 0.2 M17.5 23 c1 1.5 5 1.5 5 -0.8" />
    </>
  ),
  // A cabinet with a check: assembled and integrated.
  integrado: (
    <>
      <rect x={7} y={5} width={22} height={30} rx={1} />
      <path d="M18 5 V35 M11 11 h3 M22 11 h3 M11 16 h3 M22 16 h3" />
      <circle cx={30} cy={29} r={7} fill="var(--fondo-icono, #fff)" />
      <path d="M26.8 29 l2.2 2.2 4.2 -4.4" />
    </>
  ),
};

export default function IconoEnergia({ nombre, tamano = 40 }: { nombre: IconoBeneficio; tamano?: number }) {
  return (
    <svg
      aria-hidden
      width={tamano}
      height={tamano}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {TRAZOS[nombre]}
    </svg>
  );
}
