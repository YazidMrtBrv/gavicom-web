import { COMPANIA_INFO } from "@/constants/productos";
import type { LineaCotizacion } from "./cotizacion";

// Plain helpers, usable from server and client components alike.

export interface DatosContacto {
  nombre: string;
  empresa: string;
  ciudad: string;
  nota: string;
}

// One plain-text message with codes and quantities, so whoever answers the
// WhatsApp can quote without asking back what each item is.
export function mensajeCotizacion(lineas: LineaCotizacion[], datos: DatosContacto): string {
  const filas = lineas.map((l) => `• ${l.cantidad} × ${l.nombre} (${l.sku})`);
  const quien = [datos.nombre, datos.empresa].filter(Boolean).join(", ");
  return [
    "Hola GAVICOM, quiero cotizar:",
    ...filas,
    "",
    datos.ciudad ? `Entrega en: ${datos.ciudad}` : "",
    quien ? `De parte de: ${quien}` : "",
    datos.nota ? `Nota: ${datos.nota}` : "",
  ]
    .filter((l, i, arr) => l !== "" || (i > 0 && arr[i - 1] !== ""))
    .join("\n")
    .trim();
}

export function enlaceWhatsApp(texto: string): string {
  const numero = COMPANIA_INFO.whatsappSales.replace(/\D/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
