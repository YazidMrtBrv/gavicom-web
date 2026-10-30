import { COMPANIA_INFO, PRODUCTOS_Y_SERVICIOS, type Producto } from "@/constants/productos";

/** Los servicios técnicos del catálogo Railway: la página no tiene datos propios. */
export const SERVICIOS: Producto[] = PRODUCTOS_Y_SERVICIOS.filter(
  (producto) => producto.categoria === "Servicios" && !producto.oculto
);

export const TOTAL_SERVICIOS = SERVICIOS.length;

/** Subcategorías distintas, en el orden en que aparecen en el catálogo. */
export const AMBITOS = [...new Set(SERVICIOS.map((servicio) => servicio.subcategoria))];

export const anclaServicio = (sku: string) => sku.toLowerCase();

export const dosCifras = (n: number) => String(n).padStart(2, "0");

export const MENSAJE_WHATSAPP_SERVICIOS = `Hola ${COMPANIA_INFO.nombre}, quiero información sobre sus servicios técnicos ferroviarios.`;

export function mensajeConsultaServicio(servicio: Pick<Producto, "nombre" | "sku">): string {
  return `Hola ${COMPANIA_INFO.nombre}, quiero información sobre el servicio "${servicio.nombre}" (Ref. ${servicio.sku}).`;
}

/** "+573150509803" → "+57 315 050 9803" */
export function formatearTelefono(telefono: string): string {
  return telefono.replace(/^\+57(\d{3})(\d{3})(\d{4})$/, "+57 $1 $2 $3");
}

/*
 * El servicio que trabaja con la norma (especificación de materiales según
 * AREMA/UIC). Se busca por su texto y no por SKU para que la sección de
 * estándares siga apuntando bien si el catálogo cambia de código.
 */
export const SERVICIO_NORMATIVO = SERVICIOS.find((servicio) =>
  /\b(AREMA|UIC)\b/.test(Object.values(servicio.especificaciones).join(" "))
);
