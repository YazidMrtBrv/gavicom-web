import { buscarReferencias, nombreDe, normalizar, rielEnTexto } from "./catalogo.ts";
import { calcularPedido, NOMBRE_RIEL, textoPedido } from "./pedido.ts";
import { aplicarPrecios, faltanPrecios, leerPrecios, pesos, totales } from "./precios.ts";
import type { Cliente, Cotizacion, Durmiente, LineaPedido, MotivoPerdida, Pedido, Riel, Salida } from "./tipos.ts";
import { decisionPorDesnivel, diagnosticar, pulgadasEnTexto } from "./via.ts";

// The conversation engine. Pure functions: state in, state and messages out.
// The same engine answers the in-app simulator and, once the number is
// connected, the real WhatsApp webhook.
//
// Two rules are built in, not left to a prompt:
//   1. The agent never writes a price. Prices only come from Geimar's reply.
//   2. Nothing reaches the client as a quote until Geimar taps "Aprobar".

export type Esperando =
  | null
  | "metros"
  | "riel"
  | "durmiente"
  | "confirmar-pedido"
  | "cantidad"
  | "nombre"
  | "ciudad"
  | "desnivel"
  | "decision"
  | "motivo"
  | "recompra";

export interface Conversacion {
  cliente: Cliente;
  esperando: Esperando;
  borrador: { metros?: number; riel?: Riel; durmiente?: Durmiente };
  pedido?: Pedido;
  // References picked one by one (from a photo, a voice note or a name).
  sueltas?: LineaPedido[];
  candidatos?: string[];
  cotizacion?: Cotizacion;
  // True once the agent greeted, so it does not say hello twice.
  saludado: boolean;
}

export interface Contexto {
  ahora: Date;
  numeroCotizacion: () => string;
  // Demo numbers on the PDF and the dashboard when true.
  ejemplo: boolean;
}

export interface Resultado {
  conversacion: Conversacion;
  salidas: Salida[];
}

export function nuevaConversacion(cliente: Cliente): Conversacion {
  return { cliente, esperando: null, borrador: {}, saludado: false };
}

const BOTONES_INICIO = ["Cotizar por metros de vía", "Tengo una falla en la vía", "Busco una pieza"];

const al = (texto: string, botones?: string[]): Salida => ({ para: "cliente", mensaje: { tipo: "texto", texto, botones } });
const aGeimar = (texto: string, botones?: string[]): Salida => ({ para: "geimar", mensaje: { tipo: "texto", texto, botones } });

function primerNombre(c: Cliente): string {
  return c.nombre.split(/\s+/).filter((p) => !/^(ing|ingeniero|ingeniera|sr|sra|dr)\.?$/i.test(p))[0] ?? "";
}

function conocido(c: Cliente): boolean {
  return Boolean(c.nombre && c.empresa && c.ciudad);
}

// ---- Reading what people write -------------------------------------------

export function metrosEnTexto(texto: string): number | null {
  const t = normalizar(texto);
  const km = t.match(/(\d+(?:[.,]\d+)?)\s*(km|kilometros?)\b/);
  if (km) return Math.round(Number(km[1].replace(",", ".")) * 1000);
  const m = t.match(/(\d{1,3}(?:\.\d{3})+|\d+)\s*(m|mts?|metros?|ml)\b/);
  if (m) return Number(m[1].replace(/\./g, ""));
  return null;
}

function rielDe(texto: string): Riel | null {
  const t = normalizar(texto);
  const r = rielEnTexto(t);
  if (r === "30") return "30kg";
  if (r) return r as Riel;
  if (/uic|136|132|141|otro/.test(t)) return "otro";
  return null;
}

function durmienteDe(texto: string): Durmiente | null {
  const t = normalizar(texto);
  if (/concreto|hormigon|cemento/.test(t)) return "concreto";
  if (/madera|palo/.test(t)) return "madera";
  return null;
}

