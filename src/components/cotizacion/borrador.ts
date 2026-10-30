"use client";

import { useSyncExternalStore } from "react";
import {
  LARGO_MAXIMO_COMENTARIO,
  LARGO_MAXIMO_OTRO,
  PLAZOS_COTIZACION,
  type PlazoCotizacion,
} from "@/lib/cotizacion";

/** Lo que el visitante escribe en /cotizar, aparte de la lista (que vive en CotizacionProvider). */
export interface BorradorCotizacion {
  otroRequerimiento: string;
  ciudad: string;
  departamento: string;
  plazo: PlazoCotizacion | "";
  comentarios: string;
  personaNatural: boolean;
  nombre: string;
  empresa: string;
  cargo: string;
  nit: string;
  telefono: string;
  correo: string;
  autorizaDatos: boolean;
}

export const BORRADOR_VACIO: BorradorCotizacion = {
  otroRequerimiento: "",
  ciudad: "",
  departamento: "",
  plazo: "",
  comentarios: "",
  personaNatural: false,
  nombre: "",
  empresa: "",
  cargo: "",
  nit: "",
  telefono: "",
  correo: "",
  autorizaDatos: false,
};

const CLAVE_BORRADOR = "gavicom:cotizar:borrador:v1";
const LARGO_MAXIMO_CAMPO = 160;

const LIMITES: Partial<Record<keyof BorradorCotizacion, number>> = {
  otroRequerimiento: LARGO_MAXIMO_OTRO,
  comentarios: LARGO_MAXIMO_COMENTARIO,
};

function esPlazo(valor: unknown): valor is PlazoCotizacion {
  return typeof valor === "string" && (PLAZOS_COTIZACION as readonly string[]).includes(valor);
}

function parsear(texto: string | null): BorradorCotizacion {
  if (!texto) return BORRADOR_VACIO;
  let datos: unknown;
  try {
    datos = JSON.parse(texto);
  } catch {
    return BORRADOR_VACIO;
  }
  if (typeof datos !== "object" || datos === null) return BORRADOR_VACIO;
  const crudo = datos as Record<string, unknown>;

  const borrador: BorradorCotizacion = { ...BORRADOR_VACIO };
  for (const clave of Object.keys(BORRADOR_VACIO) as (keyof BorradorCotizacion)[]) {
    const valor = crudo[clave];
    if (clave === "plazo") borrador.plazo = esPlazo(valor) ? valor : "";
    else if (clave === "personaNatural") borrador.personaNatural = valor === true;
    // La autorización de datos no se guarda: se marca cada vez que se envía.
    else if (clave === "autorizaDatos") continue;
    else if (typeof valor === "string") {
      borrador[clave] = valor.slice(0, LIMITES[clave] ?? LARGO_MAXIMO_CAMPO);
    }
  }
  return borrador;
}

/*
 * Mismo patrón que la lista de cotización: un almacén de módulo leído con
 * useSyncExternalStore. Sobrevive a ir al catálogo y volver (sin recargar) y,
 * con sessionStorage, a una recarga accidental; se borra al cerrar la pestaña,
 * que es lo razonable para datos personales en un equipo compartido.
 */
let instantanea: BorradorCotizacion | null = null;
const oyentes = new Set<() => void>();

function leer(): BorradorCotizacion {
  if (instantanea === null) {
    let texto: string | null = null;
    try {
      texto = window.sessionStorage.getItem(CLAVE_BORRADOR);
    } catch {
      texto = null;
    }
    instantanea = parsear(texto);
  }
  return instantanea;
}

function guardar(borrador: BorradorCotizacion) {
  instantanea = borrador;
  try {
    // JSON.stringify omite las claves con undefined: la autorización no se guarda.
    window.sessionStorage.setItem(
      CLAVE_BORRADOR,
      JSON.stringify({ ...borrador, autorizaDatos: undefined })
    );
  } catch {
    // Sin almacenamiento (modo privado estricto): el borrador sigue en memoria.
  }
  oyentes.forEach((avisar) => avisar());
}

function suscribir(avisar: () => void) {
  oyentes.add(avisar);
  return () => {
    oyentes.delete(avisar);
  };
}

export function actualizarBorrador(cambios: Partial<BorradorCotizacion>) {
  guardar({ ...leer(), ...cambios });
}

export function reiniciarBorrador() {
  guardar(BORRADOR_VACIO);
}

export function useBorrador(): BorradorCotizacion {
  return useSyncExternalStore(suscribir, leer, () => BORRADOR_VACIO);
}
