import type { Metadata } from "next";

export const SITE_URL = "https://gavicomferroviario.com";
export const EMPRESA = "GAVICOM SAS";

const IMAGEN = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "GAVICOM SAS: materiales, herramientas y fabricación para vía férrea en Barranquilla, Colombia",
};

type Entrada = {
  titulo: string;
  descripcion: string;
  /** Path starting with "/", e.g. "/catalogo". */
  ruta: string;
};

/**
 * Builds the per-page metadata every page used to write by hand. Child pages
 * that set `openGraph` replace the root object entirely, so siteName, locale
 * and url must be repeated here or shared links lose them. The same goes for
 * the image: a child openGraph drops the root opengraph-image, so it points
 * back to that generated preview (not a fixed photo or the bare logo). Pages
 * with their own picture, such as a product sheet, can override `images`.
 */
export function metaPagina({ titulo, descripcion, ruta }: Entrada): Metadata {
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      title: `${titulo} | ${EMPRESA}`,
      description: descripcion,
      url: ruta,
      siteName: EMPRESA,
      locale: "es_CO",
      type: "website",
      images: [IMAGEN],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} | ${EMPRESA}`,
      description: descripcion,
      images: [IMAGEN],
    },
  };
}
