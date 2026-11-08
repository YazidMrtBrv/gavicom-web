import { nombreDe } from "./catalogo.ts";
import type { Durmiente, LineaPedido, Pedido, Riel } from "./tipos.ts";

// Full order for a stretch of single track, from its length in metres.
//
// Every number below is a STARTING RULE written for the demo from common
// practice. None is confirmed by GAVICOM yet: `confirmada: false` is shown to
// the buyer next to the result, and Geimar changes the values here once.
export const REGLAS = {
  confirmada: false,
  // Length of each rail bar; one joint at each end, on each of the two rails.
  largoRielM: 12,
  // Sleeper spacing, centre to centre.
  espaciamientoM: { concreto: 0.6, madera: 0.55 } as Record<Durmiente, number>,
  // Bolts per joint: six-hole bars on heavy rail, four on light rail.
  pernosPorJunta: { "115": 6, "90": 4, "75": 4, "30kg": 4, otro: 6 } as Record<Riel, number>,
  // Concrete: two clips and one pad under each rail seat.
  clipsPorDurmiente: 4,
  almohadillasPorDurmiente: 2,
  // Timber: one tie plate per rail seat, two spikes per plate on straight track.
  placasPorDurmiente: 2,
  clavosPorPlaca: 2,
  // Anchors: two on every other timber sleeper (one per sleeper on average).
  anclasPorDurmiente: 1,
  // Spare stock for loss and breakage on site.
  reservaPct: 3,
};

const ECLISA: Record<Riel, string | null> = {
  "115": "GVC-AK-JB115",
  "90": "GVC-AK-JB90",
  "75": "GVC-AK-EA75",
  "30kg": "GVC-AK-JB30",
  otro: null,
};

export const NOMBRE_RIEL: Record<Riel, string> = {
  "115": "115 lb",
  "90": "90 lb",
  "75": "75 lb",
  "30kg": "30 kg",
  otro: "otro perfil",
};

function conReserva(n: number): number {
  return Math.ceil(n * (1 + REGLAS.reservaPct / 100));
}

function linea(sku: string, cantidad: number, unidad: string, porque: string): LineaPedido {
  return { sku, nombre: nombreDe(sku), cantidad, unidad, porque };
}

export function calcularPedido(metros: number, riel: Riel, durmiente: Durmiente): Pedido {
  if (!Number.isFinite(metros) || metros <= 0) throw new Error("Los metros deben ser un número mayor que cero.");
  const barras = Math.ceil(metros / REGLAS.largoRielM);
  // Two rails, one joint where two bars meet: (bars - 1) per rail, plus the
  // joints that tie into the existing track at both ends.
  const juntas = 2 * (barras + 1);
  const durmientes = Math.ceil(metros / REGLAS.espaciamientoM[durmiente]) + 1;
  const lineas: LineaPedido[] = [];
  const notas: string[] = [];

  const eclisa = ECLISA[riel];
  if (eclisa) {
    lineas.push(linea(eclisa, juntas * 2, "und", `2 por junta · ${juntas} juntas (barras de ${REGLAS.largoRielM} m en los dos rieles)`));
  } else {
    notas.push("Para ese perfil de riel la eclisa se fabrica en Colombia con plano o muestra: Geimar te confirma el perfil.");
  }
  lineas.push(linea("GVC-AK-TB01", conReserva(juntas * REGLAS.pernosPorJunta[riel]), "und", `${REGLAS.pernosPorJunta[riel]} por junta, con tuerca, +${REGLAS.reservaPct}% de reserva`));

  if (durmiente === "concreto") {
    lineas.push(linea("GVC-AD-E2055", conReserva(durmientes * REGLAS.clipsPorDurmiente), "und", `${REGLAS.clipsPorDurmiente} por durmiente · ${durmientes} durmientes cada ${REGLAS.espaciamientoM.concreto} m`));
    lineas.push(linea("GVC-AD-RP02", conReserva(durmientes * REGLAS.almohadillasPorDurmiente), "und", `${REGLAS.almohadillasPorDurmiente} por durmiente, una bajo cada riel`));
  } else {
    const placas = durmientes * REGLAS.placasPorDurmiente;
    lineas.push(linea("GVC-AK-TP03", conReserva(placas), "und", `${REGLAS.placasPorDurmiente} por durmiente · ${durmientes} durmientes cada ${REGLAS.espaciamientoM.madera} m`));
    lineas.push(linea("GVC-AK-WS02", conReserva(placas * REGLAS.clavosPorPlaca), "und", `${REGLAS.clavosPorPlaca} por placa en recta (en curva van más)`));
    lineas.push(linea("GVC-AK-RA04", conReserva(durmientes * REGLAS.anclasPorDurmiente), "und", "2 cada dos durmientes, para que el riel no camine"));
  }

  notas.push(`Calculado para vía sencilla de ${metros.toLocaleString("es-CO")} m. Los durmientes y el riel no van incluidos.`);
  if (!REGLAS.confirmada) notas.push("Cantidades con reglas de cálculo que GAVICOM está confirmando; Geimar las revisa antes de cotizar.");
  return { metros, riel, durmiente, lineas, notas };
}
