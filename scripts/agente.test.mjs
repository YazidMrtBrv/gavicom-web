// The quoting agent's rules, tested without a browser or a build: the
// engine files are plain TypeScript that Node runs directly.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buscarReferencias, porSku } from "../src/lib/agente/catalogo.ts";
import { calcularPedido } from "../src/lib/agente/pedido.ts";
import { leerPrecio, totales } from "../src/lib/agente/precios.ts";
import { leerSolicitud, cantidadEnLinea } from "../src/lib/agente/solicitud.ts";
import { procesarCorreo, aprobar, marcarEnviada, procesarRespuesta, pendientesDeAprobacion } from "../src/lib/agente/bandeja.ts";
import { leerRespuesta } from "../src/lib/agente/redaccion.ts";
import { tareasDelDia } from "../src/lib/agente/seguimiento.ts";
import { calcularTablero } from "../src/lib/agente/tablero.ts";
import { clientesEjemplo, correosEjemplo, cotizacionesEjemplo, preciosEjemplo, RESPUESTAS_EJEMPLO } from "../src/lib/agente/ejemplo.ts";
import { diagnosticar, decisionPorDesnivel, CRITERIOS_VIA } from "../src/lib/agente/via.ts";
import { generarPdf } from "../src/lib/agente/pdf.ts";

