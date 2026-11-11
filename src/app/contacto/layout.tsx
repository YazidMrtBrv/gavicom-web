import type { Metadata } from "next";
import { IMAGEN_COMPARTIR, alternas } from "@/lib/meta";

// "Contacto" alone said nothing in search results; this says how.
const TITULO_CORTO = "Contacto: cotiza por WhatsApp o correo";
const TITULO = `${TITULO_CORTO} | GAVICOM SAS`;
const DESCRIPCION =
  "Escribe a GAVICOM SAS por WhatsApp o correo: suministro ferroviario, fabricación de piezas, servicios y GAVICOM Energy. Barranquilla, cobertura nacional.";

// No images declared on purpose: the shared Open Graph image is defined once
// for the whole site, not per page.
export const metadata: Metadata = {
  title: TITULO_CORTO,
  description: DESCRIPCION,
  alternates: alternas("/contacto"),
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: "/contacto",
    siteName: "GAVICOM SAS",
    locale: "es_CO",
    type: "website",
    images: [IMAGEN_COMPARTIR],
  },
  twitter: { card: "summary_large_image", images: [IMAGEN_COMPARTIR], title: TITULO, description: DESCRIPCION },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
