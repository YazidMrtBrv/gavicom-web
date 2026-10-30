import type { ComponentPropsWithoutRef, ComponentType, JSX, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type VarianteReveal = "rise" | "clip" | "fade";
export type PasoReveal = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type EtiquetaHTML = keyof JSX.IntrinsicElements;

export type RevealProps<T extends EtiquetaHTML = "div"> = {
  as?: T;
  variant?: VarianteReveal;
  /** Escalón dentro de un grupo (0–6): cada paso arranca un poco más tarde en el scroll. */
  delay?: PasoReveal;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "className" | "children">;

/*
 * Solo añade clases: la animación es CSS ligada al scroll (globals.css). Sin
 * soporte o con movimiento reducido no se aplica nada y el contenido se ve tal
 * cual llegó en el HTML.
 */
export default function Reveal<T extends EtiquetaHTML = "div">({
  as,
  variant = "rise",
  delay = 0,
  className,
  children,
  ...resto
}: RevealProps<T>) {
  // Las props ya se validaron contra la etiqueta en RevealProps<T>; aquí solo se
  // ensancha el tipo para que TS no intente cruzarlas con las ~170 etiquetas posibles.
  const Etiqueta = (as ?? "div") as unknown as ComponentType<Record<string, unknown>>;
  return (
    <Etiqueta
      className={cn(
        "reveal-on-scroll",
        variant !== "rise" && `reveal-${variant}`,
        delay > 0 && `reveal-paso-${delay}`,
        className
      )}
      {...resto}
    >
      {children}
    </Etiqueta>
  );
}
