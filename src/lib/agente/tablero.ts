import { totales } from "./precios.ts";
import { MOTIVOS, type Cotizacion, type MotivoPerdida } from "./tipos.ts";

// The money view Geimar reads: how much was quoted, won and lost, and why
// the lost ones were lost. Only quotes with Geimar's prices count as money.

export interface Tablero {
  cotizado: number;
  ganado: number;
  perdido: number;
  abierto: number;
  cantidad: { total: number; ganadas: number; perdidas: number; abiertas: number };
  // Share of closed quotes that were won, 0..1; null with nothing closed.
  tasaCierre: number | null;
  motivos: { motivo: MotivoPerdida; nombre: string; plata: number; veces: number }[];
}

export function valor(c: Cotizacion): number {
  return totales(c.lineas).total;
}

export function calcularTablero(cotizaciones: Cotizacion[]): Tablero {
  const conPrecio = cotizaciones.filter((c) => c.lineas.every((l) => l.precioUnitario != null));
  const suma = (lista: Cotizacion[]) => lista.reduce((s, c) => s + valor(c), 0);
  const ganadas = conPrecio.filter((c) => c.estado === "ganada");
  const perdidas = conPrecio.filter((c) => c.estado === "perdida");
  const abiertas = conPrecio.filter((c) => c.estado === "enviada" || c.estado === "por-aprobar");
  const porMotivo = new Map<MotivoPerdida, { plata: number; veces: number }>();
  for (const c of perdidas) {
    const m = c.motivo ?? "otro";
    const a = porMotivo.get(m) ?? { plata: 0, veces: 0 };
    porMotivo.set(m, { plata: a.plata + valor(c), veces: a.veces + 1 });
  }
  const cerradas = ganadas.length + perdidas.length;
  return {
    cotizado: suma(conPrecio),
    ganado: suma(ganadas),
    perdido: suma(perdidas),
    abierto: suma(abiertas),
    cantidad: { total: conPrecio.length, ganadas: ganadas.length, perdidas: perdidas.length, abiertas: abiertas.length },
    tasaCierre: cerradas ? ganadas.length / cerradas : null,
    motivos: [...porMotivo.entries()]
      .map(([motivo, v]) => ({ motivo, nombre: MOTIVOS[motivo], ...v }))
      .sort((a, b) => b.plata - a.plata),
  };
}
