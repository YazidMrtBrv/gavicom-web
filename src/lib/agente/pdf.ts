import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { COMPANIA_INFO } from "../../constants/productos.ts";
import { CONFIG, pesos, totales } from "./precios.ts";
import type { Cotizacion } from "./tipos.ts";

// The quote PDF with GAVICOM's brand: navy band with the white logo, Poppins
// for titles and Montserrat for text (the same faces as the site). Runs in
// the browser (simulator) and on the server (webhook) because it only needs
// the font and logo bytes, which each side loads its own way.

export interface Recursos {
  poppins: ArrayBuffer | Uint8Array;
  montserrat: ArrayBuffer | Uint8Array;
  montserratSemi: ArrayBuffer | Uint8Array;
  logoBlanco: ArrayBuffer | Uint8Array;
}

export const RUTAS_RECURSOS = {
  poppins: "/agente/fuentes/Poppins-SemiBold.ttf",
  montserrat: "/agente/fuentes/Montserrat-Regular.ttf",
  montserratSemi: "/agente/fuentes/Montserrat-SemiBold.ttf",
  logoBlanco: "/marca/gavicom-blanco.png",
} as const;

const AZUL = rgb(12 / 255, 38 / 255, 66 / 255);
const TINTA = rgb(20 / 255, 22 / 255, 26 / 255);
const TENUE = rgb(91 / 255, 95 / 255, 104 / 255);
const LINEA = rgb(226 / 255, 227 / 255, 231 / 255);
const SUAVE = rgb(232 / 255, 237 / 255, 243 / 255);
const AMBAR = rgb(180 / 255, 83 / 255, 9 / 255);

const ANCHO = 595.28;
const ALTO = 841.89;
const M = 44;

function fecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Bogota" });
}

// Breaks a text into lines that fit `ancho` points.
function partir(texto: string, fuente: PDFFont, tam: number, ancho: number): string[] {
  const lineas: string[] = [];
  let actual = "";
  for (const palabra of texto.split(/\s+/)) {
    const prueba = actual ? `${actual} ${palabra}` : palabra;
    if (fuente.widthOfTextAtSize(prueba, tam) > ancho && actual) {
      lineas.push(actual);
      actual = palabra;
    } else actual = prueba;
  }
  if (actual) lineas.push(actual);
  return lineas;
}

function derecha(page: PDFPage, texto: string, x: number, y: number, f: PDFFont, tam: number, color = TINTA) {
  page.drawText(texto, { x: x - f.widthOfTextAtSize(texto, tam), y, size: tam, font: f, color });
}

