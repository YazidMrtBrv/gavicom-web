import { nombreDe } from "./catalogo.ts";
import { DIA } from "./seguimiento.ts";
import type { Cliente, Correo, Cotizacion, LineaCotizada, MotivoPerdida } from "./tipos.ts";

// DEMO DATA. Fictitious clients and companies, fictitious addresses on the
// reserved ".ejemplo" domain, and made-up prices: GAVICOM does not publish
// prices and none of these are its prices. Every screen that shows them says
// "ejemplo". Dates are relative to "now" so the morning always has work.

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
      correo: "c.restrepo@viasdelnorte.ejemplo",
      nombre: "Camila Restrepo",
      cargo: "Jefe de mantenimiento de vía",
      empresa: "Vías del Norte S.A.S. (ejemplo)",
      ciudad: "Ciénaga, Magdalena",
      // Clips last ~6 months; bought 5 months and 15 days ago → due soon.
      compras: [{ sku: "GVC-AD-E2055", cantidad: 1600, fecha: mesesAtras(ahora, 5, 15), tramo: "el tramo del km 12 al 14" }],
      ejemplo: true,
    },
    {
      correo: "compras@patiocarbonero.ejemplo",
      nombre: "Andrés Polo",
      cargo: "Coordinador de compras",
      empresa: "Patio Carbonero S.A. (ejemplo)",
      ciudad: "Santa Marta",
      compras: [{ sku: "GVC-AK-TB01", cantidad: 480, fecha: mesesAtras(ahora, 3), tramo: "las juntas del patio 2" }],
      ejemplo: true,
    },
    {
      correo: "lortiz@mfcaribe.ejemplo",
      nombre: "Luisa Fernanda Ortiz",
      cargo: "Directora de proyectos",
      empresa: "Mantenimientos Férreos del Caribe Ltda. (ejemplo)",
      ciudad: "Barranquilla",
      compras: [{ sku: "GVC-AK-JB115", cantidad: 120, fecha: mesesAtras(ahora, 7), tramo: "la variante de Bosconia" }],
      ejemplo: true,
    },
  ];
}

const GERENCIA = { nombre: "GAVICOM Gerencia", correo: "gerencia@gavicom.com" };

// Request emails as they would arrive at gerencia@. Written the way formal
// Colombian buyers write; all fictitious.
export function correosEjemplo(ahora: Date): Correo[] {
  return [
    {
      id: "rfq-1",
      de: { nombre: "Paola Mejía", correo: "pmejia@concesionferrea.ejemplo" },
      para: GERENCIA,
      asunto: "Solicitud de cotización SC-2026-118 · Renovación de vía",
      fecha: hace(ahora, 0.2),
      cuerpo: `Buenos días,

Por medio del presente solicitamos cotización para el suministro de fijaciones para la renovación de 300 m de vía en riel de 115 lb sobre durmientes de concreto, en el sector del km 45.

Entrega en Fundación, Magdalena. Requerimos el material dentro de los próximos 20 días calendario.

Agradecemos indicar tiempo de entrega, forma de pago y validez de la oferta.

Cordialmente,

Paola Mejía
Ingeniera residente de vía
Concesión Férrea del Magdalena S.A.S. (ejemplo)
Tel. 300 000 0021`,
      adjuntos: [],
      ejemplo: true,
    },
    {
      id: "rfq-2",
      de: { nombre: "Andrés Polo", correo: "compras@patiocarbonero.ejemplo" },
      para: GERENCIA,
      asunto: "RFQ-PC-0457 Repuestos de vía patio 2",
      fecha: hace(ahora, 0.6),
      cuerpo: `Señores GAVICOM:

Solicitamos su mejor oferta para los siguientes ítems:

1. Eclisas para riel de 90 lb — 40 und
2. Pernos de eclisa con tuerca, 1" x 5" — 160 und
3. Clip elástico E2055 — 1.200 und
4. Tirafondos para durmiente de madera

Entrega en Santa Marta, patio 2. Favor enviar la oferta a este correo.

Atentamente,

Andrés Polo
Coordinador de compras
Patio Carbonero S.A. (ejemplo)`,
      adjuntos: [],
      ejemplo: true,
    },
    {
      id: "rfq-3",
      de: { nombre: "Jorge Ospina", correo: "jospina@consorciocesar.ejemplo" },
      para: GERENCIA,
      asunto: "Cotización herramienta de vía - Consorcio Vial del Cesar",
      fecha: hace(ahora, 1.1),
      cuerpo: `Buenas tardes,

En el tramo que mantenemos estamos viendo polvillo blanco sobre las traviesas y algunos durmientes que bailan al paso del tren. Vamos a programar una cuadrilla y necesitamos cotizar herramienta:

- Garlanchín de diez dientes: 10 und
- Pala de drenaje: 6 und
- Barra desguarnecedora: 4 und

Entrega en Chiriguaná, Cesar, de manera urgente.

Quedo atento,

Jorge Ospina
Supervisor de vía
Consorcio Vial del Cesar (ejemplo)`,
      adjuntos: ["foto-tramo-km45.jpg"],
      ejemplo: true,
    },
  ];
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
  // Sent 3 days ago, no answer: the morning follow-up picks it up.
  ["C-0140", 2, 3, "enviada", [["GVC-AK-JB115", 160, 185000], ["GVC-AK-TB01", 480, 14000]]],
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
      condiciones: { entrega: "15 días hábiles", pago: "Crédito a 30 días" },
      referenciaCliente: `SC-${numero.slice(2)}`,
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
  "GVC-VIA-001": 180000,
  "GVC-VIA-003": 210000,
  "GVC-VIA-006": 95000,
};

// Demo prices for one quote, in line order. NOT GAVICOM prices.
export function preciosEjemplo(skus: string[]): number[] {
  return skus.map((s) => PRECIOS_EJEMPLO[s] ?? 50000);
}

// Answers a client could send, for the demo buttons.
export const RESPUESTAS_EJEMPLO = {
  aprueba: "Buenos días, aprobamos la cotización. Esta semana les enviamos la orden de compra.",
  precio: "Buenas tardes, gracias por la oferta. No vamos a continuar: el precio quedó por encima de nuestro presupuesto.",
  otro: "Gracias por la oferta. El proceso fue adjudicado a otro proveedor.",
  sinMotivo: "Gracias por la cotización, por ahora no vamos a continuar con el proceso.",
} as const;
