import { normalizar, referenciaDeLinea, rielEnTexto } from "./catalogo.ts";
import { calcularPedido, NOMBRE_RIEL } from "./pedido.ts";
import type { Correo, Durmiente, ItemSolicitado, Riel, Solicitud } from "./tipos.ts";
import { diagnosticar } from "./via.ts";

// Reads a request-for-quote email the way a sales assistant would: who is
// asking, for which company, what they want and how many, where and by when.
// Each item keeps its position in the email, so the screen can underline
// exactly what was understood. Anything it cannot tell goes to `faltantes`
// instead of being guessed.

interface Linea {
  texto: string;
  desde: number;
}

function lineas(cuerpo: string): Linea[] {
  const out: Linea[] = [];
  let desde = 0;
  for (const texto of cuerpo.split("\n")) {
    out.push({ texto, desde });
    desde += texto.length + 1;
  }
  return out;
}

const DESPEDIDA = /^\s*(cordialmente|atentamente|saludos|quedo atent[oa]|quedamos atent[oa]s|gracias|muchas gracias)\b/i;

// Numbers that are a measure, not a quantity: 115 lb, 1", 12 m, 30 kg, 5/8...
const UNIDAD_MEDIDA = /^\s*(lb|libras?|kg|kl|kilos?|mm|cm|m\b|mts?\b|metros?|ml\b|km|pulg|in\b|"|”|''|%|\/)/i;
const UNIDAD_CANTIDAD = /^\s*(und|unds|unidades?|u\b|pares?|juegos?|piezas?|pzas?|kits?|rollos?|cajas?)/i;
const ANTES_CANTIDAD = /(cant\.?|cantidad|x)\s*:?\s*$/i;
const ANTES_NO_CANTIDAD = /(item|ítem|#|n[°º]|no\.|riel de|calibre|tipo|ref\.?|modelo)\s*:?\s*$/i;

export function cantidadEnLinea(texto: string): number | null {
  const candidatos: { n: number; puntos: number }[] = [];
  for (const m of texto.matchAll(/(?<![\w.,/])(\d{1,3}(?:\.\d{3})+|\d+)(?![\w.,]\d|[\w/])/g)) {
    const despues = texto.slice(m.index! + m[0].length);
    const antes = texto.slice(0, m.index);
    if (UNIDAD_MEDIDA.test(despues)) continue;
    // "1. Eclisas…" or "2) Pernos…": list numbering, not a quantity.
    if (/^\s*$/.test(antes) && /^[.)]\s/.test(despues)) continue;
    if (ANTES_NO_CANTIDAD.test(antes)) continue;
    const n = Number(m[0].replace(/\./g, ""));
    if (!n) continue;
    const puntos = (UNIDAD_CANTIDAD.test(despues) ? 2 : 0) + (ANTES_CANTIDAD.test(antes) ? 2 : 0);
    candidatos.push({ n, puntos });
  }
  if (!candidatos.length) return null;
  return candidatos.sort((a, b) => b.puntos - a.puntos)[0].n;
}

export function metrosEnTexto(texto: string): number | null {
  const t = normalizar(texto);
  const km = t.match(/(\d+(?:[.,]\d+)?)\s*(km|kilometros?)\b/);
  if (km) return Math.round(Number(km[1].replace(",", ".")) * 1000);
  const m = t.match(/(\d{1,3}(?:\.\d{3})+|\d+)\s*(m|mts?|metros?|ml)\b(?=[^.\n]{0,40}\bvia\b)/);
  if (m) return Number(m[1].replace(/\./g, ""));
  return null;
}

function rielDe(texto: string): Riel | null {
  const r = rielEnTexto(texto);
  if (r === "30") return "30kg";
  if (r) return r as Riel;
  if (/\buic|136 ?re|132 ?re|141/i.test(texto)) return "otro";
  return null;
}

function durmienteDe(texto: string): Durmiente | null {
  const t = normalizar(texto);
  if (/durmientes? de (concreto|hormigon)|traviesas? de (concreto|hormigon)|concreto/.test(t)) return "concreto";
  if (/durmientes? de madera|madera/.test(t)) return "madera";
  return null;
}

function primero(re: RegExp, texto: string, grupo = 1): string {
  return texto.match(re)?.[grupo]?.trim().replace(/[.,;]+$/, "") ?? "";
}

export function leerSolicitud(correo: Correo): Solicitud {
  const todas = lineas(correo.cuerpo);
  const corte = todas.findIndex((l) => DESPEDIDA.test(l.texto));
  const cuerpo = corte >= 0 ? todas.slice(0, corte) : todas;
  const firma = corte >= 0 ? todas.slice(corte + 1).map((l) => l.texto.trim()).filter(Boolean) : [];
  const textoCuerpo = cuerpo.map((l) => l.texto).join("\n");
  const rielGlobal = rielDe(textoCuerpo);

  // Signature: name, then title, then company (the line that looks like one).
  const contacto = firma[0] ?? correo.de.nombre;
  const empresaFirma =
    firma.find((l) => l !== contacto && /(\bs\.?\s?a\.?\s?s\.?|\bltda\.?|\bs\.\s?a\.|\bconsorcio\b|uni[oó]n temporal|\bconcesi[oó]n\b|\bferrocarril\b|\bsociedad\b|\be\.s\.p\.?)/i.test(l)) ?? "";
  const cargo = firma.find((l) => l !== contacto && l !== empresaFirma && !/@|\+?\d[\d\s-]{6,}/.test(l)) ?? "";

  const items: ItemSolicitado[] = [];
  for (const l of cuerpo) {
    const refs = referenciaDeLinea(l.texto);
    if (!refs.length) continue;
    // A sentence that talks about the stretch, not a line of the list.
    if (metrosEnTexto(l.texto)) continue;
    let candidatos = refs;
    // "eclisas" alone: the rail weight may be elsewhere in the email.
    if (refs.length > 1 && refs.every((s) => s.startsWith("GVC-AK-JB") || s === "GVC-AK-EA75") && rielGlobal) {
      const porRiel = referenciaDeLinea(`eclisa ${NOMBRE_RIEL[rielGlobal]}`);
      if (porRiel.length === 1) candidatos = porRiel;
    }
    const inicio = l.texto.search(/\S/);
    items.push({
      texto: l.texto.trim(),
      desde: l.desde + Math.max(inicio, 0),
      hasta: l.desde + l.texto.trimEnd().length,
      sku: candidatos.length === 1 ? candidatos[0] : null,
      candidatos,
      cantidad: cantidadEnLinea(l.texto),
    });
  }

  const faltantes: string[] = [];
  const metros = metrosEnTexto(textoCuerpo) ?? undefined;
  let pedidoPorMetros;
  if (metros) {
    const durmiente = durmienteDe(textoCuerpo);
    if (rielGlobal && durmiente) pedidoPorMetros = calcularPedido(metros, rielGlobal, durmiente);
    else {
      if (!rielGlobal) faltantes.push(`el libraje del riel de los ${metros.toLocaleString("es-CO")} m de vía`);
      if (!durmiente) faltantes.push("si los durmientes son de concreto o de madera");
    }
  }
  for (const it of items) {
    if (!it.sku) faltantes.push(`cuál de estas referencias necesita en «${it.texto}»: ${it.candidatos.join(", ")}`);
    if (it.cantidad == null) faltantes.push(`la cantidad de «${it.texto}»`);
  }

  const ciudadEntrega = primero(
    /(?:[Ee]ntrega|[Ee]ntregar|[Dd]espacho|[Pp]uesto|[Dd]estino|[Oo]bra)\s+(?:en|a|:)\s*([A-ZÁÉÍÓÚÑ][\wáéíóúñ]+(?:[ ,]+(?:del?\s+)?[A-ZÁÉÍÓÚÑ][\wáéíóúñ]+)*)/,
    textoCuerpo,
  );
  if (!ciudadEntrega) faltantes.push("el lugar de entrega");

  const plazo = primero(/((?:en|dentro de)\s+(?:los\s+)?(?:pr[oó]ximos\s+)?\d+\s+d[ií]as(?:\s+h[aá]biles|\s+calendario)?|antes del?\s+\d{1,2}\s+de\s+[a-záéíóú]+|de manera urgente|con urgencia|lo antes posible)/i, textoCuerpo);
  const referenciaCliente =
    primero(/\b([A-Z]{2,5}(?:-[A-Z]{1,4})?-\d[\w\-\/]*)/, `${correo.asunto}\n${textoCuerpo}`) ||
    primero(/\b(?:solicitud|requisici[oó]n|rfq|sc|proceso|orden|cotizaci[oó]n)\s*(?:n[°ºo.]*|#|no\.?)?\s*[:\-]?\s*([A-Z]{1,5}[-\s]?\d[\w\-\/]*)/i, `${correo.asunto}\n${textoCuerpo}`);

  return {
    correo,
    contacto,
    cargo,
    empresa: empresaFirma,
    ciudadEntrega,
    plazo,
    referenciaCliente,
    items,
    pedidoPorMetros,
    metros,
    diagnostico: diagnosticar(textoCuerpo)?.id,
    faltantes,
  };
}

// Is this email a quote request at all (vs. an answer or anything else)?
export function esSolicitud(correo: Correo): boolean {
  const t = normalizar(`${correo.asunto} ${correo.cuerpo}`);
  return /cotiza|cotizacion|rfq|solicitud de precio|presupuesto|suministro|requerimos|necesitamos/.test(t);
}
