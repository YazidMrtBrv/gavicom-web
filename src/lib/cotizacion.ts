"use client";

import { useSyncExternalStore } from "react";

// The quote list lives only in this browser: the visitor marks references
// while browsing and sends them all in one WhatsApp message or email. Nothing
// is stored on a server until they decide to send it.
export interface LineaCotizacion {
  sku: string;
  nombre: string;
  cantidad: number;
  // "Modelo 7" when the reference has several pictured models. Lines saved
  // before this field existed simply lack it and keep working.
  variante?: string;
}

// Fired on window every time something is added, so the toast can confirm it
// wherever the add came from (card, product page, home, energy).
export const EVENTO_AGREGADO = "gavicom:agregado";
export interface DetalleAgregado {
  nombre: string;
  total: number;
}

// Same key as before: changing it would silently empty every visitor's list.
const LLAVE = "gavicom-cotizacion-v1";
const oyentes = new Set<() => void>();
let cache: LineaCotizacion[] | null = null;
const VACIA: LineaCotizacion[] = [];

// A line is one sku plus one model; the same sku in two models is two lines.
function mismaLinea(l: LineaCotizacion, sku: string, variante?: string) {
  return l.sku === sku && (l.variante || undefined) === (variante || undefined);
}

function leer(): LineaCotizacion[] {
  if (cache) return cache;
  try {
    const crudo = window.localStorage.getItem(LLAVE);
    const datos = crudo ? JSON.parse(crudo) : [];
    cache = Array.isArray(datos)
      ? datos
          .filter((l) => l && typeof l.sku === "string" && Number.isFinite(l.cantidad) && l.cantidad > 0)
          .map((l) => (typeof l.variante === "string" && l.variante ? l : { sku: l.sku, nombre: l.nombre, cantidad: l.cantidad }))
      : [];
  } catch {
    // Private mode or blocked storage: the list still works for this visit.
    cache = [];
  }
  return cache!;
}

function guardar(lineas: LineaCotizacion[]) {
  cache = lineas;
  try {
    window.localStorage.setItem(LLAVE, JSON.stringify(lineas));
  } catch {
    // Same as above: keep it in memory only.
  }
  oyentes.forEach((o) => o());
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  // Another tab changed the list: drop the cache and re-read.
  const alCambiar = (e: StorageEvent) => {
    if (e.key === LLAVE) {
      cache = null;
      oyente();
    }
  };
  window.addEventListener("storage", alCambiar);
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", alCambiar);
  };
}

const sumar = (lineas: LineaCotizacion[]) => lineas.reduce((s, l) => s + l.cantidad, 0);

export function useCotizacion() {
  const lineas = useSyncExternalStore(suscribir, leer, () => VACIA);
  return {
    lineas,
    total: sumar(lineas),
    tiene: (sku: string, variante?: string) => lineas.some((l) => mismaLinea(l, sku, variante)),
    agregar: (sku: string, nombre: string, cantidad = 1, variante?: string) => {
      const n = Math.max(1, Math.min(9999, Math.round(cantidad) || 1));
      const actual = leer();
      const existe = actual.find((l) => mismaLinea(l, sku, variante));
      const nuevas = existe
        ? actual.map((l) => (l === existe ? { ...l, cantidad: Math.min(9999, l.cantidad + n) } : l))
        : [...actual, variante ? { sku, nombre, cantidad: n, variante } : { sku, nombre, cantidad: n }];
      guardar(nuevas);
      window.dispatchEvent(
        new CustomEvent<DetalleAgregado>(EVENTO_AGREGADO, {
          detail: { nombre: variante ? `${nombre} · ${variante}` : nombre, total: sumar(nuevas) },
        })
      );
    },
    cambiarCantidad: (sku: string, cantidad: number, variante?: string) => {
      const n = Math.max(1, Math.min(9999, Math.round(cantidad) || 1));
      guardar(leer().map((l) => (mismaLinea(l, sku, variante) ? { ...l, cantidad: n } : l)));
    },
    quitar: (sku: string, variante?: string) => guardar(leer().filter((l) => !mismaLinea(l, sku, variante))),
    vaciar: () => guardar([]),
  };
}
