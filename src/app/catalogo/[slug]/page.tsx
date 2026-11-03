import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, FileText } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { esFabricacionPropia, imagenPrincipal, vistasFicha } from "@/constants/catalogoExtra";
import { PRODUCTOS, lineaDe, productoPorSlug, slugProducto } from "@/lib/catalogo";
import { NOMBRE_SITIO, urlAbsoluta } from "@/lib/sitio";
import { enlaceWhatsApp, mensajeFichaTecnica } from "@/lib/whatsapp";
import TarjetaProducto from "@/components/TarjetaProducto";
import IconoLinea from "@/components/catalogo/IconoLinea";
import InsigniaFabricado from "@/components/catalogo/InsigniaFabricado";
import { ProveedorFicha } from "@/components/catalogo/ContextoFicha";
import GaleriaFicha from "@/components/catalogo/GaleriaFicha";
import FichaAcciones from "@/components/catalogo/FichaAcciones";
import BarraAccionFicha from "@/components/catalogo/BarraAccionFicha";

// Every reference gets its own address: it can be sent by WhatsApp on its
// own and found by search engines, which the old single long page could not.
export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ slug: slugProducto(p) }));
}

export const dynamicParams = false;

// Spec rows that state who designed or made the part. Only shown where the
// origin is documented (catalogoExtra); elsewhere they would be a claim the
// site cannot back up.
const FILAS_DE_ORIGEN = new Set(["Fabricación", "Origen"]);

