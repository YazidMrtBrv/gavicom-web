"use client";

import { useState } from "react";
import { Bot, CalendarClock, MessageCirclePlus, RotateCcw, Send, Sparkles } from "lucide-react";
import Telefono from "./Telefono";
import Tablero from "./Tablero";
import { useSimulador, type Lado } from "./useSimulador";
import type { Esperando } from "@/lib/agente/motor";
import "./agente.css";

const SUGERENCIAS: Partial<Record<NonNullable<Esperando> | "inicio", string[]>> = {
  inicio: ["Necesito material para 300 m de vía en riel de 115", "Los durmientes me están bailando", "Hay polvillo blanco sobre las traviesas", "¿Cuánto vale el clip?"],
  metros: ["300 metros", "1,2 km"],
  cantidad: ["200"],
  nombre: ["Camila Restrepo, Vías del Norte"],
  ciudad: ["Ciénaga, Magdalena"],
  desnivel: ["Como 3 pulgadas", "Unas 6 pulgadas"],
};

export default function Simulador() {
  const s = useSimulador();
  const [lado, setLado] = useState<Lado>("cliente");
  const cliente = s.clientes.find((c) => c.telefono === s.activo)!;
  const conv = s.conversaciones[s.activo];
  const pendientes = s.tareas.filter((t) => !s.hechas.includes(t.id));

  const clave = conv?.esperando ?? (s.chat.length === 0 ? "inicio" : null);
  const sugerenciasCliente = (clave ? SUGERENCIAS[clave] ?? [] : []).map((texto) => ({ texto }));
  const precios = s.preciosEjemplo();
  const sugerenciasGeimar = precios ? [{ texto: precios, rellenar: true, destacada: true }] : [];

  const mostrarLado = (l: Lado) => {
    setLado(l);
    s.verLado(l);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${s.estado.ia ? "bg-[#e7f8f1] text-[#006e58]" : "bg-gris text-tenue"}`}>
          <Sparkles size={15} aria-hidden="true" />
          {s.estado.ia ? "IA conectada: fotos y mensajes enredados" : "IA sin clave: fotos sin reconocer, el resto funciona"}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-gris px-3 py-1.5 text-tenue">
          <Send size={15} aria-hidden="true" />
          {s.estado.whatsapp ? "Número de WhatsApp conectado" : "WhatsApp simulado: el número aún no está conectado"}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        {/* The morning */}
        <section aria-labelledby="titulo-hoy" className="rounded-2xl border border-linea bg-white p-5 lg:sticky lg:top-24">
          <p className="t-etiqueta text-tenue flex items-center gap-2">
            <CalendarClock size={15} aria-hidden="true" /> 6:00 a. m.
          </p>
          <h2 id="titulo-hoy" className="t-tarjeta mt-2 text-azul">
            Lo que el agente encontró hoy
          </h2>
          <p className="mt-1 text-sm text-tenue">Leyó las cotizaciones y las compras de cada cliente. Nadie le escribió: él escribe primero.</p>
          <ol className="mt-4 grid gap-3">
            {s.tareas.map((t) => {
              const hecha = s.hechas.includes(t.id);
              const siguiente = pendientes[0]?.id === t.id;
              return (
                <li key={t.id} className={`agente-tarea rounded-xl border p-4 ${hecha ? "hecha border-linea" : siguiente ? "border-[#00a884] shadow-[0_0_0_3px_rgba(0,168,132,0.12)]" : "border-linea"}`}>
                  <p className="t-nombre text-tinta">{t.cliente.nombre}</p>
                  <p className="text-sm text-tenue">{t.cliente.empresa}</p>
                  <p className="mt-2 text-sm text-tinta">{t.porque}</p>
                  {t.plantilla && <p className="mt-2 t-dato text-tenue">Plantilla de Meta: {t.plantilla}</p>}
                  <button
                    type="button"
                    disabled={hecha}
                    onClick={() => {
                      s.ejecutarTarea(t);
                      mostrarLado("cliente");
                    }}
                    className={`mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 font-semibold transition ${
                      hecha ? "bg-gris text-tenue" : siguiente ? "bg-[#00a884] text-white hover:bg-[#008f72] agente-latido" : "border border-azul text-azul hover:bg-azul-suave"
                    }`}
                  >
                    {hecha ? "Ya le escribió" : t.tipo === "reposicion" ? "Que le ofrezca reponer" : "Que le haga seguimiento"}
                  </button>
                </li>
              );
            })}
            <li className="rounded-xl border border-dashed border-linea p-4">
              <p className="t-nombre text-tinta">Y si alguien escribe de una</p>
              <p className="mt-1 text-sm text-tenue">Un cliente nuevo, sin historia: pide por metros de vía, manda foto o cuenta una falla.</p>
              <button
                type="button"
                onClick={() => {
                  s.setActivo(s.NUEVO);
                  mostrarLado("cliente");
                }}
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-azul px-4 font-semibold text-azul hover:bg-azul-suave"
              >
                <MessageCirclePlus size={18} aria-hidden="true" /> Abrir su WhatsApp
              </button>
            </li>
          </ol>
        </section>

        {/* Phone switcher on small screens */}
        <div className="lg:hidden sticky top-16 z-10 -mx-4 bg-white/95 px-4 py-2 backdrop-blur" role="tablist" aria-label="Qué teléfono ver">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-gris p-1">
            {(["cliente", "geimar"] as Lado[]).map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={lado === l}
                onClick={() => mostrarLado(l)}
                className={`min-h-11 rounded-lg font-semibold inline-flex items-center justify-center gap-2 ${lado === l ? "bg-white text-azul shadow-sm" : "text-tenue"}`}
              >
                {l === "cliente" ? "Cliente" : "Geimar"}
                {s.sinLeer[l] > 0 && lado !== l && <span className="agente-insignia">{s.sinLeer[l]}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Client */}
        <div className={lado === "cliente" ? "" : "hidden lg:block"}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm text-tenue truncate">
              WhatsApp de <span className="font-semibold text-tinta">{cliente.nombre || "un cliente nuevo"}</span>
            </p>
            <label className="sr-only" htmlFor="cliente-activo">
              Cambiar de cliente
            </label>
            <select id="cliente-activo" value={s.activo} onChange={(e) => s.setActivo(e.target.value)} className="min-h-11 max-w-40 rounded-lg border border-linea bg-white px-2 text-sm">
              {s.clientes.map((c) => (
                <option key={c.telefono} value={c.telefono}>
                  {c.nombre || "Cliente nuevo"}
                </option>
              ))}
            </select>
          </div>
          <Telefono
            etiqueta="Teléfono del cliente"
            nombre="GAVICOM"
            subtitulo="Cuenta de empresa"
            avatar={<Bot size={20} aria-hidden="true" />}
            colorAvatar="#0c2642"
            burbujas={s.chat}
            escribiendo={s.escribiendo.cliente === s.activo}
            nuevas={s.nuevas}
            pdfs={s.pdfs}
            sugerencias={sugerenciasCliente}
            vacio={
              <>
                <p className="wa-dia">Hoy</p>
                <p className="wa-aviso">Escribe como si fueras el cliente o toca una sugerencia. También puedes mandar una foto de la pieza o una nota de voz.</p>
              </>
            }
            onEnviar={s.enviarCliente}
            onBoton={(b, boton) => {
              s.marcarBoton("cliente", s.activo, b.id, boton);
              s.enviarCliente(boton);
            }}
            onFoto={s.enviarFoto}
            onVoz={s.enviarVoz}
            onAviso={s.avisoCliente}
          />
        </div>

        {/* Geimar */}
        <div className={lado === "geimar" ? "" : "hidden lg:block"}>
          <div className="mb-3 flex min-h-11 items-center">
            <p className="text-sm text-tenue">
              WhatsApp de <span className="font-semibold text-tinta">Geimar</span>, gerente de GAVICOM
            </p>
          </div>
          <Telefono
            etiqueta="Teléfono de Geimar"
            nombre="Asistente de ventas"
            subtitulo="Te pasa cotizaciones para ponerles precio"
            avatar={<Bot size={20} aria-hidden="true" />}
            colorAvatar="#00a884"
            burbujas={s.chatGeimar}
            escribiendo={s.escribiendo.geimar}
            nuevas={s.nuevas}
            pdfs={s.pdfs}
            sugerencias={sugerenciasGeimar}
            vacio={<p className="wa-aviso">Aquí le llegan a Geimar las cotizaciones para que responda los precios y apruebe el PDF con un toque. La IA nunca pone precios.</p>}
            onEnviar={s.enviarGeimar}
            onBoton={(b, boton) => {
              s.marcarBoton("geimar", "", b.id, boton);
              s.enviarGeimar(boton);
              if (/aprobar/i.test(boton)) mostrarLado("cliente");
            }}
          />
        </div>
      </div>

      <section aria-labelledby="titulo-plata" className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="titulo-plata" className="t-seccion text-azul">
              La plata, sin abrir Excel
            </h2>
            <p className="mt-2 t-texto text-tenue max-w-2xl">Cotizaciones de ejemplo de los últimos 60 días, más las que hagas aquí arriba: cuando un cliente aprueba o dice que no, la cifra se mueve.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#fff4e0] px-3 py-1.5 text-sm text-[#8a4b06]">
            <RotateCcw size={15} aria-hidden="true" /> Cifras de ejemplo, no son precios de GAVICOM
          </span>
        </div>
        <div className="mt-6">
          <Tablero cotizaciones={s.cotizaciones} />
        </div>
      </section>
    </div>
  );
}
