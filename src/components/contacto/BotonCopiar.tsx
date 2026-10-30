"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

type Estado = "listo" | "copiado" | "fallo";

interface BotonCopiarProps {
  texto: string;
  /** "Copiar número", "Copiar correo"… */
  etiqueta: string;
  /** Qué se copió, para el aviso del lector de pantalla. */
  descripcion: string;
  tono?: "claro" | "oscuro";
  className?: string;
}

const DURACION_AVISO_MS = 2200;

export default function BotonCopiar({ texto, etiqueta, descripcion, tono = "claro", className }: BotonCopiarProps) {
  const [estado, setEstado] = useState<Estado>("listo");
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  const copiar = async () => {
    let siguiente: Estado = "copiado";
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // Sin permiso de portapapeles (o contexto no seguro): el dato sigue a la vista para copiarlo a mano.
      siguiente = "fallo";
    }
    setEstado(siguiente);
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setEstado("listo"), DURACION_AVISO_MS);
  };

  const oscuro = tono === "oscuro";

  return (
    <>
      <button
        type="button"
        onClick={copiar}
        className={cn(
          "boton inline-flex min-h-11 items-center justify-center gap-2 rounded-[4px] px-4 text-[11px] font-semibold uppercase tracking-[0.16em] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          oscuro
            ? "text-zinc-300 hover:bg-white/10 hover:text-white"
            : "text-brand hover:bg-surface",
          className
        )}
      >
        {estado === "copiado" ? (
          <Check aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.5} />
        ) : (
          <Copy aria-hidden="true" className="size-4 shrink-0" />
        )}
        <span>{estado === "copiado" ? "Copiado" : estado === "fallo" ? "No se pudo copiar" : etiqueta}</span>
      </button>
      {/* Fuera del botón: dentro de él, varios lectores no anuncian el cambio. */}
      <span aria-live="polite" className="sr-only">
        {estado === "copiado"
          ? `${descripcion} copiado al portapapeles.`
          : estado === "fallo"
            ? `No se pudo copiar. ${descripcion}: ${texto}.`
            : ""}
      </span>
    </>
  );
}
