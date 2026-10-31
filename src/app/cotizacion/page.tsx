"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { slugProducto } from "@/lib/catalogo";
import { useCotizacion } from "@/lib/cotizacion";
import { enlaceWhatsApp, mensajeCotizacion, type DatosContacto } from "@/lib/whatsapp";

type EstadoCorreo = "nada" | "enviando" | "enviado" | "fallo";

export default function Cotizacion() {
  const { lineas, total, cambiarCantidad, quitar, vaciar } = useCotizacion();
  const [datos, setDatos] = useState<DatosContacto & { correo: string; telefono: string }>({ nombre: "", empresa: "", ciudad: "", nota: "", correo: "", telefono: "" });
  const [correo, setCorreo] = useState<EstadoCorreo>("nada");
  const texto = mensajeCotizacion(lineas, datos);

  const campo = (id: keyof typeof datos, etiqueta: string, tipo = "text", auto?: string) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={`cot-${id}`} className="text-sm font-medium">
        {etiqueta}
      </label>
      <input
        id={`cot-${id}`}
        type={tipo}
        autoComplete={auto}
        value={datos[id]}
        onChange={(e) => setDatos((d) => ({ ...d, [id]: e.target.value }))}
        className="min-h-11 px-3 rounded border border-linea bg-white focus:border-azul outline-none"
      />
    </div>
  );

  async function enviarCorreo() {
    setCorreo("enviando");
    try {
      const r = await fetch("/api/contacto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre: [datos.nombre, datos.empresa].filter(Boolean).join(", "),
          telefono: datos.telefono,
          email: datos.correo,
          tipo: "Cotización",
          mensaje: texto,
        }),
      });
      const j = await r.json().catch(() => ({}));
      // The route answers enviado:false when email is not configured; say so
      // instead of pretending it went out.
      setCorreo(r.ok && j.enviado ? "enviado" : "fallo");
    } catch {
      setCorreo("fallo");
    }
  }

  if (!lineas.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10">
        <h1 className="text-3xl font-bold">Mi cotización</h1>
        <div className="mt-6 border border-linea rounded bg-gris p-6 flex flex-col gap-3 items-start">
          <p className="font-semibold">Tu lista está vacía.</p>
          <p className="text-tenue text-sm">En el catálogo, toca «Agregar a cotización» en cada referencia que necesites. La lista se guarda en este navegador.</p>
          <Link href="/catalogo" className="inline-flex items-center min-h-11 px-4 rounded bg-azul text-white font-semibold">
            Ir al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 md:pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-3xl font-bold">Mi cotización</h1>
        <p className="text-tenue tabular-nums">
          {lineas.length} {lineas.length === 1 ? "referencia" : "referencias"} · {total} {total === 1 ? "unidad" : "unidades"}
        </p>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr] items-start">
        <ul className="border-t border-linea">
          {lineas.map((l) => (
            <li key={l.sku} className="flex flex-wrap items-center gap-3 py-4 border-b border-linea">
              <div className="flex-1 min-w-[12rem]">
                <Link href={l.sku.startsWith("GVC-ENR-") ? `/energy#${l.sku.toLowerCase()}` : `/catalogo/${slugProducto(l)}`} className="font-semibold hover:text-azul">
                  {l.nombre}
                </Link>
                <p className="font-mono text-xs text-azul mt-0.5">{l.sku}</p>
              </div>
              <div className="flex items-center border border-linea rounded">
                <button type="button" onClick={() => cambiarCantidad(l.sku, l.cantidad - 1)} disabled={l.cantidad <= 1} className="grid place-items-center w-11 h-11 disabled:text-linea" aria-label={`Una menos de ${l.nombre}`}>
                  <Minus size={16} />
                </button>
                <label htmlFor={`cant-${l.sku}`} className="sr-only">
                  Cantidad de {l.nombre}
                </label>
                <input
                  id={`cant-${l.sku}`}
                  inputMode="numeric"
                  value={l.cantidad}
                  onChange={(e) => cambiarCantidad(l.sku, Number(e.target.value.replace(/\D/g, "")))}
                  className="w-14 h-11 text-center tabular-nums outline-none"
                />
                <button type="button" onClick={() => cambiarCantidad(l.sku, l.cantidad + 1)} className="grid place-items-center w-11 h-11" aria-label={`Una más de ${l.nombre}`}>
                  <Plus size={16} />
                </button>
              </div>
              <button type="button" onClick={() => quitar(l.sku)} className="grid place-items-center w-11 h-11 text-tenue hover:text-red-700" aria-label={`Quitar ${l.nombre}`}>
                <Trash2 size={18} />
              </button>
            </li>
          ))}
          <li className="pt-3 flex justify-between gap-3">
            <Link href="/catalogo" className="inline-flex items-center min-h-11 text-sm font-semibold text-azul hover:underline">
              Agregar más referencias
            </Link>
            <button type="button" onClick={vaciar} className="min-h-11 text-sm text-tenue hover:text-tinta">
              Vaciar lista
            </button>
          </li>
        </ul>

        <section aria-labelledby="h-enviar" className="border border-linea rounded p-5 flex flex-col gap-4 bg-gris">
          <h2 id="h-enviar" className="text-xl font-bold">
            Enviar
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {campo("nombre", "Tu nombre", "text", "name")}
            {campo("empresa", "Empresa (opcional)", "text", "organization")}
            {campo("ciudad", "Ciudad de entrega", "text", "address-level2")}
            {campo("nota", "Nota (opcional)")}
          </div>
          <a
            href={enlaceWhatsApp(texto)}
            className="inline-flex items-center justify-center min-h-12 px-5 rounded bg-whatsapp text-white font-semibold hover:brightness-110"
          >
            Enviar por WhatsApp
          </a>
          <details className="text-sm">
            <summary className="cursor-pointer min-h-11 flex items-center font-medium text-azul">Prefiero enviarla por correo</summary>
            <div className="flex flex-col gap-3 pt-2">
              {campo("correo", "Tu correo", "email", "email")}
              {campo("telefono", "Teléfono (opcional)", "tel", "tel")}
              <button
                type="button"
                onClick={enviarCorreo}
                disabled={!datos.correo.includes("@") || correo === "enviando"}
                className="min-h-11 px-4 rounded bg-azul text-white font-semibold disabled:opacity-50"
              >
                {correo === "enviando" ? "Enviando…" : "Enviar por correo"}
              </button>
              <p role="status" className="text-sm">
                {correo === "enviado" && "Listo, la recibimos. Te respondemos a tu correo."}
                {correo === "fallo" && `No se pudo enviar por correo. Envíala por WhatsApp o escribe a ${COMPANIA_INFO.email}.`}
              </p>
            </div>
          </details>
        </section>
      </div>
    </div>
  );
}
