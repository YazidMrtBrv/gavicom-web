"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import Calculadora, { REGIONES, estimar, fmt, type Region } from "./Calculadora";
import DatosParaCotizar, { DATOS, type Tipo } from "./DatosParaCotizar";

/*
 * One quote flow for the solar line: the calculator and the checklist share
 * state and end in a single WhatsApp message. Before, each had its own button
 * and the visitor had to choose which half of the information to send.
 * The message follows the shape of mensajeCotizacion (greeting, bullet lines,
 * blank line, location and who), so sales reads every quote the same way.
 */
export default function CotizadorEnergia() {
  const [kwh, setKwh] = useState(600);
  const [region, setRegion] = useState<Region>(REGIONES[0]);
  const [calculado, setCalculado] = useState(false);
  const [tipo, setTipo] = useState<Tipo | null>(null);
  const [tengo, setTengo] = useState<Set<string>>(new Set());
  const [municipio, setMunicipio] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [plazo, setPlazo] = useState("");

  // The first real use of the calculator ticks "Consumo" by itself; after
  // that the visitor can untick it and it stays unticked.
  const usarCalculadora = () => {
    if (calculado) return;
    setCalculado(true);
    setTengo((prev) => new Set(prev).add("consumo"));
  };

  const est = estimar(kwh, region);
  const consumoCalculado =
    calculado && est ? `Consumo: ${fmt(kwh)} kWh/mes (estimado ${fmt(est.kwp, 1)} kWp, región ${region.nombre})` : null;

  const alternar = (id: string) =>
    setTengo((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const puedeEnviar = DATOS.filter((d) => tengo.has(d.id) && !(d.id === "consumo" && consumoCalculado));
  const lineas = [
    tipo ? `• Tipo de instalación: ${tipo}` : "",
    tengo.has("consumo") && consumoCalculado ? `• ${consumoCalculado}` : "",
    puedeEnviar.length ? `• Puedo enviar: ${puedeEnviar.map((d) => d.enMensaje).join(", ")}` : "",
  ].filter(Boolean);
  const detalles = [
    municipio.trim() ? `Proyecto en: ${municipio.trim()}` : "",
    empresa.trim() ? `De parte de: ${empresa.trim()}` : "",
    plazo ? `Lo necesito: ${plazo}` : "",
  ].filter(Boolean);
  const mensaje = [
    "Hola GAVICOM, quiero cotizar un proyecto de energía solar con GAVICOM Energy.",
    ...lineas,
    ...(detalles.length ? ["", ...detalles] : []),
  ].join("\n");

  // Type, municipality and deadline, plus each item of the checklist.
  const listos = (tipo ? 1 : 0) + tengo.size + (municipio.trim() ? 1 : 0) + (plazo ? 1 : 0);
  const total = DATOS.length + 3;

  return (
    <div className="grid gap-12 md:gap-16">
      <div>
        <h3 className="font-titulo text-xl md:text-2xl font-bold text-white">
          <span className="font-mono text-sm text-white/70 mr-2">Paso 1</span>Calcula tu sistema
        </h3>
        <div className="mt-5">
          <Calculadora
            kwh={kwh}
            region={region}
            onKwh={(n) => {
              setKwh(n);
              usarCalculadora();
            }}
            onRegion={(r) => {
              setRegion(r);
              usarCalculadora();
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="font-titulo text-xl md:text-2xl font-bold text-white">
          <span className="font-mono text-sm text-white/70 mr-2">Paso 2</span>Lo que tienes para cotizar
        </h3>
        <p className="mt-1 text-white/75 max-w-2xl">No necesitas tenerlo todo para escribirnos: lo que marques va en el mensaje.</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.3fr_1fr] items-start">
          <DatosParaCotizar
            tipo={tipo}
            onTipo={setTipo}
            tengo={tengo}
            onAlternar={alternar}
            municipio={municipio}
            onMunicipio={setMunicipio}
            empresa={empresa}
            onEmpresa={setEmpresa}
            plazo={plazo}
            onPlazo={setPlazo}
            consumoCalculado={consumoCalculado}
          />

          <div className="lg:sticky lg:top-24 rounded-sm border border-white/25 bg-white/[0.06] p-5 flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-semibold">Tu mensaje</p>
              <p className="font-mono text-sm text-white/80">Datos listos: {listos}</p>
            </div>
            <div aria-hidden className="h-1.5 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full bg-white transition-[width] duration-300" style={{ width: `${(listos / total) * 100}%` }} />
            </div>
            {/* Focusable because it can scroll; a region so the label is read. */}
            <pre
              role="region"
              tabIndex={0}
              aria-label="Vista previa del mensaje"
              className="whitespace-pre-wrap break-words rounded-sm bg-white text-tinta p-4 text-sm font-mono leading-relaxed max-h-72 overflow-auto"
            >
              {mensaje}
            </pre>
            <a
              href={enlaceWhatsApp(mensaje)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded-sm bg-white text-azul font-semibold hover:bg-azul-suave"
            >
              <MessageCircle size={20} aria-hidden /> Enviar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
