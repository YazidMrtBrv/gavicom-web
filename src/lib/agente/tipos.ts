// Shared shapes of GAVICOM's quoting agent. GAVICOM's clients are formal
// companies and every quote goes by email, so the agent reads request emails
// and leaves its answers as DRAFTS that Geimar reviews and sends himself.
// Everything in src/lib/agente is plain TypeScript with relative ".ts"
// imports, so it runs in the app, in a scheduled job and under `node --test`.

export type Riel = "115" | "90" | "75" | "30kg" | "otro";
export type Durmiente = "concreto" | "madera";

// One line of an order: a catalogue reference and how many. Never a price:
// prices only enter through Geimar (see precios.ts).
export interface LineaPedido {
  sku: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  // Why this quantity, in words a buyer understands ("2 por junta").
  porque: string;
}

export interface Pedido {
  metros: number;
  riel: Riel;
  durmiente: Durmiente;
  lineas: LineaPedido[];
  // Things the buyer must know before trusting the numbers.
  notas: string[];
}

export type EstadoCotizacion =
  | "esperando-precios" // Geimar has to put prices and conditions
  | "por-aprobar" // draft and PDF ready, waiting for Geimar's approval
  | "enviada" // Geimar sent the email
  | "ganada"
  | "perdida";

export type MotivoPerdida = "precio" | "plazo" | "ya-compro" | "proyecto-aplazado" | "sin-respuesta" | "otro";

export const MOTIVOS: Record<MotivoPerdida, string> = {
  precio: "Precio",
  plazo: "Tiempo de entrega",
  "ya-compro": "Ya le compró a otro",
  "proyecto-aplazado": "Proyecto aplazado",
  "sin-respuesta": "No volvió a contestar",
  otro: "Otro",
};

export interface LineaCotizada extends LineaPedido {
  precioUnitario: number | null;
}

export interface Cotizacion {
  numero: string;
  cliente: Cliente;
  lineas: LineaCotizada[];
  estado: EstadoCotizacion;
  // ISO dates; the follow-up rules read them.
  creada: string;
  enviada?: string;
  cerrada?: string;
  motivo?: MotivoPerdida;
  // Where the order came from: "300 m de vía en 115 lb", "foto de una pieza"...
  origen: string;
  // Conditions Geimar fills before approving; printed on the PDF and the email.
  condiciones: { entrega: string; pago: string };
  // The client's own reference for the request (SC-2026-118, RFQ-...).
  referenciaCliente?: string;
  // True when the numbers are demo numbers, so the PDF says so.
  ejemplo: boolean;
}

export interface Compra {
  sku: string;
  cantidad: number;
  fecha: string;
  tramo: string;
}

export interface Cliente {
  correo: string;
  nombre: string;
  cargo: string;
  empresa: string;
  ciudad: string;
  compras: Compra[];
  ejemplo: boolean;
}

export interface Persona {
  nombre: string;
  correo: string;
}

export interface Correo {
  id: string;
  de: Persona;
  para: Persona;
  asunto: string;
  fecha: string;
  cuerpo: string;
  adjuntos: string[];
  // Id of the email this one answers, to build threads.
  enRespuestaA?: string;
  ejemplo: boolean;
}

// One requested line, with where it sits in the email so the screen can
// mark exactly what the agent understood.
export interface ItemSolicitado {
  texto: string;
  desde: number;
  hasta: number;
  sku: string | null;
  // More than one reference fits ("eclisas" with no rail weight).
  candidatos: string[];
  cantidad: number | null;
}

export interface Solicitud {
  correo: Correo;
  contacto: string;
  cargo: string;
  empresa: string;
  ciudadEntrega: string;
  plazo: string;
  referenciaCliente: string;
  items: ItemSolicitado[];
  pedidoPorMetros?: Pedido;
  // The stretch, when the order is by length but rail or sleeper is missing.
  metros?: number;
  diagnostico?: string;
  // Questions the agent cannot answer from the email, in the client's terms.
  faltantes: string[];
}

export type TipoBorrador = "cotizacion" | "aclaracion" | "seguimiento" | "reposicion" | "agradecimiento" | "motivo";

export interface Borrador {
  id: string;
  tipo: TipoBorrador;
  para: Persona;
  asunto: string;
  cuerpo: string;
  // Quote number whose PDF goes attached.
  adjunto?: string;
  enRespuestaA?: string;
  // Why the agent wrote it, for Geimar's screen.
  porque: string;
}
