"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTOS_Y_SERVICIOS } from "@/constants/productos";
import { TODAS_LAS_CATEGORIAS, filtrarProductos } from "./datos";

export const ID_LISTADO = "listado-referencias";
const DURACION_RESALTE_MS = 2400;

interface ValorCatalogo {
  categoria: string;
  busqueda: string;
  elegirCategoria: (categoria: string) => void;
  cambiarBusqueda: (texto: string) => void;
  limpiarFiltros: () => void;
  buscadorAbierto: boolean;
  abrirBuscador: () => void;
  cerrarBuscador: () => void;
  /** Muestra la tarjeta (quitando filtros si hace falta), la lleva a la vista y la resalta. */
  irAReferencia: (sku: string) => void;
  /** SKU de la tarjeta resaltada en este momento. */
  resaltado: string | null;
}

const ContextoCatalogo = createContext<ValorCatalogo | null>(null);

function prefiereMenosMovimiento(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Si el visitante cambia de categoría desde abajo del listado, la lista se
// acorta y lo dejaría frente al pie de página: se le sube al inicio del listado.
function subirAlListadoSiQuedoAtras() {
  const listado = document.getElementById(ID_LISTADO);
  if (!listado || listado.getBoundingClientRect().top >= 0) return;
  listado.scrollIntoView({ behavior: prefiereMenosMovimiento() ? "auto" : "smooth", block: "start" });
}

export default function ProveedorCatalogo({ children }: { children: ReactNode }) {
  const [categoria, setCategoria] = useState(TODAS_LAS_CATEGORIAS);
  const [busqueda, setBusqueda] = useState("");
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [resaltado, setResaltado] = useState<string | null>(null);
  // El contador cambia en cada elección para que elegir dos veces la misma
  // referencia vuelva a llevarla a la vista.
  const [destino, setDestino] = useState<{ sku: string; vez: number } | null>(null);

  const elegirCategoria = useCallback((nueva: string) => {
    setCategoria(nueva);
    subirAlListadoSiQuedoAtras();
  }, []);

  // Al filtrar desde el índice lateral con el listado ya recorrido, la lista
  // encoge: se sube al inicio para ver el resultado en lugar del pie de página.
  const cambiarBusqueda = useCallback((texto: string) => {
    setBusqueda(texto);
    subirAlListadoSiQuedoAtras();
  }, []);

  const limpiarFiltros = useCallback(() => {
    setCategoria(TODAS_LAS_CATEGORIAS);
    setBusqueda("");
  }, []);

  const abrirBuscador = useCallback(() => setBuscadorAbierto(true), []);
  const cerrarBuscador = useCallback(() => setBuscadorAbierto(false), []);

  const irAReferencia = useCallback(
    (sku: string) => {
      const producto = PRODUCTOS_Y_SERVICIOS.find((p) => p.sku === sku);
      if (!producto) return;
      const yaVisible = filtrarProductos(busqueda, categoria).some((p) => p.sku === sku);
      if (!yaVisible) {
        setCategoria(TODAS_LAS_CATEGORIAS);
        // Las ocultas solo se listan al buscar: se busca su SKU para que aparezca.
        setBusqueda(producto.oculto ? producto.sku : "");
      }
      setDestino((previo) => ({ sku, vez: (previo?.vez ?? 0) + 1 }));
    },
    [busqueda, categoria]
  );

  // Un enlace a /catalogo#GVC-AK-JB115 lleva a esa tarjeta aunque haya filtros,
  // y la resalta. Va en un cuadro aparte porque el cambio de página sube el
  // scroll a cero después de montar.
  const irAlHash = useEffectEvent(() => {
    const sku = decodeURIComponent(window.location.hash.slice(1));
    if (sku && PRODUCTOS_Y_SERVICIOS.some((producto) => producto.sku === sku)) irAReferencia(sku);
  });

  useEffect(() => {
    const cuadro = requestAnimationFrame(() => irAlHash());
    const alCambiarHash = () => irAlHash();
    window.addEventListener("hashchange", alCambiarHash);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("hashchange", alCambiarHash);
    };
  }, []);

  // Corre después de pintar el listado ya sin filtros, cuando la tarjeta existe.
  useEffect(() => {
    if (!destino) return;
    let apagar = 0;
    const cuadro = requestAnimationFrame(() => {
      const tarjeta = document.getElementById(destino.sku);
      if (!tarjeta) return;
      tarjeta.scrollIntoView({ behavior: prefiereMenosMovimiento() ? "auto" : "smooth", block: "start" });
      // Quien llegó con el teclado sigue desde la tarjeta, no desde el botón del buscador.
      tarjeta.focus({ preventScroll: true });
      setResaltado(destino.sku);
      apagar = window.setTimeout(() => setResaltado(null), DURACION_RESALTE_MS);
    });
    return () => {
      cancelAnimationFrame(cuadro);
      window.clearTimeout(apagar);
    };
  }, [destino]);

  const valor = useMemo<ValorCatalogo>(
    () => ({
      categoria,
      busqueda,
      elegirCategoria,
      cambiarBusqueda,
      limpiarFiltros,
      buscadorAbierto,
      abrirBuscador,
      cerrarBuscador,
      irAReferencia,
      resaltado,
    }),
    [
      categoria,
      busqueda,
      elegirCategoria,
      cambiarBusqueda,
      limpiarFiltros,
      buscadorAbierto,
      abrirBuscador,
      cerrarBuscador,
      irAReferencia,
      resaltado,
    ]
  );

  return <ContextoCatalogo.Provider value={valor}>{children}</ContextoCatalogo.Provider>;
}

export function useCatalogo(): ValorCatalogo {
  const valor = useContext(ContextoCatalogo);
  if (!valor) throw new Error("useCatalogo() debe usarse dentro de <ProveedorCatalogo>.");
  return valor;
}
