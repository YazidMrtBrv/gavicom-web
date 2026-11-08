"use client";

import { Fragment, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, Check, ClipboardPaste, FileText, Inbox, Paperclip, PenLine, Sparkles, Mail } from "lucide-react";
import { pendientesDeAprobacion } from "@/lib/agente/bandeja";
import { nombreDe } from "@/lib/agente/catalogo";
import { pesos, totales } from "@/lib/agente/precios";
import type { Correo, Cotizacion } from "@/lib/agente/tipos";
import Tablero from "./Tablero";
import { useBandeja, type Bandeja as Estado, type BorradorVivo, type Respuesta } from "./useBandeja";
import "./agente.css";

type Carpeta = "recibidos" | "borradores" | "pegar";

function hora(iso: string, ahora: Date): string {
  const f = new Date(iso);
  const mismoDia = f.toDateString() === ahora.toDateString();
  return mismoDia
    ? f.toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit" })
    : f.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

function Avatar({ nombre }: { nombre: string }) {
  const ini = nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return (
    <span className="correo-avatar" aria-hidden="true">
      {ini || "?"}
    </span>
  );
}

// ---- Body with what the agent understood underlined ----------------------

function CuerpoMarcado({ correo, b }: { correo: Correo; b: Estado }) {
  const p = b.procesados[correo.id];
  const marcas = useMemo(() => {
    if (!p) return [];
    const lista = p.solicitud.items.map((it, i) => ({ desde: it.desde, hasta: it.hasta, n: i + 1, completo: Boolean(it.sku && it.cantidad) }));
    const m = correo.cuerpo.match(/\d[\d.]*\s*(m|metros)\s+de\s+v[ií]a/);
    if (p.solicitud.pedidoPorMetros && m?.index != null) lista.push({ desde: m.index, hasta: m.index + m[0].length, n: 0, completo: true });
    return lista.sort((a, c) => a.desde - c.desde);
  }, [correo, p]);
  const partes: ReactNode[] = [];
  let i = 0;
  for (const m of marcas) {
    if (m.desde < i) continue;
    partes.push(<Fragment key={`t${i}`}>{correo.cuerpo.slice(i, m.desde)}</Fragment>);
    partes.push(
      <mark key={`m${m.desde}`} className={`correo-marca ${m.completo ? "" : "incompleta"}`}>
        {correo.cuerpo.slice(m.desde, m.hasta)}
        {m.n > 0 && <span className="correo-marca-n">{m.n}</span>}
      </mark>,
    );
    i = m.hasta;
  }
  partes.push(<Fragment key="fin">{correo.cuerpo.slice(i)}</Fragment>);
  return <div className="correo-cuerpo">{partes}</div>;
}

function Mensaje({ correo, b, marcar }: { correo: Correo; b: Estado; marcar?: boolean }) {
  return (
    <article className="correo-mensaje">
      <header className="flex items-start gap-3">
        <Avatar nombre={correo.de.nombre} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-tinta truncate">{correo.de.nombre}</p>
          <p className="text-sm text-tenue truncate">
            {correo.de.correo} · para {correo.para.correo}
          </p>
        </div>
        <span className="text-sm text-tenue whitespace-nowrap">{hora(correo.fecha, b.ahora)}</span>
      </header>
      {marcar ? <CuerpoMarcado correo={correo} b={b} /> : <div className="correo-cuerpo">{correo.cuerpo}</div>}
      {correo.adjuntos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {correo.adjuntos.map((a) => (
            <span key={a} className="correo-adjunto">
              <Paperclip size={15} aria-hidden="true" /> {a}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

function TarjetaBorrador({ bv, b }: { bv: BorradorVivo; b: Estado }) {
  const d = bv.borrador;
  const pdf = d.adjunto ? b.pdfs[d.adjunto] : undefined;
  return (
    <article className={`correo-borrador ${bv.aprobado ? "aprobado" : ""}`}>
      <p className="correo-borrador-etq">
        <PenLine size={15} aria-hidden="true" />
        {bv.aprobado ? "Borrador aprobado · en Borradores de gerencia@ para que Geimar lo envíe" : "Borrador del agente · por revisar"}
      </p>
      <dl className="correo-campos">
        <dt>Para</dt>
        <dd>
          {d.para.nombre} &lt;{d.para.correo}&gt;
        </dd>
        <dt>Asunto</dt>
        <dd>{d.asunto}</dd>
      </dl>
      <div className="correo-cuerpo">{d.cuerpo}</div>
      {d.adjunto && (
        <div className="mt-3">
          {pdf ? (
            <a href={pdf} target="_blank" rel="noopener" className="correo-adjunto pdf">
              <FileText size={16} aria-hidden="true" /> Cotizacion-{d.adjunto}-GAVICOM.pdf
            </a>
          ) : (
            <span className="correo-adjunto">Preparando PDF…</span>
          )}
        </div>
      )}
      {!bv.aprobado && (
        <button type="button" onClick={() => b.aprobarBorrador(d.id)} className="boton-principal mt-4">
          <Check size={18} aria-hidden="true" /> Aprobar borrador
        </button>
      )}
    </article>
  );
}

// ---- Agent panel ---------------------------------------------------------

const ENTREGAS = ["5 días hábiles", "15 días hábiles", "30 días"];
const PAGOS = ["Contado", "Crédito a 30 días", "50 % anticipo"];

const RESPUESTAS: { tipo: Respuesta; texto: string }[] = [
  { tipo: "aprueba", texto: "La aprueba" },
  { tipo: "precio", texto: "No: muy caro" },
  { tipo: "otro", texto: "Le compró a otro" },
  { tipo: "sinMotivo", texto: "No, sin decir por qué" },
];

function SimularRespuesta({ numero, hilo, b }: { numero: string; hilo?: string; b: Estado }) {
  const cot = b.cotizaciones[numero];
  if (!cot || cot.estado === "ganada" || cot.estado === "perdida") return null;
  return (
    <div className="mt-4 rounded-xl border border-dashed border-linea p-4">
      <p className="t-nombre text-tinta">Demostración: ¿qué contesta el cliente?</p>
      <p className="text-sm text-tenue">Con el correo conectado, el agente lee la respuesta real en la bandeja.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {RESPUESTAS.map((r) => (
          <button key={r.tipo} type="button" onClick={() => b.simularRespuesta(numero, r.tipo, hilo)} className="boton-secundario">
            {r.texto}
          </button>
        ))}
      </div>
    </div>
  );
}

function Resultado({ cot }: { cot: Cotizacion }) {
  if (cot.estado !== "ganada" && cot.estado !== "perdida") return null;
  const ganada = cot.estado === "ganada";
  return (
    <p className={`mt-4 rounded-xl p-4 text-sm ${ganada ? "bg-[#e7f8f1] text-[#0b5e47]" : "bg-[#fdecec] text-[#8a1c1c]"}`}>
      {ganada ? `Ganada: ${pesos(totales(cot.lineas).total)} con IVA. Pasa al tablero.` : `Perdida${cot.motivo && cot.motivo !== "otro" ? ` por ${cot.motivo === "precio" ? "precio" : cot.motivo === "plazo" ? "tiempo de entrega" : cot.motivo === "ya-compro" ? "otro proveedor" : "proyecto aplazado"}` : ": el agente preguntó el motivo en un borrador"}. Pasa al tablero.`}
    </p>
  );
}

function PanelSolicitud({ correoId, b }: { correoId: string; b: Estado }) {
  const p = b.procesados[correoId];
  if (!p) return <p className="text-sm text-tenue">Este correo no es una solicitud de cotización.</p>;
  const s = p.solicitud;
  const cot = p.cotizacion ? b.conPrecios(b.cotizaciones[p.cotizacion.numero]) : null;
  const escritos = cot ? b.precios[cot.numero] ?? [] : [];
  const pendientes = cot ? pendientesDeAprobacion(cot) : [];
  const editable = cot?.estado === "esperando-precios";
  const t = cot ? totales(cot.lineas) : null;
  const aclaracion = b.borradores.find((x) => x.hilo === correoId && x.borrador.tipo === "aclaracion");
  // Same numbers as the marks in the email: "m" for lines from the metres
  // of track, the item's position in the email for the rest.
  const enMetros = s.pedidoPorMetros?.lineas.length ?? 0;
  const completos = s.items.map((it, k) => ({ it, k })).filter((x) => x.it.sku && x.it.cantidad);
  const marca = (i: number) => (i < enMetros ? "m" : String((completos[i - enMetros]?.k ?? i) + 1));

  return (
    <div className="grid gap-5">
      <section>
        <p className="t-etiqueta text-tenue">Quién escribe</p>
        <p className="mt-1 t-nombre text-tinta">{p.cliente.nombre}</p>
        <p className="text-sm text-tenue">{[s.cargo, p.cliente.empresa].filter(Boolean).join(" · ")}</p>
        <p className={`mt-2 inline-block rounded-full px-3 py-1 text-sm ${p.recuerdo ? "bg-azul-suave text-azul" : "bg-gris text-tenue"}`}>{p.recuerdo ?? "Cliente nuevo: queda guardado para la próxima"}</p>
      </section>

      <section className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <p className="text-tenue">Su referencia</p>
        <p className="text-tinta">{s.referenciaCliente || "—"}</p>
        <p className="text-tenue">Entrega en</p>
        <p className="text-tinta">{s.ciudadEntrega || "No lo dice"}</p>
        <p className="text-tenue">Lo necesita</p>
        <p className="text-tinta">{s.plazo || "No lo dice"}</p>
      </section>

      {s.diagnostico && (
        <p className="rounded-xl bg-azul-suave p-3 text-sm text-azul">
          Contó una falla en la vía ({s.diagnostico === "bombeo" ? "bombeo" : s.diagnostico === "hamaca" ? "durmientes que bailan" : s.diagnostico}). La respuesta lleva una nota técnica, sin cifras ni límites sin fuente.
        </p>
      )}

      {s.faltantes.length > 0 && (
        <section className="rounded-xl border border-[#f2c879] bg-[#fff8e8] p-3 text-sm">
          <p className="font-semibold text-[#7a4a00]">Lo que el correo no dice</p>
          <ul className="mt-1 list-disc pl-5 text-[#7a4a00]">
            {s.faltantes.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {aclaracion && <p className="mt-2 text-[#7a4a00]">Dejó un borrador preguntándolo; abajo en el hilo.</p>}
        </section>
      )}

      {cot && (
        <section>
          <div className="flex items-baseline justify-between gap-2">
            <p className="t-etiqueta text-tenue">Cotización {cot.numero}</p>
            {s.pedidoPorMetros && <p className="text-sm text-tenue">{s.pedidoPorMetros.metros.toLocaleString("es-CO")} m de vía</p>}
          </div>
          <ol className="mt-2 grid gap-2">
            {cot.lineas.map((l, i) => (
              <li key={`${l.sku}-${i}`} className="rounded-xl border border-linea p-3">
                <div className="flex items-start gap-2">
                  <span className="correo-marca-n estatica">{marca(i)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-tinta">
                      {l.cantidad.toLocaleString("es-CO")} × {nombreDe(l.sku)}
                    </p>
                    <p className="t-dato text-tenue">{l.sku}</p>
                    {i < enMetros && <p className="text-xs text-tenue mt-0.5">{l.porque}</p>}
                  </div>
                </div>
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <span className="text-tenue whitespace-nowrap">Precio unitario</span>
                  <input
                    inputMode="numeric"
                    disabled={!editable}
                    value={escritos[i] ?? (l.precioUnitario != null ? l.precioUnitario.toLocaleString("es-CO") : "")}
                    onChange={(e) => b.escribirPrecio(cot.numero, i, e.target.value)}
                    placeholder="Lo pone Geimar"
                    className="campo-precio"
                    aria-label={`Precio unitario de ${nombreDe(l.sku)}`}
                  />
                </label>
              </li>
            ))}
          </ol>
          {s.pedidoPorMetros && <p className="mt-2 text-xs text-tenue">{s.pedidoPorMetros.notas.at(-1)}</p>}

          <div className="mt-4 grid gap-3">
            {(["entrega", "pago"] as const).map((campo) => (
              <div key={campo}>
                <label className="text-sm text-tenue" htmlFor={`${cot.numero}-${campo}`}>
                  {campo === "entrega" ? "Tiempo de entrega" : "Forma de pago"}
                </label>
                <input
                  id={`${cot.numero}-${campo}`}
                  disabled={!editable}
                  value={cot.condiciones[campo]}
                  onChange={(e) => b.escribirCondicion(cot.numero, campo, e.target.value)}
                  className="campo-texto"
                  placeholder="Lo define Geimar"
                />
                {editable && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {(campo === "entrega" ? ENTREGAS : PAGOS).map((v) => (
                      <button key={v} type="button" className="chip" onClick={() => b.escribirCondicion(cot.numero, campo, v)}>
                        {v}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {t && t.subtotal > 0 && (
            <dl className="mt-4 grid grid-cols-2 gap-1 text-sm">
              <dt className="text-tenue">Subtotal</dt>
              <dd className="text-right t-dato text-tinta">{pesos(t.subtotal)}</dd>
              <dt className="text-tenue">IVA 19 %</dt>
              <dd className="text-right t-dato text-tinta">{pesos(t.iva)}</dd>
              <dt className="font-semibold text-azul">Total</dt>
              <dd className="text-right t-dato font-semibold text-azul">{pesos(t.total)}</dd>
            </dl>
          )}

          {editable && (
            <div className="mt-4 grid gap-2">
              <button type="button" onClick={() => b.preciosDeEjemplo(cot)} className="boton-secundario">
                Llenar con precios de ejemplo (demo)
              </button>
              <button type="button" disabled={pendientes.length > 0} onClick={() => b.aprobarCotizacion(correoId)} className="boton-principal">
                <Check size={18} aria-hidden="true" /> Aprobar y dejar en Borradores
              </button>
              {pendientes.length > 0 && <p className="text-sm text-tenue">Falta {pendientes.join(", ")}.</p>}
            </div>
          )}
          {cot.estado === "por-aprobar" && (
            <p className="mt-4 rounded-xl bg-[#e7f8f1] p-3 text-sm text-[#0b5e47]">Listo: la respuesta formal con el PDF quedó en Borradores de gerencia@. Geimar la revisa y la envía; nada sale solo.</p>
          )}
          <SimularRespuesta numero={cot.numero} hilo={correoId} b={b} />
          <Resultado cot={b.cotizaciones[cot.numero]} />
        </section>
      )}
    </div>
  );
}

function PanelBorrador({ bv, b }: { bv: BorradorVivo; b: Estado }) {
  const cot = bv.cotizacion ? b.cotizaciones[bv.cotizacion] : undefined;
  return (
    <div className="grid gap-4">
      <section>
        <p className="t-etiqueta text-tenue">Por qué lo escribió</p>
        <p className="mt-1 text-tinta">{bv.borrador.porque}</p>
        {bv.propio && <p className="mt-2 text-sm text-tenue">Nadie le pidió nada: lo sacó de las cotizaciones y las compras guardadas, a las 6:00 a. m.</p>}
      </section>
      {bv.aprobado && cot && bv.borrador.tipo === "seguimiento" && <SimularRespuesta numero={cot.numero} b={b} />}
      {cot && <Resultado cot={cot} />}
    </div>
  );
}

// ---- Paste your own request -----------------------------------------------

function Pegar({ b }: { b: Estado }) {
  const [asunto, setAsunto] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [leyendo, setLeyendo] = useState(false);
  return (
    <form
      className="grid gap-3 p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!cuerpo.trim()) return;
        setLeyendo(true);
        await b.pegarCorreo(asunto, cuerpo);
        setLeyendo(false);
        setAsunto("");
        setCuerpo("");
      }}
    >
      <p className="text-sm text-tenue">Pega una solicitud como la escribiría un cliente (sin datos reales de personas) y mira qué entiende el agente.</p>
      <input value={asunto} onChange={(e) => setAsunto(e.target.value)} placeholder="Asunto" className="campo-texto" aria-label="Asunto" />
      <textarea
        value={cuerpo}
        onChange={(e) => setCuerpo(e.target.value)}
        rows={9}
        className="campo-texto"
        aria-label="Cuerpo del correo"
        placeholder={"Buenos días,\nSolicitamos cotización de:\n- Eclisas para riel de 115 lb: 60 und\n- Pernos de eclisa: 240 und\nEntrega en Ciénaga, Magdalena.\n\nCordialmente,\nNombre\nCargo\nEmpresa S.A.S."}
      />
      <button type="submit" className="boton-principal" disabled={leyendo || !cuerpo.trim()}>
        <Sparkles size={18} aria-hidden="true" /> {leyendo ? "Leyendo…" : "Que el agente lo lea"}
      </button>
    </form>
  );
}

// ---- The whole mailbox ------------------------------------------------------

export default function Bandeja() {
  const b = useBandeja();
  const [carpeta, setCarpeta] = useState<Carpeta>("recibidos");
  const [enDetalle, setEnDetalle] = useState(false);
  const solicitudes = b.correos.filter((c) => !c.enRespuestaA);
  // Every draft waiting in gerencia@'s Drafts folder, newest first.
  const propios = [...b.borradores].reverse();
  const porRevisar = b.borradores.filter((x) => !x.aprobado).length;

  const sel = b.seleccion;
  const correoSel = sel.tipo === "correo" ? b.correos.find((c) => c.id === sel.id) : undefined;
  const borradorSel = sel.tipo === "borrador" ? b.borradores.find((x) => x.borrador.id === sel.id) : undefined;
  const respuestas = (id: string) => b.correos.filter((c) => c.enRespuestaA === id).reverse();

  const abrir = (s: typeof sel) => {
    b.abrir(s);
    setEnDetalle(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${b.estado.ia ? "bg-[#e7f8f1] text-[#006e58]" : "bg-gris text-tenue"}`}>
          <Sparkles size={15} aria-hidden="true" />
          {b.estado.ia ? "IA conectada: lee correos enredados y PDF" : "IA sin clave: lee con reglas; los correos enredados esperan la clave"}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-gris px-3 py-1.5 text-tenue">
          <Mail size={15} aria-hidden="true" />
          {b.estado.correo ? "Buzón de gerencia@ conectado" : "Correos de ejemplo: el buzón aún no está conectado"}
        </span>
      </div>

      <div className="correo-marco mt-5">
        {/* Folder list */}
        <aside className={`correo-lista ${enDetalle ? "hidden lg:flex" : "flex"}`} aria-label="Carpetas y correos">
          <div className="border-b border-linea p-4">
            <p className="text-sm text-tenue">gerencia@gavicom.com</p>
            <p className="mt-1 text-sm text-tinta">
              <span className="font-semibold">6:00 a. m.</span> El agente leyó {solicitudes.filter((c) => !c.id.startsWith("pegado")).length} solicitudes y dejó {porRevisar} borradores por revisar.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1 p-2" role="tablist" aria-label="Carpeta">
            {(
              [
                ["recibidos", "Recibidos", <Inbox key="i" size={16} aria-hidden="true" />],
                ["borradores", `Borradores ${porRevisar ? `(${porRevisar})` : ""}`, <PenLine key="p" size={16} aria-hidden="true" />],
                ["pegar", "Pegar uno", <ClipboardPaste key="c" size={16} aria-hidden="true" />],
              ] as const
            ).map(([id, texto, icono]) => (
              <button key={id} type="button" role="tab" aria-selected={carpeta === id} onClick={() => setCarpeta(id)} className={`correo-carpeta ${carpeta === id ? "activa" : ""}`}>
                {icono}
                <span>{texto}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {carpeta === "recibidos" &&
              solicitudes.map((c) => {
                const p = b.procesados[c.id];
                const activo = sel.tipo === "correo" && sel.id === c.id;
                const cot = p?.cotizacion ? b.cotizaciones[p.cotizacion.numero] : undefined;
                return (
                  <button key={c.id} type="button" onClick={() => abrir({ tipo: "correo", id: c.id })} className={`correo-fila ${activo ? "activa" : ""} ${b.leidos.includes(c.id) ? "" : "nueva"}`}>
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-semibold text-tinta">{c.de.nombre}</span>
                      <span className="text-xs text-tenue whitespace-nowrap">{hora(c.fecha, b.ahora)}</span>
                    </span>
                    <span className="block truncate text-sm text-tinta">{c.asunto}</span>
                    <span className="mt-1 flex flex-wrap gap-1.5">
                      {p && <span className="correo-etq azul">Solicitud de cotización</span>}
                      {p?.solicitud.faltantes.length ? <span className="correo-etq ambar">Faltan datos</span> : null}
                      {cot && cot.estado !== "esperando-precios" && <span className="correo-etq verde">{cot.estado === "por-aprobar" ? "Borrador listo" : cot.estado === "ganada" ? "Ganada" : cot.estado === "perdida" ? "Perdida" : "Enviada"}</span>}
                      {respuestas(c.id).length > 0 && <span className="correo-etq">Respondió</span>}
                    </span>
                  </button>
                );
              })}
            {carpeta === "borradores" &&
              (propios.length ? (
                propios.map((x) => {
                  const activo = sel.tipo === "borrador" && sel.id === x.borrador.id;
                  return (
                    <button
                      key={x.borrador.id}
                      type="button"
                      // A draft that answers a request opens inside its thread.
                      onClick={() => abrir(x.hilo ? { tipo: "correo", id: x.hilo } : { tipo: "borrador", id: x.borrador.id })}
                      className={`correo-fila ${activo ? "activa" : ""}`}
                    >
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate font-semibold text-tinta">Para: {x.borrador.para.nombre}</span>
                        <span className={`correo-etq ${x.aprobado ? "verde" : "ambar"}`}>{x.aprobado ? "Aprobado" : "Por revisar"}</span>
                      </span>
                      <span className="block truncate text-sm text-tinta">{x.borrador.asunto}</span>
                      <span className="block truncate text-sm text-tenue">{x.borrador.porque}</span>
                    </button>
                  );
                })
              ) : (
                <p className="p-4 text-sm text-tenue">No hay borradores propios hoy.</p>
              ))}
            {carpeta === "pegar" && <Pegar b={b} />}
          </div>
        </aside>

        {/* Reading pane */}
        <section className={`correo-lectura ${enDetalle ? "block" : "hidden lg:block"}`} aria-label="Correo abierto">
          <button type="button" onClick={() => setEnDetalle(false)} className="lg:hidden mb-3 inline-flex min-h-11 items-center gap-2 text-azul font-semibold">
            <ArrowLeft size={18} aria-hidden="true" /> Bandeja
          </button>
          {correoSel && (
            <>
              <h2 className="t-tarjeta text-tinta">{correoSel.asunto}</h2>
              <div className="mt-4 grid gap-4">
                <Mensaje correo={correoSel} b={b} marcar />
                {b.borradores
                  .filter((x) => x.hilo === correoSel.id && x.borrador.tipo === "aclaracion")
                  .map((x) => (
                    <TarjetaBorrador key={x.borrador.id} bv={x} b={b} />
                  ))}
                {b.borradores
                  .filter((x) => x.hilo === correoSel.id && x.borrador.tipo === "cotizacion")
                  .map((x) => (
                    <TarjetaBorrador key={x.borrador.id} bv={x} b={b} />
                  ))}
                {respuestas(correoSel.id).map((r) => (
                  <Mensaje key={r.id} correo={r} b={b} />
                ))}
                {b.borradores
                  .filter((x) => x.hilo === correoSel.id && (x.borrador.tipo === "agradecimiento" || x.borrador.tipo === "motivo"))
                  .map((x) => (
                    <TarjetaBorrador key={x.borrador.id} bv={x} b={b} />
                  ))}
              </div>
            </>
          )}
          {borradorSel && (
            <>
              <h2 className="t-tarjeta text-tinta">{borradorSel.borrador.asunto}</h2>
              <div className="mt-4 grid gap-4">
                <TarjetaBorrador bv={borradorSel} b={b} />
                {borradorSel.cotizacion &&
                  respuestas(borradorSel.cotizacion).map((r) => (
                    <Mensaje key={r.id} correo={r} b={b} />
                  ))}
                {b.borradores
                  .filter((x) => x.cotizacion === borradorSel.cotizacion && !x.propio && x.hilo === undefined && x !== borradorSel)
                  .map((x) => (
                    <TarjetaBorrador key={x.borrador.id} bv={x} b={b} />
                  ))}
              </div>
            </>
          )}
        </section>

        {/* Agent panel */}
        <aside className={`correo-panel ${enDetalle ? "block" : "hidden lg:block"}`} aria-label="Lo que entendió el agente">
          <p className="flex items-center gap-2 t-nombre text-azul">
            <Sparkles size={17} aria-hidden="true" /> El agente
          </p>
          <div className="mt-4">
            {correoSel && <PanelSolicitud correoId={correoSel.id} b={b} />}
            {borradorSel && <PanelBorrador bv={borradorSel} b={b} />}
          </div>
        </aside>
      </div>

      <section aria-labelledby="titulo-plata" className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="titulo-plata" className="t-seccion text-azul">
              La plata, sin abrir Excel
            </h2>
            <p className="mt-2 t-texto text-tenue max-w-2xl">Cotizaciones de ejemplo de los últimos 60 días, más las que apruebes aquí arriba: cuando un cliente contesta, la cifra se mueve.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#fff4e0] px-3 py-1.5 text-sm text-[#8a4b06]">Cifras de ejemplo, no son precios de GAVICOM</span>
        </div>
        <div className="mt-6">
          <Tablero cotizaciones={Object.values(b.cotizaciones)} />
        </div>
      </section>
    </div>
  );
}
