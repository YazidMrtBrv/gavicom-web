import { PRODUCTOS, slugProducto, slugTexto } from "@/lib/catalogo";
import { origenVisible } from "@/constants/catalogoExtra";
import { NOMBRE_SITIO, urlAbsoluta } from "@/lib/sitio";
import TarjetaProducto from "@/components/TarjetaProducto";
import { scriptFiltroPrevio } from "@/components/catalogo/filtrosCatalogo";
import CatalogoFiltrable from "./CatalogoFiltrable";

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
      <h1 className="text-3xl md:text-4xl font-bold">Catálogo</h1>
      <p className="text-tenue mt-2 max-w-2xl">
        {PRODUCTOS.length} referencias con ficha técnica. Agrega las que necesites a tu cotización y envíalas juntas.
      </p>
      {/* The full grid is rendered here, on the server, exactly once: the
          page stays static, crawlers see every product link and nothing moves
          when the filters wake up. The client island only toggles `hidden`
          on these items from ?linea, ?sub, ?origen and ?q. */}
      <script dangerouslySetInnerHTML={{ __html: scriptFiltroPrevio() }} />
      <CatalogoFiltrable>
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
    </div>
  );
}
