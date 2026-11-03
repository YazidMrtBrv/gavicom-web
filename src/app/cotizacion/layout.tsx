import type { Metadata } from "next";
import { NOMBRE_SITIO } from "@/lib/sitio";

const TITULO = "Mi cotización";
const DESCRIPCION = "Lista de referencias para cotizar con GAVICOM por WhatsApp o correo.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  // The list lives in each visitor's browser: an indexed copy would be empty.
  robots: { index: false },
  alternates: { canonical: "/cotizacion" },
  openGraph: {
    title: `${TITULO} | ${NOMBRE_SITIO}`,
    description: DESCRIPCION,
    url: "/cotizacion",
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
