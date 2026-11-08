"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { aprobar, marcarEnviada, pendientesDeAprobacion, procesarCorreo, procesarRespuesta, type Procesado } from "@/lib/agente/bandeja";
import { clientesEjemplo, correosEjemplo, cotizacionesEjemplo, preciosEjemplo, RESPUESTAS_EJEMPLO } from "@/lib/agente/ejemplo";
import { generarPdf, RUTAS_RECURSOS, type Recursos } from "@/lib/agente/pdf";
import { leerPrecio } from "@/lib/agente/precios";
import { tareasDelDia } from "@/lib/agente/seguimiento";
import { nombreDe } from "@/lib/agente/catalogo";
import type { Borrador, Correo, Cotizacion } from "@/lib/agente/tipos";

// State of the email demo. It drives the same functions a scheduled job
// would run against gerencia@: read requests, prepare quotes, leave drafts.

export type Respuesta = keyof typeof RESPUESTAS_EJEMPLO;

export interface BorradorVivo {
  borrador: Borrador;
  aprobado: boolean;
  // Thread it belongs to (request email id) or the quote it follows up.
  hilo?: string;
  cotizacion?: string;
  // Prepared at 6 a.m. by the agent on its own (follow-ups, reorders).
  propio: boolean;
}

export type Seleccion = { tipo: "correo"; id: string } | { tipo: "borrador"; id: string };

const GERENCIA = { nombre: "GAVICOM Gerencia", correo: "gerencia@gavicom.com" };

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

