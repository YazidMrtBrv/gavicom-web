import type { MetadataRoute } from "next";
import { PRODUCTOS, slugProducto } from "@/lib/catalogo";

// Fixed dates of the last real content change per section. new Date() made
// every deploy claim that all pages changed, which teaches crawlers to ignore
// lastModified. Update the date of a section when its content changes.
const ACTUALIZADO = {
  inicio: "2026-11-02",
  catalogo: "2026-11-02",
  fabricacion: "2026-11-02",
  servicios: "2026-11-02",
  energy: "2026-11-02",
  nosotros: "2026-11-02",
  contacto: "2026-10-30",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gavicomferroviario.com";
  const f = (s: keyof typeof ACTUALIZADO) => new Date(`${ACTUALIZADO[s]}T00:00:00-05:00`);
  return [
    { url: base, lastModified: f("inicio"), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/catalogo`, lastModified: f("catalogo"), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/fabricacion`, lastModified: f("fabricacion"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/servicios`, lastModified: f("servicios"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/energy`, lastModified: f("energy"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/nosotros`, lastModified: f("nosotros"), changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/contacto`, lastModified: f("contacto"), changeFrequency: "monthly", priority: 0.7 },
    // One entry per reference: each now has its own page.
    ...PRODUCTOS.map((p) => ({ url: `${base}/catalogo/${slugProducto(p)}`, lastModified: f("catalogo"), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
