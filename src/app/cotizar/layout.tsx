import type { Metadata } from "next";

const TITULO = "Solicitar cotización";
const DESCRIPCION =
  "Arme su solicitud con referencias del catálogo ferroviario y servicios de energía solar de GAVICOM Energy, indique el lugar de entrega y envíela por WhatsApp. GAVICOM SAS, Barranquilla, cobertura nacional.";

// openGraph, twitter y robots se reemplazan completos en cada segmento (no se
// fusionan con los del layout raíz): por eso repiten lo que se quiere conservar.
export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: "/cotizar" },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
  },
  openGraph: {
    title: `${TITULO} | GAVICOM SAS`,
    description: DESCRIPCION,
    url: "/cotizar",
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

export default function CotizarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
