"use client";

import { Suspense, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Mail, MessageCircle } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { enlaceWhatsApp } from "@/lib/whatsapp";

const TEMAS = [
  "Suministro de materiales",
  "Herramientas de vía",
  "Señalización",
  "Fabricación de piezas",
  "GAVICOM Energy (solar)",
  "Servicios técnicos",
  "Alquiler de motosoldadores",
  "Otro",
];

// Values other pages use in ?tema= links; anything else leaves the choice empty
// so nobody sends a request filed under a topic they did not pick.
const TEMA_POR_PARAMETRO: Record<string, string> = {
  suministro: "Suministro de materiales",
  fabricacion: "Fabricación de piezas",
  energy: "GAVICOM Energy (solar)",
  servicios: "Servicios técnicos",
};

type Estado = "nada" | "enviando" | "enviado" | "fallo";

const telefonoLegible = (n: string) => n.replace(/^\+57(\d{3})(\d{3})(\d{4})$/, "+57 $1 $2 $3");

const vacio = (tema: string) => ({ nombre: "", telefono: "", email: "", tipo: tema, mensaje: "", empresa_web: "" });

function mensajeWhatsApp(f: ReturnType<typeof vacio>) {
  return [
    `Hola GAVICOM, les escribe ${f.nombre.trim() || "un cliente"}.`,
    f.telefono.trim() && `Teléfono: ${f.telefono.trim()}`,
    f.tipo && `Tema: ${f.tipo}`,
    f.mensaje.trim(),
  ]
    .filter(Boolean)
    .join("\n");
}

