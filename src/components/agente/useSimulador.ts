"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { aprobar, deCliente, deGeimar, nuevaConversacion, referenciasIdentificadas, type Contexto, type Conversacion, type Resultado } from "@/lib/agente/motor";
import { clienteNuevo, clientesEjemplo, cotizacionesEjemplo, respuestaPreciosEjemplo } from "@/lib/agente/ejemplo";
import { PLANTILLAS, rellenar, tareasDelDia, type Tarea } from "@/lib/agente/seguimiento";
import { generarPdf, RUTAS_RECURSOS, type Recursos } from "@/lib/agente/pdf";
import type { Cliente, Cotizacion, Salida } from "@/lib/agente/tipos";

// Everything the demo needs, driving the same engine the webhook uses. The
// two phones are two views of one conversation: what the client sees and
// what Geimar sees.

export type Lado = "cliente" | "geimar";

export interface Burbuja {
  id: number;
  mio: boolean;
  aviso?: boolean;
  tipo: "texto" | "documento" | "imagen" | "voz" | "referencias";
  texto: string;
  botones?: string[];
  botonUsado?: string;
  skus?: string[];
  cotizacion?: string;
  imagen?: string;
  plantilla?: string;
  // Day separator shown above the bubble ("Hace 2 días").
  dia?: string;
  hora: string;
}

export interface Estado {
  ia: boolean;
  whatsapp: boolean;
}

const NUEVO = clienteNuevo().telefono;

function horaTexto(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
}

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

let recursosPromesa: Promise<Recursos> | null = null;
function cargarRecursos(): Promise<Recursos> {
  recursosPromesa ??= (async () => {
    const leer = async (ruta: string) => (await fetch(ruta)).arrayBuffer();
    const [poppins, montserrat, montserratSemi, logoBlanco] = await Promise.all([
      leer(RUTAS_RECURSOS.poppins),
      leer(RUTAS_RECURSOS.montserrat),
      leer(RUTAS_RECURSOS.montserratSemi),
      leer(RUTAS_RECURSOS.logoBlanco),
    ]);
    return { poppins, montserrat, montserratSemi, logoBlanco };
  })();
  return recursosPromesa;
}

