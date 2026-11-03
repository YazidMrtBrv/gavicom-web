"use client";

import { Minus, Plus } from "lucide-react";

// 44 x 44 steppers: thumbs on a phone in the field, often with gloves.
export default function SelectorCantidad({
  valor,
  cambiar,
  etiqueta,
  id,
}: {
  valor: number;
  cambiar: (n: number) => void;
  etiqueta: string;
  id: string;
}) {
  const fijar = (n: number) => cambiar(Math.max(1, Math.min(9999, Math.round(n) || 1)));
  return (
    <div className="inline-flex items-center border border-linea rounded bg-white">
      <button type="button" onClick={() => fijar(valor - 1)} disabled={valor <= 1} className="grid place-items-center w-11 h-11 text-tinta disabled:text-linea" aria-label={`Una menos (${etiqueta})`}>
        <Minus size={16} aria-hidden />
      </button>
      <label htmlFor={id} className="sr-only">
        {etiqueta}
      </label>
      <input
        id={id}
        inputMode="numeric"
        value={valor}
        onChange={(e) => fijar(Number(e.target.value.replace(/\D/g, "")))}
        className="w-14 h-11 text-center tabular-nums outline-none bg-transparent"
      />
      <button type="button" onClick={() => fijar(valor + 1)} className="grid place-items-center w-11 h-11 text-tinta" aria-label={`Una más (${etiqueta})`}>
        <Plus size={16} aria-hidden />
      </button>
    </div>
  );
}