const SI = /^(si|sí|dale|de una|listo|ok|okey|claro|hagale|hágale|va|correcto|cotiza|cotizame|cotízame)\b/;
const NO = /^(no|nada|ahora no|todavia no|después|despues)\b/;

export function motivoDe(texto: string): MotivoPerdida | null {
  const t = normalizar(texto);
  if (/caro|precio|costoso|presupuesto|mas barato|economico/.test(t)) return "precio";
  if (/tiempo|entrega|demora|tarda|plazo|urgente/.test(t)) return "plazo";
  if (/otro proveedor|ya compr|ya consegui|le compramos|ya lo tenemos/.test(t)) return "ya-compro";
  if (/aplaz|mas adelante|el otro ano|cancel|se cayo el proyecto|congelad/.test(t)) return "proyecto-aplazado";
  if (/otro motivo|otra razon/.test(t)) return "otro";
  return null;
}

const ACEPTA = /(lo apruebo|aprobad|aprobamos|lo compro|lo compramos|cerramos|mandeme la factura|facture|procedan|adelante con)/;

// ---- Steps -----------------------------------------------------------------

function saludo(conv: Conversacion): Salida[] {
  const c = conv.cliente;
  conv.saludado = true;
  if (conocido(c)) {
    const ultima = c.compras.at(-1);
    const recuerdo = ultima ? ` La última vez te despachamos ${nombreDe(ultima.sku).toLowerCase()} para ${ultima.tramo}.` : "";
    return [al(`¡Hola, ${primerNombre(c)}! Qué bueno leerte otra vez.${recuerdo} ¿En qué te ayudo hoy?`, BOTONES_INICIO)];
  }
  return [
    al(
      "¡Hola! Te habla el asistente de GAVICOM. Te ayudo a armar el pedido para tu tramo de vía, a identificar una pieza por foto o a ver qué hacer con una falla. Los precios te los da Geimar, nuestro gerente, directamente.",
      BOTONES_INICIO,
    ),
  ];
}

function pedirLoQueFalta(conv: Conversacion): Salida[] {
  const b = conv.borrador;
  if (!b.metros) {
    conv.esperando = "metros";
    return [al("¿Cuántos metros de vía son? (si es en kilómetros, también me sirve: \"1,2 km\")")];
  }
  if (!b.riel) {
    conv.esperando = "riel";
    return [al(`${b.metros.toLocaleString("es-CO")} m, listo. ¿De qué libraje es el riel?`, ["115 lb", "90 lb", "75 lb"])];
  }
  if (!b.durmiente) {
    conv.esperando = "durmiente";
    return [al("¿Y los durmientes son de concreto o de madera?", ["Concreto", "Madera"])];
  }
  const pedido = calcularPedido(b.metros, b.riel, b.durmiente);
  conv.pedido = pedido;
  conv.sueltas = undefined;
  conv.esperando = "confirmar-pedido";
  return [
    {
      para: "cliente",
      mensaje: { tipo: "pedido", texto: textoPedido(pedido), pedido, botones: ["Sí, cotízame esto", "Cambiar algo"] },
    },
  ];
}

function lineasACotizar(conv: Conversacion): LineaPedido[] {
  return conv.pedido?.lineas ?? conv.sueltas ?? [];
}

function origenDe(conv: Conversacion): string {
  if (conv.pedido) return `${conv.pedido.metros.toLocaleString("es-CO")} m de vía en ${NOMBRE_RIEL[conv.pedido.riel]}, durmiente de ${conv.pedido.durmiente}`;
  return "Referencias sueltas";
}

