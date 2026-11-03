import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import Encabezado from "@/components/Encabezado";
import Pie from "@/components/Pie";
import BotonWhatsApp from "@/components/BotonWhatsApp";
import Interacciones from "@/components/movimiento/Interacciones";
import { Analytics } from "@vercel/analytics/next";
import { EMPRESA, SITE_URL } from "@/lib/meta";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Stand-in for Batangas, the manual's heading face, until it has a web license.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
});

// Only what the code already backs up: no standards or certification claims
// the company cannot document in shared previews and search results.
const DESCRIPCION =
  "Suministro de componentes ferroviarios, fijaciones pesadas, sistemas elásticos de sujeción, herramientas de vía y señalización; fabricación de piezas en Colombia con aliados industriales. Barranquilla, cobertura nacional.";
const TITULO = `${EMPRESA} | Suministros Ferroviarios y Herramientas de Vía`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0c2642",
};

export const metadata: Metadata = {
  title: {
    default: TITULO,
    template: `%s | ${EMPRESA}`,
  },
  description: DESCRIPCION,
  keywords: [
    "herramientas ferroviarias",
    "suministros ferroviarios",
    "fijaciones de riel",
    "eclisas ferroviarias",
    "sistemas elásticos de sujeción",
    "componentes para vía férrea",
    "distribuidor ferroviario Colombia",
    "mantenimiento de vía",
    "señalización ferroviaria",
    "consultoría ferroviaria",
    "suministros ferroviarios Barranquilla",
    "GAVICOM",
    "GAVICOM SAS",
    "GAVICOM ferroviario",
  ],
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "er00xipii8hKUi9e9PUQGK-gJK_yQMprai4hsVUbGLw",
  },
  alternates: {
    canonical: "/",
  },
  // No fixed images: app/opengraph-image.tsx and twitter-image.tsx render the
  // 1200x630 preview; the wide logo alone was cropped badly by every network.
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: SITE_URL,
    siteName: EMPRESA,
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
  },
  // favicon.ico is linked from app/ by file convention. Any `icons` key here
  // drops the file-based icon.png link, so it is listed again explicitly,
  // next to the vector version for browsers that render SVG favicons.
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

const organizacion = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organizacion`,
  name: EMPRESA,
  alternateName: ["GAVICOM", "GAVICOM Ferroviario"],
  url: SITE_URL,
  logo: `${SITE_URL}/apple-icon.png`,
  image: `${SITE_URL}/marca/gavicom-azul.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+57-315-050-9803",
    contactType: "sales",
    email: "gerencia@gavicom.com",
    areaServed: "CO",
    availableLanguage: ["Spanish"],
  },
  description: DESCRIPCION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Barranquilla",
    addressRegion: "Atlántico",
    addressCountry: "CO",
  },
  areaServed: {
    "@type": "Country",
    name: "Colombia",
  },
  knowsAbout: [
    "Suministro de componentes ferroviarios",
    "Fijaciones pesadas y sistemas elásticos de sujeción",
    "Herramientas de vía férrea",
    "Señalización ferroviaria e industrial",
    "Estudios topográficos con dron",
    "Consultoría ferroviaria",
    "Obras civiles para infraestructura de transporte",
    "Energía solar fotovoltaica",
  ],
};

// WebSite node with SearchAction: /catalogo reads ?q (CatalogoFiltrable), so
// search engines can offer a search box that lands on real results.
const sitioWeb = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#sitio`,
  url: SITE_URL,
  name: EMPRESA,
  inLanguage: "es-CO",
  publisher: { "@id": `${SITE_URL}/#organizacion` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/catalogo?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [organizacion, sitioWeb],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO" className={`${montserrat.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen font-sans flex flex-col">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:p-3 focus:bg-white focus:text-azul">
          Saltar al contenido
        </a>
        <Encabezado />
        <main id="contenido" className="flex-grow">
          {children}
        </main>
        <Pie />
        <BotonWhatsApp />
        <Interacciones />
        {/* Vercel Analytics only exists on Vercel; elsewhere its script 404s. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
