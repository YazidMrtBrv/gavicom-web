import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TechFrameProps {
  className?: string;
  children?: ReactNode;
  /** 'oscuro' sobre fondos brand/brand-deep o fotos con overlay oscuro. */
  tone?: "claro" | "oscuro";
  /** Marcas siempre en su estado reforzado, sin animación de entrada (p. ej. ítem activo). */
  always?: boolean;
}

const ESQUINAS = ["ti", "td", "bi", "bd"] as const;

/*
 * Marco con cuatro marcas en L (la forma de marca como sistema). Va aparte de
 * .tech-corners, que solo pinta dos esquinas con ::before/::after: aquí son
 * cuatro spans y cada uno entra desde su diagonal.
 */
export default function TechFrame({ className, children, tone = "claro", always = false }: TechFrameProps) {
  return (
    <div
      className={cn(
        "tech-frame relative",
        tone === "oscuro" && "tech-frame-oscuro",
        always && "tech-frame-siempre",
        className
      )}
    >
      {children}
      {ESQUINAS.map((esquina) => (
        <span key={esquina} aria-hidden="true" className={`tech-frame-esq tech-frame-${esquina}`} />
      ))}
    </div>
  );
}
