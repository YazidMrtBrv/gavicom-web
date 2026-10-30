import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo Técnico de Componentes y Suministros Ferroviarios",
  description:
    "Eclisas, pernos, clavos de vía, placas de asiento, anclas de riel, clips elásticos, tirafondos, herramientas de vía y señalización ferroviaria. Especificaciones técnicas y cotización directa por WhatsApp.",
  alternates: { canonical: "/catalogo" },
  openGraph: {
    title: "Catálogo Técnico de Componentes y Suministros Ferroviarios | GAVICOM SAS",
    description:
      "Fijaciones pesadas, sistemas elásticos de sujeción, herramientas de vía y señalización ferroviaria con especificaciones técnicas.",
    url: "/catalogo",
    type: "website",
    siteName: "GAVICOM SAS",
    locale: "es_CO",
    // Next replaces the root openGraph instead of merging it, so the shared
    // image has to be repeated here or the link preview goes out without one.
    images: [{ url: "/logo-gavicom.png", width: 652, height: 383, alt: "GAVICOM SAS" }],
  },
};

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
