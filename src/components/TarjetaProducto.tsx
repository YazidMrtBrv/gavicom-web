import "@/app/catalogo/transiciones.css";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Producto } from "@/constants/productos";
import { esFabricacionPropia, imagenPrincipal, tieneFotoFolleto } from "@/constants/catalogoExtra";
import { slugProducto } from "@/lib/catalogo";
import BotonCotizar from "./BotonCotizar";
import IconoLinea from "./catalogo/IconoLinea";
import InsigniaFabricado from "./catalogo/InsigniaFabricado";

export default function TarjetaProducto({ producto, prioridad = false }: { producto: Producto; prioridad?: boolean }) {
  const img = imagenPrincipal(producto);
  const folleto = tieneFotoFolleto(producto.sku);
  const propia = esFabricacionPropia(producto.sku);
  const href = `/catalogo/${slugProducto(producto)}`;
  return (
    <article className="inclinar group flex flex-col h-full border border-linea rounded bg-white hover:border-azul/40">
      <Link href={href} className="flex flex-col gap-3 p-3 pb-2 flex-1">
        <div className="relative aspect-square bg-white overflow-hidden">
          {img ? (
            // Same name as the product page photo: the browser morphs one
            // into the other on navigation (no-op where unsupported).
            <ViewTransition name={`foto-${producto.sku}`} share="morph-foto" default="none">
              <Image
                src={img.src}
                alt={producto.nombre}
                fill
                sizes="(min-width:1024px) 260px, (min-width:640px) 33vw, 50vw"
                className="object-contain p-2"
                priority={prioridad}
              />
            </ViewTransition>
          ) : (
            // No clean photo (or only a brochure page): say so plainly
            // instead of showing a flyer or a stand-in picture.
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center bg-white border border-dashed border-linea text-azul">
              <IconoLinea categoria={producto.categoria} />
              <span className="font-mono text-sm sm:text-base font-semibold tracking-tight break-all">{producto.sku}</span>
              <span className="text-xs text-tenue">{folleto ? "Foto disponible por WhatsApp" : "Sin foto"}</span>
            </div>
          )}
          {propia && (
            <span className="absolute left-1 top-1">
              <InsigniaFabricado compacta />
            </span>
          )}
        </div>
        <span className="font-mono text-xs text-azul tracking-tight">{producto.sku}</span>
        <h3 className="font-sans text-[15px] font-semibold leading-snug text-tinta group-hover:text-azul">{producto.nombre}</h3>
      </Link>
      <div className="p-3 pt-0">
        <BotonCotizar sku={producto.sku} nombre={producto.nombre} />
      </div>
    </article>
  );
}
