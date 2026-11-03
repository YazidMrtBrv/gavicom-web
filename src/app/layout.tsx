import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import Encabezado from "@/components/Encabezado";
import Pie from "@/components/Pie";
import BotonWhatsApp from "@/components/BotonWhatsApp";
import AvisoCotizacion from "@/components/catalogo/AvisoCotizacion";
import Interacciones from "@/components/movimiento/Interacciones";
import { Analytics } from "@vercel/analytics/next";
import { EMPRESA, SITE_URL, alternas } from "@/lib/meta";
import { LINEAS, rutaLinea } from "@/lib/catalogo";
import { COMPANIA_INFO } from "@/constants/productos";

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
// Kept within 155 characters so search results show it whole.
const DESCRIPCION =
  "Eclisas, fijaciones, clips elásticos, tirafondos y herramientas de vía; piezas ferroviarias fabricadas en Colombia. Desde Barranquilla a todo el país.";
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
  alternates: alternas("/"),
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

// Every day, 6:00 to 22:00 (COMPANIA_INFO.horario). Organization has no
// openingHours property of its own, so the hours go on the sales contact
// point, where schema.org defines hoursAvailable.
const HORARIO_LD = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  opens: "06:00",
  closes: "22:00",
};

const organizacion = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organizacion`,
  name: EMPRESA,
  alternateName: ["GAVICOM", "GAVICOM Ferroviario"],
  url: SITE_URL,
  logo: `${SITE_URL}/apple-icon.png`,
  telephone: "+57-315-050-9803",
  email: COMPANIA_INFO.email,
  image: `${SITE_URL}/marca/gavicom-azul.png`,
  // Owner's own facts (2026-11): founding year, promise and daily hours.
  foundingDate: String(COMPANIA_INFO.fundacion),
  slogan: COMPANIA_INFO.promesa,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+57-315-050-9803",
    contactType: "sales",
    email: "gerencia@gavicom.com",
    areaServed: "CO",
    availableLanguage: ["Spanish"],
    hoursAvailable: HORARIO_LD,
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
    "Eclisas para riel",
    "Tirafondos para durmiente",
    "Clips elásticos para vía férrea",
    "Fabricación de piezas ferroviarias en hierro nodular",
  ],
  // The solar line is a brand of the same company, not a separate entity.
  brand: { "@type": "Brand", name: "GAVICOM Energy", url: `${SITE_URL}/energy` },
  // The catalogue lines as offer catalogues pointing at their guide pages,
  // without prices: GAVICOM quotes every order.
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Catálogo de suministros ferroviarios",
    url: `${SITE_URL}/catalogo`,
    itemListElement: LINEAS.map((l) => ({
      "@type": "OfferCatalog",
      name: l.nombre,
      description: l.resumen,
      url: `${SITE_URL}${rutaLinea(l)}`,
    })),
  },
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
        {/* One add confirmation for every page with an add button (catalogue,
            home, energy), so it is the only live announcement. */}
        <AvisoCotizacion />
        <Interacciones />
        {/* Vercel Analytics only exists on Vercel; elsewhere its script 404s. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
