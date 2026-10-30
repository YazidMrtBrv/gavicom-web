import { cn } from "@/lib/cn";

interface TechnicalTableProps {
  especificaciones?: Record<string, string>;
  /** Rótulo de la tabla (visible y para lectores de pantalla). */
  titulo?: string;
  className?: string;
}

/*
 * Ficha técnica en filas parámetro / valor. El rótulo de cada fila es un <th>
 * de fila para que el lector de pantalla diga "Perforaciones: Disponibles…".
 * .spec-row pinta la barra accent; aquí se enciende con toda la fila, no solo
 * con el rótulo.
 */
export default function TechnicalTable({
  especificaciones,
  titulo = "Especificaciones técnicas",
  className,
}: TechnicalTableProps) {
  if (!especificaciones || Object.keys(especificaciones).length === 0) return null;

  return (
    <table className={cn("w-full border-collapse text-left", className)}>
      <caption className="pb-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
        {titulo}
      </caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Parámetro</th>
          <th scope="col">Especificación</th>
        </tr>
      </thead>
      <tbody className="border-y border-zinc-200">
        {Object.entries(especificaciones).map(([clave, valor]) => (
          <tr
            key={clave}
            className="group/fila border-t border-zinc-200 transition-colors duration-200 first:border-t-0 hover:bg-surface"
          >
            <th
              scope="row"
              className="spec-row w-[42%] py-2.5 pr-4 pl-3 align-top text-[11px] font-semibold uppercase leading-snug tracking-[0.06em] text-zinc-600 group-hover/fila:before:[transform:scaleY(1)]"
            >
              {clave}
            </th>
            <td className="py-2.5 pr-3 align-top text-[13px] leading-snug text-ink">{String(valor)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
