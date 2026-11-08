// The WhatsApp agent's rules, tested without a browser or a build: the
// engine files are plain TypeScript that Node runs directly.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buscarReferencias, porSku } from "../src/lib/agente/catalogo.ts";
import { calcularPedido } from "../src/lib/agente/pedido.ts";
import { leerPrecios, totales } from "../src/lib/agente/precios.ts";
import { aprobar, deCliente, deGeimar, nuevaConversacion, referenciasIdentificadas } from "../src/lib/agente/motor.ts";
import { tareasDelDia, rellenar } from "../src/lib/agente/seguimiento.ts";
import { calcularTablero } from "../src/lib/agente/tablero.ts";
import { clienteNuevo, clientesEjemplo, cotizacionesEjemplo, respuestaPreciosEjemplo } from "../src/lib/agente/ejemplo.ts";
import { diagnosticar, decisionPorDesnivel, CRITERIOS_VIA } from "../src/lib/agente/via.ts";
import { generarPdf } from "../src/lib/agente/pdf.ts";
import { firmaValida, leerEntrantes } from "../src/lib/agente/whatsapp-cloud.ts";

const AHORA = new Date("2026-11-08T13:00:00Z");
let n = 200;
const ctx = () => ({ ahora: AHORA, numeroCotizacion: () => `C-0${n++}`, ejemplo: true });
const textos = (r, para) => r.salidas.filter((s) => s.para === para).map((s) => s.mensaje.texto).join("\n");

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
  assert.deepEqual(leerPrecios("1 85.000\n2: 3200\n3 12 mil", 3), [85000, 3200, 12000]);
  assert.deepEqual(leerPrecios("1: 1.250.000, 2: 9800", 3), [1250000, 9800, null]);
  assert.deepEqual(totales([{ cantidad: 2, precioUnitario: 100000 }]), { subtotal: 200000, iva: 38000, total: 238000 });
});

test("full conversation: metres → order → Geimar prices → approval → won", () => {
  let conv = nuevaConversacion(clienteNuevo());
  let r = deCliente(conv, "Buenas, necesito material para 300 metros de vía", ctx());
  assert.match(textos(r, "cliente"), /libraje/);
  r = deCliente(r.conversacion, "115 lb", ctx());
  r = deCliente(r.conversacion, "Concreto", ctx());
  assert.equal(r.salidas[0].mensaje.tipo, "pedido");
  r = deCliente(r.conversacion, "Sí, cotízame esto", ctx());
  assert.match(textos(r, "cliente"), /nombre/);
  r = deCliente(r.conversacion, "Camila Restrepo, Vías del Norte", ctx());
  r = deCliente(r.conversacion, "Ciénaga", ctx());
  const cot = r.conversacion.cotizacion;
  assert.equal(cot.estado, "esperando-precios");
  assert.equal(cot.cliente.empresa, "Vías del Norte");
  assert.match(textos(r, "geimar"), /precio unitario/);
  // The agent never writes a price to the client on its own.
  assert.doesNotMatch(textos(r, "cliente"), /\$\s?\d/);

  r = deGeimar(r.conversacion, "1 185.000");
  assert.match(textos(r, "geimar"), /faltan/);
  r = deGeimar(r.conversacion, respuestaPreciosEjemplo(cot.lineas.map((l) => l.sku)));
  assert.equal(r.conversacion.cotizacion.estado, "por-aprobar");
  assert.equal(r.salidas.filter((s) => s.para === "cliente").length, 0, "nothing reaches the client before Geimar approves");

  r = aprobar(r.conversacion, ctx());
  assert.equal(r.salidas[0].mensaje.tipo, "documento");
  r = deCliente(r.conversacion, "La apruebo", ctx());
  assert.equal(r.conversacion.cotizacion.estado, "ganada");
});

test("a lost quote keeps the reason", () => {
  let r = deCliente(nuevaConversacion(clientesEjemplo(AHORA)[0]), "eclisas de 115", ctx());
  r = deCliente(r.conversacion, "200", ctx());
  r = deCliente(r.conversacion, "sí", ctx());
  r = deGeimar(r.conversacion, "1 185000");
  r = aprobar(r.conversacion, ctx());
  r = deCliente(r.conversacion, "No por ahora", ctx());
  assert.match(textos(r, "cliente"), /no te cuadró/);
  r = deCliente(r.conversacion, "Precio", ctx());
  assert.equal(r.conversacion.cotizacion.motivo, "precio");
});

test("price questions go to Geimar, never answered by the agent", () => {
  const r = deCliente(nuevaConversacion(clienteNuevo()), "¿cuánto vale el clip?", ctx());
  assert.match(textos(r, "cliente"), /Geimar/);
  assert.doesNotMatch(textos(r, "cliente"), /\$\s?\d/);
});

test("returning client is recognised by what they bought", () => {
  const r = deCliente(nuevaConversacion(clientesEjemplo(AHORA)[0]), "hola", ctx());
  assert.match(textos(r, "cliente"), /Camila.*km 12/s);
});

