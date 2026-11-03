import type { Metadata } from "next";

const TITULO = "Contacto | GAVICOM SAS";
const DESCRIPCION =
  "Escribe a GAVICOM SAS por WhatsApp o por correo: suministro ferroviario, fabricación de piezas, GAVICOM Energy y servicios técnicos. Barranquilla, Atlántico, con cobertura en todo el territorio nacional.";

// No images declared on purpose: the shared Open Graph image is defined once
// for the whole site, not per page.
export const metadata: Metadata = {
  title: "Contacto",
  description: DESCRIPCION,
  alternates: { canonical: "/contacto" },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: "/contacto",
    siteName: "GAVICOM SAS",
    locale: "es_CO",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRIPCION },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