export function useBandeja() {
  const [ahora] = useState(() => new Date());
  const clientes = useMemo(() => clientesEjemplo(ahora), [ahora]);
  // The agent read the inbox at 6 a.m.: every request is already processed.
  const [inicial] = useState(() => {
    let numero = 141;
    const correos = correosEjemplo(ahora);
    const procesados: Record<string, Procesado> = {};
    const cotizaciones: Record<string, Cotizacion> = Object.fromEntries(cotizacionesEjemplo(ahora).map((c) => [c.numero, c]));
    const borradores: BorradorVivo[] = [];
    for (const c of correos) {
      const p = procesarCorreo(c, clientes, { ahora, numeroCotizacion: () => `C-0${++numero}`, ejemplo: true });
      procesados[c.id] = p;
      if (p.cotizacion) cotizaciones[p.cotizacion.numero] = p.cotizacion;
      for (const b of p.borradores) borradores.push({ borrador: b, aprobado: false, hilo: c.id, propio: false });
    }
    for (const t of tareasDelDia(Object.values(cotizaciones), clientes, ahora)) {
      if (t.borrador) borradores.push({ borrador: t.borrador, aprobado: false, cotizacion: t.cotizacion, propio: true });
    }
    return { correos, procesados, cotizaciones, borradores, siguiente: numero };
  });
  const consecutivo = useRef(inicial.siguiente);
  const ctx = useCallback(() => ({ ahora: new Date(), numeroCotizacion: () => `C-0${++consecutivo.current}`, ejemplo: true }), []);

  const [correos, setCorreos] = useState<Correo[]>(inicial.correos);
  const [procesados, setProcesados] = useState(inicial.procesados);
  const [cotizaciones, setCotizaciones] = useState<Record<string, Cotizacion>>(inicial.cotizaciones);
  const [borradores, setBorradores] = useState<BorradorVivo[]>(inicial.borradores);
  // Prices as Geimar types them, per quote and line.
  const [precios, setPrecios] = useState<Record<string, string[]>>({});
  const [seleccion, setSeleccion] = useState<Seleccion>({ tipo: "correo", id: inicial.correos[0].id });
  const [pdfs, setPdfs] = useState<Record<string, string>>({});
  const [leidos, setLeidos] = useState<string[]>([inicial.correos[0].id]);
  const [estado, setEstado] = useState({ ia: false, correo: false });

  useEffect(() => {
    fetch("/api/agente/estado")
      .then((r) => r.json())
      .then(setEstado)
      .catch(() => {});
  }, []);

  const asegurarPdf = useCallback(async (cot: Cotizacion) => {
    const bytes = await generarPdf(cot, await cargarRecursos());
    const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    setPdfs((p) => ({ ...p, [cot.numero]: url }));
  }, []);

  // PDFs of quotes that follow-up drafts attach.
  useEffect(() => {
    const adjuntos = inicial.borradores.flatMap((b) => (b.borrador.adjunto && inicial.cotizaciones[b.borrador.adjunto] ? [inicial.cotizaciones[b.borrador.adjunto]] : []));
    (async () => {
      for (const cot of adjuntos) await asegurarPdf(cot);
    })();
  }, [asegurarPdf, inicial]);

  const abrir = useCallback((s: Seleccion) => {
    setSeleccion(s);
    setLeidos((l) => (l.includes(s.id) ? l : [...l, s.id]));
  }, []);

  // Quote with Geimar's typed prices applied (null where not a price yet).
  const conPrecios = useCallback(
    (cot: Cotizacion): Cotizacion => {
      const escritos = precios[cot.numero];
      if (!escritos) return cot;
      return { ...cot, lineas: cot.lineas.map((l, i) => ({ ...l, precioUnitario: escritos[i] != null ? leerPrecio(escritos[i]) : l.precioUnitario })) };
    },
    [precios],
  );

  const escribirPrecio = useCallback((numero: string, i: number, valor: string) => {
    setPrecios((p) => {
      const lista = [...(p[numero] ?? [])];
      lista[i] = valor;
      return { ...p, [numero]: lista };
    });
  }, []);

  const preciosDeEjemplo = useCallback((cot: Cotizacion) => {
    setPrecios((p) => ({ ...p, [cot.numero]: preciosEjemplo(cot.lineas.map((l) => l.sku)).map((n) => n.toLocaleString("es-CO")) }));
  }, []);

  const escribirCondicion = useCallback((numero: string, campo: "entrega" | "pago", valor: string) => {
    setCotizaciones((cs) => ({ ...cs, [numero]: { ...cs[numero], condiciones: { ...cs[numero].condiciones, [campo]: valor } } }));
  }, []);

  const aprobarCotizacion = useCallback(
    async (correoId: string) => {
      const p = procesados[correoId];
      if (!p?.cotizacion) return;
      const cot = conPrecios(cotizaciones[p.cotizacion.numero]);
      if (pendientesDeAprobacion(cot).length) return;
      const r = aprobar(cot, p.solicitud);
      setCotizaciones((cs) => ({ ...cs, [cot.numero]: r.cotizacion }));
      await asegurarPdf(r.cotizacion);
      setBorradores((bs) => [...bs, { borrador: r.borrador, aprobado: true, hilo: correoId, cotizacion: cot.numero, propio: false }]);
    },
    [asegurarPdf, conPrecios, cotizaciones, procesados],
  );

  const aprobarBorrador = useCallback((id: string) => {
    setBorradores((bs) => bs.map((b) => (b.borrador.id === id ? { ...b, aprobado: true } : b)));
  }, []);

  // Demo: Geimar sent the quote and the client answers.
  const simularRespuesta = useCallback(
    (numero: string, tipo: Respuesta, hilo?: string) => {
      const base = cotizaciones[numero];
      if (!base) return;
      const enviada = base.estado === "por-aprobar" ? marcarEnviada(base, new Date()) : base;
      const origen = hilo ? correos.find((c) => c.id === hilo) : undefined;
      const respuesta: Correo = {
        id: `resp-${numero}-${Date.now()}`,
        de: { nombre: enviada.cliente.nombre, correo: enviada.cliente.correo },
        para: GERENCIA,
        asunto: origen ? `RE: ${origen.asunto.replace(/^RE:\s*/i, "")}` : `RE: Cotización ${numero} · GAVICOM`,
        fecha: new Date().toISOString(),
        cuerpo: `${RESPUESTAS_EJEMPLO[tipo]}\n\n${enviada.cliente.nombre}\n${enviada.cliente.empresa}`,
        adjuntos: [],
        enRespuestaA: hilo ?? numero,
        ejemplo: true,
      };
      const r = procesarRespuesta(enviada, respuesta, new Date());
      setCorreos((cs) => [respuesta, ...cs]);
      setCotizaciones((cs) => ({ ...cs, [numero]: r.cotizacion }));
      if (r.borrador) setBorradores((bs) => [...bs, { borrador: r.borrador!, aprobado: false, hilo: hilo, cotizacion: numero, propio: false }]);
    },
    [correos, cotizaciones],
  );

  // A request pasted by the visitor: read like any other.
  const pegarCorreo = useCallback(
    async (asunto: string, cuerpo: string) => {
      const correo: Correo = {
        id: `pegado-${Date.now()}`,
        de: { nombre: "Correo pegado", correo: "pegado@ejemplo" },
        para: GERENCIA,
        asunto: asunto.trim() || "Solicitud de cotización",
        fecha: new Date().toISOString(),
        cuerpo,
        adjuntos: [],
        ejemplo: true,
      };
      let p = procesarCorreo(correo, clientes, ctx());
      // Rules found nothing: ask the AI, if connected, which items it sees.
      if (!p.solicitud.items.length && !p.solicitud.pedidoPorMetros && estado.ia) {
        const res = await fetch("/api/agente/leer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto: `${asunto}\n\n${cuerpo}` }) }).catch(() => null);
        const items = res?.ok ? ((await res.json()) as { items: { texto: string; sku: string | null; cantidad: number | null }[] }).items : [];
        if (items.length) {
          const lista = items.map((i) => `${i.sku ? nombreDe(i.sku) : i.texto}${i.cantidad ? `: ${i.cantidad} und` : ""}`).join("\n");
          p = procesarCorreo({ ...correo, cuerpo: `${cuerpo}\n\n${lista}` }, clientes, ctx());
          p = { ...p, solicitud: { ...p.solicitud, correo } };
        }
      }
      setCorreos((cs) => [correo, ...cs]);
      setProcesados((ps) => ({ ...ps, [correo.id]: p }));
      if (p.cotizacion) setCotizaciones((cs) => ({ ...cs, [p.cotizacion!.numero]: p.cotizacion! }));
      setBorradores((bs) => [...bs, ...p.borradores.map((b) => ({ borrador: b, aprobado: false, hilo: correo.id, propio: false }))]);
      abrir({ tipo: "correo", id: correo.id });
    },
    [abrir, clientes, ctx, estado.ia],
  );

  return {
    ahora,
    estado,
    correos,
    procesados,
    cotizaciones,
    borradores,
    seleccion,
    abrir,
    leidos,
    pdfs,
    precios,
    conPrecios,
    escribirPrecio,
    preciosDeEjemplo,
    escribirCondicion,
    aprobarCotizacion,
    aprobarBorrador,
    simularRespuesta,
    pegarCorreo,
  };
}

export type Bandeja = ReturnType<typeof useBandeja>;