function Formulario({ temaInicial }: { temaInicial: string }) {
  const [f, setF] = useState(() => vacio(temaInicial));
  const [estado, setEstado] = useState<Estado>("nada");
  const [aviso, setAviso] = useState({ email: "", whatsapp: "", detalle: "" });
  const refEstado = useRef<HTMLDivElement>(null);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    // Keep what was typed: on success the form is cleared, and on failure the
    // WhatsApp link must still carry the same text.
    const enviadoCon = { email: f.email, whatsapp: mensajeWhatsApp(f), detalle: "" };
    let resultado: Estado = "fallo";
    try {
      const r = await fetch("/api/contacto", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
      const j = await r.json().catch(() => ({}));
      // enviado:false means email is not set up on the server: say so and
      // offer WhatsApp with the same text instead of a fake "sent".
      resultado = r.ok && j.enviado ? "enviado" : "fallo";
      if (r.status === 429 && typeof j.error === "string") enviadoCon.detalle = j.error;
    } catch {
      resultado = "fallo";
    }
    setAviso(enviadoCon);
    setEstado(resultado);
    if (resultado === "enviado") setF(vacio(""));
    // Move focus to the result so keyboard and screen reader users land on it.
    requestAnimationFrame(() => refEstado.current?.focus());
  }

  const campo = (k: keyof ReturnType<typeof vacio>) => ({
    value: f[k],
    onChange: (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value })),
  });
  const input = "min-h-11 px-3 rounded border border-linea bg-white focus:border-azul outline-none w-full";

  return (
    <form onSubmit={enviar} className="border border-linea rounded p-5 md:p-6 bg-gris flex flex-col gap-4" aria-labelledby="h-form">
      <h2 id="h-form" className="text-2xl font-bold">
        Escríbenos
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="c-nombre" className="text-sm font-medium">Nombre o empresa</label>
          <input id="c-nombre" required autoComplete="name" className={input} {...campo("nombre")} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="c-tema" className="text-sm font-medium">Tema</label>
          <select id="c-tema" required className={input} {...campo("tipo")}>
            <option value="" disabled>
              Elige un tema
            </option>
            {TEMAS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="c-email" className="text-sm font-medium">Correo</label>
          <input id="c-email" type="email" required autoComplete="email" className={input} {...campo("email")} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="c-tel" className="text-sm font-medium">Teléfono (opcional)</label>
          <input id="c-tel" type="tel" autoComplete="tel" className={input} {...campo("telefono")} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="c-msj" className="text-sm font-medium">Mensaje</label>
        <textarea id="c-msj" required rows={5} className={`${input} py-2`} {...campo("mensaje")} />
      </div>
      {/* Honeypot: off screen and out of the tab order, so only bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="c-empresa-web">No llenes este campo</label>
        <input id="c-empresa-web" name="empresa_web" tabIndex={-1} autoComplete="off" {...campo("empresa_web")} />
      </div>
      <div className="flex flex-col gap-3">
        <button type="submit" disabled={estado === "enviando"} className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded bg-azul text-white font-semibold hover:bg-azul-hover disabled:opacity-60">
          <Mail aria-hidden="true" className="size-5" />
          {estado === "enviando" ? "Enviando…" : "Enviar por correo"}
        </button>
        <a
          href={enlaceWhatsApp(mensajeWhatsApp(f))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded border-2 border-whatsapp text-tinta bg-white font-semibold hover:bg-gris"
        >
          <MessageCircle aria-hidden="true" className="size-5 text-whatsapp" />
          Enviar esto por WhatsApp
        </a>
      </div>
      <div ref={refEstado} tabIndex={-1} role="status" className="text-sm outline-none focus-visible:outline-2 focus-visible:outline-azul rounded">
        {estado === "enviado" && (
          <p className="flex items-start gap-2 border border-linea bg-white rounded p-3">
            <CheckCircle aria-hidden="true" className="size-5 shrink-0 text-whatsapp" />
            <span>
              Recibimos tu mensaje. Te respondemos a <strong>{aviso.email}</strong>.
            </span>
          </p>
        )}
        {estado === "fallo" && (
          <p className="border border-linea bg-white rounded p-3">
            {aviso.detalle || "No se pudo enviar el correo."}{" "}
            <a href={enlaceWhatsApp(aviso.whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-11 text-azul font-semibold underline underline-offset-4">
              Envíalo por WhatsApp con tus datos
            </a>{" "}
            o escribe a {COMPANIA_INFO.email}.
          </p>
        )}
      </div>
    </form>
  );
}

// useSearchParams needs a Suspense boundary so the page can still be
// prerendered; the fallback is the same form with no topic chosen.
function FormularioConTema() {
  const tema = TEMA_POR_PARAMETRO[useSearchParams().get("tema") ?? ""] ?? "";
  return <Formulario key={tema} temaInicial={tema} />;
}

export default function Contacto() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-10 md:pt-16 pb-20 md:pb-28">
      <p className="font-mono text-xs md:text-sm tracking-widest uppercase text-tenue">Contacto</p>
      <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Escríbenos por WhatsApp o por correo</h1>
      <p className="text-tenue mt-4 max-w-2xl">Para cotizar varias referencias es más rápido armar tu lista en el catálogo. Para cualquier otra consulta, escríbenos aquí.</p>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.4fr] items-start">
        <section aria-labelledby="h-directo" className="flex flex-col gap-4">
          <h2 id="h-directo" className="text-2xl font-bold">
            Directo
          </h2>
          <a
            href={enlaceWhatsApp("Hola GAVICOM, quiero hacer una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded bg-whatsapp text-white font-semibold self-start hover:brightness-110"
          >
            <MessageCircle aria-hidden="true" className="size-5" />
            WhatsApp {telefonoLegible(COMPANIA_INFO.whatsappSales)}
          </a>
          <dl className="text-sm flex flex-col gap-3">
            <div>
              <dt className="text-tenue">Correo</dt>
              <dd>
                <a href={`mailto:${COMPANIA_INFO.email}`} className="inline-flex items-center min-h-11 text-azul font-medium hover:underline">
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

        <div className="relative">
          <Suspense fallback={<Formulario temaInicial="" />}>
            <FormularioConTema />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
