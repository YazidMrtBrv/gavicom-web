import { PRODUCTOS_Y_SERVICIOS, type Producto } from "@/constants/productos";
import { normalizarBusqueda } from "@/lib/cotizacion";

/** Valor del filtro que muestra todas las categorías (el mismo que usaba el catálogo). */
export const TODAS_LAS_CATEGORIAS = "Todos";

export const REFERENCIAS_VISIBLES: Producto[] = PRODUCTOS_Y_SERVICIOS.filter((producto) => !producto.oculto);

// El índice sale de todo el catálogo, en el orden en que aparece cada categoría,
// igual que antes del rediseño.
export const CATEGORIAS: string[] = [...new Set(PRODUCTOS_Y_SERVICIOS.map((producto) => producto.categoria))];

export interface ResumenCategoria {
  nombre: string;
  /** Posición en el índice, desde 0. */
  indice: number;
  /** Referencias visibles de la categoría. */
  total: number;
  subcategorias: string[];
  /** Para ids y anclas: "Herramientas de Vía" → "herramientas-de-via". */
  slug: string;
}

export function slugCategoria(nombre: string): string {
  return normalizarBusqueda(nombre)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const RESUMEN_CATEGORIAS: ResumenCategoria[] = CATEGORIAS.map((nombre, indice) => {
  const deLaCategoria = REFERENCIAS_VISIBLES.filter((producto) => producto.categoria === nombre);
  return {
    nombre,
    indice,
    total: deLaCategoria.length,
    subcategorias: [...new Set(deLaCategoria.map((producto) => producto.subcategoria))],
    slug: slugCategoria(nombre),
  };
});

export const TOTAL_REFERENCIAS = REFERENCIAS_VISIBLES.length;
export const TOTAL_CATEGORIAS = RESUMEN_CATEGORIAS.filter((categoria) => categoria.total > 0).length;
export const TOTAL_SUBCATEGORIAS = new Set(REFERENCIAS_VISIBLES.map((producto) => producto.subcategoria)).size;

export function dosCifras(n: number): string {
  return String(n).padStart(2, "0");
}

function terminosDe(consulta: string): string[] {
  const limpia = normalizarBusqueda(consulta);
  return limpia ? limpia.split(" ") : [];
}

/* ---------- Filtro del listado ---------- */

// Texto donde busca el filtro del listado: lo de antes (nombre, SKU, descripción y
// especificaciones) más subcategoría y las especificaciones de cada variante.
const TEXTO_FILTRABLE = new Map<string, string>(
  PRODUCTOS_Y_SERVICIOS.map((producto) => [
    producto.sku,
    normalizarBusqueda(
      [
        producto.nombre,
        producto.sku,
        producto.subcategoria,
        producto.descripcion,
        ...Object.values(producto.especificaciones),
        ...(producto.variantes ?? []).flatMap((variante) => [
          variante.nombre ?? "",
          ...Object.values(variante.especificaciones ?? {}),
        ]),
      ].join(" ")
    ),
  ])
);

/*
 * Misma lógica del catálogo anterior: las referencias ocultas solo aparecen al
 * buscar, y la categoría "Todos" no filtra. La búsqueda pide que cada palabra
 * aparezca en algún campo (antes buscaba la frase entera: "riel 115" no
 * encontraba "Eclisas para Riel de 115 LB").
 */
export function filtrarProductos(busqueda: string, categoria: string): Producto[] {
  const terminos = terminosDe(busqueda);
  return PRODUCTOS_Y_SERVICIOS.filter((producto) => {
    if (producto.oculto && terminos.length === 0) return false;
    const cumpleCategoria = categoria === TODAS_LAS_CATEGORIAS || producto.categoria === categoria;
    if (!cumpleCategoria) return false;
    const texto = TEXTO_FILTRABLE.get(producto.sku) ?? "";
    return terminos.every((termino) => texto.includes(termino));
  });
}

export interface GrupoCategoria {
  categoria: ResumenCategoria;
  productos: Producto[];
}

export function agruparPorCategoria(productos: Producto[]): GrupoCategoria[] {
  return RESUMEN_CATEGORIAS.map((categoria) => ({
    categoria,
    productos: productos.filter((producto) => producto.categoria === categoria.nombre),
  })).filter((grupo) => grupo.productos.length > 0);
}

/** Coincidencias del texto del filtro por categoría (sin aplicar la categoría elegida). */
export function conteoPorCategoria(busqueda: string): Map<string, number> {
  const conteo = new Map<string, number>();
  for (const producto of filtrarProductos(busqueda, TODAS_LAS_CATEGORIAS)) {
    conteo.set(producto.categoria, (conteo.get(producto.categoria) ?? 0) + 1);
  }
  return conteo;
}

/* ---------- Buscador rápido ---------- */

interface CamposBusqueda {
  sku: string;
  skuCompacto: string;
  nombre: string;
  palabrasNombre: string[];
  categoria: string;
  subcategoria: string;
}

const CAMPOS = new Map<string, CamposBusqueda>(
  PRODUCTOS_Y_SERVICIOS.map((producto) => {
    const sku = normalizarBusqueda(producto.sku);
    const nombre = normalizarBusqueda(producto.nombre);
    return [
      producto.sku,
      {
        sku,
        skuCompacto: sku.replace(/[^a-z0-9]/g, ""),
        nombre,
        palabrasNombre: nombre.split(/[^a-z0-9]+/).filter(Boolean),
        categoria: normalizarBusqueda(producto.categoria),
        subcategoria: normalizarBusqueda(producto.subcategoria),
      },
    ];
  })
);

// Cuánto pesa que un término aparezca en cada campo: quien escribe un SKU
// quiere esa referencia arriba; quien escribe "señal", la categoría entera.
function puntajeTermino(campos: CamposBusqueda, termino: string): number {
  const compacto = termino.replace(/[^a-z0-9]/g, "");
  let puntaje = 0;
  if (campos.sku === termino) puntaje = 120;
  else if (campos.sku.startsWith(termino)) puntaje = 100;
  else if (campos.sku.includes(termino) || (compacto.length > 2 && campos.skuCompacto.includes(compacto))) puntaje = 80;

  if (campos.nombre.startsWith(termino)) puntaje = Math.max(puntaje, 70);
  else if (campos.palabrasNombre.some((palabra) => palabra.startsWith(termino))) puntaje = Math.max(puntaje, 60);
  else if (campos.nombre.includes(termino)) puntaje = Math.max(puntaje, 45);

  if (campos.subcategoria.includes(termino)) puntaje = Math.max(puntaje, 30);
  if (campos.categoria.includes(termino)) puntaje = Math.max(puntaje, 25);
  return puntaje;
}

/*
 * Busca por SKU, nombre, categoría y subcategoría, sin tildes ni mayúsculas.
 * Cada palabra tiene que aparecer en algún campo; se ordena por relevancia y,
 * a igualdad, en el orden del catálogo. Sin consulta devuelve el catálogo
 * visible completo (y, como el filtro, las ocultas solo aparecen al buscar).
 */
export function buscarReferencias(consulta: string): Producto[] {
  const terminos = terminosDe(consulta);
  if (terminos.length === 0) return REFERENCIAS_VISIBLES;

  const resultados: { producto: Producto; puntaje: number; orden: number }[] = [];
  PRODUCTOS_Y_SERVICIOS.forEach((producto, orden) => {
    const campos = CAMPOS.get(producto.sku);
    if (!campos) return;
    let puntaje = 0;
    for (const termino of terminos) {
      const delTermino = puntajeTermino(campos, termino);
      if (delTermino === 0) return;
      puntaje += delTermino;
    }
    resultados.push({ producto, puntaje, orden });
  });

  return resultados
    .sort((a, b) => b.puntaje - a.puntaje || a.orden - b.orden)
    .map((resultado) => resultado.producto);
}

export interface Segmento {
  texto: string;
  coincide: boolean;
}

/*
 * Parte el texto original en tramos que coinciden o no con la consulta.
 * Normaliza letra por letra para saber a qué posición del original corresponde
 * cada letra normalizada ("Señal" y "senal" no siempre miden lo mismo).
 */
export function segmentosResaltados(texto: string, consulta: string): Segmento[] {
  const terminos = terminosDe(consulta);
  if (terminos.length === 0) return [{ texto, coincide: false }];

  let normal = "";
  const origen: number[] = [];
  for (let i = 0; i < texto.length; i++) {
    const letra = texto[i]
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();
    for (const caracter of letra) {
      normal += caracter;
      origen.push(i);
    }
  }

  const marcado = new Array<boolean>(texto.length).fill(false);
  for (const termino of terminos) {
    let desde = 0;
    let posicion = normal.indexOf(termino, desde);
    while (posicion !== -1) {
      for (let j = posicion; j < posicion + termino.length; j++) marcado[origen[j]] = true;
      desde = posicion + termino.length;
      posicion = normal.indexOf(termino, desde);
    }
  }

  const segmentos: Segmento[] = [];
  for (let i = 0; i < texto.length; i++) {
    const ultimo = segmentos[segmentos.length - 1];
    if (ultimo && ultimo.coincide === marcado[i]) ultimo.texto += texto[i];
    else segmentos.push({ texto: texto[i], coincide: marcado[i] });
  }
  return segmentos;
}
