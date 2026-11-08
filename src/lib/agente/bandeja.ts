import { nombreDe } from "./catalogo.ts";
import { borradorAclaracion, borradorAgradecimiento, borradorCotizacion, borradorMotivo, leerRespuesta, motivoDe } from "./redaccion.ts";
import { faltanPrecios } from "./precios.ts";
import { leerSolicitud } from "./solicitud.ts";
import type { Borrador, Cliente, Correo, Cotizacion, LineaCotizada, Solicitud } from "./tipos.ts";

// The agent's work on the mailbox, as pure functions: an email comes in, a
// quote waiting for Geimar's prices and the right drafts come out. Nothing
// here sends anything: drafts are for Geimar to review and send.

export interface Contexto {
  ahora: Date;
  numeroCotizacion: () => string;
  ejemplo: boolean;
}

export interface Procesado {
  solicitud: Solicitud;
  cliente: Cliente;
  // Known client: what the agent remembers about them.
  recuerdo?: string;
  cotizacion: Cotizacion | null;
  borradores: Borrador[];
}

export function lineasDe(sol: Solicitud): LineaCotizada[] {
  const desdeMetros = sol.pedidoPorMetros?.lineas ?? [];
  const sueltas = sol.items
    .filter((i) => i.sku && i.cantidad)
    .map((i) => ({ sku: i.sku!, nombre: nombreDe(i.sku!), cantidad: i.cantidad!, unidad: "und", porque: `Pedido en el correo: «${i.texto}»` }));
  return [...desdeMetros, ...sueltas].map((l) => ({ ...l, precioUnitario: null }));
}

export function procesarCorreo(correo: Correo, clientes: Cliente[], ctx: Contexto): Procesado {
  const sol = leerSolicitud(correo);
  const conocido = clientes.find((c) => c.correo.toLowerCase() === correo.de.correo.toLowerCase());
  const cliente: Cliente = conocido
    ? { ...conocido, ciudad: sol.ciudadEntrega || conocido.ciudad }
    : { correo: correo.de.correo, nombre: sol.contacto || correo.de.nombre, cargo: sol.cargo, empresa: sol.empresa, ciudad: sol.ciudadEntrega, compras: [], ejemplo: correo.ejemplo };
  const ultima = conocido?.compras.at(-1);
  const recuerdo = ultima
    ? `Cliente que vuelve: el ${new Date(ultima.fecha).toLocaleDateString("es-CO", { month: "long", year: "numeric" })} compró ${ultima.cantidad.toLocaleString("es-CO")} de ${nombreDe(ultima.sku).toLowerCase()} para ${ultima.tramo}.`
    : undefined;

  const lineas = lineasDe(sol);
  const cotizacion: Cotizacion | null = lineas.length
    ? {
        numero: ctx.numeroCotizacion(),
        cliente,
        lineas,
        estado: "esperando-precios",
        creada: ctx.ahora.toISOString(),
        origen: sol.pedidoPorMetros ? `${sol.pedidoPorMetros.metros.toLocaleString("es-CO")} m de vía, según el correo` : "Correo de solicitud",
        condiciones: { entrega: "", pago: "" },
        referenciaCliente: sol.referenciaCliente || undefined,
        ejemplo: ctx.ejemplo,
      }
    : null;
  // Questions that only matter for the quote (place of delivery is asked in
  // the quote's own conditions when the rest is clear).
  const borradores = sol.faltantes.length ? [borradorAclaracion(sol, Boolean(cotizacion))] : [];
  return { solicitud: sol, cliente, recuerdo, cotizacion, borradores };
}

// What still blocks Geimar's approval, in his words.
export function pendientesDeAprobacion(cot: Cotizacion): string[] {
  const p: string[] = [];
  const sin = faltanPrecios(cot.lineas);
  if (sin.length) p.push(sin.length === 1 ? "el precio de 1 línea" : `los precios de ${sin.length} líneas`);
  if (!cot.condiciones.entrega.trim()) p.push("el tiempo de entrega");
  if (!cot.condiciones.pago.trim()) p.push("la forma de pago");
  return p;
}

export function aprobar(cot: Cotizacion, sol: Solicitud | undefined): { cotizacion: Cotizacion; borrador: Borrador } {
  const pendientes = pendientesDeAprobacion(cot);
  if (pendientes.length) throw new Error(`Falta ${pendientes.join(", ")}.`);
  const lista: Cotizacion = { ...cot, estado: "por-aprobar" };
  return { cotizacion: lista, borrador: borradorCotizacion(lista, sol) };
}

export function marcarEnviada(cot: Cotizacion, ahora: Date): Cotizacion {
  return { ...cot, estado: "enviada", enviada: ahora.toISOString() };
}

// The client answered a sent quote. A "no" with a reason closes it with that
// reason; a "no" without one leaves a polite question as a draft.
export function procesarRespuesta(cot: Cotizacion, correo: Correo, ahora: Date): { cotizacion: Cotizacion; borrador: Borrador | null } {
  // Answer to the agent's "what didn't fit?": only the reason changes.
  if (cot.estado === "perdida") {
    const m = motivoDe(correo.cuerpo);
    return { cotizacion: m ? { ...cot, motivo: m } : cot, borrador: null };
  }
  const r = leerRespuesta(correo.cuerpo);
  if (r.tipo === "aprobada") {
    const c: Cotizacion = { ...cot, estado: "ganada", cerrada: ahora.toISOString() };
    return { cotizacion: c, borrador: borradorAgradecimiento(c, correo.asunto, correo.id) };
  }
  if (r.tipo === "perdida") {
    const c: Cotizacion = { ...cot, estado: "perdida", cerrada: ahora.toISOString(), motivo: r.motivo ?? "otro" };
    return { cotizacion: c, borrador: r.motivo ? null : borradorMotivo(c, correo.asunto, correo.id) };
  }
  return { cotizacion: cot, borrador: null };
}
