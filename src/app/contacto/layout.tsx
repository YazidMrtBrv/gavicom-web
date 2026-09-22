import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto y Solicitud de Cotización",
  description:
    "Solicita cotización de suministros ferroviarios a GAVICOM SAS. Sede en Barranquilla, Atlántico, con cobertura en toda Colombia. Atención por WhatsApp, teléfono y correo.",
  alternates: { canonical: "/contacto" },
  openGraph: {
    title: "Contacto y Solicitud de Cotización | GAVICOM SAS",
    description:
      "Canal directo para cotizaciones de componentes ferroviarios y servicios técnicos. Barranquilla, Colombia.",
    url: "/contacto",
    type: "website",
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
