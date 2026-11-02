import Link from "next/link";

// A band of the product lines that drifts sideways; it stops under the cursor
// and with reduced motion. The list is doubled so the loop has no seam.
export default function Franja({ items }: { items: { texto: string; href: string }[] }) {
  const fila = (oculta: boolean) => (
    <ul className="franja-fila flex shrink-0 items-center gap-10 pr-10" aria-hidden={oculta || undefined}>
      {items.map((i) => (
        <li key={i.texto} className="flex items-center gap-10">
          <Link href={i.href} tabIndex={oculta ? -1 : undefined} className="font-titulo font-bold text-3xl sm:text-5xl text-white/90 hover:text-white whitespace-nowrap">
            {i.texto}
          </Link>
          <span aria-hidden className="size-2.5 rotate-45 bg-white/40" />
        </li>
      ))}
    </ul>
  );
  return (
    <nav aria-label="Líneas de producto" className="franja bg-azul py-7 overflow-hidden">
      <div className="franja-pista flex w-max">
        {fila(false)}
        {fila(true)}
      </div>
    </nav>
  );
}
