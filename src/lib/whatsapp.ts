import { COMPANIA_INFO } from "@/constants/productos";
import type { LineaCotizacion } from "./cotizacion";

// Plain helpers, usable from server and client components alike.

export interface DatosContacto {
  nombre: string;
  empresa: string;
  ciudad: string;
  nota: string;
  // Optional so every existing caller keeps compiling; printed only when set.
  nit?: string;
  plazo?: string;
}

// Same three answers wherever a quote asks for a deadline, so sales reads
// them the same way from the catalogue list and from the solar form.
export const PLAZOS = ["Urgente", "Este mes", "Proyecto futuro"] as const;

// "Señalización ferroviaria · Modelo 7": the model travels with the name so
// whoever answers knows which picture the visitor chose.
export function nombreConVariante(nombre: string, variante?: string): string {
  return variante ? `${nombre} · ${variante}` : nombre;
}

// One plain-text message with codes and quantities, so whoever answers the
// WhatsApp can quote without asking back what each item is.
export function mensajeCotizacion(lineas: LineaCotizacion[], datos: DatosContacto): string {
  const filas = lineas.map((l) => `• ${l.cantidad} × ${nombreConVariante(l.nombre, l.variante)} (${l.sku})`);
  const quien = [datos.nombre, datos.empresa].filter(Boolean).join(", ");
  // Empty details are dropped before joining, so the only blank line is the
  // one that separates the item list from who is asking.
  const detalles = [
    datos.ciudad ? `Entrega en: ${datos.ciudad}` : "",
    quien ? `De parte de: ${quien}` : "",
    datos.nit ? `NIT: ${datos.nit}` : "",
    datos.plazo ? `Lo necesito: ${datos.plazo}` : "",
    datos.nota ? `Nota: ${datos.nota}` : "",
  ].filter(Boolean);
  return ["Hola GAVICOM, quiero cotizar:", ...filas, ...(detalles.length ? ["", ...detalles] : [])].join("\n");
}

export function mensajeProducto(nombre: string, sku: string): string {
  return `Hola GAVICOM, quiero cotizar ${nombre} (${sku}).`;
}

export function mensajeFichaTecnica(nombre: string, sku: string): string {
  return `Hola GAVICOM, ¿me pueden enviar la ficha técnica en PDF de ${nombre} (${sku})?`;
}

export function enlaceWhatsApp(texto: string): string {
  const numero = COMPANIA_INFO.whatsappSales.replace(/\D/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
