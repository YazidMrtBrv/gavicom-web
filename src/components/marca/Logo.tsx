import Image from "next/image";
import { cn } from "@/lib/cn";

interface LogoProps {
  /** 'color' sobre fondos claros (placa azul); 'blanco' sobre fondos brand/brand-deep. */
  variante?: "color" | "blanco";
  className?: string;
  /** Ancho del logotipo en px (sin contar la placa). */
  ancho?: number;
  /** Solo si el logo es lo primero que se pinta en pantalla. */
  prioridad?: boolean;
}

// Proporción del PNG actual (652 × 383).
const PROPORCION = 383 / 652;

/*
 * Único punto donde se pinta el logotipo. Hoy es el PNG blanco sobre una placa
 * azul; cuando lleguen los archivos oficiales del manual se reemplazan aquí y
 * nada más cambia. Nunca redibujarlo con texto o SVG, ni rotarlo, deformarlo,
 * animarlo o ponerle sombra.
 */
export default function Logo({ variante = "color", className, ancho = 120, prioridad = false }: LogoProps) {
  const imagen = (
    <Image
      src="/logo-gavicom.png"
      alt="GAVICOM SAS"
      width={ancho}
      height={Math.round(ancho * PROPORCION)}
      loading={prioridad ? "eager" : "lazy"}
      fetchPriority={prioridad ? "high" : undefined}
      className="block h-auto max-w-none"
    />
  );

  if (variante === "blanco") {
    return <span className={cn("inline-block shrink-0", className)}>{imagen}</span>;
  }

  return (
    <span
      className={cn("inline-block shrink-0 rounded-lg bg-brand", className)}
      style={{ padding: Math.max(6, Math.round(ancho * 0.1)) }}
    >
      {imagen}
    </span>
  );
}
