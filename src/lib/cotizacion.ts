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
  cargo?: string;
  nit?: string;
  telefono?: string;
  correo?: string;
  ciudad?: string;
  /** Ciudad y departamento donde se entrega o se instala (cotizador de /cotizar). */
  lugarEntrega?: string;
  plazo?: string;
  comentario?: string;
  /** Lo que el visitante pide y no está en el catálogo, en sus palabras. */
  otroRequerimiento?: string;
}

export interface OpcionesMensaje {
  /** Asteriscos de negrita de WhatsApp en los títulos. En un correo sobran. */
  negritas?: boolean;
}

export const PLAZOS_COTIZACION = ["Inmediato", "1-2 semanas", "1 mes", "Por definir"] as const;
export type PlazoCotizacion = (typeof PLAZOS_COTIZACION)[number];

export const LARGO_MAXIMO_OTRO = 600;
export const LARGO_MAXIMO_COMENTARIO = 1000;

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
  solicitante: DatosSolicitante = {},
  { negritas = true }: OpcionesMensaje = {}
): string {
  const titulo = (texto: string) => (negritas ? `*${texto}*` : texto);
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
      lineas.push("", titulo(NOMBRE_LINEA[linea]));
      deLaLinea.forEach((item, i) => {
        lineas.push(`${i + 1}. ${item.nombre} (Ref. ${item.sku}) — Cantidad: ${item.cantidad}`);
        if (item.nota) lineas.push(`   Nota: ${item.nota}`);
      });
    }
  }

  const otro = solicitante.otroRequerimiento?.trim();
  if (otro) lineas.push("", titulo("Otro requerimiento"), otro);

  // Los campos nuevos van entre los de siempre sin cambiar el orden de estos:
  // quien no los pasa recibe exactamente el mismo mensaje que antes.
  const datos: [string, string | undefined][] = [
    ["Nombre", solicitante.nombre],
    ["Empresa", solicitante.empresa],
    ["Cargo", solicitante.cargo],
    ["NIT", solicitante.nit],
    ["Teléfono", solicitante.telefono],
    ["Correo", solicitante.correo],
    ["Ciudad", solicitante.ciudad],
    ["Lugar de entrega", solicitante.lugarEntrega],
    ["Plazo requerido", solicitante.plazo],
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

/** mailto: con asunto y cuerpo ya codificados. Por defecto, al correo de gerencia. */
export function construirUrlCorreo(
  mensaje: string,
  asunto: string,
  destinatario: string = COMPANIA_INFO.email
): string {
  return `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`;
}

/** Minúsculas, sin tildes y con espacios simples: "Señalización" ~ "senalizacion". */
export function normalizarBusqueda(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function urlWhatsAppCotizacion(
  items: readonly ItemCotizacion[],
  solicitante?: DatosSolicitante
): string {
  return construirUrlWhatsApp(formatearMensajeCotizacion(items, solicitante));
}
