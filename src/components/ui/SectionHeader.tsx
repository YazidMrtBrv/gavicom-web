import { cn } from "@/lib/cn";
import ScrambleLabel from "@/components/motion/ScrambleLabel";
import SplitHeading from "@/components/motion/SplitHeading";

interface SectionHeaderProps {
  /** Formato "S.01 — RAILWAY". */
  etiqueta: string;
  titulo: string;
  entradilla?: string;
  align?: "izquierda" | "centro";
  tono?: "claro" | "oscuro";
  as?: "h1" | "h2";
  /** Palabras del título con subrayado accent. */
  acentos?: string[];
  /** id del titular, para usarlo en aria-labelledby de la sección. */
  id?: string;
  className?: string;
}

export default function SectionHeader({
  etiqueta,
  titulo,
  entradilla,
  align = "izquierda",
  tono = "claro",
  as = "h2",
  acentos,
  id,
  className,
}: SectionHeaderProps) {
  const oscuro = tono === "oscuro";
  const centrado = align === "centro";

  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-5",
        centrado ? "mx-auto items-center text-center" : "items-start text-left",
        className
      )}
    >
      <ScrambleLabel text={etiqueta} className={oscuro ? "text-accent" : undefined} />
      <SplitHeading
        as={as}
        id={id}
        text={titulo}
        accentWords={acentos}
        className={cn(
          "font-titulo font-semibold tracking-tight text-balance",
          as === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-5xl",
          // Después del tamaño: en Tailwind v4 text-4xl trae su propio interlineado
          // y cn() descartaría un leading-* escrito antes.
          "leading-[1.08]",
          // Sobre fondo oscuro las palabras arrancan en blanco tenue en lugar de gris.
          oscuro ? "text-white [--split-desde:rgb(255_255_255/0.35)]" : "text-brand"
        )}
      />
      {entradilla && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed sm:text-lg",
            oscuro ? "text-zinc-300" : "text-zinc-600"
          )}
        >
          {entradilla}
        </p>
      )}
    </div>
  );
}
