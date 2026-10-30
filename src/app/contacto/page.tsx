"use client";

import { useState, type FormEvent } from "react";
import { COMPANIA_INFO } from "@/constants/productos";
import { enlaceWhatsApp } from "@/lib/whatsapp";

const TEMAS = ["Suministro de materiales", "Herramientas de vía", "Señalización", "Servicios", "Alquiler de motosoldadores", "Otro"];
type Estado = "nada" | "enviando" | "enviado" | "fallo";

const telefonoLegible = (n: string) => n.replace(/^\+57(\d{3})(\d{3})(\d{4})$/, "+57 $1 $2 $3");

export default function Contacto() {
  const [f, setF] = useState({ nombre: "", telefono: "", email: "", tipo: TEMAS[0], mensaje: "" });
  const [estado, setEstado] = useState<Estado>("nada");

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    try {
      const r = await fetch("/api/contacto", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
      const j = await r.json().catch(() => ({}));
      // enviado:false means email is not set up on the server: say so and
      // offer WhatsApp with the same text instead of a fake "sent".
      setEstado(r.ok && j.enviado ? "enviado" : "fallo");
    } catch {
      setEstado("fallo");
    }
  }

  const textoWhatsApp = [`Hola GAVICOM, les escribe ${f.nombre || "un cliente"}.`, `Tema: ${f.tipo}.`, f.mensaje].filter(Boolean).join("\n");
  const input = "min-h-11 px-3 rounded border border-linea bg-white focus:border-azul outline-none w-full";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 md:pt-12">
      <h1 className="text-3xl md:text-4xl font-bold">Contacto</h1>
      <p className="text-tenue mt-2 max-w-2xl">Para cotizar varias referencias es más rápido armar tu lista en el catálogo. Para cualquier otra consulta, escríbenos aquí.</p>

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_1.4fr] items-start">
        <section aria-labelledby="h-directo" className="flex flex-col gap-4">
          <h2 id="h-directo" className="text-xl font-bold">
            Directo
          </h2>
          <a href={enlaceWhatsApp("Hola GAVICOM, quiero hacer una consulta.")} className="inline-flex items-center justify-center min-h-12 px-5 rounded bg-whatsapp text-white font-semibold self-start">
            WhatsApp {telefonoLegible(COMPANIA_INFO.whatsappSales)}
          </a>
          <dl className="text-sm flex flex-col gap-3">
            <div>
              <dt className="text-tenue">Correo</dt>
              <dd>
                <a href={`mailto:${COMPANIA_INFO.email}`} className="text-azul font-medium hover:underline">
                  {COMPANIA_INFO.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-tenue">Ciudad</dt>
              <dd>
                {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento}
              </dd>
            </div>
            <div>
              <dt className="text-tenue">Cobertura</dt>
              <dd>{COMPANIA_INFO.cobertura}</dd>
            </div>
          </dl>
        </section>

        <form onSubmit={enviar} className="border border-linea rounded p-5 bg-gris flex flex-col gap-4" aria-labelledby="h-form">
          <h2 id="h-form" className="text-xl font-bold">
            Escríbenos
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="c-nombre" className="text-sm font-medium">Nombre o empresa</label>
              <input id="c-nombre" required autoComplete="name" className={input} value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="c-tema" className="text-sm font-medium">Tema</label>
              <select id="c-tema" className={input} value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>
                {TEMAS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="c-email" className="text-sm font-medium">Correo</label>
              <input id="c-email" type="email" required autoComplete="email" className={input} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="c-tel" className="text-sm font-medium">Teléfono (opcional)</label>
              <input id="c-tel" type="tel" autoComplete="tel" className={input} value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="c-msj" className="text-sm font-medium">Mensaje</label>
            <textarea id="c-msj" required rows={5} className={`${input} py-2`} value={f.mensaje} onChange={(e) => setF({ ...f, mensaje: e.target.value })} />
          </div>
          <button type="submit" disabled={estado === "enviando"} className="self-start min-h-12 px-6 rounded bg-azul text-white font-semibold hover:bg-azul-hover disabled:opacity-60">
            {estado === "enviando" ? "Enviando…" : "Enviar"}
          </button>
          <div role="status" className="text-sm">
            {estado === "enviado" && <p>Recibimos tu mensaje. Te respondemos a {f.email}.</p>}
            {estado === "fallo" && (
              <p>
                No se pudo enviar el correo.{" "}
                <a href={enlaceWhatsApp(textoWhatsApp)} className="text-azul font-semibold underline">
                  Envíalo por WhatsApp
                </a>{" "}
                o escribe a {COMPANIA_INFO.email}.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
