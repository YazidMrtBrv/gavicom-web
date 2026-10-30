"use client";

import { cn } from "@/lib/cn";
import TechFrame from "@/components/motion/TechFrame";
import Boton from "@/components/ui/Boton";
import { useCotizacion } from "@/components/cotizacion/CotizacionProvider";

/*
 * Estado real de la lista del visitante, sobre fondo oscuro. Recibe los SKU de
 * los servicios como prop para no arrastrar el catálogo al cliente. Mientras
 * no hidrata muestra la frase genérica, que también es cierta con la lista llena.
 */
export default function ResumenServicios({ skus, className }: { skus: string[]; className?: string }) {
  const { items, hidratado } = useCotizacion();
  const deServicios = hidratado ? items.filter((item) => skus.includes(item.sku)) : [];
  const otros = hidratado ? items.length - deServicios.length : 0;
  const cuantos = deServicios.length;

  return (
    <TechFrame tone="oscuro" className={cn("border border-white/15 bg-white/[0.03] p-6 sm:p-8", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">Su cotización</p>

      {cuantos > 0 ? (
        <>
          <p className="mt-4 flex items-baseline gap-3 text-white">
            <span className="font-titulo text-5xl font-semibold leading-none tabular-nums">
              {String(cuantos).padStart(2, "0")}
            </span>
            <span className="text-sm leading-snug text-zinc-300">
              {cuantos === 1 ? "servicio técnico" : "servicios técnicos"}
              {otros > 0 && ` y ${otros} ${otros === 1 ? "referencia más" : "referencias más"}`}
            </span>
          </p>
          <ul aria-label="Servicios en su cotización" className="mt-5 flex flex-wrap gap-2">
            {deServicios.map((item) => (
              <li
                key={item.sku}
                title={item.nombre}
                className="rounded-[2px] border border-white/15 px-2 py-1 text-[11px] font-semibold tracking-[0.16em] text-accent tabular-nums"
              >
                {item.sku}
              </li>
            ))}
          </ul>
          <Boton href="/cotizar" variante="claro" icono="flecha" className="mt-7">
            Revisar y enviar
          </Boton>
        </>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-zinc-300">
          Agregue los servicios que necesite desde cada ficha y envíelos junto con sus suministros en una sola
          solicitud.
        </p>
      )}
    </TechFrame>
  );
}
