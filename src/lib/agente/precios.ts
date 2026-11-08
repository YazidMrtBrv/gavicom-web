import type { LineaCotizada } from "./tipos.ts";

// Prices only come from Geimar. He answers the agent on WhatsApp the way he
// would type them on the phone ("1 85.000", "2: 3200", "3 12 mil") and this
// file turns that into numbers. The agent never fills a price by itself.

export interface Configuracion {
  ivaPct: number;
  // Whether Geimar's numbers already include VAT. To confirm with GAVICOM.
  preciosIncluyenIva: boolean;
  validezDias: number;
}

export const CONFIG: Configuracion = { ivaPct: 19, preciosIncluyenIva: false, validezDias: 15 };

function numeroColombiano(crudo: string, sufijo?: string): number | null {
  let s = crudo.trim();
  // "85.000" and "1.250.000": dots are thousands; "12,5" is a decimal.
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(,\d{3})+$/.test(s)) s = s.replace(/,/g, "");
  else s = s.replace(",", ".");
  let n = Number(s);
  if (!Number.isFinite(n)) return null;
  const suf = (sufijo ?? "").toLowerCase();
  if (suf === "mil" || suf === "k") n *= 1_000;
  if (suf === "m" || suf.startsWith("millon")) n *= 1_000_000;
  return Math.round(n);
}

// Returns one price per line number (1-based), or null for lines he skipped.
export function leerPrecios(texto: string, totalLineas: number): (number | null)[] {
  const precios: (number | null)[] = Array(totalLineas).fill(null);
  const patron = /(?:^|\n|;|,\s+|\s{2,})\s*#?(\d{1,2})(?:\s*[:=)\-.]\s*|\s+)\$?\s*(\d(?:[\d.,]*\d)?)[ \t]*(mil|k|millones|millon|m)?\b/gi;
  for (const m of texto.matchAll(patron)) {
    const i = Number(m[1]) - 1;
    const valor = numeroColombiano(m[2], m[3]);
    if (i >= 0 && i < totalLineas && valor && valor > 0) precios[i] = valor;
  }
  return precios;
}

export function aplicarPrecios(lineas: LineaCotizada[], precios: (number | null)[]): LineaCotizada[] {
  return lineas.map((l, i) => ({ ...l, precioUnitario: precios[i] ?? l.precioUnitario }));
}

export function faltanPrecios(lineas: LineaCotizada[]): number[] {
  return lineas.flatMap((l, i) => (l.precioUnitario == null ? [i + 1] : []));
}

export interface Totales {
  subtotal: number;
  iva: number;
  total: number;
}

export function totales(lineas: LineaCotizada[], cfg: Configuracion = CONFIG): Totales {
  const bruto = lineas.reduce((s, l) => s + (l.precioUnitario ?? 0) * l.cantidad, 0);
  if (cfg.preciosIncluyenIva) {
    const subtotal = Math.round(bruto / (1 + cfg.ivaPct / 100));
    return { subtotal, iva: bruto - subtotal, total: bruto };
  }
  const iva = Math.round((bruto * cfg.ivaPct) / 100);
  return { subtotal: bruto, iva, total: bruto + iva };
}

export function pesos(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-CO");
}

// "$84 millones", "$1,2 millones", "$950 mil": how a dashboard says money.
export function plataCorta(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${m.toLocaleString("es-CO", { maximumFractionDigits: m >= 10 ? 0 : 1 })} millones`;
  }
  if (n >= 1_000) return `$${Math.round(n / 1_000).toLocaleString("es-CO")} mil`;
  return pesos(n);
}
