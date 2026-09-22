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
  },
};

export default function ServiciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
