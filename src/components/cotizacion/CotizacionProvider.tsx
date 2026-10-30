"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  CLAVE_COTIZACION,
  normalizarCantidad,
  normalizarNota,
  parsearItemsGuardados,
  totalUnidades,
  type ItemCotizacion,
  type ItemNuevo,
} from "@/lib/cotizacion";

/*
 * La lista vive en un almacén de módulo leído con useSyncExternalStore: en el
 * servidor y durante la hidratación se usa la lista vacía, y justo después
 * React vuelve a pintar con lo guardado. Así el HTML del servidor y el primer
 * render del cliente coinciden aunque el visitante tenga ítems guardados.
 */
const LISTA_SERVIDOR: ItemCotizacion[] = [];
let instantanea: ItemCotizacion[] | null = null;
const oyentes = new Set<() => void>();

function leerAlmacen(): ItemCotizacion[] {
  if (instantanea === null) {
    let texto: string | null = null;
    try {
      texto = window.localStorage.getItem(CLAVE_COTIZACION);
    } catch {
      texto = null;
    }
    instantanea = parsearItemsGuardados(texto);
  }
  return instantanea;
}

function guardar(items: ItemCotizacion[]) {
  instantanea = items;
  try {
    window.localStorage.setItem(CLAVE_COTIZACION, JSON.stringify(items));
  } catch {
    // Modo privado o cuota llena: la lista sigue funcionando en memoria.
  }
  oyentes.forEach((avisar) => avisar());
}

function modificar(cambio: (items: ItemCotizacion[]) => ItemCotizacion[]) {
  guardar(cambio(leerAlmacen()));
}

function suscribir(avisar: () => void) {
  oyentes.add(avisar);
  // Mantiene en sincronía varias pestañas abiertas del sitio.
  const alCambiarEnOtraPestana = (evento: StorageEvent) => {
    if (evento.key === CLAVE_COTIZACION || evento.key === null) {
      instantanea = null;
      avisar();
    }
  };
  window.addEventListener("storage", alCambiarEnOtraPestana);
  return () => {
    oyentes.delete(avisar);
    window.removeEventListener("storage", alCambiarEnOtraPestana);
  };
}

const suscribirNada = () => () => {};

function agregar(item: ItemNuevo) {
  const cantidad = normalizarCantidad(item.cantidad ?? 1);
  modificar((items) => {
    const existente = items.find((actual) => actual.sku === item.sku);
    if (existente) {
      return items.map((actual) =>
        actual.sku === item.sku
          ? { ...actual, cantidad: normalizarCantidad(actual.cantidad + cantidad) }
          : actual
      );
    }
    return [
      ...items,
      {
        sku: item.sku,
        nombre: item.nombre,
        linea: item.linea,
        cantidad,
        nota: normalizarNota(item.nota),
      },
    ];
  });
}

function quitar(sku: string) {
  modificar((items) => items.filter((item) => item.sku !== sku));
}

function actualizarCantidad(sku: string, cantidad: number) {
  modificar((items) =>
    items.map((item) =>
      item.sku === sku ? { ...item, cantidad: normalizarCantidad(cantidad) } : item
    )
  );
}

function actualizarNota(sku: string, nota: string) {
  modificar((items) =>
    items.map((item) => (item.sku === sku ? { ...item, nota: normalizarNota(nota) } : item))
  );
}

function vaciar() {
  guardar([]);
}

export interface ValorCotizacion {
  items: ItemCotizacion[];
  /** Número de referencias distintas en la lista. */
  total: number;
  /** Suma de las cantidades de todas las referencias. */
  unidades: number;
  /** false en el servidor y durante la hidratación: la lista aún no se ha leído. */
  hidratado: boolean;
  contiene: (sku: string) => boolean;
  agregar: (item: ItemNuevo) => void;
  quitar: (sku: string) => void;
  actualizarCantidad: (sku: string, cantidad: number) => void;
  actualizarNota: (sku: string, nota: string) => void;
  vaciar: () => void;
}

const ContextoCotizacion = createContext<ValorCotizacion | null>(null);

export default function CotizacionProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(suscribir, leerAlmacen, () => LISTA_SERVIDOR);
  const hidratado = useSyncExternalStore(suscribirNada, () => true, () => false);

  const valor = useMemo<ValorCotizacion>(() => {
    const skus = new Set(items.map((item) => item.sku));
    return {
      items,
      total: items.length,
      unidades: totalUnidades(items),
      hidratado,
      contiene: (sku) => skus.has(sku),
      agregar,
      quitar,
      actualizarCantidad,
      actualizarNota,
      vaciar,
    };
  }, [items, hidratado]);

  return <ContextoCotizacion.Provider value={valor}>{children}</ContextoCotizacion.Provider>;
}

export function useCotizacion(): ValorCotizacion {
  const valor = useContext(ContextoCotizacion);
  if (!valor) {
    throw new Error("useCotizacion() necesita estar dentro de <CotizacionProvider> (src/app/layout.tsx).");
  }
  return valor;
}