export function useSimulador() {
  // "Now" is fixed at mount so the demo data and the morning agree.
  const [ahora] = useState(() => new Date());
  const clientesBase = useMemo(() => [...clientesEjemplo(ahora), clienteNuevo()], [ahora]);
  const [clientes, setClientes] = useState<Cliente[]>(clientesBase);
  const [conversaciones, setConversaciones] = useState<Record<string, Conversacion>>(() =>
    Object.fromEntries(clientesBase.map((c) => [c.telefono, nuevaConversacion(c)])),
  );
  const [cotizaciones, setCotizaciones] = useState<Record<string, Cotizacion>>(() =>
    Object.fromEntries(cotizacionesEjemplo(ahora).map((c) => [c.numero, c])),
  );
  const tareas = useMemo<Tarea[]>(() => tareasDelDia(cotizacionesEjemplo(ahora), clientesEjemplo(ahora), ahora), [ahora]);
  const [hechas, setHechas] = useState<string[]>([]);
  const [chats, setChats] = useState<Record<string, Burbuja[]>>({});
  const [chatGeimar, setChatGeimar] = useState<Burbuja[]>([]);
  const [activo, setActivo] = useState<string>(NUEVO);
  const [escribiendo, setEscribiendo] = useState<{ cliente: string | null; geimar: boolean }>({ cliente: null, geimar: false });
  const [sinLeer, setSinLeer] = useState<Record<Lado, number>>({ cliente: 0, geimar: 0 });
  const [pdfs, setPdfs] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<Estado>({ ia: false, whatsapp: false });
  const [nuevas, setNuevas] = useState<number[]>([]);

  // Refs mirror state for the async message queue.
  // Updated together with the state in guardarConversacion.
  const convRef = useRef(conversaciones);
  const cola = useRef<Promise<void>>(Promise.resolve());
  const ids = useRef(1);
  const reloj = useRef(6 * 60 + 2);
  const consecutivo = useRef(141);
  const lento = useRef(true);
  const visible = useRef<Lado>("cliente");

  useEffect(() => {
    lento.current = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    fetch("/api/agente/estado")
      .then((r) => r.json())
      .then((e: Estado) => setEstado(e))
      .catch(() => {});
  }, []);

  const contexto = useCallback(
    (): Contexto => ({ ahora: new Date(ahora.getTime() + (reloj.current - 6 * 60) * 60_000), numeroCotizacion: () => `C-0${++consecutivo.current}`, ejemplo: true }),
    [ahora],
  );

  const burbuja = (b: Omit<Burbuja, "id" | "hora">): Burbuja => {
    reloj.current += 1;
    const id = ids.current++;
    setNuevas((n) => [...n.slice(-20), id]);
    return { ...b, id, hora: horaTexto(reloj.current) };
  };

  const empujar = useCallback((lado: Lado, telefono: string, b: Burbuja) => {
    if (lado === "geimar") setChatGeimar((c) => [...c, b]);
    else setChats((c) => ({ ...c, [telefono]: [...(c[telefono] ?? []), b] }));
    if (!b.mio && visible.current !== lado) setSinLeer((s) => ({ ...s, [lado]: s[lado] + 1 }));
  }, []);

  const guardarConversacion = useCallback((telefono: string, conv: Conversacion) => {
    convRef.current = { ...convRef.current, [telefono]: conv };
    setConversaciones(convRef.current);
    setClientes((cs) => cs.map((c) => (c.telefono === telefono ? conv.cliente : c)));
    const cot = conv.cotizacion;
    if (cot) setCotizaciones((cs) => ({ ...cs, [cot.numero]: structuredClone(cot) }));
  }, []);

  const asegurarPdf = useCallback(async (cot: Cotizacion) => {
    const bytes = await generarPdf(cot, await cargarRecursos());
    const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    setPdfs((p) => ({ ...p, [cot.numero]: url }));
  }, []);

  // Messages from the agent go out one by one, with "escribiendo…" first.
  const entregar = useCallback(
    (telefono: string, salidas: Salida[], conv: Conversacion) => {
      cola.current = cola.current.then(async () => {
        for (const s of salidas) {
          const lado: Lado = s.para;
          setEscribiendo(lado === "geimar" ? { cliente: null, geimar: true } : { cliente: telefono, geimar: false });
          await espera(lento.current ? Math.min(450 + s.mensaje.texto.length * 4, 1300) : 60);
          if (s.mensaje.tipo === "documento" && conv.cotizacion) await asegurarPdf(conv.cotizacion);
          const m = s.mensaje;
          const b = burbuja({
            mio: false,
            tipo: m.tipo === "documento" ? "documento" : m.tipo === "referencias" ? "referencias" : "texto",
            texto: m.texto,
            botones: "botones" in m ? m.botones : undefined,
            skus: m.tipo === "referencias" ? m.skus : undefined,
            cotizacion: m.tipo === "documento" ? m.cotizacion : undefined,
          });
          empujar(lado, telefono, b);
        }
        setEscribiendo({ cliente: null, geimar: false });
      });
      return cola.current;
    },
     
    [asegurarPdf, empujar],
  );

  const aplicar = useCallback(
    (telefono: string, r: Resultado) => {
      guardarConversacion(telefono, r.conversacion);
      return entregar(telefono, r.salidas, r.conversacion);
    },
    [entregar, guardarConversacion],
  );

  // ---- Client side ----

  const responderCliente = useCallback(
    async (telefono: string, texto: string) => {
      const previa = convRef.current[telefono];
      let r = deCliente(previa, texto, contexto());
      const noEntendio = r.salidas.some((s) => s.mensaje.texto.startsWith("No te entendí"));
      if (noEntendio && estado.ia) {
        const res = await fetch("/api/agente/entender", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto }) }).catch(() => null);
        const frase = res?.ok ? ((await res.json()) as { frase?: string }).frase : null;
        if (frase) r = deCliente(previa, frase, contexto());
      }
      return aplicar(telefono, r);
    },
    [aplicar, contexto, estado.ia],
  );

  const enviarCliente = useCallback(
    (texto: string) => {
      const t = texto.trim();
      if (!t) return;
      const telefono = activo;
      empujar("cliente", telefono, burbuja({ mio: true, tipo: "texto", texto: t }));
      return responderCliente(telefono, t);
    },
     
    [activo, empujar, responderCliente],
  );

  const enviarVoz = useCallback(
    (transcripcion: string) => {
      const telefono = activo;
      empujar("cliente", telefono, burbuja({ mio: true, tipo: "voz", texto: transcripcion }));
      return responderCliente(telefono, transcripcion);
    },
     
    [activo, empujar, responderCliente],
  );

  const aviso = useCallback(
    (lado: Lado, telefono: string, texto: string) => empujar(lado, telefono, burbuja({ mio: false, aviso: true, tipo: "texto", texto })),
     
    [empujar],
  );

  const enviarFoto = useCallback(
    async (dataUrl: string) => {
      const telefono = activo;
      empujar("cliente", telefono, burbuja({ mio: true, tipo: "imagen", texto: "", imagen: dataUrl }));
      const [cabecera, base64] = dataUrl.split(",");
      const tipo = cabecera.match(/data:(.*?);/)?.[1] ?? "image/jpeg";
      setEscribiendo({ cliente: telefono, geimar: false });
      const res = await fetch("/api/agente/foto", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imagen: base64, tipo }) }).catch(() => null);
      setEscribiendo({ cliente: null, geimar: false });
      if (!res || res.status === 503) {
        aviso("cliente", telefono, "Demostración: para reconocer fotos falta poner la clave de la IA (ANTHROPIC_API_KEY) en Vercel. Con la clave, aquí llega la referencia exacta del catálogo.");
        return;
      }
      if (!res.ok) {
        aviso("cliente", telefono, "La IA no pudo leer la foto esta vez. Prueba con otra.");
        return;
      }
      const { skus } = (await res.json()) as { skus: string[] };
      return aplicar(telefono, referenciasIdentificadas(convRef.current[telefono], skus, "La pieza de la foto"));
    },
     
    [activo, aplicar, aviso, empujar],
  );

  // ---- Geimar side ----

  const enviarGeimar = useCallback(
    (texto: string) => {
      const t = texto.trim();
      if (!t) return;
      empujar("geimar", "", burbuja({ mio: true, tipo: "texto", texto: t }));
      const entrada = Object.entries(convRef.current).find(([, c]) => c.cotizacion && ["esperando-precios", "por-aprobar"].includes(c.cotizacion.estado));
      if (!entrada) {
        return entregar("", [{ para: "geimar", mensaje: { tipo: "texto", texto: "No tengo cotizaciones esperando precios ahora mismo." } }], convRef.current[NUEVO]);
      }
      const [telefono, conv] = entrada;
      if (/aprobar/i.test(t)) {
        const r = aprobar(conv, contexto());
        guardarConversacion(telefono, r.conversacion);
        if (telefono !== activo) setActivo(telefono);
        return entregar(telefono, r.salidas, r.conversacion);
      }
      if (/corregir/i.test(t)) {
        return entregar(telefono, [{ para: "geimar", mensaje: { tipo: "texto", texto: "Dale. Mándame solo las líneas que cambian, con el número adelante (ej.: 2 3.100)." } }], conv);
      }
      return aplicar(telefono, deGeimar(conv, t));
    },
     
    [activo, aplicar, contexto, empujar, entregar, guardarConversacion],
  );

  // The demo prices Geimar's shortcut types for him (he still sends them).
  const preciosEjemplo = useCallback((): string | null => {
    const c = Object.values(convRef.current).find((x) => x.cotizacion?.estado === "esperando-precios");
    return c?.cotizacion ? respuestaPreciosEjemplo(c.cotizacion.lineas.map((l) => l.sku)) : null;
  }, []);

  const marcarBoton = useCallback((lado: Lado, telefono: string, id: number, boton: string) => {
    const marcar = (lista: Burbuja[]) => lista.map((b) => (b.id === id ? { ...b, botonUsado: boton } : b));
    if (lado === "geimar") setChatGeimar(marcar);
    else setChats((c) => ({ ...c, [telefono]: marcar(c[telefono] ?? []) }));
  }, []);

  // ---- The morning: the agent writes first ----

  const ejecutarTarea = useCallback(
    (t: Tarea) => {
      if (hechas.includes(t.id) || !t.plantilla) return;
      setHechas((h) => [...h, t.id]);
      const telefono = t.cliente.telefono;
      const conv: Conversacion = structuredClone(convRef.current[telefono]);
      conv.saludado = true;
      if (t.tipo === "seguimiento" && t.cotizacion) {
        conv.cotizacion = structuredClone(cotizaciones[t.cotizacion]);
        conv.esperando = "decision";
      } else conv.esperando = "recompra";
      guardarConversacion(telefono, conv);
      setActivo(telefono);
      const p = PLANTILLAS[t.plantilla];
      cola.current = cola.current.then(async () => {
        await espera(lento.current ? 500 : 30);
        if (t.cotizacion) {
          // The quote that went out days ago, so the follow-up has context.
          const cot = cotizaciones[t.cotizacion];
          await asegurarPdf(cot);
          const dias = cot.enviada ? Math.round((ahora.getTime() - new Date(cot.enviada).getTime()) / 86_400_000) : 0;
          empujar("cliente", telefono, burbuja({ mio: false, tipo: "documento", texto: `Cotización ${cot.numero} · GAVICOM`, cotizacion: cot.numero, dia: `Hace ${dias} días` }));
        }
        empujar("cliente", telefono, burbuja({ mio: false, tipo: "texto", dia: "Hoy", texto: rellenar(t.plantilla!, t.variables), botones: [...p.botones], plantilla: `Plantilla «${t.plantilla}» · ${p.categoria}` }));
        await espera(lento.current ? 400 : 30);
        empujar("geimar", "", burbuja({ mio: false, tipo: "texto", texto: `Le escribí a ${t.cliente.nombre} (${t.cliente.empresa}). ${t.porque}` }));
      });
    },
     
    [ahora, asegurarPdf, cotizaciones, empujar, guardarConversacion, hechas],
  );

  const verLado = useCallback((lado: Lado) => {
    visible.current = lado;
    setSinLeer((s) => ({ ...s, [lado]: 0 }));
  }, []);

  return {
    estado,
    clientes,
    activo,
    setActivo,
    conversaciones,
    cotizaciones: Object.values(cotizaciones),
    tareas,
    hechas,
    ejecutarTarea,
    chat: chats[activo] ?? [],
    chatGeimar,
    escribiendo,
    sinLeer,
    verLado,
    pdfs,
    nuevas,
    enviarCliente,
    enviarVoz,
    enviarFoto,
    avisoCliente: (texto: string) => aviso("cliente", activo, texto),
    enviarGeimar,
    preciosEjemplo,
    marcarBoton,
    NUEVO,
  };
}

export type Simulador = ReturnType<typeof useSimulador>;
