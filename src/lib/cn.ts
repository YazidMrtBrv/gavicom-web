import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// twMerge deja ganar a la última clase en conflicto (p. ej. text-brand frente a
// text-accent): sin él, la que gana depende del orden del CSS generado.
export function cn(...clases: ClassValue[]): string {
  return twMerge(clsx(clases));
}
