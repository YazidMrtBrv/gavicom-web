import type { Metadata } from "next";

const TITULO = "Servicios técnicos para vía férrea";
const DESCRIPCION =
  "Topografía con dron, mantenimiento de equipos ferroviarios, servicio técnico hidráulico, alquiler de motosoldadores Lincoln, planos de cambiavías, modelado 3D y consultoría ferroviaria en Colombia.";

// No fixed images, per the site convention: share images come from
// file-based opengraph-image routes, never from a hard-coded path.
export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: "/servicios" },
  openGraph: {
    title: `${TITULO} | GAVICOM SAS`,
    description: DESCRIPCION,
    url: "/servicios",
    siteName: "GAVICOM SAS",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITULO} | GAVICOM SAS`,
    description: DESCRIPCION,
  },
};

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
