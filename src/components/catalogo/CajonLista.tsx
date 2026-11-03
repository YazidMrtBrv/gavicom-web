"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import "./cajon.css";

const ContenidoLista = dynamic(() => import("./ContenidoLista"));

// Any component opens the drawer with this event (the floating "Tu lista"
// button, a card chip that is already in the list, the home finder), so
// building a quote happens in place instead of navigating away.
export const EVENTO_ABRIR_LISTA = "gavicom:abrir-lista";
export const abrirLista = () => window.dispatchEvent(new Event(EVENTO_ABRIR_LISTA));

/*
 * The live quote list as a drawer: a native <dialog> opened modally, so focus
 * is trapped, Escape closes and the page behind is inert for free. Bottom
 * sheet on phones, side panel from sm up. Its contents only render while
 * open: the green send button is part of the list, not of the page.
 */
export default function CajonLista() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const abrir = () => setAbierto(true);
    window.addEventListener(EVENTO_ABRIR_LISTA, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_LISTA, abrir);
  }, []);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="h-cajon"
      onClose={() => setAbierto(false)}
      // A click on the backdrop lands on the dialog element itself.
      onClick={(e) => {
        if (e.target === e.currentTarget) setAbierto(false);
      }}
      className="cajon-lista p-0 bg-white text-tinta shadow-2xl"
    >
      {abierto && <ContenidoLista cerrar={() => setAbierto(false)} />}
    </dialog>
  );
}
