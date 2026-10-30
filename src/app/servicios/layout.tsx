import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios Ferroviarios: Topografía, Mantenimiento y Consultoría",
  description:
    "Estudios topográficos con dron, mantenimiento de equipos ferroviarios, servicio técnico hidráulico, alquiler de equipos de soldadura, diseño de planos de cambiavías, renderizado 3D y consultoría ferroviaria en Colombia.",
  alternates: { canonical: "/servicios" },
  openGraph: {
    title: "Servicios Ferroviarios: Topografía, Mantenimiento y Consultoría | GAVICOM SAS",
    description:
      "Portafolio de servicios técnicos para infraestructura férrea: topografía, mantenimiento, diseño de planos y consultoría especializada.",
    url: "/servicios",
    type: "website",
    siteName: "GAVICOM SAS",
    locale: "es_CO",
    // Next replaces the root openGraph instead of merging it, so the shared
    // image has to be repeated here or the link preview goes out without one.
    images: [{ url: "/logo-gavicom.png", width: 652, height: 383, alt: "GAVICOM SAS" }],
  },
};

export default function ServiciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
