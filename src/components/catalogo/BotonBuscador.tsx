"use client";

import { useSyncExternalStore } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCatalogo } from "./ProveedorCatalogo";

const suscribirNada = () => () => {};
const esApple = () => /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);
// En el servidor no se sabe el sistema: se pinta "Ctrl" y en Mac se corrige al hidratar.
const esAppleEnServidor = () => false;

/** Atajo del buscador tal como se ve en el teclado del visitante. */
export function AtajoTeclado({ className }: { className?: string }) {
  const apple = useSyncExternalStore(suscribirNada, esApple, esAppleEnServidor);
  return (
    <kbd
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1 rounded-[3px] border border-zinc-300 bg-surface px-1.5 font-sans text-[11px] font-semibold tracking-wide text-zinc-600",
        className
      )}
    >
      <span aria-hidden="true">{apple ? "⌘" : "Ctrl"}</span>
      <span className="sr-only">{apple ? "Comando" : "Control"} más</span>
      <span>K</span>
    </kbd>
  );
}

interface BotonBuscadorProps {
  /** 'campo' parece una caja de búsqueda; 'icono' es el botón cuadrado de la barra móvil. */
  variante?: "campo" | "icono";
  className?: string;
}

export default function BotonBuscador({ variante = "campo", className }: BotonBuscadorProps) {
  const { abrirBuscador } = useCatalogo();

  if (variante === "icono") {
    return (
      <button
        type="button"
        onClick={abrirBuscador}
        aria-haspopup="dialog"
        aria-label="Buscar una referencia"
        className={cn(
          "boton flex size-11 shrink-0 items-center justify-center rounded-[4px] bg-brand text-white hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          className
        )}
      >
        <Search aria-hidden="true" className="size-[18px]" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={abrirBuscador}
      aria-haspopup="dialog"
      aria-keyshortcuts="Control+K Meta+K"
      className={cn(
        "group/buscar boton flex min-h-12 w-full items-center gap-3 rounded-[4px] border border-zinc-300 bg-white px-4 text-left shadow-[0_1px_2px_rgb(0_0_0/0.04)]",
        "hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className
      )}
    >
      <Search aria-hidden="true" className="size-[18px] shrink-0 text-brand" />
      <span className="min-w-0 flex-1 truncate text-sm text-zinc-600 transition-colors group-hover/buscar:text-brand">
        Buscar por SKU, nombre o categoría
      </span>
      <AtajoTeclado className="hidden sm:inline-flex" />
    </button>
  );
}
