import { nombreDe } from "./catalogo.ts";
import { DIA } from "./seguimiento.ts";
import type { Cliente, Cotizacion, LineaCotizada, MotivoPerdida } from "./tipos.ts";

// DEMO DATA. Fictitious clients, fictitious phone numbers (+57 300 000 00xx)
// and made-up prices: GAVICOM does not publish prices and none of these are
// its prices. Every screen that shows them says "ejemplo". Dates are relative
// to "now" so the morning always has something to do.

function hace(ahora: Date, dias: number): string {
  return new Date(ahora.getTime() - dias * DIA).toISOString();
}

function mesesAtras(ahora: Date, meses: number, dias = 0): string {
  const f = new Date(ahora);
  f.setMonth(f.getMonth() - meses);
  return new Date(f.getTime() - dias * DIA).toISOString();
}

export function clientesEjemplo(ahora: Date): Cliente[] {
  return [
    {
      telefono: "+573000000011",
      nombre: "Ing. Camila Restrepo",
      empresa: "Vías del Norte (ejemplo)",
      ciudad: "Ciénaga, Magdalena",
      // Clips last ~6 months; bought 5 months and 15 days ago → due soon.
      compras: [{ sku: "GVC-AD-E2055", cantidad: 1600, fecha: mesesAtras(ahora, 5, 15), tramo: "el tramo del km 12 al 14" }],
      ultimoMensaje: hace(ahora, 160),
      ejemplo: true,
    },
    {
      telefono: "+573000000012",
      nombre: "Andrés Polo",
      empresa: "Patio Carbonero (ejemplo)",
      ciudad: "Santa Marta",
      compras: [{ sku: "GVC-AK-TB01", cantidad: 480, fecha: mesesAtras(ahora, 3), tramo: "las juntas del patio 2" }],
      ultimoMensaje: hace(ahora, 2),
      ejemplo: true,
    },
    {
      telefono: "+573000000013",
      nombre: "Luisa Fernanda Ortiz",
      empresa: "Mantenimientos Férreos del Caribe (ejemplo)",
      ciudad: "Barranquilla",
      compras: [{ sku: "GVC-AK-JB115", cantidad: 120, fecha: mesesAtras(ahora, 7), tramo: "la variante de Bosconia" }],
      ultimoMensaje: hace(ahora, 9),
      ejemplo: true,
    },
  ];
}

// A client nobody has seen before: the agent has to ask who they are.
export function clienteNuevo(): Cliente {
  return { telefono: "+573000000099", nombre: "", empresa: "", ciudad: "", compras: [], ejemplo: true };
}

function lineas(items: [string, number, number][]): LineaCotizada[] {
  return items.map(([sku, cantidad, precio]) => ({ sku, nombre: nombreDe(sku), cantidad, unidad: "und", porque: "", precioUnitario: precio }));
}

type Fila = [numero: string, cliente: number, dias: number, estado: Cotizacion["estado"], items: [string, number, number][], motivo?: MotivoPerdida];

// Last 60 days of quotes, made up for the demo.
const HISTORIA: Fila[] = [
  ["C-0118", 0, 58, "ganada", [["GVC-AD-E2055", 1600, 9800], ["GVC-AD-RP02", 800, 6500]]],
  ["C-0121", 2, 52, "perdida", [["GVC-AK-JB115", 200, 185000], ["GVC-AK-TB01", 600, 14000]], "precio"],
  ["C-0123", 1, 47, "ganada", [["GVC-AK-TB01", 480, 14000]]],
  ["C-0125", 0, 41, "perdida", [["GVC-AD-SS01", 3000, 7200]], "plazo"],
  ["C-0127", 2, 36, "ganada", [["GVC-AK-JB115", 120, 185000], ["GVC-AK-TB01", 360, 14000]]],
  ["C-0129", 1, 31, "perdida", [["GVC-VIA-003", 20, 210000], ["GVC-VIA-006", 30, 95000]], "ya-compro"],
  ["C-0131", 0, 27, "perdida", [["GVC-AK-TP03", 1200, 48000], ["GVC-AK-WS02", 2400, 3900]], "precio"],
  ["C-0133", 2, 22, "ganada", [["GVC-AK-EA75", 400, 160000]]],
  ["C-0135", 1, 18, "perdida", [["GVC-SOL-001", 2, 2400000]], "proyecto-aplazado"],
  ["C-0137", 0, 16, "perdida", [["GVC-AD-E2055", 900, 9800]], "sin-respuesta"],
  ["C-0139", 2, 9, "ganada", [["GVC-FIJ-001", 12, 380000], ["GVC-FIJ-003", 6, 520000]]],
  // Sent 2 days ago, no answer: the morning follow-up picks it up.
  ["C-0140", 2, 2, "enviada", [["GVC-AK-JB115", 160, 185000], ["GVC-AK-TB01", 480, 14000]]],
];

export function cotizacionesEjemplo(ahora: Date): Cotizacion[] {
  const clientes = clientesEjemplo(ahora);
  return HISTORIA.map(([numero, i, dias, estado, items, motivo]) => {
    const fecha = hace(ahora, dias);
    return {
      numero,
      cliente: clientes[i],
      lineas: lineas(items),
      estado,
      creada: hace(ahora, dias + 1),
      enviada: fecha,
      cerrada: estado === "ganada" || estado === "perdida" ? hace(ahora, Math.max(dias - 2, 0)) : undefined,
      motivo,
      origen: "Ejemplo",
      ejemplo: true,
    };
  });
}

// Made-up unit prices Geimar's "answer with demo prices" button types for
// him, keyed by reference. NOT GAVICOM prices.
export const PRECIOS_EJEMPLO: Record<string, number> = {
  "GVC-AK-JB115": 185000,
  "GVC-AK-JB90": 150000,
  "GVC-AK-EA75": 160000,
  "GVC-AK-JB30": 120000,
  "GVC-AK-TB01": 14000,
  "GVC-AD-E2055": 9800,
  "GVC-AD-SKL14": 12500,
  "GVC-AD-RP02": 6500,
  "GVC-AK-TP03": 48000,
  "GVC-AK-WS02": 3900,
  "GVC-AK-RA04": 7500,
  "GVC-AD-SS01": 7200,
};

export function respuestaPreciosEjemplo(skus: string[]): string {
  return skus.map((s, i) => `${i + 1} ${(PRECIOS_EJEMPLO[s] ?? 50000).toLocaleString("es-CO")}`).join("\n");
}