function crearCotizacion(conv: Conversacion, ctx: Contexto): Salida[] {
  const lineas = lineasACotizar(conv);
  const cot: Cotizacion = {
    numero: ctx.numeroCotizacion(),
    cliente: conv.cliente,
    lineas: lineas.map((l) => ({ ...l, precioUnitario: null })),
    estado: "esperando-precios",
    creada: ctx.ahora.toISOString(),
    origen: origenDe(conv),
    ejemplo: ctx.ejemplo,
  };
  conv.cotizacion = cot;
  conv.esperando = null;
  const c = conv.cliente;
  const filas = cot.lineas.map((l, i) => `${i + 1}. ${l.cantidad.toLocaleString("es-CO")} ${l.unidad} · ${l.nombre} (${l.sku})`);
  return [
    al(`Listo, ${primerNombre(c)}. Le pasé la cotización ${cot.numero} a Geimar para que le ponga los precios. Apenas la apruebe te llega aquí mismo en PDF.`),
    aGeimar(
      [
        `Cotización ${cot.numero} para ${c.nombre} · ${c.empresa} (${c.ciudad}).`,
        `Pidió: ${cot.origen}.`,
        "",
        ...filas,
        "",
        "Respóndeme el precio unitario de cada línea, así:",
        cot.lineas.length > 1 ? "1 85.000\n2 3.200\n…" : "1 85.000",
      ].join("\n"),
    ),
  ];
}

function confirmarCotizar(conv: Conversacion, ctx: Contexto): Salida[] {
  if (!conv.cliente.nombre) {
    conv.esperando = "nombre";
    return [al("¿A nombre de quién y de qué empresa va la cotización?")];
  }
  if (!conv.cliente.ciudad) {
    conv.esperando = "ciudad";
    return [al("¿En qué ciudad o en qué punto de la vía te la entregamos?")];
  }
  return crearCotizacion(conv, ctx);
}

function mostrarReferencias(conv: Conversacion, skus: string[], desde: string): Salida[] {
  conv.candidatos = skus;
  conv.esperando = "cantidad";
  const lista = skus.map((s) => `• ${nombreDe(s)} (${s})`).join("\n");
  const texto =
    skus.length === 1
      ? `${desde} es esta: ${nombreDe(skus[0])} (${skus[0]}). ¿Cuántas necesitas?`
      : `${desde} puede ser una de estas:\n${lista}\n\n¿Cuál es y cuántas necesitas? (por ejemplo: "200 de la primera")`;
  return [{ para: "cliente", mensaje: { tipo: "referencias", texto, skus } }];
}

function cerrar(conv: Conversacion, ctx: Contexto, ganada: boolean, motivo?: MotivoPerdida): Salida[] {
  const cot = conv.cotizacion;
  if (!cot) return [];
  cot.estado = ganada ? "ganada" : "perdida";
  cot.cerrada = ctx.ahora.toISOString();
  cot.motivo = ganada ? undefined : motivo;
  conv.esperando = null;
  if (ganada) {
    const total = totales(cot.lineas).total;
    return [
      al(`¡Gracias, ${primerNombre(conv.cliente)}! Quedó aprobada la ${cot.numero}. Geimar te escribe hoy para coordinar orden de compra y despacho.`),
      aGeimar(`✅ ${conv.cliente.empresa} aprobó la ${cot.numero} por ${pesos(total)}. Te toca coordinar la orden de compra y el despacho.`),
    ];
  }
  const respuesta: Record<MotivoPerdida, string> = {
    precio: "Entendido. Le paso a Geimar que el precio no te cuadró; si hay forma de ajustarlo, él te escribe.",
    plazo: "Entendido. Le cuento a Geimar lo del tiempo de entrega; si fabricamos aquí en Colombia a veces sale más rápido que importar, él te dice.",
    "ya-compro": "Listo, gracias por avisar. Aquí quedamos para la próxima.",
    "proyecto-aplazado": "Entendido. Cuando se reactive el proyecto, aquí quedó guardada la cotización para no empezar de cero.",
    "sin-respuesta": "",
    otro: "Gracias por contarme. Le paso la nota a Geimar.",
  };
  return [
    al(respuesta[motivo ?? "otro"]),
    aGeimar(`La ${cot.numero} de ${conv.cliente.empresa} no se cerró. Motivo: ${motivo ?? "otro"}.`),
  ];
}

// ---- Entry points ------------------------------------------------------------

