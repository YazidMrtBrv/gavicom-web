import { COMPANIA_INFO } from "../../constants/productos.ts";
import { nombreDe, normalizar } from "./catalogo.ts";
import { NOMBRE_RIEL } from "./pedido.ts";
import { CONFIG, pesos, totales } from "./precios.ts";
import type { Borrador, Cliente, Compra, Cotizacion, MotivoPerdida, Solicitud } from "./tipos.ts";

// The emails the agent writes. GAVICOM's clients are formal companies, so
// every draft is formal Colombian business Spanish, signed by Geimar, and
// stays a DRAFT: Geimar reads it and presses send himself.
//
// The greeting uses the person's full name ("Cordial saludo, Camila
// Restrepo:") so the agent never has to guess "Estimado" or "Estimada".

export const FIRMA = [
  "Cordialmente,",
  "",
  COMPANIA_INFO.gerente,
  COMPANIA_INFO.cargo,
  COMPANIA_INFO.nombre,
  `${COMPANIA_INFO.email} · ${COMPANIA_INFO.whatsappSales.replace(/^\+57(\d{3})(\d{3})(\d{4})$/, "+57 $1 $2 $3")}`,
  `${COMPANIA_INFO.ciudad}, ${COMPANIA_INFO.departamento}`,
].join("\n");

function saludo(nombre: string): string {
  return nombre ? `Cordial saludo, ${nombre}:` : "Cordial saludo:";
}

function fecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Bogota" });
}

function re(asunto: string): string {
  return /^re:/i.test(asunto) ? asunto : `RE: ${asunto}`;
}

// Formal version of each field diagnosis (via.ts), for a client email. No
// technical limits: those only appear once they have a cited standard.
const NOTA_TECNICA: Record<string, string> = {
  bombeo:
    "el polvillo blanco sobre las traviesas suele indicar bombeo: el balasto se está moliendo y hay agua o finos subiendo desde la base. Antes de intervenir conviene identificar en qué capa está la falla; si es la base, la solución de fondo es un saneamiento de plataforma, y separar el balasto de la tierra con geotextil ayuda a que el lodo no vuelva a subir.",
  hamaca:
    "los durmientes que se mueven al paso del tren suelen indicar asentamiento diferencial de la base. Recomendamos medir el desnivel y contrastarlo con el reglamento de mantenimiento de la vía; la solución de fondo suele ser sanear la plataforma, no solo volver a calzar.",
  junta: "una junta que golpea desgasta la eclisa y los pernos y afecta los durmientes vecinos; conviene cambiar el par de eclisas con pernos nuevos y revisar el apoyo de los durmientes de la junta.",
  clips: "cuando los clips se sueltan el riel pierde presión contra el durmiente; además de reponerlos, conviene revisar las almohadillas, porque una almohadilla gastada deja holgura.",
  tirafondos: "si la madera ya no sujeta el tirafondo, conviene cambiar el durmiente o reperforar a un lado e instalar tirafondo nuevo.",
};

let serie = 0;
const id = (tipo: string) => `${tipo}-${Date.now().toString(36)}-${(serie++).toString(36)}`;

