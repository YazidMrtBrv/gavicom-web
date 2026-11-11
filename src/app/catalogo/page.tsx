import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LINEAS, PRODUCTOS, rutaLinea, slugProducto, slugTexto } from "@/lib/catalogo";
import { origenVisible } from "@/constants/catalogoExtra";
import { NOMBRE_SITIO, urlAbsoluta } from "@/lib/sitio";
import TarjetaProducto from "@/components/TarjetaProducto";
import { scriptFiltroPrevio } from "@/components/catalogo/filtrosCatalogo";
import CatalogoFiltrable from "./CatalogoFiltrable";
import { COMPANIA_INFO } from "@/constants/productos";
import { BotonWhatsAppVenta } from "@/components/venta/Venta";

export default function Catalogo() {
  // Lets search engines read the whole catalogue as one ordered list of
  // product pages (no prices or stock: GAVICOM quotes each order).
  const listaJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Catálogo ${NOMBRE_SITIO}`,
    numberOfItems: PRODUCTOS.length,
    itemListElement: PRODUCTOS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: urlAbsoluta(`/catalogo/${slugProducto(p)}`),
      name: p.nombre,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 md:pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listaJsonLd) }} />
      {/* Sales header: what the buyer gets and the shortest way to it, before
          the grid. The H1 keeps "Catálogo" for the page's search intent. */}
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className="t-etiqueta text-tenue">{COMPANIA_INFO.promesa.replace(/\.$/, "")}</p>
          <h1 className="mt-2 t-titulo">Catálogo: {PRODUCTOS.length} productos GAVICOM para la vía férrea</h1>
          <p className="t-entrada text-tenue mt-3 max-w-2xl">
            Cada pieza tiene su ficha técnica: ábrela, revisa las especificaciones y agrégala a tu cotización. Al final envías la lista completa, con códigos y cantidades.
          </p>
        </div>
        <BotonWhatsAppVenta mensaje="Hola GAVICOM, quiero cotizar estas referencias: " ancho>
          Cotizar por WhatsApp
        </BotonWhatsAppVenta>
      </div>
      {/* The full grid is rendered here, on the server, exactly once: the
          page stays static, crawlers see every product link and nothing moves
          when the filters wake up. The client island only toggles `hidden`
          on these items from ?linea, ?sub, ?origen and ?q. */}
      <script dangerouslySetInnerHTML={{ __html: scriptFiltroPrevio() }} />
      <CatalogoFiltrable>
        {/* The cards are h3: this keeps the heading outline h1 → h2 → h3. */}
        <h2 className="sr-only">Productos</h2>
        <ul id="grilla-catalogo" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {PRODUCTOS.map((p, i) => (
            <li
              key={p.sku}
              data-sku={p.sku}
              data-linea={p.categoria}
              data-sub={slugTexto(p.subcategoria)}
              data-origen={origenVisible(p.sku)}
            >
              <TarjetaProducto producto={p} prioridad={i < 4} />
            </li>
          ))}
        </ul>
      </CatalogoFiltrable>

      {/* Server-rendered links to the line guides: the filter chips above are
          buttons, so without these the guides would be reachable only from
          the home page. */}
      <nav aria-labelledby="h-guias" className="mt-16 border-t border-linea pt-8">
        <h2 id="h-guias" className="t-seccion">Guías por línea</h2>
        <p className="text-tenue mt-1 max-w-2xl">Qué incluye cada línea, para qué sirve cada pieza y cómo cotizarla.</p>
        <ul className="mt-5 grid gap-px bg-linea border border-linea rounded overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {LINEAS.map((l) => (
            <li key={l.slug} className="bg-white">
              <Link href={rutaLinea(l)} className="foco group flex items-center justify-between gap-3 h-full min-h-12 p-4 font-semibold text-tinta hover:bg-gris hover:text-azul">
                {l.nombre} <ArrowRight size={16} aria-hidden className="shrink-0" />
              </Link>
            </li>
          ))}
          <li className="bg-white">
            <Link href="/preguntas-frecuentes" className="foco group flex items-center justify-between gap-3 h-full min-h-12 p-4 font-semibold text-tinta hover:bg-gris hover:text-azul">
              Preguntas frecuentes <ArrowRight size={16} aria-hidden className="shrink-0" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
