import HeroServicios from "@/components/servicios/HeroServicios";
import CintaServicios from "@/components/servicios/CintaServicios";
import PortafolioServicios from "@/components/servicios/PortafolioServicios";
import EstandaresServicios from "@/components/servicios/EstandaresServicios";
import CierreServicios from "@/components/servicios/CierreServicios";
import { anclaServicio, SERVICIOS } from "@/components/servicios/datos";

const SITE_URL = "https://gavicomferroviario.com";

// Los servicios como datos estructurados, enlazados a la organización que
// declara el layout raíz (@id #organizacion). Solo lo que dice la página.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Servicios técnicos ferroviarios de GAVICOM SAS",
  itemListElement: SERVICIOS.map((servicio, i) => {
    const url = `${SITE_URL}/servicios#${anclaServicio(servicio.sku)}`;
    return {
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        "@id": url,
        url,
        name: servicio.nombre,
        description: servicio.descripcion,
        serviceType: servicio.subcategoria,
        identifier: servicio.sku,
        ...(servicio.imagen ? { image: `${SITE_URL}/images/productos/${servicio.imagen}` } : {}),
        areaServed: { "@type": "Country", name: "Colombia" },
        provider: { "@id": `${SITE_URL}/#organizacion` },
      },
    };
  }),
};

export default function ServiciosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HeroServicios />
      <CintaServicios />
      <PortafolioServicios />
      <EstandaresServicios />
      <CierreServicios />
    </>
  );
}
