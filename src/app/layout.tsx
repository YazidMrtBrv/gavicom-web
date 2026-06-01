import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/commons/Navbar";
import WhatsAppFloat from "@/components/commons/WhatsAppFloat";
import PageTransition from "@/components/PageTransition";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import IntroWrapper from "@/components/IntroWrapper";
import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/ui/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = "https://gavicom-web.vercel.app";
const EMPRESA = "GAVICOM SAS";

export const metadata: Metadata = {
  title: {
    default: `${EMPRESA} | Suministros Ferroviarios y Herramientas de Vía`,
    template: `%s | ${EMPRESA}`,
  },
  description:
    "Distribuidor independiente de componentes ferroviarios, fijaciones pesadas, sistemas elásticos de sujeción, herramientas de vía certificadas AREMA/UIC y señalización industrial en Colombia.",
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
    "GAVICOM",
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
      "Distribuidor independiente de componentes ferroviarios, fijaciones pesadas, sistemas elásticos de sujeción y herramientas certificadas para la industria del tren.",
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
  name: EMPRESA,
  alternateName: "GAVICOM",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-gavicom.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+57-315-050-9803",
    contactType: "sales",
    email: "gvtsas01@gmail.com",
    availableLanguage: ["Spanish"],
  },
  sameAs: [
    `https://wa.me/573150509803`,
  ],
  description:
    "Distribuidor independiente de componentes ferroviarios, fijaciones pesadas, sistemas elásticos de sujeción, herramientas de vía certificadas y señalización industrial.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#f8f9fa] text-[#1a1a2e] font-sans antialiased flex flex-col">
        <IntroWrapper>
          <Navbar />
          <main className="flex-grow"><SmoothScrollProvider><ErrorBoundary><PageTransition>{children}</PageTransition></ErrorBoundary></SmoothScrollProvider></main>
          <Footer />
          <WhatsAppFloat />
        </IntroWrapper>
      </body>
    </html>
  );
}
