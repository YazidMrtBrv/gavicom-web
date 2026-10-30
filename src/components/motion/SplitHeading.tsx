import { Fragment, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface SplitHeadingProps {
  as?: "h1" | "h2" | "h3";
  text: string;
  /** Palabras que llevan subrayado accent (decorativo; el texto conserva su color). */
  accentWords?: string[];
  className?: string;
  id?: string;
}

type ConVariables = CSSProperties & Record<`--${string}`, string | number>;

// Compara sin mayúsculas, tildes ni puntuación pegada: "ferroviario," == "Ferroviario".
function normalizar(palabra: string): string {
  return palabra
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

/*
 * Cada palabra va en su span con espacios reales entre ellas, así el texto
 * copiado y el que lee un lector de pantalla es la frase normal. El color final
 * lo da la clase del encabezado; las palabras lo heredan al terminar la animación.
 */
export default function SplitHeading({
  as: Etiqueta = "h2",
  text,
  accentWords = [],
  className,
  id,
}: SplitHeadingProps) {
  const palabras = text.trim().split(/\s+/);
  const acentos = new Set(accentWords.map(normalizar));

  return (
    <Etiqueta
      id={id}
      className={cn("split-heading", className)}
      style={{ "--n": Math.max(palabras.length - 1, 1) } as ConVariables}
    >
      {palabras.map((palabra, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span
            className={cn("split-palabra", acentos.has(normalizar(palabra)) && "split-acento")}
            style={{ "--i": i } as ConVariables}
          >
            {palabra}
          </span>
        </Fragment>
      ))}
    </Etiqueta>
  );
}
