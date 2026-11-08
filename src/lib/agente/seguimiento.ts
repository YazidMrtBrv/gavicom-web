import { borradorReposicion, borradorSeguimiento } from "./redaccion.ts";
import type { Borrador, Cliente, Compra, Cotizacion } from "./tipos.ts";

// What makes this agent different: it writes FIRST, from the data, instead of
// waiting. Every morning it reads the quotes and past purchases and leaves
// drafts for Geimar: a follow-up on a quote nobody answered, a reorder note
// when a client's material should be wearing out. Geimar sends them or not.

export const DIA = 24 * 60 * 60 * 1000;

// Starting rules for the demo; GAVICOM adjusts them.
export const REGLAS_SEGUIMIENTO = {
  // Unanswered quote: first follow-up, second follow-up, then closed as lost.
  diasPrimerRecordatorio: 3,
  diasSegundoRecordatorio: 8,
  diasCerrarSinRespuesta: 20,
  // How long each consumable lasts on track before the client reorders.
  // Estimates to confirm with Geimar's field experience.
  mesesReposicion: {
    "GVC-AD-E2055": 6,
    "GVC-AD-RP02": 8,
    "GVC-AK-TB01": 10,
    "GVC-AK-WS02": 10,
    "GVC-AD-SS01": 12,
    "GVC-AK-JB115": 12,
    "GVC-AK-JB90": 12,
    "GVC-AK-EA75": 12,
    "GVC-TM-02": 2,
    "GVC-GS-01": 2,
  } as Record<string, number>,
  // Write this many days before the estimated date, so the order arrives in time.
  diasAnticipacion: 20,
};

export interface Tarea {
  id: string;
  tipo: "seguimiento" | "reposicion" | "cerrar";
  cliente: Cliente;
  porque: string;
  borrador?: Borrador;
  cotizacion?: string;
  compra?: Compra;
  // Higher first.
  prioridad: number;
}

function dias(desde: string, ahora: Date): number {
  return Math.floor((ahora.getTime() - new Date(desde).getTime()) / DIA);
}

export function fechaReposicion(compra: Compra): Date | null {
  const meses = REGLAS_SEGUIMIENTO.mesesReposicion[compra.sku];
  if (!meses) return null;
  const f = new Date(compra.fecha);
  f.setMonth(f.getMonth() + meses);
  return f;
}

// `respondidas`: quote numbers the client already answered by email.
export function tareasDelDia(cotizaciones: Cotizacion[], clientes: Cliente[], ahora: Date, respondidas: string[] = []): Tarea[] {
  const r = REGLAS_SEGUIMIENTO;
  const tareas: Tarea[] = [];

  for (const c of cotizaciones) {
    if (c.estado !== "enviada" || !c.enviada || respondidas.includes(c.numero)) continue;
    const d = dias(c.enviada, ahora);
    if (d >= r.diasCerrarSinRespuesta) {
      tareas.push({ id: `cerrar-${c.numero}`, tipo: "cerrar", cliente: c.cliente, porque: `${d} días sin respuesta a la ${c.numero}: pasa a perdida por «no volvió a contestar».`, cotizacion: c.numero, prioridad: 1 });
    } else if (d === r.diasPrimerRecordatorio || d === r.diasSegundoRecordatorio) {
      const borrador = borradorSeguimiento(c, d);
      tareas.push({ id: `seguir-${c.numero}-${d}`, tipo: "seguimiento", cliente: c.cliente, porque: borrador.porque, borrador, cotizacion: c.numero, prioridad: 3 });
    }
  }

  for (const cl of clientes) {
    const ultima = cl.compras.at(-1);
    if (!ultima) continue;
    // Someone with an open quote is not bothered with a reorder.
    const abierta = cotizaciones.some((c) => c.cliente.correo === cl.correo && ["enviada", "esperando-precios", "por-aprobar"].includes(c.estado));
    if (abierta) continue;
    const toca = fechaReposicion(ultima);
    if (!toca) continue;
    const faltan = Math.ceil((toca.getTime() - ahora.getTime()) / DIA);
    if (faltan <= r.diasAnticipacion && faltan > -60) {
      const borrador = borradorReposicion(cl, ultima, faltan);
      tareas.push({ id: `reponer-${cl.correo}-${ultima.sku}`, tipo: "reposicion", cliente: cl, porque: borrador.porque, borrador, compra: ultima, prioridad: 2 });
    }
  }

  return tareas.sort((a, b) => b.prioridad - a.prioridad);
}