const resumen = (texto: string) => (texto.length > 160 ? `${texto.slice(0, 157).trimEnd()}…` : texto);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productoPorSlug(slug);
  if (!p) return {};
  const titulo = `${p.nombre} (${p.sku})`;
  const descripcion = resumen(p.descripcion);
  const url = `/catalogo/${slug}`;
  // The share image comes from ./opengraph-image.tsx, which Next adds to
  // both og:image and twitter:image on its own.
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url },
    openGraph: {
      title: `${titulo} | ${NOMBRE_SITIO}`,
      description: descripcion,
      url,
      siteName: NOMBRE_SITIO,
      locale: "es_CO",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} | ${NOMBRE_SITIO}`,
      description: descripcion,
    },
  };
}

export default async function FichaProducto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = productoPorSlug(slug);
  if (!p) notFound();
  const linea = lineaDe(p);
  const propia = esFabricacionPropia(p.sku);
  const vistas = vistasFicha(p);
  const principal = imagenPrincipal(p);
  const filas = Object.entries(p.especificaciones).filter(([k]) => propia || !FILAS_DE_ORIGEN.has(k));

  // Related: same sub-line first, starting right after this product and
  // wrapping around, so neighbouring pages do not all show the same four.
  const mismaSub = PRODUCTOS.filter((o) => o.categoria === p.categoria && o.subcategoria === p.subcategoria);
  const desde = mismaSub.findIndex((o) => o.sku === p.sku);
  const rotados = [...mismaSub.slice(desde + 1), ...mismaSub.slice(0, desde)];
  const relleno = PRODUCTOS.filter((o) => o.categoria === p.categoria && o.subcategoria !== p.subcategoria);
  const relacionados = [...rotados, ...relleno].slice(0, 4);

  const urlFicha = urlAbsoluta(`/catalogo/${slug}`);
  const urlLinea = linea ? `/catalogo?linea=${linea.slug}` : "/catalogo";
  const material = p.especificaciones.Material ?? p.especificaciones["Material Base"];
  // No offers, price, availability or reviews on purpose: GAVICOM quotes each
  // order and has published no reviews, and structured data must match what
  // the page shows (Google penalises markup that claims more than that).
  const marcaVisible = filas.find(([k]) => k === "Marca")?.[1];
  const productoJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    sku: p.sku,
    url: urlFicha,
    description: p.descripcion,
    category: p.categoria,
    image: principal ? urlAbsoluta(principal.src) : undefined,
    material,
    // GAVICOM is the brand only of what it manufactures; for supplied
    // references the brand is the one the ficha states, or none at all.
    brand: propia
      ? { "@type": "Organization", name: COMPANIA_INFO.nombre }
      : marcaVisible
        ? { "@type": "Brand", name: marcaVisible }
        : undefined,
    additionalProperty: filas.map(([nombre, valor]) => ({ "@type": "PropertyValue", name: nombre, value: valor })),
  };
  const migasJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Catálogo", item: urlAbsoluta("/catalogo") },
      ...(linea ? [{ "@type": "ListItem", position: 2, name: linea.nombre, item: urlAbsoluta(urlLinea) }] : []),
      { "@type": "ListItem", position: linea ? 3 : 2, name: p.nombre, item: urlFicha },
    ],
  };

  const varias = vistas.length > 1;

  return (
    // data-producto-* let the site-wide WhatsApp button prefill this product
    // without importing the whole catalogue into every page.
    <div
      className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 md:pt-10"
      data-producto-nombre={p.nombre}
      data-producto-sku={p.sku}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([productoJsonLd, migasJsonLd]) }} />
      <nav aria-label="Migas" className="text-sm">
        <ol className="flex flex-wrap items-center gap-x-1 text-tenue">
          <li className="flex items-center">
            <Link href="/catalogo" className="inline-flex items-center min-h-11 hover:text-azul hover:underline">
              Catálogo
            </Link>
          </li>
          {linea && (
            <li className="flex items-center gap-1">
              <ChevronRight size={14} aria-hidden />
              <Link href={urlLinea} className="inline-flex items-center min-h-11 hover:text-azul hover:underline">
                {linea.nombre}
              </Link>
            </li>
          )}
          <li className="flex items-center gap-1 min-w-0">
            <ChevronRight size={14} aria-hidden />
            <span aria-current="page" className="text-tinta truncate max-w-[16rem] sm:max-w-md">
              {p.nombre}
            </span>
          </li>
        </ol>
      </nav>

      <ProveedorFicha sku={p.sku} nombre={p.nombre} varianteInicial={varias ? vistas[0].nombre : undefined}>
        <div className="mt-2 grid gap-8 md:grid-cols-[1fr_1.05fr] items-start">
          {vistas.length ? (
            <GaleriaFicha vistas={vistas} alt={p.nombre} />
          ) : (
            // Brochure-only references: no flyer page as a product photo.
            <div className="aspect-square border border-dashed border-linea rounded bg-white flex flex-col items-center justify-center gap-3 p-6 text-center text-azul">
              <IconoLinea categoria={p.categoria} size={48} />
              <p className="font-mono text-2xl font-semibold">{p.sku}</p>
              <p className="text-sm text-tenue max-w-xs">Foto disponible por WhatsApp: pídela al cotizar.</p>
            </div>
          )}

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm text-azul">{p.sku}</span>
                {propia && <InsigniaFabricado />}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">{p.nombre}</h1>
              <p className="text-sm text-tenue">{p.subcategoria}</p>
            </div>
            <p className="text-[17px] leading-relaxed">{p.descripcion}</p>

            <dl className="border-t border-linea">
              {filas.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-4 py-3 border-b border-linea text-sm">
                  <dt className="text-tenue">{k}</dt>
                  <dd className="text-tinta">{v}</dd>
                </div>
              ))}
            </dl>

            <FichaAcciones />

            <a
              href={enlaceWhatsApp(mensajeFichaTecnica(p.nombre, p.sku))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start min-h-11 text-sm font-semibold text-azul hover:underline"
            >
              <FileText size={18} aria-hidden /> Solicitar ficha técnica en PDF
            </a>

            {propia && (
              <div className="border border-linea rounded bg-azul-suave p-5 flex flex-col gap-2">
                <p className="font-semibold">Hecha en Colombia con aliado industrial</p>
                <p className="text-sm text-tenue">
                  Planos propios de GAVICOM y fundición con un aliado industrial nacional.
                </p>
                <Link href="/fabricacion" className="inline-flex items-center gap-1.5 self-start min-h-11 text-sm font-semibold text-azul hover:underline">
                  Cómo la fabricamos <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            )}
          </div>
        </div>

        <BarraAccionFicha />
      </ProveedorFicha>

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
