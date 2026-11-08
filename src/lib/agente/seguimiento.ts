import { nombreDe } from "./catalogo.ts";
import type { Cliente, Compra, Cotizacion } from "./tipos.ts";

// What makes this agent different: it writes FIRST, from the data, instead of
// waiting. Every morning it reads quotes and past purchases and decides who
// to write to and why. Messages outside WhatsApp's 24-hour window must be
// templates Meta approved beforehand; each task says which one it uses.

export const DIA = 24 * 60 * 60 * 1000;

// Starting rules for the demo; GAVICOM adjusts them.
export const REGLAS_SEGUIMIENTO = {
  // Unanswered quote: first nudge, second nudge, then closed as lost.
  diasPrimerRecordatorio: 2,
  diasSegundoRecordatorio: 6,
  diasCerrarSinRespuesta: 15,
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

// Meta templates the agent needs approved before going live. {{n}} are the
// template's variables. Category decides the price per message.
export const PLANTILLAS = {
  seguimiento_cotizacion: {
    categoria: "utilidad",
    texto: "Hola {{1}}, ¿pudiste revisar la cotización {{2}} que te mandamos? Si tienes dudas te las resolvemos por aquí.",
    botones: ["La apruebo", "Tengo dudas", "No por ahora"],
  },
  recordatorio_reposicion: {
    categoria: "marketing",
    texto: "Hola {{1}}, según tu última compra de {{2}} para {{3}}, ya te debe estar tocando reponer. ¿Te la cotizo igual que la vez pasada?",
    botones: ["Sí, cotízame igual", "Cambia cantidades", "Ahora no"],
  },
} as const;

export type NombrePlantilla = keyof typeof PLANTILLAS;

export interface Tarea {
  id: string;
  tipo: "seguimiento" | "reposicion" | "cerrar";
  cliente: Cliente;
  // Why the agent is writing, in one line for Geimar's screen.
  porque: string;
  plantilla?: NombrePlantilla;
  variables: string[];
  cotizacion?: string;
  compra?: Compra;
  // Higher first.
  prioridad: number;
}

export function rellenar(plantilla: NombrePlantilla, variables: string[]): string {
  return PLANTILLAS[plantilla].texto.replace(/\{\{(\d)\}\}/g, (_, n) => variables[Number(n) - 1] ?? "");
}

export function ventanaAbierta(cliente: Cliente, ahora: Date): boolean {
  return Boolean(cliente.ultimoMensaje && ahora.getTime() - new Date(cliente.ultimoMensaje).getTime() < DIA);
}

function dias(desde: string, ahora: Date): number {
  return Math.floor((ahora.getTime() - new Date(desde).getTime()) / DIA);
}

function primerNombre(c: Cliente): string {
  return c.nombre.split(/\s+/).filter((p) => !/^(ing|sr|sra|dr)\.?$/i.test(p))[0] ?? c.nombre;
}

export function fechaReposicion(compra: Compra): Date | null {
  const meses = REGLAS_SEGUIMIENTO.mesesReposicion[compra.sku];
  if (!meses) return null;
  const f = new Date(compra.fecha);
  f.setMonth(f.getMonth() + meses);
  return f;
}

export function tareasDelDia(cotizaciones: Cotizacion[], clientes: Cliente[], ahora: Date): Tarea[] {
  const r = REGLAS_SEGUIMIENTO;
  const tareas: Tarea[] = [];

  for (const c of cotizaciones) {
    if (c.estado !== "enviada" || !c.enviada) continue;
    // A client who wrote after the quote went out is already talking.
    if (c.cliente.ultimoMensaje && new Date(c.cliente.ultimoMensaje) > new Date(c.enviada)) continue;
    const d = dias(c.enviada, ahora);
    if (d >= r.diasCerrarSinRespuesta) {
      tareas.push({ id: `cerrar-${c.numero}`, tipo: "cerrar", cliente: c.cliente, porque: `${d} días sin respuesta a la ${c.numero}: pasa a perdida por «no volvió a contestar».`, variables: [], cotizacion: c.numero, prioridad: 1 });
    } else if (d === r.diasPrimerRecordatorio || d === r.diasSegundoRecordatorio) {
      tareas.push({
        id: `seguir-${c.numero}-${d}`,
        tipo: "seguimiento",
        cliente: c.cliente,
        porque: `Le mandamos la ${c.numero} hace ${d} días y no ha contestado.`,
        plantilla: "seguimiento_cotizacion",
        variables: [primerNombre(c.cliente), c.numero],
        cotizacion: c.numero,
        prioridad: 3,
      });
    }
  }

  for (const cl of clientes) {
    const ultima = cl.compras.at(-1);
    if (!ultima) continue;
    // Someone with an open quote is not bothered with a reorder.
    if (cotizaciones.some((c) => c.cliente.telefono === cl.telefono && (c.estado === "enviada" || c.estado === "esperando-precios" || c.estado === "por-aprobar"))) continue;
    const toca = fechaReposicion(ultima);
    if (!toca) continue;
    const faltan = Math.ceil((toca.getTime() - ahora.getTime()) / DIA);
    if (faltan <= r.diasAnticipacion && faltan > -60) {
      const nombre = nombreDe(ultima.sku).toLowerCase();
      tareas.push({
        id: `reponer-${cl.telefono}-${ultima.sku}`,
        tipo: "reposicion",
        cliente: cl,
        porque:
          faltan > 0
            ? `Compró ${ultima.cantidad.toLocaleString("es-CO")} de ${nombre} para ${ultima.tramo}; según el desgaste le toca reponer en unos ${faltan} días.`
            : `Compró ${ultima.cantidad.toLocaleString("es-CO")} de ${nombre} para ${ultima.tramo}; ya debió reponer hace ${-faltan} días.`,
        plantilla: "recordatorio_reposicion",
        variables: [primerNombre(cl), nombre, ultima.tramo],
        compra: ultima,
        prioridad: 2,
      });
    }
  }

  return tareas.sort((a, b) => b.prioridad - a.prioridad);
}
