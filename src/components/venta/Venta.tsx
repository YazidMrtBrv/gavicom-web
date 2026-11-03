import { Clock, Crosshair, Factory, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { enlaceWhatsApp } from "@/lib/whatsapp";

/*
 * Shared sales pieces: the green WhatsApp button, the trust strip with the
 * owner's promise ("100% confiables, rápidos y precisos") and the hours line.
 * Budget per page: one green button in the hero and one in the closing band
 * (PieCotizar); the promise once; the hours only next to those two asks.
 * Server components: no client JavaScript is shipped for any of them.
 */

export function IconoWhatsApp({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden className="shrink-0">
      <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.9-3.9-1.9-6 0-5.9 4.9-10.6 11-10.6s11 4.8 11 10.6-4.9 10.9-10.9 10.9zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
    </svg>
  );
}

// The one primary call to action of the site. WhatsApp green is reserved for
// buttons that open WhatsApp (brand rule), so this is the only green button.
export function BotonWhatsAppVenta({
  mensaje,
  children,
  grande = false,
  ancho = false,
  className = "",
}: {
  mensaje: string;
  children: React.ReactNode;
  grande?: boolean;
  // Full width on phones: the thumb finds it without aiming.
  ancho?: boolean;
  className?: string;
}) {
  return (
    <a
      href={enlaceWhatsApp(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      className={`boton-iman inline-flex items-center justify-center gap-2 rounded bg-whatsapp text-white font-semibold shadow-sm hover:brightness-110 ${
        grande ? "min-h-14 px-6 text-lg" : "min-h-12 px-5"
      } ${ancho ? "w-full sm:w-auto" : ""} ${className}`}
    >
      <IconoWhatsApp size={grande ? 24 : 20} />
      {children}
      <span className="sr-only"> (abre WhatsApp)</span>
    </a>
  );
}

const minuscula = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

// Hours next to every WhatsApp call to action: the buyer knows someone
// answers today, which is the "now" in "why buy now".
export function LineaHorario({ claro = false, className = "" }: { claro?: boolean; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-2 text-sm ${claro ? "text-white/85" : "text-tenue"} ${className}`}>
      <Clock size={16} aria-hidden className="shrink-0" />
      {/* Short form on phones so it stays on one line under the button. */}
      <span>
        Atendemos{" "}
        <span className={`font-semibold ${claro ? "text-white" : "text-tinta"}`}>
          <span className="sm:hidden">{minuscula(COMPANIA_INFO.horarioCorto)}</span>
          <span className="hidden sm:inline">{minuscula(COMPANIA_INFO.horario)}</span>
        </span>
      </span>
    </p>
  );
}

export interface PuntoConfianza {
  icono: LucideIcon;
  titulo: string;
  texto: string;
}

// The promise split in its three words plus who makes the product. Each line
// only restates facts already published on the site.
export const CONFIANZA_FERROVIARIA: PuntoConfianza[] = [
  { icono: ShieldCheck, titulo: "100% confiables", texto: "Cada referencia con ficha técnica y código." },
  { icono: Zap, titulo: "Rápidos", texto: "Tu lista o tu plano, cotizados por WhatsApp." },
  { icono: Crosshair, titulo: "Precisos", texto: "Fabricamos según tu plano o tu muestra." },
  { icono: Factory, titulo: "Hecho por GAVICOM", texto: "Fabricación en Colombia con aliados industriales." },
];

export function FranjaConfianza({
  puntos = CONFIANZA_FERROVIARIA,
  azul = false,
  etiqueta = "Por qué GAVICOM",
}: {
  puntos?: PuntoConfianza[];
  azul?: boolean;
  etiqueta?: string;
}) {
  return (
    <section aria-label={etiqueta} className={azul ? "sobre-azul bg-azul-hover text-white" : "bg-azul-suave border-y border-linea"}>
      <ul className="mx-auto max-w-6xl px-4 sm:px-6 py-5 md:py-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3 sm:gap-y-4">
        {puntos.map(({ icono: Icono, titulo, texto }) => (
          <li key={titulo} className="flex items-start gap-3">
            <span className={`grid place-items-center size-9 sm:size-10 shrink-0 rounded ${azul ? "bg-white/10 text-white" : "bg-azul text-white"}`}>
              <Icono size={20} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className={`block font-semibold leading-tight ${azul ? "text-white" : "text-azul"}`}>{titulo}</span>
              <span className={`block text-sm leading-snug mt-0.5 ${azul ? "text-white/80" : "text-tenue"}`}>{texto}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
