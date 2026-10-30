import { COMPANIA_INFO } from "@/constants/productos";
import { SERVICIOS_ENERGY } from "@/constants/energy";

/*
 * Datos de presentación de la página /energy. Los textos de los servicios
 * viven en constants/energy.ts (redacción del cliente); aquí solo hay
 * nombres cortos derivados de esos títulos, para la leyenda y los pictogramas.
 */

export type CodigoServicio = "GVC-ENR-01" | "GVC-ENR-02" | "GVC-ENR-03" | "GVC-ENR-04";

/** Pieza del esquema del hero que corresponde a cada servicio. */
export const PIEZA_SERVICIO: Record<CodigoServicio, string> = {
  "GVC-ENR-01": "cofre",
  "GVC-ENR-02": "modulos",
  "GVC-ENR-03": "protecciones",
  "GVC-ENR-04": "gabinete",
};

export const NOMBRE_CORTO: Record<CodigoServicio, string> = {
  "GVC-ENR-01": "Cofres fotovoltaicos",
  "GVC-ENR-02": "Montaje e instalación",
  "GVC-ENR-03": "Protecciones AC y DC",
  "GVC-ENR-04": "Ensamble e integración",
};

export function esCodigoServicio(codigo: string): codigo is CodigoServicio {
  return codigo in PIEZA_SERVICIO;
}

/** id de la tarjeta del servicio (ancla desde la leyenda del hero). */
export const anclaServicio = (codigo: string) => codigo.toLowerCase();

export const TOTAL_SERVICIOS = SERVICIOS_ENERGY.length;
export const dosCifras = (n: number) => String(n).padStart(2, "0");

export const MENSAJE_WHATSAPP_ENERGY = `Hola ${COMPANIA_INFO.nombre}, me interesa cotizar un proyecto de energía solar con GAVICOM Energy.`;

export function mensajeConsultaServicio(codigo: string, titulo: string): string {
  return `Hola ${COMPANIA_INFO.nombre}, quiero información sobre este servicio de GAVICOM Energy: ${titulo} (Ref. ${codigo}).`;
}

export const TIPOS_INSTALACION = ["Residencial", "Comercial", "Industrial"] as const;
export type TipoInstalacion = (typeof TIPOS_INSTALACION)[number];

export interface DatoParaCotizar {
  id: "ubicacion" | "tipo" | "consumo" | "sitio" | "plazo";
  titulo: string;
  detalle: string;
  /** Cómo se nombra en el mensaje de WhatsApp ("Puedo enviar: …"). */
  enMensaje: string;
}

// Es la información que la empresa pide para cotizar, no una promesa de
// proceso: por eso no hay pasos ni tiempos.
export const DATOS_PARA_COTIZAR: DatoParaCotizar[] = [
  {
    id: "ubicacion",
    titulo: "Ubicación del proyecto",
    detalle: "Municipio y departamento donde se hará la instalación o la entrega.",
    enMensaje: "ubicación del proyecto",
  },
  {
    id: "tipo",
    titulo: "Tipo de instalación",
    detalle: "Residencial, comercial o industrial.",
    enMensaje: "tipo de instalación",
  },
  {
    id: "consumo",
    titulo: "Consumo o factura de energía",
    detalle: "Si la tiene, una factura reciente del inmueble o el dato de consumo.",
    enMensaje: "consumo o factura de energía",
  },
  {
    id: "sitio",
    titulo: "Plano o fotos del sitio",
    detalle: "Del lugar donde se haría la instalación.",
    enMensaje: "plano o fotos del sitio",
  },
  {
    id: "plazo",
    titulo: "Plazo deseado",
    detalle: "Para cuándo necesita el sistema o el suministro.",
    enMensaje: "plazo deseado",
  },
];
