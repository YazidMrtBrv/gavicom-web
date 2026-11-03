"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

// WCAG 2.2.2: anything that moves on its own for more than five seconds needs
// a way to stop it. The state lives on the band's data-pausada attribute so
// the CSS animation can stay in globals.css and the band can stay a server
// component.
export default function PausaFranja() {
  const [pausada, setPausada] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);

  // Keyboard users: globals.css stops the track while a link has focus; this
  // brings the focused link into the band's visible width (WCAG 2.4.11) and
  // puts the band back at its start when focus leaves.
  useEffect(() => {
    const franja = boton.current?.closest<HTMLElement>(".franja");
    if (!franja) return;
    const alEnfocar = (e: FocusEvent) => {
      const enlace = e.target as HTMLElement;
      if (enlace.tagName !== "A") return;
      requestAnimationFrame(() => enlace.scrollIntoView({ block: "nearest", inline: "center" }));
    };
    const alSalir = (e: FocusEvent) => {
      if (franja.contains(e.relatedTarget as Node | null)) return;
      const ventana = franja.querySelector(".franja-ventana");
      if (ventana) ventana.scrollLeft = 0;
    };
    franja.addEventListener("focusin", alEnfocar);
    franja.addEventListener("focusout", alSalir);
    return () => {
      franja.removeEventListener("focusin", alEnfocar);
      franja.removeEventListener("focusout", alSalir);
    };
  }, []);

  return (
    <button
      ref={boton}
      type="button"
      aria-pressed={pausada}
      aria-label={pausada ? "Reanudar la franja" : "Pausar la franja"}
      onClick={(e) => {
        const siguiente = !pausada;
        setPausada(siguiente);
        e.currentTarget.closest(".franja")?.setAttribute("data-pausada", String(siguiente));
      }}
      className="motion-reduce:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 grid place-items-center size-11 rounded-full bg-azul text-white border border-white/40 hover:bg-azul-hover"
    >
      {pausada ? <Play size={18} aria-hidden /> : <Pause size={18} aria-hidden />}
    </button>
  );
}
