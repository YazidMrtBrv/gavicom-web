import { SERVICIOS_ENERGY } from "@/constants/energy";
import SectionHeader from "@/components/ui/SectionHeader";
import HeroEnergy from "@/components/energy/HeroEnergy";
import ServiciosEnergy from "@/components/energy/ServiciosEnergy";
import DatosParaCotizar from "@/components/energy/DatosParaCotizar";
import CierreEnergy from "@/components/energy/CierreEnergy";
import { anclaServicio } from "@/components/energy/datos";

const SITE_URL = "https://gavicomferroviario.com";

// Los servicios como datos estructurados, enlazados a la organización que ya
// declara el layout raíz (@id #organizacion). Solo lo que dice la página.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Servicios de GAVICOM Energy",
  itemListElement: SERVICIOS_ENERGY.map((servicio, i) => {
    const url = `${SITE_URL}/energy#${anclaServicio(servicio.codigo)}`;
    return {
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        "@id": url,
        url,
        name: servicio.titulo,
        description: servicio.descripcion,
        serviceType: "Energía solar fotovoltaica",
        identifier: servicio.codigo,
        provider: { "@id": `${SITE_URL}/#organizacion` },
      },
    };
  }),
};

export default function EnergyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Sin fotos ni video propios de Energy todavía: el hero usa el esquema
          ilustrativo. Cuando existan, pásense aquí: <HeroEnergy material={{ imagen, alt, videoSrc }} />. */}
      <HeroEnergy />

      <ServiciosEnergy />

      <section aria-labelledby="titulo-datos-energy" className="bg-surface py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
          <DatosParaCotizar
            encabezado={
              <SectionHeader
                etiqueta="S.02 — PARA COTIZAR"
                titulo="Qué necesitamos para cotizar"
                entradilla="Con estos datos podemos preparar su cotización. No necesita tenerlos todos para escribirnos: marque los que ya tiene y quedarán incluidos en su mensaje de WhatsApp."
                acentos={["cotizar"]}
                id="titulo-datos-energy"
              />
            }
          />
        </div>
      </section>

      <CierreEnergy />
    </>
  );
}
