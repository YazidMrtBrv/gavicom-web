import Link from "next/link";
import PausaFranja from "./PausaFranja";

// A band of the product lines that drifts sideways; it stops under the cursor,
// while a link inside has focus, with the pause button and with reduced
// motion. The list is doubled so the loop has no seam.
export default function Franja({ items }: { items: { texto: string; href: string }[] }) {
  const fila = (oculta: boolean) => (
    <ul className="franja-fila flex shrink-0 items-center gap-10 pr-10" aria-hidden={oculta || undefined}>
      {items.map((i) => (
        <li key={i.texto} className="flex items-center gap-10">
          <Link href={i.href} tabIndex={oculta ? -1 : undefined} className="inline-flex items-center py-3 font-titulo font-bold text-3xl sm:text-5xl text-white/90 hover:text-white whitespace-nowrap">
            {i.texto}
          </Link>
          <span aria-hidden className="size-2.5 rotate-45 bg-white/40" />
        </li>
      ))}
    </ul>
  );
  return (
    <nav aria-label="Líneas de producto" className="franja sobre-azul relative bg-azul">
      {/* The window scrolls (only by script, to reveal a focused link); the
          pause button sits outside it so it never scrolls away. */}
      <div className="franja-ventana overflow-hidden py-4">
        <div className="franja-pista flex w-max">
          {fila(false)}
          {fila(true)}
        </div>
      </div>
      <PausaFranja />
    </nav>
  );
}