export function deCliente(anterior: Conversacion, texto: string, ctx: Contexto): Resultado {
  const conv: Conversacion = structuredClone(anterior);
  conv.cliente.ultimoMensaje = ctx.ahora.toISOString();
  const t = normalizar(texto);
  const salidas: Salida[] = [];
  const fin = (s: Salida[]) => ({ conversacion: conv, salidas: [...salidas, ...s] });

  // 1. Answers to what the agent just asked.
  switch (conv.esperando) {
    case "metros": {
      const m = metrosEnTexto(texto) ?? (/^\d[\d.]*$/.test(t) ? Number(t.replace(/\./g, "")) : null);
      if (m) {
        conv.borrador.metros = m;
        const r = rielDe(texto);
        if (r) conv.borrador.riel = r;
        return fin(pedirLoQueFalta(conv));
      }
      break;
    }
    case "riel": {
      const r = rielDe(texto);
      if (r) {
        conv.borrador.riel = r;
        return fin(pedirLoQueFalta(conv));
      }
      break;
    }
    case "durmiente": {
      const d = durmienteDe(texto);
      if (d) {
        conv.borrador.durmiente = d;
        return fin(pedirLoQueFalta(conv));
      }
      break;
    }
    case "confirmar-pedido":
      if (SI.test(t)) return fin(confirmarCotizar(conv, ctx));
      if (/cambiar|ajust|modific/.test(t)) {
        conv.borrador = {};
        conv.pedido = undefined;
        conv.esperando = "metros";
        return fin([al("Dale, empecemos de nuevo. ¿Cuántos metros son?")]);
      }
      if (/agregar|otra pieza|algo mas/.test(t)) {
        conv.esperando = null;
        return fin([al("¿Qué otra pieza? Dime el nombre o mándame la foto.")]);
      }
      break;
    case "cantidad": {
      const n = t.match(/(\d[\d.]*)/);
      if (n && conv.candidatos?.length) {
        const ordinal = /segund/.test(t) ? 1 : /tercer/.test(t) ? 2 : /cuart/.test(t) ? 3 : 0;
        const nombrada = buscarReferencias(texto).find((s) => conv.candidatos!.includes(s));
        const sku = nombrada ?? conv.candidatos[Math.min(ordinal, conv.candidatos.length - 1)];
        const cantidad = Number(n[1].replace(/\./g, ""));
        conv.sueltas = [...(conv.sueltas ?? []), { sku, nombre: nombreDe(sku), cantidad, unidad: "und", porque: "Cantidad que pidió el cliente" }];
        conv.pedido = undefined;
        conv.candidatos = undefined;
        conv.esperando = "confirmar-pedido";
        return fin([al(`Anotado: ${cantidad.toLocaleString("es-CO")} × ${nombreDe(sku)}. ¿Te lo cotizo así o agregas algo más?`, ["Sí, cotízame esto", "Agregar otra pieza"])]);
      }
      break;
    }
    case "nombre": {
      const partes = texto.split(/,| de la empresa | de | - /i).map((s) => s.trim()).filter(Boolean);
      conv.cliente.nombre = partes[0] ?? texto.trim();
      conv.cliente.empresa = partes[1] ?? conv.cliente.empresa ?? "";
      return fin(confirmarCotizar(conv, ctx));
    }
    case "ciudad":
      conv.cliente.ciudad = texto.trim();
      return fin(crearCotizacion(conv, ctx));
    case "desnivel": {
      const p = pulgadasEnTexto(texto) ?? (/^\d+([.,]\d+)?$/.test(t) ? Number(t.replace(",", ".")) : null);
      if (p != null) {
        conv.esperando = null;
        return fin([al(decisionPorDesnivel(p) + "\n\n¿Quieres que te arme el pedido de material y herramienta para ese tramo?", ["Cotizar por metros de vía", "Hablar con Geimar"])]);
      }
      break;
    }
    case "decision":
      if (ACEPTA.test(t) || /^(la apruebo|si|sí|dale|de una)\b/.test(t)) return fin(cerrar(conv, ctx, true));
      if (/no por ahora|^no\b|todavia no/.test(t)) {
        const m = motivoDe(texto);
        if (m) return fin(cerrar(conv, ctx, false, m));
        conv.esperando = "motivo";
        return fin([al("Listo, sin problema. Para mejorar: ¿qué fue lo que no te cuadró?", ["Precio", "Tiempo de entrega", "Otro motivo"])]);
      }
      if (/duda|pregunta/.test(t)) {
        conv.esperando = "decision";
        return fin([al("Claro. Escríbeme la duda y se la paso a Geimar tal cual; él te responde por aquí."), aGeimar(`${conv.cliente.nombre} tiene dudas sobre la ${conv.cotizacion?.numero}. Escríbele.`)]);
      }
      break;
    case "motivo":
      return fin(cerrar(conv, ctx, false, motivoDe(texto) ?? "otro"));
    case "recompra":
      if (SI.test(t) || /igual/.test(t)) {
        const ultima = conv.cliente.compras.at(-1);
        if (ultima) {
          conv.sueltas = [{ sku: ultima.sku, nombre: nombreDe(ultima.sku), cantidad: ultima.cantidad, unidad: "und", porque: `Igual a la compra anterior para ${ultima.tramo}` }];
          conv.pedido = undefined;
          return fin(confirmarCotizar(conv, ctx));
        }
      }
      if (/cambia|cantidad/.test(t)) {
        conv.candidatos = [conv.cliente.compras.at(-1)?.sku].filter(Boolean) as string[];
        conv.esperando = "cantidad";
        return fin([al("¿Cuántas necesitas esta vez?")]);
      }
      if (NO.test(t)) {
        conv.esperando = null;
        return fin([al("Listo, entonces te escribo más adelante. Si se adelanta, aquí estoy.")]);
      }
      break;
  }

  // 2. A decision on a quote can come without the agent asking.
  if (conv.cotizacion?.estado === "enviada") {
    if (ACEPTA.test(t)) return fin(cerrar(conv, ctx, true));
    const m = motivoDe(texto);
    if (m && /no|caro|otro|aplaz|cancel|demora/.test(t)) return fin(cerrar(conv, ctx, false, m));
  }

  // 3. A symptom on the track: answer like a track engineer.
  const d = diagnosticar(texto);
  if (d) {
    conv.esperando = d.id === "hamaca" ? "desnivel" : null;
    const piezas = d.skus.map((s) => `• ${nombreDe(s)}`).join("\n");
    const out: Salida[] = [
      al(`${d.titulo}. ${d.explicacion}\n\n${d.queHacer}`),
      { para: "cliente", mensaje: { tipo: "referencias", texto: `De lo que tenemos, esto sirve para ese trabajo:\n${piezas}`, skus: d.skus } },
    ];
    if (d.pregunta) out.push(al(d.pregunta));
    if (!conv.saludado) conv.saludado = true;
    return fin(out);
  }

  // 4. An order by length of track.
  const metros = metrosEnTexto(texto);
  if (metros || /metros de via|por metros|tramo|kilometro/.test(t)) {
    conv.borrador = { metros: metros ?? undefined, riel: rielDe(texto) ?? undefined, durmiente: durmienteDe(texto) ?? undefined };
    conv.saludado = true;
    return fin(pedirLoQueFalta(conv));
  }

  // 5. Prices: never from the agent.
  if (/cuanto (vale|cuesta|sale)|precio|valor/.test(t)) {
    conv.saludado = true;
    return fin([al("Los precios te los da Geimar directamente, según cantidad y lugar de entrega. Si me dices qué necesitas, armo la cotización y él le pone los precios hoy mismo.", BOTONES_INICIO)]);
  }

  // 6. Pieces by name.
  const refs = buscarReferencias(texto);
  if (refs.length) {
    conv.saludado = true;
    return fin(mostrarReferencias(conv, refs.slice(0, 4), "Lo que buscas"));
  }

  // 7. Menu choices.
  if (/falla|problema|dano/.test(t)) return fin([al("Cuéntame qué estás viendo en la vía: ¿durmientes que bailan, polvillo blanco sobre las traviesas, juntas que golpean, clips que se salen?")]);
  if (/pieza|busco|foto/.test(t)) return fin([al("Mándame una foto de la pieza o dime cómo la llaman en obra, y te digo la referencia exacta.")]);
  if (/hablar con geimar|asesor|humano|persona/.test(t)) return fin([al("Ya le aviso a Geimar para que te escriba."), aGeimar(`${conv.cliente.nombre || "Un cliente nuevo"} quiere hablar contigo.`)]);

  if (!conv.saludado || /^(hola|buen|buenas|saludos|que mas|q mas)/.test(t)) return fin(saludo(conv));

  return fin([al("No te entendí bien, perdona. ¿Me lo dices de otra forma o escoges una de estas?", BOTONES_INICIO)]);
}

