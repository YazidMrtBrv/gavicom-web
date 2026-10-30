import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto y Solicitud de Cotización",
  description:
    "Solicite cotización de suministros ferroviarios, servicios técnicos y energía solar a GAVICOM SAS. Sede en Barranquilla, Atlántico, con cobertura en toda Colombia. Atención por WhatsApp y correo.",
  alternates: { canonical: "/contacto" },
  openGraph: {
    title: "Contacto y Solicitud de Cotización | GAVICOM SAS",
    description:
      "Canal directo para cotizaciones de componentes ferroviarios, servicios técnicos y energía solar. Barranquilla, Colombia.",
    url: "/contacto",
    type: "website",
    siteName: "GAVICOM SAS",
    locale: "es_CO",
    // Next replaces the root openGraph instead of merging it, so the shared
    // image has to be repeated here or the link preview goes out without one.
    images: [{ url: "/logo-gavicom.png", width: 652, height: 383, alt: "GAVICOM SAS" }],
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
