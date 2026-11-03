"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { slugProducto } from "@/lib/catalogo";
import { useCotizacion } from "@/lib/cotizacion";
import { PLAZOS, enlaceWhatsApp, mensajeCotizacion, type DatosContacto } from "@/lib/whatsapp";
import SelectorCantidad from "@/components/catalogo/SelectorCantidad";

type EstadoCorreo = "nada" | "enviando" | "enviado" | "fallo" | "correo-invalido";
type Campo = "nombre" | "empresa" | "ciudad" | "nota" | "correo" | "telefono";
type Datos = Record<Campo, string> & { plazo: string };

// Without a name and a delivery city every quote starts with a question
// back, so both are asked before the message leaves.
const OBLIGATORIOS: Campo[] = ["nombre", "ciudad"];

export default function Cotizacion() {
  const { lineas, total, cambiarCantidad, quitar, vaciar } = useCotizacion();
  const [datos, setDatos] = useState<Datos>({ nombre: "", empresa: "", ciudad: "", nota: "", correo: "", telefono: "", plazo: "" });
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const [correo, setCorreo] = useState<EstadoCorreo>("nada");
  // Emptying the list is one tap away from the last item's controls, so it
  // asks once before wiping everything the visitor built.
  const [confirmarVaciar, setConfirmarVaciar] = useState(false);
  // Honeypot: hidden from people, filled by bots; the API drops those posts.
  const [trampa, setTrampa] = useState("");
  const refs = useRef<Partial<Record<Campo, HTMLInputElement | null>>>({});

  // The field takes a NIT or a company name: a number goes on its own "NIT:"
  // line, so sales never mistakes it for a phone number after the name.
  const empresaONit = datos.empresa.trim();
  const esNit = /^\d[\d.\s]*(-\s*\d)?$/.test(empresaONit) && empresaONit.replace(/\D/g, "").length >= 6;
  const contacto: DatosContacto = {
    nombre: datos.nombre.trim(),
    empresa: esNit ? "" : empresaONit,
    nit: esNit ? empresaONit : undefined,
    ciudad: datos.ciudad.trim(),
    nota: datos.nota.trim(),
    plazo: datos.plazo,
  };
  const texto = mensajeCotizacion(lineas, contacto);

  // Returns true when the required fields are filled; otherwise marks them
  // and moves focus to the first empty one so the visitor sees what is missing.
  function validar(): boolean {
    const nuevos: Partial<Record<Campo, string>> = {};
    if (!datos.nombre.trim()) nuevos.nombre = "Escribe tu nombre.";
    if (!datos.ciudad.trim()) nuevos.ciudad = "Escribe la ciudad de entrega.";
    setErrores(nuevos);
    const primero = OBLIGATORIOS.find((c) => nuevos[c]);
    if (primero) refs.current[primero]?.focus();
    return !primero;
  }

  const campo = (id: Campo, etiqueta: string, opciones: { tipo?: string; auto?: string; obligatorio?: boolean } = {}) => {
    const error = errores[id];
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={`cot-${id}`} className="text-sm font-medium">
          {etiqueta}
          {opciones.obligatorio && (
            <span className="text-tenue font-normal"> (obligatorio)</span>
          )}
        </label>
        <input
          id={`cot-${id}`}
          ref={(el) => {
            refs.current[id] = el;
          }}
          type={opciones.tipo ?? "text"}
          autoComplete={opciones.auto}
          required={opciones.obligatorio}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `cot-${id}-error` : undefined}
          value={datos[id]}
          onChange={(e) => {
            const v = e.target.value;
            setDatos((d) => ({ ...d, [id]: v }));
            if (error && v.trim()) setErrores((x) => ({ ...x, [id]: undefined }));
          }}
          className={`min-h-11 px-3 rounded border bg-white outline-none focus:border-azul ${error ? "border-red-700" : "border-linea"}`}
        />
        {error && (
          <p id={`cot-${id}-error`} className="text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    );
  };

  async function enviarCorreo() {
    if (!validar()) return;
    const entrada = refs.current.correo;
    if (!datos.correo.trim() || (entrada && !entrada.checkValidity())) {
      setCorreo("correo-invalido");
      entrada?.focus();
      return;
    }
    setCorreo("enviando");
    try {
      const r = await fetch("/api/contacto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre: [contacto.nombre, contacto.empresa, contacto.nit && `NIT ${contacto.nit}`].filter(Boolean).join(", "),
          telefono: datos.telefono,
          email: datos.correo.trim(),
          tipo: "Cotización",
          mensaje: texto,
          empresa_web: trampa,
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
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10">
        <h1 className="text-3xl font-bold">Mi cotización</h1>
        <div className="mt-6 max-w-3xl border border-linea rounded bg-gris p-6 flex flex-col gap-3 items-start">
          <p className="font-semibold">Tu lista está vacía.</p>
          <p className="text-tenue text-sm">En el catálogo, toca «Agregar a cotización» en cada referencia que necesites. La lista se guarda en este navegador.</p>
          <Link href="/catalogo" className="inline-flex items-center min-h-11 px-4 rounded bg-azul text-white font-semibold hover:bg-azul-hover">
            Ir al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 md:pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-3xl font-bold">Mi cotización</h1>
        <p className="text-tenue tabular-nums">
          {lineas.length} {lineas.length === 1 ? "referencia" : "referencias"} · {total} {total === 1 ? "unidad" : "unidades"}
        </p>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr] items-start">
        <ul className="border-t border-linea">
          {lineas.map((l) => {
            const clave = `${l.sku}|${l.variante ?? ""}`;
            const nombreCompleto = l.variante ? `${l.nombre}, ${l.variante}` : l.nombre;
            return (
              // Phone: name on its own line, quantity and delete in one row
              // below; from sm up, all on one line.
              <li key={clave} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 py-4 border-b border-linea">
                <div className="flex-1 min-w-0">
                  <Link href={l.sku.startsWith("GVC-ENR-") ? `/energy#${l.sku.toLowerCase()}` : `/catalogo/${slugProducto(l)}`} className="inline-flex items-center min-h-11 font-semibold hover:text-azul">
                    {l.nombre}
                  </Link>
                  {l.variante && <p className="text-sm text-tinta">{l.variante}</p>}
                  <p className="font-mono text-xs text-azul mt-0.5">{l.sku}</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <SelectorCantidad id={`cant-${clave}`} valor={l.cantidad} cambiar={(n) => cambiarCantidad(l.sku, n, l.variante)} etiqueta={`Cantidad de ${nombreCompleto}`} />
                  <button type="button" onClick={() => quitar(l.sku, l.variante)} className="grid place-items-center w-11 h-11 text-tenue hover:text-red-700" aria-label={`Quitar ${nombreCompleto}`}>
                    <Trash2 size={18} aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
          <li className="pt-3 flex justify-between gap-3">
            <Link href="/catalogo" className="inline-flex items-center min-h-11 text-sm font-semibold text-azul hover:underline">
              Agregar más referencias
            </Link>
            {confirmarVaciar ? (
              <span role="group" aria-label="¿Vaciar toda la lista?" className="flex flex-wrap items-center justify-end gap-2 text-sm">
                <span className="text-tinta">¿Vaciar toda la lista?</span>
                <button type="button" onClick={vaciar} className="min-h-11 px-3 rounded border border-red-700 text-red-700 font-semibold hover:bg-red-50">
                  Sí, vaciar
                </button>
                <button type="button" autoFocus onClick={() => setConfirmarVaciar(false)} className="min-h-11 px-3 rounded border border-linea font-semibold hover:border-azul">
                  Cancelar
                </button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirmarVaciar(true)} className="min-h-11 text-sm text-tenue hover:text-tinta">
                Vaciar lista
              </button>
            )}
          </li>
        </ul>

        <section aria-labelledby="h-enviar" className="border border-linea rounded p-5 flex flex-col gap-4 bg-gris">
          <h2 id="h-enviar" className="text-xl font-bold">
            Enviar
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {campo("nombre", "Tu nombre", { auto: "name", obligatorio: true })}
            {campo("ciudad", "Ciudad de entrega", { auto: "address-level2", obligatorio: true })}
            {campo("empresa", "NIT o empresa (opcional)", { auto: "organization" })}
            {campo("nota", "Nota (opcional)")}
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium mb-1">¿Para cuándo lo necesitas? <span className="text-tenue font-normal">(opcional)</span></legend>
            <div className="flex flex-wrap gap-2">
              {PLAZOS.map((p) => {
                const activo = datos.plazo === p;
                return (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => setDatos((d) => ({ ...d, plazo: activo ? "" : p }))}
                    className={`min-h-11 px-4 rounded border text-sm font-medium transition-colors ${
                      activo ? "bg-azul text-white border-azul" : "bg-white text-tinta border-linea hover:border-azul hover:text-azul"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Bots fill every input they find; people never see this one. */}
          <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
            <label htmlFor="cot-empresa-web">No llenar este campo</label>
            <input id="cot-empresa-web" name="empresa_web" tabIndex={-1} autoComplete="off" value={trampa} onChange={(e) => setTrampa(e.target.value)} />
          </div>

          <details open className="text-sm border border-linea rounded bg-white">
            <summary className="cursor-pointer min-h-11 flex items-center px-3 font-medium text-azul">Así se verá tu mensaje</summary>
            <pre className="px-3 pb-3 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-tinta">{texto}</pre>
          </details>

          <a
            href={enlaceWhatsApp(texto)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!validar()) e.preventDefault();
            }}
            className="inline-flex items-center justify-center min-h-12 px-5 rounded bg-whatsapp text-white font-semibold hover:brightness-110"
          >
            Enviar por WhatsApp
          </a>
          <details className="text-sm">
            <summary className="cursor-pointer min-h-11 flex items-center font-medium text-azul">Prefiero enviarla por correo</summary>
            <div className="flex flex-col gap-3 pt-2">
              {campo("correo", "Tu correo", { tipo: "email", auto: "email" })}
              {campo("telefono", "Teléfono (opcional)", { tipo: "tel", auto: "tel" })}
              <button
                type="button"
                onClick={enviarCorreo}
                disabled={correo === "enviando"}
                className="min-h-11 px-4 rounded bg-azul text-white font-semibold hover:bg-azul-hover disabled:opacity-50"
              >
                {correo === "enviando" ? "Enviando…" : "Enviar por correo"}
              </button>
              <p role="status" className="text-sm">
                {correo === "enviado" && "Listo, la recibimos. Te respondemos a tu correo."}
                {correo === "correo-invalido" && "Revisa tu correo: debe tener la forma nombre@empresa.com."}
                {correo === "fallo" && `No se pudo enviar por correo. Envíala por WhatsApp o escribe a ${COMPANIA_INFO.email}.`}
              </p>
            </div>
          </details>
        </section>
      </div>
    </div>
  );
}
