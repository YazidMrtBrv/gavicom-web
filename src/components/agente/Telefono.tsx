"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Camera, Check, CheckCheck, FileImage, Mic, Paperclip, Reply, SendHorizontal, Square } from "lucide-react";
import { porSku } from "@/lib/agente/catalogo";
import { imagenPrincipal } from "@/constants/catalogoExtra";
import type { Burbuja } from "./useSimulador";

// One WhatsApp screen. Bubbles of the phone's owner go right (green), the
// other side's go left (white), reply buttons hang under their bubble, and
// documents show a drawn first page like WhatsApp's own preview.

// WhatsApp's *bold* and _italic_.
function formato(texto: string): ReactNode {
  return texto.split(/(\*[^*\n]+\*|_[^_\n]+_)/g).map((parte, i) => {
    if (/^\*[^*]+\*$/.test(parte)) return <strong key={i}>{parte.slice(1, -1)}</strong>;
    if (/^_[^_]+_$/.test(parte)) return <em key={i}>{parte.slice(1, -1)}</em>;
    return <Fragment key={i}>{parte}</Fragment>;
  });
}

function Meta({ b }: { b: Burbuja }) {
  return (
    <span className="wa-meta">
      {b.hora}
      {b.mio && <CheckCheck size={16} className="wa-check" aria-label="Leído" />}
    </span>
  );
}

function Documento({ b, url }: { b: Burbuja; url?: string }) {
  const contenido = (
    <>
      <span className="wa-doc-hoja" aria-hidden="true">
        <span className="wa-doc-banda">
          <Image src="/marca/gavicom-blanco.png" alt="" width={36} height={9} />
        </span>
        <span className="wa-doc-linea" style={{ width: "45%" }} />
        <span className="wa-doc-linea" style={{ width: "70%" }} />
        <span className="wa-doc-linea" style={{ width: "85%" }} />
        <span className="wa-doc-linea" style={{ width: "60%" }} />
        <span className="wa-doc-linea" style={{ width: "35%", marginLeft: "auto" }} />
      </span>
      <span className="wa-doc-pie">
        <span className="wa-pdf">PDF</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">Cotizacion-{b.cotizacion}-GAVICOM.pdf</span>
          <span className="block text-xs" style={{ color: "var(--wa-tenue)" }}>
            {url ? "1 página · PDF · tócalo para abrirlo" : "Preparando…"}
          </span>
        </span>
      </span>
    </>
  );
  return (
    <div className="wa-doc">
      {url ? (
        <a href={url} target="_blank" rel="noopener" className="block" aria-label={`Abrir cotización ${b.cotizacion} en PDF`}>
          {contenido}
        </a>
      ) : (
        contenido
      )}
    </div>
  );
}

