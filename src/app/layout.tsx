import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/commons/Navbar";
import WhatsAppFloat from "@/components/commons/WhatsAppFloat";
import PageTransition from "@/components/PageTransition";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import IntroWrapper from "@/components/IntroWrapper";
import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/ui/Footer";
import PointerSpotlight from "@/components/ui/PointerSpotlight";
import { Analytics } from "@vercel/analytics/next";

// Montserrat is the brand's secondary typeface (Manual de Identidad, sec. 03)
// and stands in for headings too: the primary one, Batangas, has no web
// licence. Variable font, so the manual's 300–700 range needs no weight list.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
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
    "Distribuidor independiente de componentes ferroviarios, fijaciones pesadas, sistemas elásticos de sujeción, herramientas de vía bajo estándares AREMA/UIC y señalización industrial. Sede en Barranquilla con cobertura en toda Colombia.",
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
      "Distribuidor independiente de componentes ferroviarios, fijaciones pesadas, sistemas elásticos de sujeción y herramientas de vía bajo estándares AREMA/UIC.",
    url: SITE_URL,
    siteName: EMPRESA,
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/logo-gavicom.png",
        width: 512,
        height: 512,
        alt: EMPRESA,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${EMPRESA} | Suministros Ferroviarios y Herramientas de Vía`,
    description:
      "Distribuidor independiente de componentes ferroviarios, fijaciones pesadas, sistemas elásticos de sujeción y herramientas de vía bajo estándares AREMA/UIC.",
    images: ["/logo-gavicom.png"],
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
    apple: "/favicon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organizacion`,
  name: EMPRESA,
  alternateName: ["GAVICOM", "GAVICOM Ferroviario"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo-gavicom.png`,
  image: `${SITE_URL}/logo-gavicom.png`,
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
    "Distribuidor independiente de componentes ferroviarios, fijaciones pesadas, sistemas elásticos de sujeción, herramientas de vía bajo estándares AREMA/UIC y señalización industrial.",
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
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={montserrat.variable}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
        <div className="rail-progress" aria-hidden="true" />
        <PointerSpotlight />
        <IntroWrapper>
          <Navbar />
          <main className="flex-grow"><SmoothScrollProvider><ErrorBoundary><PageTransition>{children}</PageTransition></ErrorBoundary></SmoothScrollProvider></main>
          <Footer />
          <WhatsAppFloat />
        </IntroWrapper>
        <Analytics />
      </body>
    </html>
  );
}
