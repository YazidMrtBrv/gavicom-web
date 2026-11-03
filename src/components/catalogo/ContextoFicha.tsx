"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Shared by the gallery (which model is shown), the main actions and the
// phone action bar, so all three always add the same model and quantity.
interface EstadoFicha {
  sku: string;
  nombre: string;
  variante?: string;
  setVariante: (v: string | undefined) => void;
  cantidad: number;
  setCantidad: (n: number) => void;
}

const Contexto = createContext<EstadoFicha | null>(null);

export function ProveedorFicha({
  sku,
  nombre,
  varianteInicial,
  children,
}: {
  sku: string;
  nombre: string;
  varianteInicial?: string;
  children: ReactNode;
}) {
  const [variante, setVariante] = useState(varianteInicial);
  const [cantidad, setCantidad] = useState(1);
  return <Contexto.Provider value={{ sku, nombre, variante, setVariante, cantidad, setCantidad }}>{children}</Contexto.Provider>;
}

export function useFicha(): EstadoFicha {
  const c = useContext(Contexto);
  if (!c) throw new Error("useFicha fuera de ProveedorFicha");
  return c;
}
