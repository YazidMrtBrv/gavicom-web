import { COMPANIA_INFO } from "@/constants/productos";
import HeroContacto from "@/components/contacto/HeroContacto";
import SeccionSolicitud from "@/components/contacto/SeccionSolicitud";
import BandaCotizador from "@/components/contacto/BandaCotizador";
import Directorio from "@/components/contacto/Directorio";

const SITE_URL = "https://gavicomferroviario.com";

// La página como ContactPage de la organización que ya declara el layout raíz
// (@id #organizacion). Los datos de contacto viven allí: repetirlos aquí con otro
// formato de teléfono haría que los buscadores vieran dos puntos de contacto.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contacto#pagina`,
  url: `${SITE_URL}/contacto`,
  name: `Contacto — ${COMPANIA_INFO.nombre}`,
  inLanguage: "es-CO",
  about: { "@id": `${SITE_URL}/#organizacion` },
  mainEntity: { "@id": `${SITE_URL}/#organizacion` },
};

export default function ContactoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HeroContacto />
      <SeccionSolicitud />
      <BandaCotizador />
      <Directorio />
    </>
  );
}
