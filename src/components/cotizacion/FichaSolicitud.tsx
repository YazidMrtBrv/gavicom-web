"use client";

import { cn } from "@/lib/cn";
import { COMPANIA_INFO } from "@/constants/productos";
import { totalUnidades, type ItemCotizacion } from "@/lib/cotizacion";
import TechFrame from "@/components/motion/TechFrame";
import type { BorradorCotizacion } from "./borrador";
import { dosCifras, PASOS } from "./RielPasos";
import type { Paso } from "./validacion";
import estilos from "./cotizador.module.css";

// Pocas, para que la ficha fija quepa en pantalla aunque la lista sea larga.
const ITEMS_A_LA_VISTA = 4;

interface FichaSolicitudProps {
  items: ItemCotizacion[];
  hidratado: boolean;
  borrador: BorradorCotizacion;
  paso: Paso;
  enviado: boolean;
  idTitulo: string;
  className?: string;
}

/** Cifra grande que se subraya un instante cuando cambia (la key la vuelve a montar). */
function Cifra({ valor, hidratado }: { valor: number; hidratado: boolean }) {
  if (!hidratado) return <span className="text-zinc-400">—</span>;
  return (
    <span key={valor} className={estilos.datoNuevo}>
      {dosCifras(valor)}
    </span>
  );
}

function lugarDeEntrega({ ciudad, departamento }: BorradorCotizacion): string {
  return [ciudad.trim(), departamento.trim()].filter(Boolean).join(", ");
}

/*
 * La solicitud se va armando a la vista, como el cajetín de un plano: cada
 * paso llena sus casillas. No es un carrito: no hay precios ni totales en
 * dinero, solo lo que GAVICOM necesita leer para cotizar.
 */
export default function FichaSolicitud({
  items,
  hidratado,
  borrador,
  paso,
  enviado,
  idTitulo,
  className,
}: FichaSolicitudProps) {
  const deRailway = items.filter((item) => item.linea === "railway").length;
  const deEnergy = items.length - deRailway;
  const solicitante = [
    borrador.nombre.trim(),
    borrador.personaNatural ? "Persona natural" : borrador.empresa.trim(),
  ]
    .filter(Boolean)
    .join(" — ");

  const filas: [string, string][] = [
    ["Otro requerimiento", borrador.otroRequerimiento.trim() ? "Incluido" : ""],
    ["Entrega", lugarDeEntrega(borrador)],
    ["Plazo", borrador.plazo],
    ["Solicitante", solicitante],
    ["Contacto", borrador.telefono.trim()],
  ];

  return (
    <aside aria-labelledby={idTitulo} className={className}>
      <TechFrame tone="oscuro" className="bg-brand-deep text-white">
        <div className="flex items-start justify-between gap-4 border-b border-white/15 px-6 pb-5 pt-7 sm:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-accent">Ficha de solicitud</p>
            <h2 id={idTitulo} className="mt-2 text-lg font-semibold leading-snug text-white">
              Su cotización hasta ahora
            </h2>
          </div>
          <p className="shrink-0 pt-0.5 text-right text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300 tabular-nums">
            {enviado ? (
              <span className="text-accent">Enviada</span>
            ) : (
              <>
                Paso {dosCifras(paso)}
                <span className="text-zinc-400"> / {dosCifras(PASOS.length)}</span>
              </>
            )}
          </p>
        </div>

        <dl className="grid grid-cols-2 border-b border-white/15">
          <div className="border-r border-white/15 px-6 py-5 sm:px-8">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300">Referencias</dt>
            <dd className="mt-2 text-5xl font-light leading-none text-white tabular-nums">
              <Cifra valor={items.length} hidratado={hidratado} />
            </dd>
          </div>
          <div className="px-6 py-5 sm:px-8">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300">Unidades</dt>
            <dd className="mt-2 text-5xl font-light leading-none text-white tabular-nums">
              <Cifra valor={totalUnidades(items)} hidratado={hidratado} />
            </dd>
          </div>
        </dl>

        {hidratado && items.length > 0 && (
          <div className="border-b border-white/15 px-6 py-4 sm:px-8">
            <p className="flex gap-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300 tabular-nums">
              <span>
                Railway <span className="text-white">{dosCifras(deRailway)}</span>
              </span>
              <span>
                Energy <span className="text-white">{dosCifras(deEnergy)}</span>
              </span>
            </p>
            <ul className="mt-3 space-y-1.5">
              {items.slice(0, ITEMS_A_LA_VISTA).map((item) => (
                <li key={item.sku} className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="min-w-0 truncate font-medium tracking-[0.06em] text-zinc-200" title={item.nombre}>
                    {item.sku}
                  </span>
                  <span className="shrink-0 text-accent tabular-nums">× {item.cantidad}</span>
                </li>
              ))}
            </ul>
            {items.length > ITEMS_A_LA_VISTA && (
              <p className="mt-3 text-xs text-zinc-300">
                y {items.length - ITEMS_A_LA_VISTA} {items.length - ITEMS_A_LA_VISTA === 1 ? "referencia más" : "referencias más"}
              </p>
            )}
          </div>
        )}

        <dl className="px-6 py-3 sm:px-8">
          {filas.map(([termino, valor]) => (
            <div
              key={termino}
              className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-white/10 py-2.5 last:border-b-0"
            >
              <dt className="pt-px text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">{termino}</dt>
              <dd className={cn("min-w-0 break-words text-sm leading-snug", valor ? "text-white" : "text-zinc-400")}>
                {valor || "—"}
              </dd>
            </div>
          ))}
        </dl>

        {/* Pie del cajetín: quién emite y adónde llega. */}
        <dl className="grid grid-cols-2 border-t border-white/15 text-[10px] uppercase tracking-[0.2em]">
          <div className="border-r border-white/15 px-6 py-4 sm:px-8">
            <dt className="font-semibold text-zinc-400">Para</dt>
            <dd className="mt-1.5 font-semibold text-white">{COMPANIA_INFO.nombre}</dd>
          </div>
          <div className="px-6 py-4 sm:px-8">
            <dt className="font-semibold text-zinc-400">Canal</dt>
            <dd className="mt-1.5 font-semibold text-white">WhatsApp comercial</dd>
          </div>
        </dl>
      </TechFrame>
    </aside>
  );
}
