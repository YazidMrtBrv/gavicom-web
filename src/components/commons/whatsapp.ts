import { COMPANIA_INFO } from "@/constants/productos";
import { construirUrlWhatsApp } from "@/lib/cotizacion";

/** "+573150509803" → "+57 315 050 9803" */
export function formatearTelefono(telefono: string): string {
  return telefono.replace(/^\+57(\d{3})(\d{3})(\d{4})$/, "+57 $1 $2 $3");
}

export const MENSAJE_GENERAL = `Hola ${COMPANIA_INFO.nombre}, quiero información sobre sus productos y servicios.`;

// Quien escribe desde una página concreta casi siempre pregunta por lo que está
// viendo: el mensaje prellenado se lo ahorra y le dice a ventas de qué línea es.
const MENSAJE_POR_SECCION: Record<string, string> = {
  "/catalogo": `Hola ${COMPANIA_INFO.nombre}, quiero información sobre referencias del catálogo ferroviario.`,
  "/servicios": `Hola ${COMPANIA_INFO.nombre}, quiero información sobre sus servicios técnicos ferroviarios.`,
  "/energy": `Hola ${COMPANIA_INFO.nombre}, quiero información sobre GAVICOM Energy (energía solar fotovoltaica).`,
};

function seccionDe(ruta: string): string {
  const primerTramo = ruta.split("/")[1] ?? "";
  return `/${primerTramo}`;
}

export function mensajeWhatsAppDeRuta(ruta: string): string {
  return MENSAJE_POR_SECCION[seccionDe(ruta)] ?? MENSAJE_GENERAL;
}

export function urlWhatsAppDeRuta(ruta: string): string {
  return construirUrlWhatsApp(mensajeWhatsAppDeRuta(ruta));
}
