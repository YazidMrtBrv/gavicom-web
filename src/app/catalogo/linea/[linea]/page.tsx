import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, MessageCircle } from "lucide-react";
import { GUIAS_LINEA, guiaDe, type GuiaLinea } from "@/constants/lineasGuia";
import { PERFILES_ECLISA } from "@/constants/perfilesEclisa";
import { COMPANIA_INFO, type Producto } from "@/constants/productos";
import { LINEAS, PRODUCTOS, lineaPorSlug, rutaLinea, slugProducto } from "@/lib/catalogo";
import { metaPagina } from "@/lib/meta";
import { urlAbsoluta } from "@/lib/sitio";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import TarjetaProducto from "@/components/TarjetaProducto";
import IconoLinea from "@/components/catalogo/IconoLinea";

// Only the five catalogue lines exist; any other slug is a real 404.
export function generateStaticParams() {
  return GUIAS_LINEA.filter((g) => lineaPorSlug(g.slug)).map((g) => ({ linea: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ linea: string }> }): Promise<Metadata> {
  const { linea } = await params;
  const guia = guiaDe(linea);
  if (!guia) return {};
  return metaPagina({ titulo: guia.titulo, descripcion: guia.descripcion, ruta: `/catalogo/linea/${guia.slug}` });
}

const porSku = new Map(PRODUCTOS.map((p) => [p.sku, p]));

function productosDe(skus: string[]): Producto[] {
  return skus.map((s) => porSku.get(s)).filter((p): p is Producto => p !== undefined);
}

// Groups as written in lineasGuia, plus any reference of the line that the
// copy does not mention yet, so a product added to productos.ts is never
// missing from its line page.
function gruposCon(guia: GuiaLinea, categoria: string) {
  const grupos = guia.grupos.map((g) => ({ ...g, productos: productosDe(g.skus) })).filter((g) => g.productos.length);
  const nombrados = new Set(guia.grupos.flatMap((g) => g.skus));
  const resto = PRODUCTOS.filter((p) => p.categoria === categoria && !nombrados.has(p.sku));
  if (resto.length) grupos.push({ titulo: "Otras referencias", texto: "", skus: resto.map((p) => p.sku), productos: resto });
  return grupos;
}

const H2 = "t-seccion";
const ANTETITULO = "t-etiqueta text-tenue";

export default async function PaginaLinea({ params }: { params: Promise<{ linea: string }> }) {
  const { linea: slug } = await params;
  const guia = guiaDe(slug);
  const linea = lineaPorSlug(slug);
  if (!guia || !linea) notFound();

  const grupos = gruposCon(guia, linea.categoria);
  const productos = grupos.flatMap((g) => g.productos);
  const complementos = guia.complementos ? productosDe(guia.complementos.skus) : [];
  const ruta = rutaLinea(linea);
  const otras = LINEAS.filter((l) => l.slug !== linea.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${urlAbsoluta(ruta)}#pagina`,
      url: urlAbsoluta(ruta),
      name: guia.h1,
      description: guia.descripcion,
      inLanguage: "es-CO",
      isPartOf: { "@id": `${urlAbsoluta("/")}#sitio` },
      about: { "@id": `${urlAbsoluta("/")}#organizacion` },
      mainEntity: {
        "@type": "ItemList",
        name: guia.h1,
        numberOfItems: productos.length,
        itemListElement: productos.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: urlAbsoluta(`/catalogo/${slugProducto(p)}`),
          name: p.nombre,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: urlAbsoluta("/") },
        { "@type": "ListItem", position: 2, name: "Catálogo", item: urlAbsoluta("/catalogo") },
        { "@type": "ListItem", position: 3, name: linea.nombre, item: urlAbsoluta(ruta) },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 md:pt-10 pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Migas" className="text-sm">
        <ol className="flex flex-wrap items-center gap-x-1 text-tenue">
          <li className="flex items-center">
            <Link href="/catalogo" className="inline-flex items-center min-h-11 hover:text-azul hover:underline">
              Catálogo
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <ChevronRight size={14} aria-hidden />
            <span aria-current="page" className="text-tinta">
              {linea.nombre}
            </span>
          </li>
        </ol>
      </nav>

      <header className="mt-2 grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
        <div data-aparecer className="flex flex-col gap-4">
          <p className={`flex items-center gap-2 ${ANTETITULO}`}>
            <IconoLinea categoria={linea.categoria} size={18} /> Línea · {linea.nombre}
          </p>
          <h1 className="t-titulo">{guia.h1}</h1>
          {guia.intro.map((t) => (
            <p key={t} className="t-texto text-tinta max-w-3xl">
              {t}
            </p>
          ))}
        </div>
        <div data-aparecer className="flex flex-col gap-3 rounded border border-linea bg-azul-suave p-5">
          <p className="t-cifra text-azul">
            {productos.length} <span className="text-base font-sans font-semibold">referencias</span>
          </p>
          <p className="text-sm text-tenue">
            Desde {COMPANIA_INFO.ciudad} para todo el país. Cada referencia tiene su ficha técnica y código.
          </p>
          <a
            href={enlaceWhatsApp(guia.mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            className="boton-iman inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded bg-whatsapp text-white font-semibold hover:brightness-110"
          >
            <MessageCircle size={18} aria-hidden /> Cotizar por WhatsApp
          </a>
          <Link href={`/catalogo?linea=${linea.slug}`} className="inline-flex items-center justify-center gap-1.5 min-h-11 text-sm font-semibold text-azul hover:underline">
            Filtrar en el catálogo <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </header>

      {grupos.map((g, i) => (
        <section key={g.titulo} aria-labelledby={`h-grupo-${i}`} className="mt-14 md:mt-20">
          <div data-aparecer className="flex flex-col gap-2 mb-6 max-w-3xl">
            <p className={ANTETITULO}>
              {String(i + 1).padStart(2, "0")} / {g.productos.length} ref.
            </p>
            <h2 id={`h-grupo-${i}`} className={H2}>
              {g.titulo}
            </h2>
            {g.texto && <p className="text-tenue leading-relaxed">{g.texto}</p>}
          </div>
          <ul data-aparecer="grupo" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {g.productos.map((p) => (
              <li key={p.sku} className="flex [&>article]:w-full">
                <TarjetaProducto producto={p} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {linea.slug === "fijaciones-pesadas" && (
        <section aria-labelledby="h-perfiles" className="mt-14 md:mt-20">
          <div data-aparecer className="flex flex-col gap-2 mb-6 max-w-3xl">
            <p className={ANTETITULO}>Eclisas a pedido</p>
            <h2 id="h-perfiles" className={H2}>
              Eclisas por perfil de riel y norma
            </h2>
            <p className="text-tenue leading-relaxed">
              Perfiles para los que podemos producir eclisas. Las normas se citan como referencia técnica de compatibilidad.
            </p>
          </div>
          {/* Scrolls sideways on phones instead of squeezing four columns. */}
          <div data-aparecer className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm sm:text-base border border-linea">
              <thead className="bg-azul text-white text-left">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Perfil</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Material</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Norma</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Proceso</th>
                </tr>
              </thead>
              <tbody>
                {PERFILES_ECLISA.map(([perfil, material, norma, proceso]) => (
                  <tr key={perfil} className="border-t border-linea">
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-tinta">{perfil}</th>
                    <td className="px-4 py-3 text-tenue">{material}</td>
                    <td className={`px-4 py-3 ${norma ? "font-mono text-sm text-azul" : "text-sm text-tenue"}`}>{norma ?? "Sin norma asociada"}</td>
                    <td className="px-4 py-3 text-tenue">{proceso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/fabricacion#arma-tu-pedido" className="inline-flex items-center gap-1.5 min-h-11 font-semibold text-azul hover:underline">
              Pedir eclisas por perfil <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="/fabricacion" className="inline-flex items-center gap-1.5 min-h-11 font-semibold text-azul hover:underline">
              Cómo fabricamos en Colombia <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </section>
      )}

      {complementos.length > 0 && guia.complementos && (
        <section aria-labelledby="h-complementos" className="mt-14 md:mt-20">
          <div data-aparecer className="flex flex-col gap-2 mb-6">
            <p className={ANTETITULO}>De otras líneas</p>
            <h2 id="h-complementos" className={H2}>
              {guia.complementos.titulo}
            </h2>
          </div>
          <ul data-aparecer="grupo" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {complementos.map((p) => (
              <li key={p.sku} className="flex [&>article]:w-full">
                <TarjetaProducto producto={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* How to quote, as information only: the page's one call to action
          is in the header, and the footer band closes the page. */}
      <section aria-labelledby="h-cotizar" className="mt-16 md:mt-24 rounded border border-linea bg-gris">
        <div className="grid gap-8 p-6 md:p-10 md:grid-cols-[1fr_1.3fr] md:items-center">
          <div data-aparecer className="flex flex-col gap-3">
            <h2 id="h-cotizar" className={H2}>
              Cómo cotizar {linea.nombre.toLowerCase()}
            </h2>
            <p className="text-tenue">No publicamos precios: cada pedido se cotiza con sus referencias y cantidades.</p>
          </div>
          <ol data-aparecer="grupo" className="grid gap-5 sm:grid-cols-3">
            {[
              ["Elige las piezas", "En la ficha de cada una, con «Agregar a cotización»."],
              ["Pon cantidades", "Y la ciudad donde las necesitas."],
              ["Envía la lista", "Por WhatsApp o correo. Te respondemos con la cotización."],
            ].map(([t, d], i) => (
              <li key={t} className="border-t-2 border-azul pt-3">
                <p className="font-semibold">
                  <span className="font-mono tabular-nums text-tenue mr-1.5">{i + 1}.</span>
                  {t}
                </p>
                <p className="text-sm text-tenue mt-1">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <nav aria-labelledby="h-otras" className="mt-14 md:mt-20">
        <h2 id="h-otras" className={`${H2} mb-6`}>
          Otras líneas
        </h2>
        <ul data-aparecer="grupo" className="grid gap-px bg-linea border border-linea rounded overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {otras.map((l) => (
            <li key={l.slug} className="bg-white">
              <Link href={rutaLinea(l)} className="foco group flex flex-col gap-1 h-full min-h-11 p-5 hover:bg-gris">
                <span className="flex items-center gap-2 font-semibold text-tinta group-hover:text-azul">
                  <IconoLinea categoria={l.categoria} size={18} /> {l.nombre}
                </span>
                <span className="text-sm text-tenue">{l.resumen}</span>
              </Link>
            </li>
          ))}
          {/* Four other lines plus these two fill whole rows at every width,
              so the 1px grid never shows an empty grey cell. */}
          <li className="bg-white">
            <Link href="/servicios" className="foco group flex flex-col gap-1 h-full min-h-11 p-5 hover:bg-gris">
              <span className="font-semibold text-tinta group-hover:text-azul">Servicios</span>
              <span className="text-sm text-tenue">Topografía con dron, mantenimiento, hidráulica, alquiler Lincoln, planos y consultoría.</span>
            </Link>
          </li>
          <li className="bg-white">
            <Link href="/preguntas-frecuentes" className="foco group flex flex-col gap-1 h-full min-h-11 p-5 hover:bg-gris">
              <span className="font-semibold text-tinta group-hover:text-azul">Preguntas frecuentes</span>
              <span className="text-sm text-tenue">Cómo cotizar, fabricación en Colombia, cobertura y GAVICOM Energy.</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
