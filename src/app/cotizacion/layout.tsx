import type { Metadata } from "next";
import { IMAGEN_COMPARTIR, alternas } from "@/lib/meta";
import { NOMBRE_SITIO } from "@/lib/sitio";

const TITULO = "Mi cotización";
const DESCRIPCION = "Lista de referencias para cotizar con GAVICOM por WhatsApp o correo.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  // The list lives in each visitor's browser: an indexed copy would be empty.
  robots: { index: false },
  alternates: alternas("/cotizacion"),
  openGraph: {
    title: `${TITULO} | ${NOMBRE_SITIO}`,
    description: DESCRIPCION,
    url: "/cotizacion",
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
