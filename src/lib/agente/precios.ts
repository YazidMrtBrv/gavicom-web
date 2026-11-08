import type { LineaCotizada } from "./tipos.ts";

// Prices only come from Geimar: he types them in the agent's panel the way
// he writes them ("185.000", "12 mil") and this file turns that into
// numbers. The agent never fills a price by itself.

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

// One price as Geimar types it in the panel: "185.000", "$ 1.250.000",
// "12 mil". Null when it is not a price.
export function leerPrecio(texto: string): number | null {
  const m = texto.trim().match(/^\$?\s*(\d(?:[\d.,]*\d)?)\s*(mil|k|millones|millon|m)?$/i);
  if (!m) return null;
  const n = numeroColombiano(m[1], m[2]);
  return n && n > 0 ? n : null;
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