function Referencias({ skus }: { skus: string[] }) {
  return (
    <div className="wa-refs">
      {skus.map((s) => {
        const p = porSku(s);
        // Same picture the catalogue leads with; none for brochure-only items.
        const foto = p ? imagenPrincipal(p)?.src : null;
        return (
          <div key={s} className="wa-ref">
            <div className="wa-ref-foto">{foto ? <Image src={foto} alt="" fill sizes="128px" className="object-contain p-1" /> : <span className="grid h-full place-items-center text-xs" style={{ color: "var(--wa-tenue)" }}>Foto a pedido</span>}</div>
            <div className="wa-ref-texto">
              <span className="block font-medium line-clamp-2">{p?.nombre ?? s}</span>
              <span style={{ color: "var(--wa-tenue)" }}>{s}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const ONDA = [6, 12, 18, 9, 22, 14, 8, 16, 20, 11, 7, 15, 19, 10, 13, 21, 9, 6, 14, 17, 8, 12];

function Fila({ b, anterior, nueva, pdf, onBoton }: { b: Burbuja; anterior?: Burbuja; nueva: boolean; pdf?: string; onBoton: (b: Burbuja, boton: string) => void }) {
  if (b.aviso) return <p className="wa-aviso">{b.texto}</p>;
  const primera = !anterior || anterior.mio !== b.mio || anterior.aviso || Boolean(b.dia);
  return (
    <>
      {b.dia && <p className="wa-dia">{b.dia}</p>}
      <div className={`wa-fila ${b.mio ? "mio" : ""} ${primera ? "primera" : ""} ${nueva ? "nueva" : ""}`}>
        <div className="wa-burbuja" style={b.tipo === "imagen" ? { padding: 3 } : undefined}>
          {b.plantilla && <span className="wa-plantilla">{b.plantilla}</span>}
          {b.tipo === "documento" && <Documento b={b} url={b.cotizacion ? pdf : undefined} />}
          {b.tipo === "imagen" && b.imagen && (
            // A data: URL from the visitor's own camera; next/image cannot optimise it.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.imagen} alt="Foto enviada" className="block rounded-md max-h-64 w-auto" />
          )}
          {b.tipo === "voz" && (
            <span className="wa-voz">
              <Mic size={18} className="text-[#00a884]" aria-hidden="true" />
              <span className="wa-onda" aria-hidden="true">
                {ONDA.map((h, i) => (
                  <span key={i} style={{ height: h }} />
                ))}
              </span>
            </span>
          )}
          {b.tipo === "voz" && <span className="block text-xs mt-1 italic" style={{ color: "var(--wa-tenue)" }}>Transcripción: {b.texto}</span>}
          {(b.tipo === "texto" || b.tipo === "referencias") && formato(b.texto)}
          {b.tipo === "referencias" && b.skus && <Referencias skus={b.skus} />}
          {b.tipo !== "documento" && <Meta b={b} />}
          {b.tipo === "documento" && (
            <span className="block text-right">
              <Meta b={b} />
            </span>
          )}
        </div>
      </div>
      {b.botones && b.botones.length > 0 && (
        <div className={`wa-fila ${b.mio ? "mio" : ""}`}>
          <div className="wa-botones w-full">
            {b.botones.map((boton) => (
              <button key={boton} type="button" className="wa-boton" disabled={Boolean(b.botonUsado)} onClick={() => onBoton(b, boton)}>
                <Reply size={16} aria-hidden="true" />
                {boton}
                {b.botonUsado === boton && <Check size={16} aria-label="Escogido" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export interface PropsTelefono {
  etiqueta: string;
  nombre: string;
  subtitulo: string;
  avatar: ReactNode;
  colorAvatar: string;
  burbujas: Burbuja[];
  escribiendo: boolean;
  nuevas: number[];
  pdfs: Record<string, string>;
  sugerencias: { texto: string; destacada?: boolean; rellenar?: boolean }[];
  vacio?: ReactNode;
  onEnviar: (texto: string) => void;
  onBoton: (b: Burbuja, boton: string) => void;
  // Client phone only.
  onFoto?: (dataUrl: string) => void;
  onVoz?: (texto: string) => void;
  onAviso?: (texto: string) => void;
}

type Reconocedor = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export default function Telefono(p: PropsTelefono) {
  const [texto, setTexto] = useState("");
  const [menu, setMenu] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const chat = useRef<HTMLDivElement>(null);
  const entrada = useRef<HTMLInputElement>(null);
  const archivo = useRef<HTMLInputElement>(null);
  const reconocedor = useRef<Reconocedor | null>(null);
  const dictado = useRef("");

  useEffect(() => {
    const el = chat.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [p.burbujas.length, p.escribiendo]);

  function enviar() {
    if (!texto.trim()) return;
    p.onEnviar(texto);
    setTexto("");
  }

  function sugerir(s: { texto: string; rellenar?: boolean }) {
    if (s.rellenar) {
      setTexto(s.texto);
      entrada.current?.focus();
    } else p.onEnviar(s.texto);
  }

  function leerFoto(f: File | undefined) {
    setMenu(false);
    if (!f || !p.onFoto) return;
    // Downscale on the phone before sending: a 12-megapixel photo is too
    // heavy for the request and the model needs far less to recognise a piece.
    const img = new window.Image();
    img.onload = () => {
      const max = 1280;
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
      p.onFoto?.(c.toDataURL("image/jpeg", 0.85));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(f);
  }

  async function fotoDeCatalogo() {
    setMenu(false);
    const res = await fetch("/images/productos/eclisa-angular-75lb.webp");
    const blob = await res.blob();
    leerFoto(new File([blob], "pieza.webp", { type: blob.type }));
  }

  function voz() {
    setMenu(false);
    if (grabando) {
      reconocedor.current?.stop();
      return;
    }
    const w = window as unknown as { SpeechRecognition?: new () => Reconocedor; webkitSpeechRecognition?: new () => Reconocedor };
    const Clase = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Clase) {
      p.onAviso?.("Este navegador no transcribe notas de voz. Pruébalo en Chrome (computador o Android).");
      return;
    }
    const r = new Clase();
    r.lang = "es-CO";
    r.interimResults = false;
    r.continuous = true;
    dictado.current = "";
    r.onresult = (e) => {
      dictado.current = Array.from(e.results)
        .map((x) => x[0].transcript)
        .join(" ");
    };
    r.onend = () => {
      setGrabando(false);
      if (dictado.current.trim()) p.onVoz?.(dictado.current.trim());
    };
    r.onerror = () => setGrabando(false);
    reconocedor.current = r;
    setGrabando(true);
    r.start();
  }

  const conVoz = Boolean(p.onVoz);

  return (
    <div className="wa" aria-label={p.etiqueta} role="group">
      <div className="wa-barra">
        <ArrowLeft size={22} aria-hidden="true" />
        <span className="wa-avatar" style={{ background: p.colorAvatar }}>
          {p.avatar}
        </span>
        <div className="min-w-0 flex-1">
          <p className="wa-nombre truncate">{p.nombre}</p>
          <p className="wa-estado truncate" aria-live="polite">
            {p.escribiendo ? "escribiendo…" : p.subtitulo}
          </p>
        </div>
      </div>

      <div ref={chat} className="wa-chat" aria-live="polite" aria-relevant="additions">
        {p.burbujas.length === 0 && p.vacio}
        {p.burbujas.map((b, i) => (
          <Fila key={b.id} b={b} anterior={p.burbujas[i - 1]} nueva={p.nuevas.includes(b.id)} pdf={b.cotizacion ? p.pdfs[b.cotizacion] : undefined} onBoton={p.onBoton} />
        ))}
        {p.escribiendo && (
          <div className="wa-fila primera nueva">
            <div className="wa-burbuja">
              <span className="wa-escribiendo" aria-label="Escribiendo">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        )}
      </div>

      {p.sugerencias.length > 0 && (
        <div className="wa-sugerencias" aria-label="Mensajes sugeridos">
          {p.sugerencias.map((s) => (
            <button key={s.texto} type="button" className={`wa-sugerencia ${s.destacada ? "destacada" : ""}`} onClick={() => sugerir(s)}>
              {s.rellenar ? "Responder con precios de ejemplo" : s.texto}
            </button>
          ))}
        </div>
      )}

      {menu && p.onFoto && (
        <div className="wa-menu" role="menu">
          <button type="button" role="menuitem" onClick={() => archivo.current?.click()}>
            <Camera size={22} className="text-[#d3396d]" aria-hidden="true" /> Foto de la pieza (cámara o galería)
          </button>
          <button type="button" role="menuitem" onClick={fotoDeCatalogo}>
            <FileImage size={22} className="text-[#7f66ff]" aria-hidden="true" /> Usar una foto de ejemplo (eclisa angular)
          </button>
        </div>
      )}
      <input ref={archivo} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => leerFoto(e.target.files?.[0])} />

      <form
        className="wa-entrada"
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
      >
        <div className="wa-caja">
          {p.onFoto && (
            <button type="button" className="wa-icono" aria-label="Adjuntar foto" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
              <Paperclip size={21} aria-hidden="true" />
            </button>
          )}
          <input ref={entrada} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={grabando ? "Grabando… toca ■ para enviar" : "Mensaje"} aria-label={`Escribir como ${p.etiqueta}`} enterKeyHint="send" />
        </div>
        {texto.trim() || !conVoz ? (
          <button type="submit" className="wa-enviar" aria-label="Enviar">
            <SendHorizontal size={21} aria-hidden="true" />
          </button>
        ) : (
          <button type="button" className={`wa-enviar ${grabando ? "grabando agente-latido" : ""}`} aria-label={grabando ? "Terminar y enviar nota de voz" : "Grabar nota de voz"} onClick={voz}>
            {grabando ? <Square size={18} aria-hidden="true" /> : <Mic size={21} aria-hidden="true" />}
          </button>
        )}
      </form>
    </div>
  );
}
