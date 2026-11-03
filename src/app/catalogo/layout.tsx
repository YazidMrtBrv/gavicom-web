import type { Metadata } from "next";
import { IMAGEN_COMPARTIR } from "@/lib/meta";
import { NOMBRE_SITIO } from "@/lib/sitio";

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
    images: [IMAGEN_COMPARTIR],
  },
  twitter: {
    card: "summary_large_image", images: [IMAGEN_COMPARTIR],
    title: `${TITULO} | ${NOMBRE_SITIO}`,
    description: DESCRIPCION,
  },
};

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  // The add confirmation (AvisoCotizacion) lives in the root layout so home,
  // energy and the catalogue share one live region; mounting it here too
  // would announce every addition twice.
  return children;
}
