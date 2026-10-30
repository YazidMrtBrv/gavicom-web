"use client";

import { useRef, type PointerEvent } from "react";

function fueraDelDialogo(evento: PointerEvent<HTMLDialogElement>): boolean {
  const caja = evento.currentTarget.getBoundingClientRect();
  return (
    evento.clientX < caja.left || evento.clientX > caja.right || evento.clientY < caja.top || evento.clientY > caja.bottom
  );
}

/*
 * closedby="any" cierra un <dialog> modal al pulsar fuera de él; Safari aún no
 * lo soporta y ahí se replica con estos manejadores. Mira la posición del
 * puntero y no el target (el diálogo también es el target de su propio
 * relleno), y exige pulsar y soltar fuera para que arrastrar al seleccionar
 * texto no lo cierre.
 */
export function useCierreAlPulsarFuera() {
  const pulsoFuera = useRef(false);
  return {
    onPointerDown: (evento: PointerEvent<HTMLDialogElement>) => {
      pulsoFuera.current = fueraDelDialogo(evento);
    },
    onPointerUp: (evento: PointerEvent<HTMLDialogElement>) => {
      if ("closedBy" in HTMLDialogElement.prototype) return;
      if (pulsoFuera.current && fueraDelDialogo(evento)) evento.currentTarget.close();
    },
  };
}
