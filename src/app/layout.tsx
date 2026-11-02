import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import Encabezado from "@/components/Encabezado";
import Pie from "@/components/Pie";
import BotonWhatsApp from "@/components/BotonWhatsApp";
import Interacciones from "@/components/movimiento/Interacciones";
import { Analytics } from "@vercel/analytics/next";

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

const SITE_URL = "https://gavicomferroviario.com";
const EMPRESA = "GAVICOM SAS";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: {
    default: `${EMPRESA} | Suministros Ferroviarios y Herramientas de Vía`,
    template: `%s | ${EMPRESA}`,
  },
  description:
    "Distribuidor independiente de componentes ferroviarios, fijaciones pesadas, sistemas elásticos de sujeción, herramientas de vía certificadas AREMA/UIC y señalización industrial. Sede en Barranquilla con cobertura en toda Colombia.",
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
  openGraph: {
    title: `${EMPRESA} | Suministros Ferroviarios y Herramientas de Vía`,
    description:
      "Distribuidor independiente de componentes ferroviarios, fijaciones pesadas, sistemas elásticos de sujeción y herramientas certificadas para la industria del tren.",
    url: SITE_URL,
    siteName: EMPRESA,
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/marca/gavicom-azul.png",
        width: 1267,
        height: 327,
        alt: EMPRESA,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${EMPRESA} | Suministros Ferroviarios y Herramientas de Vía`,
    description:
      "Distribuidor independiente de componentes ferroviarios, fijaciones pesadas, sistemas elásticos de sujeción y herramientas certificadas para la industria del tren.",
    images: ["/marca/gavicom-azul.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organizacion`,
  name: EMPRESA,
  alternateName: ["GAVICOM", "GAVICOM Ferroviario"],
  url: SITE_URL,
  logo: `${SITE_URL}/marca/gavicom-azul.png`,
  image: `${SITE_URL}/marca/gavicom-azul.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+57-315-050-9803",
    contactType: "sales",
    email: "gerencia@gavicom.com",
    areaServed: "CO",
    availableLanguage: ["Spanish"],
  },
  sameAs: [
    `https://wa.me/573150509803`,
  ],
  description:
    "Distribuidor independiente de componentes ferroviarios, fijaciones pesadas, sistemas elásticos de sujeción, herramientas de vía certificadas y señalización industrial.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${poppins.variable}`}>
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
        <Analytics />
      </body>
    </html>
  );
}
