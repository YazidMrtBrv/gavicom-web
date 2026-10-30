"use client";

import { useSyncExternalStore } from "react";

// The quote list lives only in this browser: the visitor marks references
// while browsing and sends them all in one WhatsApp message or email. Nothing
// is stored on a server until they decide to send it.
export interface LineaCotizacion {
  sku: string;
  nombre: string;
  cantidad: number;
}

const LLAVE = "gavicom-cotizacion-v1";
const oyentes = new Set<() => void>();
let cache: LineaCotizacion[] | null = null;
const VACIA: LineaCotizacion[] = [];

function leer(): LineaCotizacion[] {
  if (cache) return cache;
  try {
    const crudo = window.localStorage.getItem(LLAVE);
    const datos = crudo ? JSON.parse(crudo) : [];
    cache = Array.isArray(datos)
      ? datos.filter((l) => l && typeof l.sku === "string" && Number.isFinite(l.cantidad) && l.cantidad > 0)
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

export function useCotizacion() {
  const lineas = useSyncExternalStore(suscribir, leer, () => VACIA);
  return {
    lineas,
    total: lineas.reduce((s, l) => s + l.cantidad, 0),
    tiene: (sku: string) => lineas.some((l) => l.sku === sku),
    agregar: (sku: string, nombre: string, cantidad = 1) => {
      const actual = leer();
      const existe = actual.find((l) => l.sku === sku);
      guardar(
        existe
          ? actual.map((l) => (l.sku === sku ? { ...l, cantidad: l.cantidad + cantidad } : l))
          : [...actual, { sku, nombre, cantidad }]
      );
    },
    cambiarCantidad: (sku: string, cantidad: number) => {
      const n = Math.max(1, Math.min(9999, Math.round(cantidad) || 1));
      guardar(leer().map((l) => (l.sku === sku ? { ...l, cantidad: n } : l)));
    },
    quitar: (sku: string) => guardar(leer().filter((l) => l.sku !== sku)),
    vaciar: () => guardar([]),
  };
}
