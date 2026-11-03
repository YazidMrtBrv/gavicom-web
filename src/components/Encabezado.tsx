"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Menu, Sun, X } from "lucide-react";
import { useCotizacion } from "@/lib/cotizacion";
import { enlaceWhatsApp } from "@/lib/whatsapp";

const ENLACES = [
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/fabricacion", texto: "Fabricación" },
  { href: "/servicios", texto: "Servicios" },
  { href: "/energy", texto: "Energy" },
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/contacto", texto: "Contacto" },
];

// True only after hydration: lets the counter tell the stored list arriving
// from localStorage (no pulse) apart from the visitor adding something.
const sinSuscripcion = () => () => {};
const useHidratado = () => useSyncExternalStore(sinSuscripcion, () => true, () => false);

export default function Encabezado() {
  const ruta = usePathname();
  // The menu remembers the page it was opened on, so navigating closes it
  // without an effect resetting state after render.
  const [abiertoEn, setAbiertoEn] = useState<string | null>(null);
  const abierto = abiertoEn === ruta;
  const { total } = useCotizacion();
  const hidratado = useHidratado();

  // Over a full-bleed hero (any page with #vuelo) the bar is transparent with
  // the official white logo. The header is always fixed, so changing this
  // never moves the page; an IntersectionObserver replaces the scroll
  // listener. Until it reports for the current route the attribute is
  // "auto" and globals.css decides with body:has(#vuelo), so the server HTML
  // already matches and nothing flashes.
  const [cielo, setCielo] = useState<{ ruta: string; si: boolean } | null>(null);
  useEffect(() => {
    const vuelo = document.getElementById("vuelo");
    if (!vuelo) {
      // Deferred like the observer callback, so the effect never sets state
      // synchronously while committing.
      const id = requestAnimationFrame(() => setCielo({ ruta, si: false }));
      return () => cancelAnimationFrame(id);
    }
    const obs = new IntersectionObserver(([e]) => setCielo({ ruta, si: e.isIntersecting }), {
      rootMargin: "-72px 0px 0px 0px",
    });
    obs.observe(vuelo);
    return () => obs.disconnect();
  }, [ruta]);
  const estadoCielo = abierto ? "no" : cielo?.ruta === ruta ? (cielo.si ? "si" : "no") : "auto";

  // Mobile menu: focus goes in on open, the page behind stops scrolling,
  // Escape closes and hands focus back to the toggle.
  const boton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const cabecera = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const raiz = document.documentElement;
    const antes = raiz.style.overflow;
    raiz.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();

    const cerrar = (devolverFoco: boolean) => {
      setAbiertoEn(null);
      if (devolverFoco) boton.current?.focus();
    };
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cerrar(true);
        return;
      }
      // Keep Tab inside the bar and the menu: the page behind is covered.
      if (e.key !== "Tab" || !cabecera.current) return;
      const focos = Array.from(cabecera.current.querySelectorAll<HTMLElement>("a[href], button")).filter((n) => n.offsetParent !== null);
      if (focos.length === 0) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    const alTocar = (e: PointerEvent) => {
      if (cabecera.current && !cabecera.current.contains(e.target as Node)) cerrar(false);
    };
    document.addEventListener("keydown", alTeclear);
    document.addEventListener("pointerdown", alTocar);
    return () => {
      raiz.style.overflow = antes;
      document.removeEventListener("keydown", alTeclear);
      document.removeEventListener("pointerdown", alTocar);
    };
  }, [abierto]);

  // A short pulse when the visitor adds units. The announcement for screen
  // readers belongs to the catalog's notice, so this one stays silent.
  const contador = useRef<HTMLSpanElement>(null);
  const totalPrevio = useRef<number | null>(null);
  useEffect(() => {
    if (!hidratado) return;
    const previo = totalPrevio.current;
    totalPrevio.current = total;
    const nodo = contador.current;
    if (previo === null || total <= previo || !nodo) return;
    nodo.classList.remove("pulso-contador");
    // Reading layout restarts the animation when several adds come quickly.
    void nodo.offsetWidth;
    nodo.classList.add("pulso-contador");
  }, [total, hidratado]);

  const activo = (href: string) => ruta === href || ruta.startsWith(`${href}/`);

  return (
    <>
      <header ref={cabecera} data-cielo={estadoCielo} data-menu={abierto ? "abierto" : undefined} className="encabezado fixed top-0 inset-x-0 z-40 border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-[72px] flex items-center gap-6">
          <Link href="/" className="shrink-0 inline-flex items-center min-h-11" aria-label="GAVICOM, inicio">
            {/* Both official versions are in the page and CSS shows one, so
                the logo is swapped, never recolored or animated. The manual
                sets 120 px as the minimum on screen. */}
            <Image src="/marca/gavicom-azul.png" alt="" width={140} height={36} priority className="logo-azul h-9 w-auto" />
            <Image src="/marca/gavicom-blanco.png" alt="" width={140} height={36} priority className="logo-blanco h-9 w-auto" />
          </Link>

          <nav aria-label="Principal" className="hidden md:flex items-center gap-1 ml-auto">
            {ENLACES.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                aria-current={activo(e.href) ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 min-h-11 px-3 text-[15px] font-medium border-b-2 transition-[color,border-color] duration-200 ${
                  activo(e.href)
                    ? "text-azul border-azul cielo:text-white cielo:border-white"
                    : "text-tenue border-transparent hover:text-azul cielo:text-white/85 cielo:hover:text-white"
                }`}
              >
                {e.href === "/energy" && <Sun size={16} aria-hidden />}
                {e.texto}
              </Link>
            ))}
          </nav>

          <Link
            href="/cotizacion"
            className="ml-auto md:ml-2 inline-flex items-center gap-2 min-h-11 px-4 rounded text-sm font-semibold transition-[background-color,color] duration-200 bg-azul text-white hover:bg-azul-hover cielo:bg-white cielo:text-azul cielo:hover:bg-azul-suave"
          >
            Cotización
            {total > 0 && (
              <>
                <span
                  ref={contador}
                  aria-hidden
                  className="min-w-6 h-6 px-1.5 rounded-full bg-white text-azul cielo:bg-azul cielo:text-white text-xs font-bold grid place-items-center tabular-nums"
                >
                  {total}
                </span>
                <span className="sr-only">, {total} unidades</span>
              </>
            )}
          </Link>

          <button
            ref={boton}
            type="button"
            onClick={() => setAbiertoEn(abierto ? null : ruta)}
            className="md:hidden grid place-items-center w-11 h-11 text-azul cielo:text-white"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          >
            {abierto ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
          </button>
        </div>

        {abierto && (
          <div
            ref={panel}
            id="menu-movil"
            className="md:hidden fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto bg-azul text-white"
          >
            <nav aria-label="Principal" className="mx-auto max-w-6xl px-4 pt-4 pb-8 flex flex-col min-h-full">
              <ul>
                {ENLACES.map((e, i) => (
                  <li key={e.href} className="menu-enlace" style={{ "--i": i } as React.CSSProperties}>
                    <Link
                      href={e.href}
                      onClick={() => setAbiertoEn(null)}
                      aria-current={activo(e.href) ? "page" : undefined}
                      className={`flex items-center gap-3 min-h-12 py-2 pl-4 font-titulo text-2xl font-semibold border-l-[3px] ${
                        activo(e.href) ? "border-white text-white" : "border-transparent text-white/85 hover:text-white"
                      }`}
                    >
                      {e.href === "/energy" && <Sun size={22} aria-hidden />}
                      {e.texto}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8 grid gap-3">
                <a
                  href={enlaceWhatsApp("Hola GAVICOM, quiero hacer una consulta.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-12 px-5 rounded bg-white text-azul font-semibold hover:bg-azul-suave"
                >
                  Escribir por WhatsApp
                </a>
                {total > 0 ? (
                  <Link
                    href="/cotizacion"
                    onClick={() => setAbiertoEn(null)}
                    className="inline-flex items-center justify-center min-h-12 px-5 rounded border border-white text-white font-semibold hover:bg-white/10"
                  >
                    Ver mi cotización ({total})
                  </Link>
                ) : (
                  <Link
                    href="/catalogo"
                    onClick={() => setAbiertoEn(null)}
                    className="inline-flex items-center justify-center min-h-12 px-5 rounded border border-white text-white font-semibold hover:bg-white/10"
                  >
                    Armar cotización
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
      {/* The header is fixed everywhere; this keeps content clear of it.
          globals.css hides it on pages whose hero (#vuelo) runs under the bar. */}
      <div aria-hidden className="espaciador-encabezado h-[72px]" />
    </>
  );
}
