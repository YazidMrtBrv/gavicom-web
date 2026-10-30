import type { Metadata } from "next";

const TITULO = "GAVICOM Energy — Energía solar fotovoltaica";
const DESCRIPCION =
  "Cofres fotovoltaicos metálicos rígidos con cumplimiento de los requisitos aplicables del RETIE, montaje e instalación de sistemas solares residenciales, comerciales e industriales, protecciones eléctricas AC y DC y ensamble de gabinetes. GAVICOM SAS, Barranquilla.";

// openGraph y twitter se reemplazan completos en cada segmento (no se
// fusionan con los del layout raíz): por eso repiten siteName, locale e imagen.
export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  keywords: [
    "energía solar fotovoltaica",
    "cofres fotovoltaicos",
    "cofres fotovoltaicos metálicos",
    "instalación de sistemas solares",
    "paneles solares Barranquilla",
    "protecciones eléctricas AC y DC",
    "gabinetes eléctricos",
    "RETIE",
    "GAVICOM Energy",
  ],
  alternates: { canonical: "/energy" },
  openGraph: {
    title: `${TITULO} | GAVICOM SAS`,
    description: DESCRIPCION,
    url: "/energy",
    siteName: "GAVICOM SAS",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/logo-gavicom.png", width: 512, height: 512, alt: "GAVICOM SAS" }],
  },
  twitter: {
    card: "summary",
    title: `${TITULO} | GAVICOM SAS`,
    description: DESCRIPCION,
    images: ["/logo-gavicom.png"],
  },
};

export default function EnergyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
