import type { Metadata } from "next";

export const SITE_URL = "https://gavicomferroviario.com";
export const EMPRESA = "GAVICOM SAS";

// Exported so pages that still write their own metadata keep the shared preview.
export const IMAGEN_COMPARTIR = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "GAVICOM SAS: materiales, herramientas y fabricación para vía férrea en Barranquilla, Colombia",
};

/**
 * Canonical plus a self-referencing es-CO hreflang (and x-default) for one
 * path. The site is Spanish for Colombia only, so the annotation just states
 * that clearly. Every page must pass it whole: a child `alternates` object
 * replaces the parent's instead of merging with it.
 */
export function alternas(ruta: string): NonNullable<Metadata["alternates"]> {
  return { canonical: ruta, languages: { "es-CO": ruta, "x-default": ruta } };
}

// The root template appends " | GAVICOM SAS" (14 characters). Search results
// cut titles around 60, so a page title is kept to 46 before the suffix.
export const MAX_TITULO = 60 - ` | ${EMPRESA}`.length;

/** Cuts a description at a word boundary so it fits in a search snippet. */
export function recortar(texto: string, max = 155): string {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max - 1);
  return `${corte.slice(0, corte.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}

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
    alternates: alternas(ruta),
    openGraph: {
      title: `${titulo} | ${EMPRESA}`,
      description: descripcion,
      url: ruta,
      siteName: EMPRESA,
      locale: "es_CO",
      type: "website",
      images: [IMAGEN_COMPARTIR],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} | ${EMPRESA}`,
      description: descripcion,
      images: [IMAGEN_COMPARTIR],
    },
  };
}
