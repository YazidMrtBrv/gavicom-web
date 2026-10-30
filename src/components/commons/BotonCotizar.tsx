import Boton from "@/components/ui/Boton";
import { cn } from "@/lib/cn";
import { textoReferencias } from "./navegacion";
import estilos from "./navbar.module.css";

interface BotonCotizarProps {
  /** Referencias distintas en la lista de cotización del visitante. */
  total: number;
  /** Sube cada vez que el visitante agrega algo: repite el latido del contador. */
  pulsos: number;
  /** El visitante ya está en /cotizar. */
  activo: boolean;
  etiqueta?: string;
  className?: string;
  onClick?: () => void;
}

export default function BotonCotizar({
  total,
  pulsos,
  activo,
  etiqueta = "Cotizar",
  className,
  onClick,
}: BotonCotizarProps) {
  return (
    <Boton
      href="/cotizar"
      aria-current={activo ? "page" : undefined}
      aria-label={total > 0 ? `${etiqueta}, ${textoReferencias(total)}` : undefined}
      onClick={onClick}
      className={cn("min-h-10 px-4 sm:px-5", activo && "bg-accent-strong", className)}
    >
      {etiqueta}
      {total > 0 && (
        <span
          key={pulsos}
          aria-hidden="true"
          className={cn(
            estilos.contador,
            pulsos > 0 && estilos.contadorPulso,
            "ml-2.5 inline-flex h-5 min-w-5 items-center justify-center rounded-[2px] bg-brand-deep px-1 align-middle text-[10px] font-semibold leading-none tracking-normal text-accent tabular-nums"
          )}
        >
          {total > 99 ? "99+" : total}
        </span>
      )}
    </Boton>
  );
}
