// Shared shapes of the WhatsApp agent. Everything in src/lib/agente is plain
// TypeScript with relative ".ts" imports, so the same files run in the app,
// in the WhatsApp webhook and under `node --test` without a build.

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
  | "esperando-precios" // Geimar has to answer with prices
  | "por-aprobar" // PDF built, waiting for Geimar's tap
  | "enviada" // the client has the PDF
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
  telefono: string;
  nombre: string;
  empresa: string;
  ciudad: string;
  compras: Compra[];
  // Last time the client wrote: WhatsApp only lets a business write freely
  // for 24 hours after that; later it must use a template Meta approved.
  ultimoMensaje?: string;
  ejemplo: boolean;
}

// What the agent sends. "botones" become WhatsApp reply buttons (max 3) and
// "documento" a PDF attachment.
export type Mensaje =
  | { tipo: "texto"; texto: string; botones?: string[] }
  | { tipo: "pedido"; texto: string; pedido: Pedido; botones?: string[] }
  | { tipo: "documento"; texto: string; cotizacion: string }
  | { tipo: "referencias"; texto: string; skus: string[]; botones?: string[] };

export type Para = "cliente" | "geimar";

export interface Salida {
  para: Para;
  mensaje: Mensaje;
}
