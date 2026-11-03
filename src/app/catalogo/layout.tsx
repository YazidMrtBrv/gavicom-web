import type { Metadata } from "next";
import { IMAGEN_COMPARTIR, alternas } from "@/lib/meta";
import { NOMBRE_SITIO } from "@/lib/sitio";

const TITULO = "Catálogo de suministros ferroviarios";
const DESCRIPCION =
  "Eclisas, pernos, placas de asiento, anclas de riel, clips, tirafondos, herramientas de vía y señalización. Fichas técnicas y cotización por WhatsApp.";

// A plain string title here would stop the root " | GAVICOM SAS" template
// from reaching the product and line pages below, so the template is
// declared again for them and this page's own title is spelled out.
export const metadata: Metadata = {
  title: { absolute: `${TITULO} | ${NOMBRE_SITIO}`, template: `%s | ${NOMBRE_SITIO}` },
  description: DESCRIPCION,
  alternates: alternas("/catalogo"),
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