export async function generarPdf(cot: Cotizacion, r: Recursos): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(`Cotización ${cot.numero} · GAVICOM`);
  doc.setAuthor(COMPANIA_INFO.nombre);
  doc.setCreator("Agente de cotizaciones de GAVICOM");
  const titulo = await doc.embedFont(r.poppins, { subset: true });
  const texto = await doc.embedFont(r.montserrat, { subset: true });
  const semi = await doc.embedFont(r.montserratSemi, { subset: true });
  const logo = await doc.embedPng(r.logoBlanco);

  let page = doc.addPage([ANCHO, ALTO]);

  // Band
  page.drawRectangle({ x: 0, y: ALTO - 110, width: ANCHO, height: 110, color: AZUL });
  const lw = 150;
  page.drawImage(logo, { x: M, y: ALTO - 72, width: lw, height: (lw * logo.height) / logo.width });
  derecha(page, "Cotización", ANCHO - M, ALTO - 52, titulo, 22, rgb(1, 1, 1));
  derecha(page, cot.numero, ANCHO - M, ALTO - 74, semi, 12, rgb(1, 1, 1));
  page.drawText(COMPANIA_INFO.promesa, { x: M, y: ALTO - 96, size: 9, font: texto, color: rgb(0.8, 0.85, 0.9) });

  let y = ALTO - 140;
  if (cot.ejemplo) {
    page.drawRectangle({ x: M, y: y - 8, width: ANCHO - 2 * M, height: 24, color: rgb(1, 0.97, 0.9) });
    page.drawText("Documento de demostración: precios de ejemplo, no son precios de GAVICOM.", { x: M + 10, y: y, size: 9, font: semi, color: AMBAR });
    y -= 36;
  }

  // Who and when
  const col2 = ANCHO / 2 + 10;
  page.drawText("Para", { x: M, y, size: 8, font: semi, color: TENUE });
  page.drawText("Fecha", { x: col2, y, size: 8, font: semi, color: TENUE });
  y -= 15;
  page.drawText(cot.cliente.nombre || "Cliente", { x: M, y, size: 12, font: titulo, color: AZUL });
  page.drawText(fecha(cot.enviada ?? cot.creada), { x: col2, y, size: 11, font: texto, color: TINTA });
  y -= 15;
  page.drawText([cot.cliente.empresa, cot.cliente.ciudad].filter(Boolean).join(" · "), { x: M, y, size: 10, font: texto, color: TINTA });
  page.drawText(`Válida por ${CONFIG.validezDias} días`, { x: col2, y, size: 10, font: texto, color: TENUE });
  y -= 15;
  page.drawText(`Pedido: ${cot.origen}`, { x: M, y, size: 9, font: texto, color: TENUE });
  if (cot.referenciaCliente) page.drawText(`Su referencia: ${cot.referenciaCliente}`, { x: col2, y, size: 9, font: texto, color: TENUE });
  y -= 30;

  // Table
  const cols = { n: M, ref: M + 22, cant: 360, pu: 450, sub: ANCHO - M };
  const encabezado = () => {
    page.drawRectangle({ x: M, y: y - 6, width: ANCHO - 2 * M, height: 22, color: SUAVE });
    page.drawText("#", { x: cols.n + 6, y, size: 8, font: semi, color: AZUL });
    page.drawText("Referencia", { x: cols.ref, y, size: 8, font: semi, color: AZUL });
    derecha(page, "Cantidad", cols.cant, y, semi, 8, AZUL);
    derecha(page, "Precio unitario", cols.pu, y, semi, 8, AZUL);
    derecha(page, "Subtotal", cols.sub - 6, y, semi, 8, AZUL);
    y -= 26;
  };
  encabezado();
  cot.lineas.forEach((l, i) => {
    const nombre = partir(l.nombre, semi, 9.5, cols.cant - cols.ref - 60);
    const alto = 20 + nombre.length * 12;
    if (y - alto < 170) {
      page = doc.addPage([ANCHO, ALTO]);
      y = ALTO - M;
      encabezado();
    }
    page.drawText(String(i + 1), { x: cols.n + 6, y, size: 9, font: texto, color: TENUE });
    nombre.forEach((ln, k) => page.drawText(ln, { x: cols.ref, y: y - k * 12, size: 9.5, font: semi, color: TINTA }));
    page.drawText(l.sku, { x: cols.ref, y: y - nombre.length * 12, size: 8, font: texto, color: TENUE });
    derecha(page, `${l.cantidad.toLocaleString("es-CO")} ${l.unidad}`, cols.cant, y, texto, 9.5);
    derecha(page, l.precioUnitario != null ? pesos(l.precioUnitario) : "—", cols.pu, y, texto, 9.5);
    derecha(page, l.precioUnitario != null ? pesos(l.precioUnitario * l.cantidad) : "—", cols.sub - 6, y, semi, 9.5);
    y -= alto;
    page.drawLine({ start: { x: M, y: y + 8 }, end: { x: ANCHO - M, y: y + 8 }, thickness: 0.6, color: LINEA });
  });

  // Totals
  const t = totales(cot.lineas);
  y -= 8;
  const filaTotal = (etq: string, v: number, fuerte = false) => {
    page.drawText(etq, { x: cols.pu - 70, y, size: fuerte ? 11 : 9.5, font: fuerte ? titulo : texto, color: fuerte ? AZUL : TENUE });
    derecha(page, pesos(v), cols.sub - 6, y, fuerte ? titulo : semi, fuerte ? 13 : 9.5, fuerte ? AZUL : TINTA);
    y -= fuerte ? 22 : 16;
  };
  filaTotal("Subtotal", t.subtotal);
  filaTotal(`IVA ${CONFIG.ivaPct}%`, t.iva);
  const yTotales = y;
  filaTotal("Total", t.total, true);

  // Conditions, on the left of the totals block.
  const condiciones: [string, string][] = [
    ["Tiempo de entrega", cot.condiciones.entrega || "Por confirmar"],
    ["Lugar de entrega", cot.cliente.ciudad || "Por confirmar"],
    ["Forma de pago", cot.condiciones.pago || "Por confirmar"],
  ];
  let yc = yTotales + 38;
  page.drawText("Condiciones", { x: M, y: yc + 14, size: 8, font: semi, color: TENUE });
  for (const [k, v] of condiciones) {
    page.drawText(`${k}: `, { x: M, y: yc, size: 9, font: semi, color: TINTA });
    page.drawText(v, { x: M + semi.widthOfTextAtSize(`${k}: `, 9), y: yc, size: 9, font: texto, color: TINTA });
    yc -= 14;
  }

  // Footer
  const pie = [
    `Precios definidos y aprobados por ${COMPANIA_INFO.gerente}, ${COMPANIA_INFO.cargo}.`,
    "Cantidades calculadas a partir de los metros de vía; confírmalas con tu diseño antes de emitir la orden de compra.",
  ];
  let yp = 100;
  for (const p of pie) {
    for (const ln of partir(p, texto, 8.5, ANCHO - 2 * M)) {
      page.drawText(ln, { x: M, y: yp, size: 8.5, font: texto, color: TENUE });
      yp -= 12;
    }
  }
  page.drawLine({ start: { x: M, y: 62 }, end: { x: ANCHO - M, y: 62 }, thickness: 0.6, color: LINEA });
  page.drawText(`${COMPANIA_INFO.nombre} · ${COMPANIA_INFO.ciudad}, ${COMPANIA_INFO.departamento} · ${COMPANIA_INFO.cobertura}`, { x: M, y: 46, size: 8.5, font: semi, color: AZUL });
  page.drawText(`WhatsApp ${COMPANIA_INFO.whatsappSales} · ${COMPANIA_INFO.email} · ${COMPANIA_INFO.horarioCorto}`, { x: M, y: 33, size: 8.5, font: texto, color: TENUE });

  return doc.save();
}
