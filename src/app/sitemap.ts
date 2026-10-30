import type { MetadataRoute } from "next";

const BASE = "https://gavicomferroviario.com";

type Entrada = Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority"> & { ruta: string };

// /catalogo, /servicios y /contacto conservan su URL: el posicionamiento
// ferroviario ya ganado depende de ellas.
const PAGINAS: Entrada[] = [
  { ruta: "", changeFrequency: "weekly", priority: 1 },
  { ruta: "/catalogo", changeFrequency: "weekly", priority: 0.9 },
  { ruta: "/energy", changeFrequency: "monthly", priority: 0.9 },
  { ruta: "/servicios", changeFrequency: "monthly", priority: 0.8 },
  { ruta: "/contacto", changeFrequency: "monthly", priority: 0.8 },
  { ruta: "/cotizar", changeFrequency: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGINAS.map(({ ruta, ...resto }) => ({ url: `${BASE}${ruta}`, lastModified, ...resto }));
}
