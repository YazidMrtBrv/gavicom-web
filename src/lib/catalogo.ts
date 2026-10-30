import { PRODUCTOS_Y_SERVICIOS, type Producto } from "@/constants/productos";

// Product lines as the visitor sees them. Each groups one `categoria` of the
// catalogue; services live on their own page, so they are not a catalogue line.
export const LINEAS = [
  {
    slug: "fijaciones-pesadas",
    categoria: "Fijaciones Pesadas",
    nombre: "Fijaciones pesadas",
    resumen: "Eclisas, pernos, clavos de vía, placas de asiento y anclas de riel.",
  },
  {
    slug: "sistemas-elasticos",
    categoria: "Sistemas Elásticos",
    nombre: "Sistemas elásticos",
    resumen: "Clips, tirafondos, almohadillas y sistemas SKL-14.",
  },
  {
    slug: "herramientas-de-via",
    categoria: "Herramientas de Vía",
    nombre: "Herramientas de vía",
    resumen: "Barras, garlanchines, saca clips, pinzas, troleys y equipo de soldadura.",
  },
  {
    slug: "suministros",
    categoria: "Suministros Ferroviarios",
    nombre: "Suministros",
    resumen: "Brocas, dados, discos de corte, hidráulica y protección personal.",
  },
  {
    slug: "senalizacion",
    categoria: "Señalización",
    nombre: "Señalización",
    resumen: "Señales ferroviarias y viales con soporte, y cuñas de rueda con bandera.",
  },
] as const;

export type Linea = (typeof LINEAS)[number];

const CATEGORIA_SERVICIOS = "Servicios";

export const PRODUCTOS: Producto[] = PRODUCTOS_Y_SERVICIOS.filter(
  (p) => !p.oculto && p.categoria !== CATEGORIA_SERVICIOS
);

export const SERVICIOS: Producto[] = PRODUCTOS_Y_SERVICIOS.filter(
  (p) => !p.oculto && p.categoria === CATEGORIA_SERVICIOS
);

// References shown on the home page. Chosen because they have clean product
// photos, not because of sales volume: the site does not claim "best sellers"
// until GAVICOM says which references sell most.
export const DESTACADOS = ["GVC-AK-JB115", "GVC-AD-SKL14", "GVC-AD-E2055", "GVC-AD-SS01", "GVC-AK-TP03", "GVC-AK-RA04", "GVC-FIJ-001", "GVC-MAN-003"];

export function slugProducto(p: Pick<Producto, "sku">): string {
  return p.sku.toLowerCase();
}

export function productoPorSlug(slug: string): Producto | undefined {
  return PRODUCTOS.find((p) => slugProducto(p) === slug.toLowerCase());
}

export function lineaDe(p: Producto): Linea | undefined {
  return LINEAS.find((l) => l.categoria === p.categoria);
}

export function lineaPorSlug(slug: string | null | undefined): Linea | undefined {
  return LINEAS.find((l) => l.slug === slug);
}

export function imagenProducto(p: Pick<Producto, "imagen">): string | null {
  return p.imagen ? `/images/productos/${p.imagen}` : null;
}

// Lowercase without accents, so "senalizacion" finds "Señalización" and a
// code typed in any case still matches.
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function buscar(productos: Producto[], consulta: string): Producto[] {
  const palabras = normalizar(consulta).split(/\s+/).filter(Boolean);
  if (!palabras.length) return productos;
  return productos.filter((p) => {
    const texto = normalizar(
      [p.sku, p.nombre, p.categoria, p.subcategoria, p.descripcion, ...Object.values(p.especificaciones)].join(" ")
    );
    return palabras.every((w) => texto.includes(w));
  });
}