const AHORA = new Date("2026-11-08T13:00:00Z");
let n = 200;
const ctx = () => ({ ahora: AHORA, numeroCotizacion: () => `C-0${n++}`, ejemplo: true });
const correo = (id) => correosEjemplo(AHORA).find((c) => c.id === id);
const PRECIO = /\$\s?\d/;
// Geimar's approximate field figures: never in a client email while unvalidated.
const CIFRAS_VIA = /2[.,]5 ?(pulg|")|15 km|\b30 cm|\b15 cm|400\.000|\b5 pulgadas/;
const conPrecios = (cot, condiciones = { entrega: "15 días hábiles", pago: "Crédito a 30 días" }) => {
  const precios = preciosEjemplo(cot.lineas.map((l) => l.sku));
  return { ...cot, lineas: cot.lineas.map((l, i) => ({ ...l, precioUnitario: precios[i] })), condiciones };
};

test("field words find real catalogue references", () => {
  assert.deepEqual(buscarReferencias("necesito eclisas de 90"), ["GVC-AK-JB90"]);
  assert.ok(buscarReferencias("unos clips pandrol").includes("GVC-AD-E2055"));
  assert.ok(buscarReferencias("tirafondos para durmiente").includes("GVC-AD-SS01"));
  for (const s of buscarReferencias("eclisas pernos clips almohadillas placa de asiento clavos anclas garlanchin troley")) assert.ok(porSku(s), s);
});

test("order by metres: joints, bolts, clips and pads add up", () => {
  const p = calcularPedido(300, "115", "concreto");
  const q = Object.fromEntries(p.lineas.map((l) => [l.sku, l.cantidad]));
  // 300 m / 12 m = 25 bars; 2 rails × 26 joints = 52; 2 bars each.
  assert.equal(q["GVC-AK-JB115"], 104);
  assert.equal(q["GVC-AK-TB01"], Math.ceil(52 * 6 * 1.03));
  // 300 / 0.6 + 1 = 501 sleepers.
  assert.equal(q["GVC-AD-E2055"], Math.ceil(501 * 4 * 1.03));
  assert.equal(q["GVC-AD-RP02"], Math.ceil(501 * 2 * 1.03));
  assert.ok(p.notas.some((x) => /confirmando/.test(x)), "says the rules are not confirmed yet");
  const madera = calcularPedido(100, "90", "madera").lineas.map((l) => l.sku);
  assert.deepEqual(madera, ["GVC-AK-JB90", "GVC-AK-TB01", "GVC-AK-TP03", "GVC-AK-WS02", "GVC-AK-RA04"]);
  assert.throws(() => calcularPedido(0, "115", "concreto"));
});

test("Geimar's prices are read the way he types them", () => {
  assert.equal(leerPrecio("85.000"), 85000);
  assert.equal(leerPrecio("$ 1.250.000"), 1250000);
  assert.equal(leerPrecio("12 mil"), 12000);
  assert.equal(leerPrecio("9800"), 9800);
  assert.equal(leerPrecio("abc"), null);
  assert.deepEqual(totales([{ cantidad: 2, precioUnitario: 100000 }]), { subtotal: 200000, iva: 38000, total: 238000 });
});

test("quantities: units and list numbers are not quantities", () => {
  assert.equal(cantidadEnLinea("1. Eclisas para riel de 90 lb — 40 und"), 40);
  assert.equal(cantidadEnLinea('2. Pernos de eclisa con tuerca, 1" x 5" — 160 und'), 160);
  assert.equal(cantidadEnLinea("3. Clip elástico E2055 — 1.200 und"), 1200);
  assert.equal(cantidadEnLinea("4. Tirafondos para durmiente de madera"), null);
  assert.equal(cantidadEnLinea("- Garlanchín de diez dientes: 10 und"), 10);
});

test("an item list email: references, quantities, place and what is missing", () => {
  const s = leerSolicitud(correo("rfq-2"));
  assert.deepEqual(
    s.items.map((i) => [i.sku, i.cantidad]),
    [["GVC-AK-JB90", 40], ["GVC-AK-TB01", 160], ["GVC-AD-E2055", 1200], ["GVC-AD-SS01", null]],
  );
  assert.equal(s.referenciaCliente, "RFQ-PC-0457");
  assert.match(s.ciudadEntrega, /Santa Marta/);
  assert.equal(s.contacto, "Andrés Polo");
  assert.match(s.empresa, /Patio Carbonero/);
  assert.equal(s.faltantes.length, 1);
  assert.match(s.faltantes[0], /cantidad.*Tirafondos/);
  // Each item points at its own text in the email, for the highlight.
  const it = s.items[0];
  assert.equal(correo("rfq-2").cuerpo.slice(it.desde, it.hasta), it.texto);
});

test("an order by metres of track written in prose", () => {
  const s = leerSolicitud(correo("rfq-1"));
  assert.equal(s.pedidoPorMetros?.metros, 300);
  assert.equal(s.pedidoPorMetros?.riel, "115");
  assert.equal(s.pedidoPorMetros?.durmiente, "concreto");
  assert.equal(s.referenciaCliente, "SC-2026-118");
  assert.match(s.ciudadEntrega, /Fundación/);
  assert.match(s.plazo, /20 días/);
  assert.deepEqual(s.faltantes, []);
});

test("full flow: email → quote → Geimar's prices → formal draft → answer → won", () => {
  const p = procesarCorreo(correo("rfq-1"), clientesEjemplo(AHORA), ctx());
  const cot = p.cotizacion;
  assert.equal(cot.estado, "esperando-precios");
  assert.equal(p.borradores.length, 0, "nothing to ask: the email is complete");
  assert.equal(pendientesDeAprobacion(cot).length, 3, "prices, delivery time and payment are pending");
  assert.throws(() => aprobar(cot, p.solicitud), /Falta/);

  const { cotizacion, borrador } = aprobar(conPrecios(cot), p.solicitud);
  assert.equal(cotizacion.estado, "por-aprobar");
  assert.equal(borrador.tipo, "cotizacion");
  assert.equal(borrador.para.correo, "pmejia@concesionferrea.ejemplo");
  assert.match(borrador.asunto, /^RE: Solicitud de cotización SC-2026-118/);
  assert.match(borrador.cuerpo, /^Cordial saludo, Paola Mejía:/);
  assert.match(borrador.cuerpo, /SC-2026-118/);
  assert.match(borrador.cuerpo, /15 días hábiles/);
  assert.match(borrador.cuerpo, /Geimar Martínez\nGerente General/);
  assert.equal(borrador.adjunto, cotizacion.numero);

  const r = procesarRespuesta(marcarEnviada(cotizacion, AHORA), { ...correo("rfq-1"), id: "r1", cuerpo: RESPUESTAS_EJEMPLO.aprueba }, AHORA);
  assert.equal(r.cotizacion.estado, "ganada");
  assert.equal(r.borrador.tipo, "agradecimiento");
});

test("missing data: the agent asks by email and quotes what is clear", () => {
  const p = procesarCorreo(correo("rfq-2"), clientesEjemplo(AHORA), ctx());
  assert.equal(p.cotizacion.lineas.length, 3);
  assert.equal(p.borradores[0].tipo, "aclaracion");
  assert.match(p.borradores[0].cuerpo, /cantidad de «4\. Tirafondos/);
  assert.doesNotMatch(p.borradores[0].cuerpo, PRECIO);
  assert.match(p.recuerdo, /Cliente que vuelve/);
});

test("a symptom in the email adds a field note, without unsourced limits", () => {
  const p = procesarCorreo(correo("rfq-3"), clientesEjemplo(AHORA), ctx());
  assert.equal(p.solicitud.diagnostico, "bombeo");
  assert.deepEqual(p.cotizacion.lineas.map((l) => [l.sku, l.cantidad]), [["GVC-VIA-003", 10], ["GVC-VIA-006", 6], ["GVC-VIA-001", 4]]);
  const { borrador } = aprobar(conPrecios(p.cotizacion, { entrega: "5 días hábiles", pago: "Contado" }), p.solicitud);
  assert.match(borrador.cuerpo, /bombeo/);
  assert.doesNotMatch(borrador.cuerpo, CIFRAS_VIA);
});

test("a lost quote keeps the reason, or the agent asks for it", () => {
  const base = marcarEnviada(cotizacionesEjemplo(AHORA).at(-1), AHORA);
  const r1 = procesarRespuesta(base, { ...correo("rfq-1"), id: "x", cuerpo: RESPUESTAS_EJEMPLO.precio }, AHORA);
  assert.deepEqual([r1.cotizacion.estado, r1.cotizacion.motivo, r1.borrador], ["perdida", "precio", null]);
  const r2 = procesarRespuesta(base, { ...correo("rfq-1"), id: "y", cuerpo: RESPUESTAS_EJEMPLO.sinMotivo }, AHORA);
  assert.equal(r2.borrador.tipo, "motivo");
  const r3 = procesarRespuesta(r2.cotizacion, { ...correo("rfq-1"), id: "z", cuerpo: "Fue por el tiempo de entrega, lo necesitábamos antes." }, AHORA);
  assert.equal(r3.cotizacion.motivo, "plazo");
  assert.equal(leerRespuesta(RESPUESTAS_EJEMPLO.otro).motivo, "ya-compro");
});

test("track symptoms are recognised", () => {
  assert.equal(diagnosticar("hay polvillo blanco sobre las traviesas")?.id, "bombeo");
  assert.equal(diagnosticar("los durmientes están bailando")?.id, "hamaca");
});

test("Geimar's approximate figures stay off until validated with a source", () => {
  assert.equal(CRITERIOS_VIA.validado, false);
  assert.doesNotMatch(decisionPorDesnivel(3), CIFRAS_VIA);
  const validos = { ...CRITERIOS_VIA, validado: true, fuente: "el reglamento del operador" };
  assert.match(decisionPorDesnivel(3, validos), /reglamento/);
});

test("the morning: follow-up drafts and reorder by wear, no prices", () => {
  const tareas = tareasDelDia(cotizacionesEjemplo(AHORA), clientesEjemplo(AHORA), AHORA);
  const tipos = tareas.map((t) => `${t.tipo}:${t.cliente.correo}`);
  assert.ok(tipos.includes("seguimiento:lortiz@mfcaribe.ejemplo"), tipos.join());
  assert.ok(tipos.includes("reposicion:c.restrepo@viasdelnorte.ejemplo"), tipos.join());
  assert.ok(!tipos.includes("reposicion:compras@patiocarbonero.ejemplo"), "bolts bought 3 months ago are not due");
  for (const t of tareas) {
    assert.match(t.borrador.cuerpo, /^Cordial saludo, /);
    assert.doesNotMatch(t.borrador.cuerpo, PRECIO);
  }
  const sinSeguimiento = tareasDelDia(cotizacionesEjemplo(AHORA), [], AHORA, ["C-0140"]);
  assert.deepEqual(sinSeguimiento, [], "an answered quote gets no follow-up");
});

test("dashboard: quoted, won, lost and why", () => {
  const t = calcularTablero(cotizacionesEjemplo(AHORA));
  assert.equal(t.cantidad.total, 12);
  assert.equal(t.cotizado, t.ganado + t.perdido + t.abierto);
  assert.equal(t.motivos[0].motivo, "precio");
});

test("the quote PDF is a real PDF with the brand fonts", async () => {
  const leer = (p) => readFileSync(new URL(`../public${p}`, import.meta.url));
  const bytes = await generarPdf(cotizacionesEjemplo(AHORA)[0], {
    poppins: leer("/agente/fuentes/Poppins-SemiBold.ttf"),
    montserrat: leer("/agente/fuentes/Montserrat-Regular.ttf"),
    montserratSemi: leer("/agente/fuentes/Montserrat-SemiBold.ttf"),
    logoBlanco: leer("/marca/gavicom-blanco.png"),
  });
  assert.equal(Buffer.from(bytes.slice(0, 5)).toString(), "%PDF-");
  assert.ok(bytes.length < 400_000, `${bytes.length} bytes`);
});

test("Microsoft 365: reads the inbox and only creates drafts", async () => {
  const { Buzon, aCorreo, adjuntoPdf } = await import("../src/lib/agente/microsoft.ts");
  const c = aCorreo({ id: "AAMk1", subject: "RFQ-1", from: { emailAddress: { name: "Ana", address: "ana@x.ejemplo" } }, receivedDateTime: "2026-11-08T12:00:00Z", body: { content: "Hola\r\n- Pala de drenaje: 6 und\r\n" } }, "gerencia@gavicom.com");
  assert.deepEqual([c.id, c.de.correo, c.cuerpo], ["AAMk1", "ana@x.ejemplo", "Hola\n- Pala de drenaje: 6 und"]);
  assert.equal(adjuntoPdf("a.pdf", new Uint8Array([37, 80, 68, 70])).contentBytes, "JVBERg==");

  const llamadas = [];
  const pedir = async (url, init) => {
    llamadas.push([init.method ?? "GET", url.replace(/\?.*/, "")]);
    if (url.includes("oauth2")) return Response.json({ access_token: "t", expires_in: 3600 });
    if (url.includes("/createReply")) return Response.json({ id: "BORRADOR1" });
    if (url.includes("/mailFolders/inbox/messages"))
      return Response.json({ value: [{ id: "m1", subject: "x", categories: [] }, { id: "m2", subject: "y", categories: ["Agente GAVICOM"] }] });
    return Response.json({ id: "ok" });
  };
  const buzon = new Buzon({ tenant: "t", cliente: "c", secreto: "s", buzon: "gerencia@gavicom.com" }, pedir);
  const nuevos = await buzon.nuevos(new Date("2026-11-06T00:00:00Z"));
  assert.deepEqual(nuevos.map((x) => x.id), ["m1"], "emails the agent already tagged are skipped");
  const id = await buzon.borradorRespuesta({ id: "b", tipo: "aclaracion", para: c.de, asunto: "RE", cuerpo: "Cordial saludo", enRespuestaA: "m1", porque: "" }, { nombre: "C.pdf", bytes: new Uint8Array([1]) });
  assert.equal(id, "BORRADOR1");
  // Never a send call: only token, list, draft reply and attachment.
  assert.ok(llamadas.every(([, url]) => !/\/send(Mail)?$|\/reply$|\/replyAll$|\/forward$/.test(url)), JSON.stringify(llamadas));
  assert.ok(llamadas.some(([m, url]) => m === "POST" && url.endsWith("/messages/BORRADOR1/attachments")));
});
