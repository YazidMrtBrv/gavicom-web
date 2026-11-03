import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Crosshair, FileText, ShieldCheck, Zap } from "lucide-react";
import { esFabricacionPropia, esProductoGavicom, marcaDe, vistasFicha } from "@/constants/catalogoExtra";
import { PRODUCTOS, lineaDe, productoPorSlug, rutaLinea, slugProducto } from "@/lib/catalogo";
import { MAX_TITULO, alternas, recortar } from "@/lib/meta";
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

// Long names lose the code first, then get cut, so the full title with the
// " | GAVICOM SAS" suffix stays inside the ~60 characters a result shows.
function tituloFicha(nombre: string, sku: string): string {
  const conCodigo = `${nombre} (${sku})`;
  if (conCodigo.length <= MAX_TITULO) return conCodigo;
  if (nombre.length <= MAX_TITULO) return nombre;
  // "Escalera para Camioneta – Acceso y Carga…": the part before the dash
  // already names the product.
  const principal = nombre.split(/\s[–-]\s/)[0];
  return principal.length <= MAX_TITULO ? principal : recortar(principal, MAX_TITULO);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productoPorSlug(slug);
  if (!p) return {};
  const titulo = tituloFicha(p.nombre, p.sku);
  // Some fichas have a one-line description; a snippet that short says
  // nothing about who sells it, so the code and how to quote are added.
  const descripcion = recortar(
    p.descripcion.length < 90 ? `${p.descripcion} Ref. ${p.sku}. Cotiza con ${NOMBRE_SITIO} por WhatsApp desde Barranquilla.` : p.descripcion
  );
  const url = `/catalogo/${slug}`;
  // The share image comes from ./opengraph-image.tsx, which Next adds to
  // both og:image and twitter:image on its own.
  return {
    title: titulo,
    description: descripcion,
    alternates: alternas(url),
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
  const gavicom = esProductoGavicom(p);
  const vistas = vistasFicha(p);
  const filas = Object.entries(p.especificaciones).filter(([k]) => propia || !FILAS_DE_ORIGEN.has(k));

  // Related: same sub-line first, starting right after this product and
  // wrapping around, so neighbouring pages do not all show the same four.
  const mismaSub = PRODUCTOS.filter((o) => o.categoria === p.categoria && o.subcategoria === p.subcategoria);
  const desde = mismaSub.findIndex((o) => o.sku === p.sku);
  const rotados = [...mismaSub.slice(desde + 1), ...mismaSub.slice(0, desde)];
  const relleno = PRODUCTOS.filter((o) => o.categoria === p.categoria && o.subcategoria !== p.subcategoria);
  const relacionados = [...rotados, ...relleno].slice(0, 4);

  const urlFicha = urlAbsoluta(`/catalogo/${slug}`);
  const urlLinea = linea ? rutaLinea(linea) : "/catalogo";
  const material = p.especificaciones.Material ?? p.especificaciones["Material Base"];
  // No offers, price, availability or reviews on purpose: GAVICOM quotes each
  // order and has published no reviews, and structured data must match what
  // the page shows (Google penalises markup that claims more than that).
  const productoJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${urlFicha}#producto`,
    name: p.nombre,
    sku: p.sku,
    url: urlFicha,
    description: p.descripcion,
    category: p.categoria,
    // Every visible model photo, main one first; none for brochure-only
    // references, which show a placeholder instead of a picture.
    image: vistas.length ? vistas.map((v) => urlAbsoluta(v.src)) : undefined,
    material,
    // The owner states every catalogue product is GAVICOM's; a ficha that
    // names another maker (Marca row) keeps that maker as the brand.
    brand: gavicom
      ? { "@type": "Brand", name: "GAVICOM" }
      : { "@type": "Brand", name: marcaDe(p) },
    manufacturer: gavicom ? { "@id": urlAbsoluta("/#organizacion") } : undefined,
    additionalProperty: filas.map(([nombre, valor]) => ({ "@type": "PropertyValue", name: nombre, value: valor })),
  };
  const migasJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: urlAbsoluta("/") },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: urlAbsoluta("/catalogo") },
      ...(linea ? [{ "@type": "ListItem", position: 3, name: linea.nombre, item: urlAbsoluta(urlLinea) }] : []),
      { "@type": "ListItem", position: linea ? 4 : 3, name: p.nombre, item: urlFicha },
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
                {gavicom && <InsigniaFabricado />}
                {propia && <InsigniaFabricado colombia />}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">{p.nombre}</h1>
              <p className="text-sm text-tenue">{p.subcategoria}</p>
            </div>
            <p className="text-[17px] leading-relaxed">{p.descripcion}</p>


            <FichaAcciones />

            <a
              href={enlaceWhatsApp(mensajeFichaTecnica(p.nombre, p.sku))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start min-h-11 text-sm font-semibold text-azul hover:underline"
            >
              <FileText size={18} aria-hidden /> Solicitar ficha técnica en PDF
            </a>

            {/* The promise once, next to the buying decision. Hours stay in
                the closing band and the footer. */}
            <ul className="grid gap-2 rounded border border-linea bg-azul-suave p-4 text-sm">
              <li className="flex items-start gap-2">
                <ShieldCheck size={18} aria-hidden className="shrink-0 text-azul" />
                <span><span className="font-semibold text-tinta">100% confiables:</span> ficha técnica y código en cada referencia.</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap size={18} aria-hidden className="shrink-0 text-azul" />
                <span><span className="font-semibold text-tinta">Rápidos:</span> tu pedido sale en un solo mensaje, sin formularios.</span>
              </li>
              <li className="flex items-start gap-2">
                <Crosshair size={18} aria-hidden className="shrink-0 text-azul" />
                <span><span className="font-semibold text-tinta">Precisos:</span> la cotización sale con tu código y tu cantidad.</span>
              </li>
            </ul>

            <h2 className="sr-only">Especificaciones</h2>
            <dl className="border-t border-linea">
              {filas.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-4 py-3 border-b border-linea text-sm">
                  <dt className="text-tenue">{k}</dt>
                  <dd className="text-tinta">{v}</dd>
                </div>
              ))}
            </dl>

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

      {/* Plain links to the line guide and the FAQ: the guide explains the
          whole family of parts, which a single ficha cannot. */}
      <nav aria-label="Más información" className="mt-10 flex flex-wrap gap-x-6 gap-y-1 border-t border-linea pt-4">
        {linea && (
          <Link href={urlLinea} className="inline-flex items-center gap-1.5 min-h-11 text-sm font-semibold text-azul hover:underline">
            Guía de {linea.nombre.toLowerCase()} <ArrowRight size={16} aria-hidden />
          </Link>
        )}
        <Link href="/preguntas-frecuentes" className="inline-flex items-center gap-1.5 min-h-11 text-sm font-semibold text-azul hover:underline">
          Preguntas frecuentes <ArrowRight size={16} aria-hidden />
        </Link>
      </nav>

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
