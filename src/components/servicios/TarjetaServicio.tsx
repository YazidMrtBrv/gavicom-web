import Image from "next/image";
import type { Producto } from "@/constants/productos";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import { cn } from "@/lib/cn";
import TechFrame from "@/components/motion/TechFrame";
import Boton from "@/components/ui/Boton";
import BotonAgregarCotizacion from "@/components/cotizacion/BotonAgregarCotizacion";
import IconoServicio from "./IconoServicio";
import { anclaServicio, dosCifras, mensajeConsultaServicio } from "./datos";
import estilos from "./servicios.module.css";

interface TarjetaServicioProps {
  servicio: Producto;
  indice: number;
  total: number;
}

// La foto ocupa 5/12 de la tarjeta cuando esta pasa de ~672 px (contenedor
// @2xl); por debajo va arriba a todo el ancho.
const SIZES_FOTO = "(min-width: 1280px) 370px, (min-width: 1024px) 290px, (min-width: 720px) 40vw, 100vw";

/*
 * Ficha técnica de un servicio. Es de servidor: las interacciones son CSS
 * (foto que pasa de gris a color, barrido de escáner, sombra que se desplaza,
 * marcas del marco) y el único estado, la lista de cotización, vive en
 * BotonAgregarCotizacion.
 */
export default function TarjetaServicio({ servicio, indice, total }: TarjetaServicioProps) {
  const { sku, nombre, descripcion, subcategoria, especificaciones, imagen } = servicio;
  const ancla = anclaServicio(sku);
  const idTitulo = `${ancla}-titulo`;

  return (
    <article
      id={ancla}
      aria-labelledby={idTitulo}
      className={cn(estilos.tarjeta, "group @container/tarjeta relative scroll-mt-36")}
    >
      {/* Sombra técnica: asoma en accent por la derecha y por debajo al pasar. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-accent opacity-0 transition-[translate,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:translate-y-1.5 group-hover:opacity-100 motion-reduce:transition-none"
      />

      <TechFrame className="relative border border-zinc-200 bg-white transition-colors duration-300 group-hover:border-brand/40">
        <header className="flex items-center justify-between gap-4 border-b border-zinc-200 bg-surface px-5 py-3 transition-colors duration-300 group-hover:bg-brand sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* Placa de referencia, igual que el SKU del catálogo. */}
            <span className="shrink-0 rounded-[2px] bg-brand-deep px-2.5 py-1.5 text-[11px] font-semibold leading-none tracking-[0.18em] text-accent tabular-nums">
              {sku}
            </span>
            <span className="hidden truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600 transition-colors duration-300 group-hover:text-zinc-200 @md/tarjeta:block">
              {subcategoria}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-600 tabular-nums transition-colors duration-300 group-hover:text-zinc-200">
              {dosCifras(indice + 1)}
              <span aria-hidden="true" className="px-1 opacity-50">
                /
              </span>
              <span className="sr-only"> de </span>
              {dosCifras(total)}
            </span>
            <span className="size-8 text-brand transition-colors duration-300 group-hover:text-white">
              <IconoServicio sku={sku} />
            </span>
          </div>
        </header>

        <div className="grid @2xl/tarjeta:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative aspect-[16/10] overflow-hidden border-b border-zinc-200 bg-surface @2xl/tarjeta:aspect-auto @2xl/tarjeta:min-h-72 @2xl/tarjeta:border-b-0 @2xl/tarjeta:border-r">
            {imagen && (
              <Image
                src={`/images/productos/${imagen}`}
                alt={nombre}
                fill
                sizes={SIZES_FOTO}
                className={cn(
                  "object-cover object-center transition-[scale,filter] duration-700 ease-out motion-reduce:transition-none",
                  // En gris solo donde existe el hover que la devuelve al color:
                  // en táctil la foto se ve siempre a color.
                  "[@media(hover:hover)]:grayscale group-hover:scale-105 group-hover:grayscale-0 group-focus-within:grayscale-0"
                )}
              />
            )}
            <span aria-hidden="true" className={estilos.escaner} />
            <span
              aria-hidden="true"
              className="absolute bottom-3 left-3 rounded-[2px] bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand backdrop-blur-sm"
            >
              Fig. {dosCifras(indice + 1)}
            </span>
          </div>

          <div className="@container/ficha flex flex-col gap-6 p-6 sm:p-8">
            <h3 id={idTitulo} className="text-xl font-semibold leading-snug text-brand text-pretty sm:text-2xl sm:leading-snug">
              {nombre}
            </h3>
            <p className="leading-relaxed text-zinc-600">{descripcion}</p>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Especificaciones</p>
              <dl className="mt-3 border-t border-zinc-200">
                {Object.entries(especificaciones).map(([termino, valor]) => (
                  <div
                    key={termino}
                    className="spec-row grid gap-1 border-b border-zinc-200 py-3 pl-4 pr-2 hover:bg-surface @md/ficha:grid-cols-[9rem_minmax(0,1fr)] @md/ficha:gap-6"
                  >
                    <dt className="text-[11px] font-semibold uppercase leading-5 tracking-[0.14em] text-brand">
                      {termino}
                    </dt>
                    <dd className="text-sm leading-5 text-ink">{valor}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-x-7 gap-y-3 pt-1">
              <BotonAgregarCotizacion sku={sku} nombre={nombre} linea="railway" />
              <Boton
                href={construirUrlWhatsApp(mensajeConsultaServicio(servicio))}
                externo
                variante="enlace"
                icono="whatsapp"
                aria-label={`Consultar por WhatsApp: ${nombre} (se abre en una pestaña nueva)`}
              >
                Consultar
              </Boton>
            </div>
          </div>
        </div>
      </TechFrame>
    </article>
  );
}