// A photo or voice note already turned into references (ia.ts or the
// browser's dictation) enters here.
export function referenciasIdentificadas(anterior: Conversacion, skus: string[], desde: string): Resultado {
  const conv: Conversacion = structuredClone(anterior);
  conv.saludado = true;
  if (!skus.length)
    return { conversacion: conv, salidas: [al("No logré reconocer la pieza en la foto. ¿Me mandas otra con más luz, o me dices el nombre que le dan en obra?")] };
  return { conversacion: conv, salidas: mostrarReferencias(conv, skus, desde) };
}

// Geimar answers the prices on his own WhatsApp.
export function deGeimar(anterior: Conversacion, texto: string): Resultado {
  const conv: Conversacion = structuredClone(anterior);
  const cot = conv.cotizacion;
  if (!cot || (cot.estado !== "esperando-precios" && cot.estado !== "por-aprobar"))
    return { conversacion: conv, salidas: [aGeimar("No tengo ninguna cotización esperando precios ahora mismo.")] };
  cot.lineas = aplicarPrecios(cot.lineas, leerPrecios(texto, cot.lineas.length));
  const faltan = faltanPrecios(cot.lineas);
  if (faltan.length)
    return { conversacion: conv, salidas: [aGeimar(`Me faltan los precios de ${faltan.length === 1 ? "la línea" : "las líneas"} ${faltan.join(", ")}. Mándamelos con el número de la línea adelante.`)] };
  cot.estado = "por-aprobar";
  const t = totales(cot.lineas);
  return {
    conversacion: conv,
    salidas: [
      {
        para: "geimar",
        mensaje: { tipo: "documento", texto: `Armé la ${cot.numero}: ${pesos(t.total)} con IVA. Revísala y, si está bien, apruébala y se la mando a ${primerNombre(cot.cliente)}.`, cotizacion: cot.numero },
      },
      aGeimar("¿La envío?", ["Aprobar y enviar", "Corregir precios"]),
    ],
  };
}

export function aprobar(anterior: Conversacion, ctx: Contexto): Resultado {
  const conv: Conversacion = structuredClone(anterior);
  const cot = conv.cotizacion;
  if (!cot || cot.estado !== "por-aprobar") return { conversacion: conv, salidas: [] };
  cot.estado = "enviada";
  cot.enviada = ctx.ahora.toISOString();
  conv.esperando = "decision";
  return {
    conversacion: conv,
    salidas: [
      { para: "cliente", mensaje: { tipo: "documento", texto: `Cotización ${cot.numero} · GAVICOM`, cotizacion: cot.numero } },
      al(`${primerNombre(cot.cliente)}, aquí está tu cotización aprobada por Geimar. ¿Cómo la ves?`, ["La apruebo", "Tengo dudas", "No por ahora"]),
      aGeimar(`Enviada a ${cot.cliente.nombre}. Si no contesta en 2 días le escribo yo.`),
    ],
  };
}
