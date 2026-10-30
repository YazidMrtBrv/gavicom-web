import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { PRODUCTOS, imagenProducto, lineaDe, productoPorSlug, slugProducto } from "@/lib/catalogo";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import BotonCotizar from "@/components/BotonCotizar";
import TarjetaProducto from "@/components/TarjetaProducto";

// Every reference gets its own address: it can be sent by WhatsApp on its
// own and found by search engines, which the old single long page could not.
export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ slug: slugProducto(p) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productoPorSlug(slug);
  if (!p) return {};
  const img = imagenProducto(p);
  return {
    title: `${p.nombre} (${p.sku})`,
    description: p.descripcion.slice(0, 160),
    alternates: { canonical: `/catalogo/${slug}` },
    openGraph: { title: `${p.nombre} | ${COMPANIA_INFO.nombre}`, description: p.descripcion.slice(0, 160), url: `/catalogo/${slug}`, images: img ? [img] : undefined },
  };
}

export default async function FichaProducto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = productoPorSlug(slug);
  if (!p) notFound();
  const linea = lineaDe(p);
  const img = imagenProducto(p);
  const variantes = p.variantes ?? [];
  const relacionados = PRODUCTOS.filter((o) => o.categoria === p.categoria && o.sku !== p.sku).slice(0, 4);

  // No price or stock in the markup: GAVICOM quotes each order, and claiming
  // availability the site cannot check would be false.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    sku: p.sku,
    description: p.descripcion,
    category: p.categoria,
    image: img ? `https://gavicomferroviario.com${img}` : undefined,
    brand: { "@type": "Organization", name: COMPANIA_INFO.nombre },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 md:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Ruta" className="text-sm">
        <Link href={linea ? `/catalogo?linea=${linea.slug}` : "/catalogo"} className="inline-flex items-center gap-1 min-h-11 text-tenue hover:text-azul">
          <ChevronLeft size={16} aria-hidden /> {linea ? linea.nombre : "Catálogo"}
        </Link>
      </nav>

      <div className="mt-2 grid gap-8 md:grid-cols-[1fr_1.05fr] items-start">
        <div className="relative aspect-square border border-linea rounded bg-white">
          {img ? <Image src={img} alt={p.nombre} fill sizes="(min-width:768px) 520px, 100vw" className="object-contain p-6" priority /> : null}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-sm text-azul">{p.sku}</span>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{p.nombre}</h1>
            <p className="text-sm text-tenue">{p.subcategoria}</p>
          </div>
          <p className="text-[17px] leading-relaxed">{p.descripcion}</p>

          <dl className="border-t border-linea">
            {Object.entries(p.especificaciones).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-4 py-3 border-b border-linea text-sm">
                <dt className="text-tenue">{k}</dt>
                <dd className="text-tinta">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-3">
            <BotonCotizar sku={p.sku} nombre={p.nombre} grande />
            <a
              href={enlaceWhatsApp(`Hola GAVICOM, quiero cotizar ${p.nombre} (${p.sku}).`)}
              className="inline-flex items-center justify-center min-h-12 px-5 rounded border border-linea font-semibold text-tinta hover:border-azul hover:text-azul"
            >
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {variantes.length > 0 && (
        <section aria-labelledby="h-variantes" className="mt-14">
          <h2 id="h-variantes" className="text-2xl font-bold mb-4">
            Variantes <span className="text-tenue font-normal text-lg tabular-nums">{variantes.length}</span>
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {variantes.map((v, i) => (
              <li key={v.imagen} className="border border-linea rounded bg-white p-2 flex flex-col gap-2">
                <div className="relative aspect-square">
                  <Image src={`/images/productos/${v.imagen}`} alt={v.nombre ?? `${p.nombre}, variante ${i + 1}`} fill sizes="200px" className="object-contain" />
                </div>
                {v.nombre && <p className="text-sm font-medium leading-snug">{v.nombre}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {relacionados.length > 0 && (
        <section aria-labelledby="h-relacionados" className="mt-14">
          <h2 id="h-relacionados" className="text-2xl font-bold mb-4">
            Más en {linea?.nombre.toLowerCase() ?? "el catálogo"}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {relacionados.map((o) => (
              <TarjetaProducto key={o.sku} producto={o} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