export function borradorCotizacion(cot: Cotizacion, sol?: Solicitud): Borrador {
  const t = totales(cot.lineas);
  const ref = cot.referenciaCliente ? ` ${cot.referenciaCliente}` : "";
  const cuando = sol ? ` del ${fecha(sol.correo.fecha)}` : "";
  const tecnica = sol?.diagnostico ? NOTA_TECNICA[sol.diagnostico] : undefined;
  const porMetros = sol?.pedidoPorMetros
    ? `Las cantidades se calcularon para ${sol.pedidoPorMetros.metros.toLocaleString("es-CO")} m de vía sencilla en riel de ${NOMBRE_RIEL[sol.pedidoPorMetros.riel]} sobre durmiente de ${sol.pedidoPorMetros.durmiente}; le agradecemos confirmarlas con su diseño antes de emitir la orden de compra.`
    : "";
  const cuerpo = [
    saludo(cot.cliente.nombre),
    "",
    `En atención a su solicitud${ref}${cuando}, adjuntamos la cotización ${cot.numero} por un valor total de ${pesos(t.total)}, IVA incluido, con validez de ${CONFIG.validezDias} días.`,
    "",
    "Condiciones:",
    `• Tiempo de entrega: ${cot.condiciones.entrega}`,
    `• Lugar de entrega: ${cot.cliente.ciudad || "por confirmar"}`,
    `• Forma de pago: ${cot.condiciones.pago}`,
    ...(porMetros ? ["", porMetros] : []),
    ...(tecnica ? ["", `Sobre lo que nos comenta de la vía: ${tecnica} Con gusto le acompañamos en el diagnóstico del tramo.`] : []),
    "",
    "Quedamos atentos a sus comentarios.",
    "",
    FIRMA,
  ].join("\n");
  return {
    id: id("cot"),
    tipo: "cotizacion",
    para: { nombre: cot.cliente.nombre, correo: cot.cliente.correo },
    asunto: sol ? re(sol.correo.asunto) : `Cotización ${cot.numero} · GAVICOM`,
    cuerpo,
    adjunto: cot.numero,
    enRespuestaA: sol?.correo.id,
    porque: `Respuesta a la solicitud${ref || ` de ${cot.cliente.empresa}`} con la cotización ${cot.numero}.`,
  };
}

// When the email leaves something open, the agent asks before quoting it,
// and says what it will quote meanwhile.
export function borradorAclaracion(sol: Solicitud, cotizaParcial: boolean): Borrador {
  const preguntas = sol.faltantes.map((f, i) => `${i + 1}. ${f.charAt(0).toUpperCase()}${f.slice(1)}.`);
  const cuerpo = [
    saludo(sol.contacto),
    "",
    `Gracias por tener en cuenta a GAVICOM${sol.referenciaCliente ? ` para la solicitud ${sol.referenciaCliente}` : ""}. Para cotizarle con precisión, ¿nos ayuda a confirmar lo siguiente?`,
    "",
    ...preguntas,
    "",
    cotizaParcial ? "Mientras tanto, le enviaremos la cotización de las referencias que ya están claras." : "Con esta información le enviamos la cotización el mismo día.",
    "",
    FIRMA,
  ].join("\n");
  return {
    id: id("acl"),
    tipo: "aclaracion",
    para: sol.correo.de,
    asunto: re(sol.correo.asunto),
    cuerpo,
    enRespuestaA: sol.correo.id,
    porque: `Al correo le faltan ${sol.faltantes.length} dato${sol.faltantes.length === 1 ? "" : "s"} para cotizar sin adivinar.`,
  };
}

export function borradorSeguimiento(cot: Cotizacion, dias: number): Borrador {
  const cuerpo = [
    saludo(cot.cliente.nombre),
    "",
    `Le escribimos para saber si tuvo la oportunidad de revisar la cotización ${cot.numero}${cot.referenciaCliente ? ` (solicitud ${cot.referenciaCliente})` : ""} que le enviamos el ${fecha(cot.enviada ?? cot.creada)}.`,
    "",
    "Si tiene alguna observación sobre cantidades, tiempos de entrega o condiciones, con gusto la revisamos. La cotización sigue vigente.",
    "",
    FIRMA,
  ].join("\n");
  return {
    id: id("seg"),
    tipo: "seguimiento",
    para: { nombre: cot.cliente.nombre, correo: cot.cliente.correo },
    asunto: `Seguimiento cotización ${cot.numero} · GAVICOM`,
    cuerpo,
    adjunto: cot.numero,
    porque: `Le enviamos la ${cot.numero} hace ${dias} días y no ha respondido.`,
  };
}

