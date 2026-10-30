import type { MetadataRoute } from "next";
import { PRODUCTOS, slugProducto } from "@/lib/catalogo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gavicomferroviario.com";
  const hoy = new Date();
  return [
    { url: base, lastModified: hoy, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/catalogo`, lastModified: hoy, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/servicios`, lastModified: hoy, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/nosotros`, lastModified: hoy, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/contacto`, lastModified: hoy, changeFrequency: "monthly", priority: 0.7 },
    // One entry per reference: each now has its own page.
    ...PRODUCTOS.map((p) => ({ url: `${base}/catalogo/${slugProducto(p)}`, lastModified: hoy, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
