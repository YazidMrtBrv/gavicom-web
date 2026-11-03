"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Send } from "lucide-react";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import "./fabricacion.css";

// The profile table and this form live in different parts of the page; a
// window event keeps them decoupled without lifting state into a provider.
const EVENTO_PERFIL = "gavicom:pedido-perfil";

const PIEZAS = ["Eclisa", "Tirafondo", "Otra pieza"];
const PARTIDAS = ["Plano", "Muestra física", "Solo la pieza en uso"];
const SIN_DATO = "por definir";

function Opciones({
  titulo,
  opciones,
  valor,
  onElegir,
}: {
  titulo: string;
  opciones: string[];
  valor: string;
  onElegir: (v: string) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="font-semibold text-tinta">{titulo}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {opciones.map((o) => {
          const elegido = valor === o;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={elegido}
              onClick={() => onElegir(elegido ? "" : o)}
              className={`min-h-12 px-4 rounded border text-left text-sm font-semibold transition-colors ${elegido ? "bg-azul border-azul text-white" : "bg-white border-linea text-tinta hover:border-azul"}`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// Link-shaped so it still jumps to the form without JavaScript; with it, the
// row's profile also lands in the form.
export function BotonPerfil({ perfil }: { perfil: string }) {
  return (
    <a
      href="#arma-tu-pedido"
      onClick={() => window.dispatchEvent(new CustomEvent(EVENTO_PERFIL, { detail: perfil }))}
      // A quiet text link, not a button: a table of seven "Cotizar" buttons
      // read as pressure; this just preselects the profile in the form.
      className="inline-flex items-center min-h-11 text-sm font-semibold text-azul underline underline-offset-4 decoration-azul/40 hover:decoration-azul whitespace-nowrap"
    >
      Elegir este perfil
    </a>
  );
}

export default function ArmaTuPedido({ perfiles }: { perfiles: string[] }) {
  const [pieza, setPieza] = useState("");
  const [perfil, setPerfil] = useState("");
  const [partida, setPartida] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [ciudad, setCiudad] = useState("");
  const idCantidad = useId();
  const idCiudad = useId();

  useEffect(() => {
    const alElegir = (e: Event) => {
      const valor = (e as CustomEvent<string>).detail;
      if (typeof valor !== "string") return;
      // The table lists joint-bar profiles, so a row implies the piece too.
      setPieza("Eclisa");
      setPerfil(valor);
    };
    window.addEventListener(EVENTO_PERFIL, alElegir);
    return () => window.removeEventListener(EVENTO_PERFIL, alElegir);
  }, []);

  // Every field always appears, filled or "por definir", so whoever answers
  // sees at a glance what is still missing instead of guessing.
  const mensaje = [
    "Hola GAVICOM, quiero cotizar la fabricación de una pieza.",
    `Pieza: ${pieza || SIN_DATO}`,
    `Perfil de riel: ${perfil || SIN_DATO}`,
    `Punto de partida: ${partida || SIN_DATO}`,
    `Cantidad aproximada: ${cantidad.trim() || SIN_DATO}`,
    `Ciudad de entrega: ${ciudad.trim() || SIN_DATO}`,
  ].join("\n");

  const campo =
    "mt-2 w-full min-h-12 px-3 rounded border border-linea bg-white text-tinta placeholder:text-tenue focus:border-azul";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
      <div className="flex flex-col gap-6">
        <Opciones titulo="Pieza" opciones={PIEZAS} valor={pieza} onElegir={setPieza} />
        <Opciones titulo="Perfil de riel" opciones={[...perfiles, "Otro"]} valor={perfil} onElegir={setPerfil} />
        <Opciones titulo="Punto de partida" opciones={PARTIDAS} valor={partida} onElegir={setPartida} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={idCantidad} className="font-semibold text-tinta">
              Cantidad aproximada
            </label>
            <input
              id={idCantidad}
              type="text"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Ej.: 200 pares"
              maxLength={60}
              className={campo}
            />
          </div>
          <div>
            <label htmlFor={idCiudad} className="font-semibold text-tinta">
              Ciudad de entrega
            </label>
            <input
              id={idCiudad}
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              autoComplete="address-level2"
              maxLength={60}
              className={campo}
            />
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 flex flex-col gap-4">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-tenue">Así llega tu mensaje</p>
        <pre className="pedido-vista whitespace-pre-wrap break-words font-mono text-sm leading-relaxed rounded border border-linea bg-gris p-4 text-tinta">
          {mensaje}
        </pre>
        <div className="flex flex-wrap gap-3">
          <a
            href={enlaceWhatsApp(mensaje)}
            target="_blank"
            rel="noopener noreferrer"
            className="boton-iman inline-flex items-center gap-2 min-h-12 px-6 rounded bg-azul text-white font-semibold hover:bg-azul-hover"
          >
            <Send size={18} aria-hidden /> Enviar por WhatsApp
          </a>
          <Link
            href="/contacto?tema=fabricacion"
            className="boton-iman inline-flex items-center min-h-12 px-6 rounded border border-azul text-azul font-semibold hover:bg-azul-suave"
          >
            Prefiero el formulario
          </Link>
        </div>
      </div>
    </div>
  );
}
