import type { MetadataRoute } from "next";
import { LINEAS, PRODUCTOS, rutaLinea, slugProducto } from "@/lib/catalogo";

// Fixed dates of the last real content change per section. new Date() made
// every deploy claim that all pages changed, which teaches crawlers to ignore
// lastModified. Update the date of a section when its content changes.
const ACTUALIZADO = {
  inicio: "2026-11-03",
  catalogo: "2026-11-03",
  lineas: "2026-11-03",
  preguntas: "2026-11-03",
  fabricacion: "2026-11-02",
  servicios: "2026-11-03",
  energy: "2026-11-02",
  nosotros: "2026-11-02",
  contacto: "2026-11-03",
} as const;

const BASE = "https://gavicomferroviario.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const f = (s: keyof typeof ACTUALIZADO) => new Date(`${ACTUALIZADO[s]}T00:00:00-05:00`);
  // Self-referencing es-CO alternate on every entry: the site has a single
  // language, and stating it here covers pages whose own <head> cannot.
  const entrada = (
    ruta: string,
    seccion: keyof typeof ACTUALIZADO,
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>,
    priority: number
  ): MetadataRoute.Sitemap[number] => {
    const url = `${BASE}${ruta}`;
    return { url, lastModified: f(seccion), changeFrequency, priority, alternates: { languages: { "es-CO": url } } };
  };
  return [
    entrada("", "inicio", "weekly", 1),
    entrada("/catalogo", "catalogo", "weekly", 0.9),
    ...LINEAS.map((l) => entrada(rutaLinea(l), "lineas", "monthly", 0.9)),
    entrada("/fabricacion", "fabricacion", "monthly", 0.9),
    entrada("/servicios", "servicios", "monthly", 0.8),
    entrada("/energy", "energy", "monthly", 0.8),
    entrada("/preguntas-frecuentes", "preguntas", "monthly", 0.7),
    entrada("/nosotros", "nosotros", "yearly", 0.5),
    entrada("/contacto", "contacto", "monthly", 0.7),
    // One entry per reference: each has its own page.
    ...PRODUCTOS.map((p) => entrada(`/catalogo/${slugProducto(p)}`, "catalogo", "monthly", 0.7)),
  ];
}
