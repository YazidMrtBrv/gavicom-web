import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo Técnico de Componentes y Suministros Ferroviarios",
  description:
    "Eclisas, pernos, clavos de vía, placas de asiento, anclas de riel, clips elásticos, tirafondos, herramientas de vía y señalización ferroviaria. Fichas técnicas y cotización directa por WhatsApp.",
  alternates: { canonical: "/catalogo" },
  openGraph: {
    title: "Catálogo Técnico de Componentes y Suministros Ferroviarios | GAVICOM SAS",
    description:
      "Fijaciones pesadas, sistemas elásticos de sujeción, herramientas de vía y señalización ferroviaria con especificaciones técnicas.",
    url: "/catalogo",
    type: "website",
  },
};

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
