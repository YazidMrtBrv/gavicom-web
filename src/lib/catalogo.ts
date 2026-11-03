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
export const DESTACADOS = ["GVC-AK-EA75", "GVC-AK-JB115", "GVC-AD-SKL14", "GVC-AD-SS01", "GVC-AK-TP03", "GVC-AK-CF01", "GVC-FIJ-001", "GVC-MAN-003"];

export function slugProducto(p: Pick<Producto, "sku">): string {
  return p.sku.toLowerCase();
}

export function productoPorSlug(slug: string): Producto | undefined {
  return PRODUCTOS.find((p) => slugProducto(p) === slug.toLowerCase());
}

export function lineaDe(p: Producto): Linea | undefined {
  return LINEAS.find((l) => l.categoria === p.categoria);
}

// Each line has its own indexable guide page; the filtered catalogue
// (/catalogo?linea=) stays for browsing but canonicalises to /catalogo.
export function rutaLinea(l: Pick<Linea, "slug">): string {
  return `/catalogo/linea/${l.slug}`;
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

// Turns "Herramientas de Mano" into "herramientas-de-mano" for ?sub=.
export function slugTexto(texto: string): string {
  return normalizar(texto).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function subcategoriasDe(productos: Producto[]): { slug: string; nombre: string; total: number }[] {
  const mapa = new Map<string, { slug: string; nombre: string; total: number }>();
  for (const p of productos) {
    const slug = slugTexto(p.subcategoria);
    const actual = mapa.get(slug);
    if (actual) actual.total++;
    else mapa.set(slug, { slug, nombre: p.subcategoria, total: 1 });
  }
  return [...mapa.values()];
}

// Words that name the same part in the field. A query word matches if the
// text has it OR any synonym, so these only ever widen a search.
const SINONIMOS: string[][] = [
  ["eclisa", "joint bar", "jointbar"],
  ["clip", "grapa"],
  ["durmiente", "traviesa"],
  ["tornillo", "perno"],
];

// Plural to singular, loosely: "eclisas" -> "eclisa", "rieles" -> "riel".
// Matching is by substring, so a stem that is a bit short still works.
function raiz(palabra: string): string {
  if (palabra.length <= 4) return palabra;
  if (palabra.endsWith("es") && !/[aeiou]es$/.test(palabra)) return palabra.slice(0, -2);
  if (palabra.endsWith("s")) return palabra.slice(0, -1);
  return palabra;
}

function alternativas(palabra: string): string[] {
  const r = raiz(palabra);
  const grupo = SINONIMOS.find((g) => g.some((s) => raiz(s) === r || s === palabra));
  return grupo ? [r, ...grupo.map(raiz)] : [r];
}

export function buscar(productos: Producto[], consulta: string): Producto[] {
  // "joint bars" is one idea in two words: glue it before splitting.
  const limpia = normalizar(consulta).replace(/joint\s+bars?/g, "jointbar");
  const palabras = limpia.split(/\s+/).filter(Boolean).map(alternativas);
  if (!palabras.length) return productos;
  const coincide = (texto: string) => palabras.every((alts) => alts.some((a) => texto.includes(a)));
  const puntuados: { p: Producto; puntos: number }[] = [];
  for (const p of productos) {
    const titulo = normalizar(`${p.sku} ${p.nombre}`).replace(/joint\s+bars?/g, "jointbar");
    const resto = normalizar(
      [p.categoria, p.subcategoria, p.descripcion, ...Object.values(p.especificaciones)].join(" ")
    ).replace(/joint\s+bars?/g, "jointbar");
    // Code or name hits first, description-only hits after.
    if (coincide(titulo)) puntuados.push({ p, puntos: 2 });
    else if (coincide(`${titulo} ${resto}`)) puntuados.push({ p, puntos: 1 });
  }
  // Array.prototype.sort is stable, so ties keep catalogue order.
  return puntuados.sort((a, b) => b.puntos - a.puntos).map((x) => x.p);
}
