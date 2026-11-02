import Image from "next/image";
import Link from "next/link";
import type { Producto } from "@/constants/productos";
import { imagenProducto, slugProducto } from "@/lib/catalogo";
import BotonCotizar from "./BotonCotizar";

export default function TarjetaProducto({ producto, prioridad = false }: { producto: Producto; prioridad?: boolean }) {
  const img = imagenProducto(producto);
  const href = `/catalogo/${slugProducto(producto)}`;
  return (
    <article className="inclinar group flex flex-col border border-linea rounded bg-white hover:border-azul/40">
      <Link href={href} className="flex flex-col gap-3 p-3 pb-2 flex-1">
        <div className="relative aspect-square bg-white overflow-hidden">
          {img ? (
            <Image src={img} alt={producto.nombre} fill sizes="(min-width:1024px) 260px, (min-width:640px) 33vw, 50vw" className="object-contain p-2" priority={prioridad} />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm text-tenue bg-gris">Sin foto</div>
          )}
        </div>
        <span className="font-mono text-[11px] text-azul tracking-tight">{producto.sku}</span>
        <h3 className="font-sans text-[15px] font-semibold leading-snug text-tinta group-hover:text-azul">{producto.nombre}</h3>
      </Link>
      <div className="p-3 pt-0">
        <BotonCotizar sku={producto.sku} nombre={producto.nombre} />
      </div>
    </article>
  );
}
