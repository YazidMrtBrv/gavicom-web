import { COMPANIA_INFO } from "@/constants/productos";

export type LineaNegocio = "railway" | "energy";

export interface ItemCotizacion {
  sku: string;
  nombre: string;
  linea: LineaNegocio;
  cantidad: number;
  nota?: string;
}

/** Lo que se pasa al agregar: la cantidad es opcional (1 por defecto). */
export type ItemNuevo = Omit<ItemCotizacion, "cantidad"> & { cantidad?: number };

export interface DatosSolicitante {
  nombre?: string;
  empresa?: string;
  ciudad?: string;
  comentario?: string;
}

// Con versión en la clave: si cambia la forma del ítem, una lista vieja se
// ignora en lugar de romper la página.
export const CLAVE_COTIZACION = "gavicom:cotizacion:v1";
export const CANTIDAD_MAXIMA = 9999;
export const LARGO_MAXIMO_NOTA = 280;

export const NOMBRE_LINEA: Record<LineaNegocio, string> = {
  railway: "GAVICOM Railway Solutions & Supply",
  energy: "GAVICOM Energy",
};

export function normalizarCantidad(cantidad: number): number {
  if (!Number.isFinite(cantidad)) return 1;
  return Math.min(CANTIDAD_MAXIMA, Math.max(1, Math.round(cantidad)));
}

export function normalizarNota(nota: string | undefined): string | undefined {
  const limpia = nota?.trim().slice(0, LARGO_MAXIMO_NOTA);
  return limpia ? limpia : undefined;
}

function esLinea(valor: unknown): valor is LineaNegocio {
  return valor === "railway" || valor === "energy";
}

/** Lee lo guardado en localStorage descartando cualquier entrada mal formada. */
export function parsearItemsGuardados(texto: string | null): ItemCotizacion[] {
  if (!texto) return [];
  let datos: unknown;
  try {
    datos = JSON.parse(texto);
  } catch {
    return [];
  }
  if (!Array.isArray(datos)) return [];

  const vistos = new Set<string>();
  const items: ItemCotizacion[] = [];
  for (const crudo of datos) {
    if (typeof crudo !== "object" || crudo === null) continue;
    const { sku, nombre, linea, cantidad, nota } = crudo as Record<string, unknown>;
    if (typeof sku !== "string" || !sku || vistos.has(sku)) continue;
    if (typeof nombre !== "string" || !esLinea(linea)) continue;
    vistos.add(sku);
    items.push({
      sku,
      nombre,
      linea,
      cantidad: normalizarCantidad(typeof cantidad === "number" ? cantidad : 1),
      nota: normalizarNota(typeof nota === "string" ? nota : undefined),
    });
  }
  return items;
}

export function totalUnidades(items: readonly ItemCotizacion[]): number {
  return items.reduce((suma, item) => suma + item.cantidad, 0);
}

/** Mensaje de WhatsApp agrupado por línea de negocio. */
export function formatearMensajeCotizacion(
  items: readonly ItemCotizacion[],
  solicitante: DatosSolicitante = {}
): string {
  const lineas: string[] = [];

  if (items.length === 0) {
    lineas.push(`Hola ${COMPANIA_INFO.nombre}, deseo solicitar una cotización.`);
  } else {
    lineas.push(
      `Hola ${COMPANIA_INFO.nombre}, solicito cotización de las siguientes referencias:`
    );
    for (const linea of Object.keys(NOMBRE_LINEA) as LineaNegocio[]) {
      const deLaLinea = items.filter((item) => item.linea === linea);
      if (deLaLinea.length === 0) continue;
      lineas.push("", `*${NOMBRE_LINEA[linea]}*`);
      deLaLinea.forEach((item, i) => {
        lineas.push(`${i + 1}. ${item.nombre} (Ref. ${item.sku}) — Cantidad: ${item.cantidad}`);
        if (item.nota) lineas.push(`   Nota: ${item.nota}`);
      });
    }
  }

  const datos: [string, string | undefined][] = [
    ["Nombre", solicitante.nombre],
    ["Empresa", solicitante.empresa],
    ["Ciudad", solicitante.ciudad],
    ["Comentarios", solicitante.comentario],
  ];
  const conValor = datos.flatMap(([etiqueta, valor]) => {
    const limpio = valor?.trim();
    return limpio ? [`${etiqueta}: ${limpio}`] : [];
  });
  if (conValor.length > 0) lineas.push("", ...conValor);

  lineas.push("", "Agradezco su respuesta con especificaciones y condiciones comerciales.");
  return lineas.join("\n");
}

/** URL de WhatsApp con el mensaje ya codificado. Por defecto, al número de ventas. */
export function construirUrlWhatsApp(
  mensaje: string,
  telefono: string = COMPANIA_INFO.whatsappSales
): string {
  // El "+" sin codificar en una query se lee como espacio: solo van dígitos.
  const numero = telefono.replace(/\D/g, "");
  return `${COMPANIA_INFO.whatsappBaseUrl}?phone=${numero}&text=${encodeURIComponent(mensaje)}`;
}

export function urlWhatsAppCotizacion(
  items: readonly ItemCotizacion[],
  solicitante?: DatosSolicitante
): string {
  return construirUrlWhatsApp(formatearMensajeCotizacion(items, solicitante));
}