test("track symptoms get Geimar's field answer, without unsourced limits", () => {
  assert.equal(diagnosticar("hay polvillo blanco sobre las traviesas")?.id, "bombeo");
  assert.equal(diagnosticar("los durmientes están bailando")?.id, "hamaca");
  let r = deCliente(nuevaConversacion(clienteNuevo()), "los durmientes me están bailando", ctx());
  assert.match(textos(r, "cliente"), /hamaca/);
  r = deCliente(r.conversacion, "como 3 pulgadas", ctx());
  assert.match(textos(r, "geimar"), /3" de desnivel/);
  assert.match(textos(r, "cliente"), /Geimar/);
});

test("Geimar's approximate figures never reach a client while unvalidated", () => {
  assert.equal(CRITERIOS_VIA.validado, false);
  const cifras = /2[.,]5|15 km|\b30 cm|\b15 cm|400\.000|5"|\b5 pulgadas/;
  const frases = ["hay polvillo blanco", "los durmientes están bailando", "eclisa rota", "se salen los clips", "tirafondo flojo"];
  for (const f of frases) {
    let r = deCliente(nuevaConversacion(clienteNuevo()), f, ctx());
    assert.doesNotMatch(textos(r, "cliente"), cifras, f);
    for (const medida of ["2 pulgadas", "3 pulgadas", "6 pulgadas"]) {
      const r2 = deCliente(r.conversacion, medida, ctx());
      assert.doesNotMatch(textos(r2, "cliente"), cifras, `${f} → ${medida}`);
    }
  }
  // Once someone fills the source and validates, the limits apply and cite it.
  const validos = { ...CRITERIOS_VIA, validado: true, fuente: "el reglamento del operador" };
  assert.match(decisionPorDesnivel(3, validos), /15 km\/h.*reglamento|reglamento.*15 km\/h/);
  assert.match(decisionPorDesnivel(6, validos), /intervención/);
});

test("a photo's references enter the same flow", () => {
  const r = referenciasIdentificadas(nuevaConversacion(clienteNuevo()), ["GVC-AK-EA75"], "La pieza de la foto");
  assert.match(textos(r, "cliente"), /Eclisa Angular/);
  assert.equal(r.conversacion.esperando, "cantidad");
});

test("the morning: follow-up on the silent quote and reorder by wear", () => {
  const tareas = tareasDelDia(cotizacionesEjemplo(AHORA), clientesEjemplo(AHORA), AHORA);
  const tipos = tareas.map((t) => `${t.tipo}:${t.cliente.telefono}`);
  assert.ok(tipos.includes("seguimiento:+573000000013"), tipos.join());
  assert.ok(tipos.includes("reposicion:+573000000011"), tipos.join());
  assert.ok(!tipos.includes("reposicion:+573000000012"), "bolts bought 3 months ago are not due");
  const t = tareas.find((x) => x.tipo === "reposicion");
  assert.match(rellenar(t.plantilla, t.variables), /Camila.*clip/s);
});

test("dashboard: quoted, won, lost and why", () => {
  const t = calcularTablero(cotizacionesEjemplo(AHORA));
  assert.equal(t.cantidad.total, 12);
  assert.equal(t.cotizado, t.ganado + t.perdido + t.abierto);
  assert.equal(t.motivos[0].motivo, "precio");
});

test("the quote PDF is a real PDF with the brand fonts", async () => {
  const leer = (p) => readFileSync(new URL(`../public${p}`, import.meta.url));
  const conv = cotizacionesEjemplo(AHORA)[0];
  const bytes = await generarPdf(conv, {
    poppins: leer("/agente/fuentes/Poppins-SemiBold.ttf"),
    montserrat: leer("/agente/fuentes/Montserrat-Regular.ttf"),
    montserratSemi: leer("/agente/fuentes/Montserrat-SemiBold.ttf"),
    logoBlanco: leer("/marca/gavicom-blanco.png"),
  });
  assert.equal(Buffer.from(bytes.slice(0, 5)).toString(), "%PDF-");
  assert.ok(bytes.length < 400_000, `${bytes.length} bytes`);
});

test("webhook: signature and incoming messages", async () => {
  const cuerpo = JSON.stringify({
    entry: [{ changes: [{ value: { contacts: [{ wa_id: "573000000011", profile: { name: "Camila" } }], messages: [{ from: "573000000011", id: "wamid.1", type: "text", text: { body: "hola" } }, { from: "573000000011", id: "wamid.2", type: "interactive", interactive: { type: "button_reply", button_reply: { id: "b1", title: "La apruebo" } } }] } }] }],
  });
  const { createHmac } = await import("node:crypto");
  const firma = "sha256=" + createHmac("sha256", "secreto").update(cuerpo).digest("hex");
  assert.equal(await firmaValida(cuerpo, firma, "secreto"), true);
  assert.equal(await firmaValida(cuerpo, firma, "otro"), false);
  const e = leerEntrantes(JSON.parse(cuerpo));
  assert.deepEqual(e.map((m) => m.texto), ["hola", "La apruebo"]);
  assert.equal(e[0].nombre, "Camila");
});