export function borradorReposicion(cliente: Cliente, compra: Compra, faltanDias: number): Borrador {
  const pieza = nombreDe(compra.sku);
  const cuerpo = [
    saludo(cliente.nombre),
    "",
    `El ${fecha(compra.fecha)} le suministramos ${compra.cantidad.toLocaleString("es-CO")} unidades de ${pieza} (${compra.sku}) para ${compra.tramo}. Por el desgaste habitual de esa referencia, es probable que en las próximas semanas necesite reponer.`,
    "",
    "Si le sirve, le preparamos una cotización con las mismas cantidades, o con las que nos indique, para que el material llegue antes de que haga falta en la vía.",
    "",
    FIRMA,
  ].join("\n");
  return {
    id: id("rep"),
    tipo: "reposicion",
    para: { nombre: cliente.nombre, correo: cliente.correo },
    asunto: `Reposición de ${pieza.toLowerCase()} para ${compra.tramo}`,
    cuerpo,
    porque:
      faltanDias > 0
        ? `Compró ${compra.cantidad.toLocaleString("es-CO")} de ${pieza.toLowerCase()} para ${compra.tramo}; según el desgaste le toca reponer en unos ${faltanDias} días.`
        : `Compró ${compra.cantidad.toLocaleString("es-CO")} de ${pieza.toLowerCase()} para ${compra.tramo}; ya debió reponer hace ${-faltanDias} días.`,
  };
}

export function borradorAgradecimiento(cot: Cotizacion, asunto: string, enRespuestaA?: string): Borrador {
  return {
    id: id("gra"),
    tipo: "agradecimiento",
    para: { nombre: cot.cliente.nombre, correo: cot.cliente.correo },
    asunto: re(asunto),
    cuerpo: [
      saludo(cot.cliente.nombre),
      "",
      `Muchas gracias por la aprobación de la cotización ${cot.numero}. Quedamos atentos a la orden de compra para programar el despacho a ${cot.cliente.ciudad || "su obra"}.`,
      "",
      FIRMA,
    ].join("\n"),
    enRespuestaA,
    porque: `${cot.cliente.empresa} aprobó la ${cot.numero}.`,
  };
}

// A "no" without a reason: one polite question, so the dashboard learns why.
export function borradorMotivo(cot: Cotizacion, asunto: string, enRespuestaA?: string): Borrador {
  return {
    id: id("mot"),
    tipo: "motivo",
    para: { nombre: cot.cliente.nombre, correo: cot.cliente.correo },
    asunto: re(asunto),
    cuerpo: [
      saludo(cot.cliente.nombre),
      "",
      `Gracias por su respuesta sobre la cotización ${cot.numero}. Para mejorar nuestras propuestas, ¿nos podría contar qué fue lo que no se ajustó: el precio, el tiempo de entrega u otro aspecto?`,
      "",
      FIRMA,
    ].join("\n"),
    enRespuestaA,
    porque: `${cot.cliente.empresa} no aceptó la ${cot.numero} y no dijo por qué.`,
  };
}

// ---- Reading the client's answer ----------------------------------------

export function motivoDe(texto: string): MotivoPerdida | null {
  const t = normalizar(texto);
  if (/caro|precio|costoso|presupuesto|mas barato|economic|por encima/.test(t)) return "precio";
  if (/tiempo de entrega|entrega|demora|tarda|plazo|urgente|no alcanz/.test(t)) return "plazo";
  if (/otro proveedor|ya compr|ya conseguimos|adjudic|le compramos|ya lo tenemos/.test(t)) return "ya-compro";
  if (/aplaz|mas adelante|proximo ano|el otro ano|cancel|suspend|congelad|se cayo el proyecto/.test(t)) return "proyecto-aplazado";
  return null;
}

export type Respuesta = { tipo: "aprobada" } | { tipo: "perdida"; motivo: MotivoPerdida | null } | { tipo: "otra" };

export function leerRespuesta(texto: string): Respuesta {
  const t = normalizar(texto);
  if (/(aprobad|aprobamos|aceptamos|adjunto (la )?orden de compra|enviamos (la )?orden|procedan|adelante con|confirmamos el pedido)/.test(t)) return { tipo: "aprobada" };
  if (/(no (vamos a|podemos|continuaremos|seguiremos)|no fue aprobad|declinamos|desistimos|no es posible|no procede|otro proveedor|adjudic|aplaz|cancel|suspend)/.test(t)) return { tipo: "perdida", motivo: motivoDe(texto) };
  return { tipo: "otra" };
}
