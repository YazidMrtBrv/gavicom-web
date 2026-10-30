"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import estilos from "./catalogo.module.css";

interface CifraOdometroProps {
  valor: number;
  /** Cifras mínimas (6 → "06"). */
  digitos?: number;
  /** Espera antes de rodar (ms), para escalonar varias cifras. */
  retardo?: number;
  className?: string;
}

type Fase = "quieta" | "en-cero" | "rodando";
type ConVariables = CSSProperties & Record<`--${string}`, string | number>;

const DIEZ = Array.from({ length: 10 }, (_, n) => n);

/*
 * Llega del servidor como texto plano con la cifra final: es lo que leen los
 * buscadores y quien pidió menos movimiento. Al entrar en pantalla, cada dígito
 * se cambia por una rueda 0-9 que arranca en cero y gira hasta su valor, como
 * el odómetro de una locomotora. Las ruedas solo existen mientras ruedan.
 */
export default function CifraOdometro({ valor, digitos = 1, retardo = 0, className }: CifraOdometroProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [fase, setFase] = useState<Fase>("quieta");
  const texto = String(valor).padStart(digitos, "0");

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cuadro = 0;
    let fin = 0;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return;
        observador.disconnect();
        setFase("en-cero");
        // Dos cuadros: el primero pinta las ruedas en cero, el segundo arranca la transición.
        cuadro = requestAnimationFrame(() => {
          cuadro = requestAnimationFrame(() => setFase("rodando"));
        });
        // Al terminar vuelve al texto plano (copiable y sin ruedas en el DOM).
        fin = window.setTimeout(() => setFase("quieta"), 1500 + retardo + texto.length * 120 + 200);
      },
      { threshold: 0.6 }
    );
    observador.observe(nodo);

    return () => {
      observador.disconnect();
      cancelAnimationFrame(cuadro);
      window.clearTimeout(fin);
    };
  }, [retardo, texto.length]);

  return (
    <span ref={ref} className={cn("inline-flex tabular-nums", className)}>
      {fase === "quieta" ? (
        // Misma caja que las ruedas: el cambio de texto a ruedas no mueve nada.
        <span className={estilos.odometroVentana}>{texto}</span>
      ) : (
        <>
          <span className="sr-only">{texto}</span>
          <span aria-hidden="true" className="inline-flex">
            {Array.from(texto, (caracter, i) => (
              <span key={i} className={estilos.odometroVentana}>
                <span
                  className={cn(estilos.odometroRueda, fase === "rodando" && estilos.odometroRodando)}
                  style={
                    {
                      "--digito": fase === "rodando" ? Number(caracter) : 0,
                      "--retardo": `${retardo + i * 120}ms`,
                    } as ConVariables
                  }
                >
                  {DIEZ.map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </span>
              </span>
            ))}
          </span>
        </>
      )}
    </span>
  );
}
