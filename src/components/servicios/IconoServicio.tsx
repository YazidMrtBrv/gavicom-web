import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Pictogramas de línea de la página anterior, ahora por SKU: el nombre
// comercial de un servicio cambia más que su código.
const ICONOS: Record<string, ReactNode> = {
  "GVC-SRV-TOP01": (
    <>
      <circle cx="24" cy="20" r="8" />
      <line x1="24" y1="12" x2="24" y2="28" />
      <line x1="16" y1="20" x2="32" y2="20" />
      <path d="M14 36 L24 30 L34 36" strokeLinejoin="round" />
      <line x1="24" y1="28" x2="24" y2="30" />
      <circle cx="24" cy="20" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  "GVC-SRV-MT01": (
    <>
      <circle cx="24" cy="24" r="12" />
      <circle cx="24" cy="24" r="5" />
      <g strokeLinecap="round">
        <line x1="24" y1="12" x2="24" y2="8" />
        <line x1="24" y1="36" x2="24" y2="40" />
        <line x1="12" y1="24" x2="8" y2="24" />
        <line x1="36" y1="24" x2="40" y2="24" />
        <path d="M16 16 L14 14 M32 16 L34 14 M16 32 L14 34 M32 32 L34 34" strokeWidth="1.5" />
      </g>
    </>
  ),
  "GVC-SRV-HD01": (
    <>
      <rect x="10" y="14" width="28" height="20" rx="3" />
      <g strokeWidth="1.5">
        <path d="M20 20 L28 20 L28 18 L34 24 L28 30 L28 28 L20 28 Z" strokeLinejoin="round" />
        <line x1="10" y1="14" x2="10" y2="10" />
        <line x1="38" y1="14" x2="38" y2="10" />
        <circle cx="10" cy="38" r="3" />
        <circle cx="38" cy="38" r="3" />
      </g>
    </>
  ),
  "GVC-SRV-LC01": (
    <>
      <rect x="10" y="16" width="28" height="16" rx="2" />
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="16" x2="18" y2="32" />
        <line x1="30" y1="16" x2="30" y2="32" />
        <path d="M16 36 C16 38, 20 40, 24 40 C28 40, 32 38, 32 36" />
        <circle cx="24" cy="12" r="3" />
        <path d="M20 24 L22 22 L24 26 L26 22 L28 24" />
      </g>
    </>
  ),
  "GVC-SRV-PL01": (
    <g strokeWidth="1.5">
      <rect x="8" y="10" width="32" height="28" rx="2" />
      <line x1="8" y1="18" x2="40" y2="18" />
      <line x1="16" y1="10" x2="16" y2="38" />
      <line x1="22" y1="22" x2="22" y2="34" />
      <line x1="28" y1="22" x2="28" y2="34" />
      <line x1="34" y1="22" x2="34" y2="34" />
      <g fill="currentColor" stroke="none">
        <circle cx="13" cy="14" r="1.5" />
        <circle cx="13" cy="34" r="1.5" />
        <circle cx="37" cy="14" r="1.5" />
        <circle cx="37" cy="34" r="1.5" />
      </g>
    </g>
  ),
  "GVC-SRV-3D01": (
    <>
      <path d="M24 8 L42 20 L42 40 L24 40 L6 40 L6 20 Z" strokeLinejoin="round" />
      <line x1="6" y1="20" x2="24" y2="8" />
      <line x1="24" y1="20" x2="42" y2="8" />
      <g strokeWidth="1.5">
        <line x1="24" y1="8" x2="24" y2="40" />
        <line x1="6" y1="20" x2="24" y2="20" />
        <line x1="24" y1="20" x2="42" y2="20" />
        <path d="M24 28 L12 34 M24 28 L36 34" strokeLinecap="round" />
      </g>
    </>
  ),
  "GVC-SRV-CON01": (
    <>
      <path d="M10 8 h20 l6 6 v18 H10 Z" strokeLinejoin="round" />
      <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 8 v6 h6" />
        <line x1="15" y1="18" x2="27" y2="18" />
        <line x1="15" y1="23" x2="24" y2="23" />
        <path d="M27 33 l3 3 l5 -6" />
      </g>
      <circle cx="31" cy="33" r="8" />
      <line x1="37" y1="39" x2="42" y2="44" strokeLinecap="round" />
    </>
  ),
};

export default function IconoServicio({ sku, className }: { sku: string; className?: string }) {
  const icono = ICONOS[sku];
  if (!icono) return null;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn("size-full", className)}
    >
      {icono}
    </svg>
  );
}
