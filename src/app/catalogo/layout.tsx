import type { Metadata } from "next";
import { NOMBRE_SITIO } from "@/lib/sitio";
import AvisoCotizacion from "@/components/catalogo/AvisoCotizacion";

const TITULO = "Catálogo Técnico de Componentes y Suministros Ferroviarios";
const DESCRIPCION =
  "Eclisas, pernos, clavos de vía, placas de asiento, anclas de riel, clips elásticos, tirafondos, herramientas de vía y señalización ferroviaria. Fichas técnicas y cotización directa por WhatsApp.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: "/catalogo" },
  openGraph: {
    title: `${TITULO} | ${NOMBRE_SITIO}`,
    description: DESCRIPCION,
    url: "/catalogo",
    siteName: NOMBRE_SITIO,
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITULO} | ${NOMBRE_SITIO}`,
    description: DESCRIPCION,
  },
};

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* Add confirmation for the catalogue and product pages. Other pages
          with add buttons (home, energy) need it mounted in the root layout,
          which belongs to another change set. */}
      <AvisoCotizacion />
    </>
  );
}
