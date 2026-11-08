import type { Metadata } from "next";
import Bandeja from "@/components/agente/Bandeja";
import { REGLAS } from "@/lib/agente/pedido";

// Demo of GAVICOM's quoting agent for Geimar. Quotes go by email (clients are
// formal companies), so the demo is a mailbox. Not part of the public site:
// no menu link and no index until GAVICOM decides to launch it.
export const metadata: Metadata = {
  title: "Agente de cotizaciones",
  description: "Prototipo del agente de cotizaciones de GAVICOM: lee las solicitudes que llegan por correo, arma el pedido y deja la respuesta formal en borradores para Geimar.",
  robots: { index: false, follow: false },
};

const FALTA = [
  {
    titulo: "Conectar el buzón de gerencia@",
    texto: "Un acceso al correo de GAVICOM con permiso para leer la bandeja y guardar borradores, nada más: el agente nunca envía. La clave la pone Yazid en Vercel.",
  },
  {
    titulo: "Correos reales de muestra",
    texto: "Tres o cuatro solicitudes de cotización reales, con los datos tapados, para afinar la lectura con el formato que de verdad mandan los clientes (texto, PDF, Excel o pliego).",
  },
  {
    titulo: "Que Geimar confirme las reglas de cálculo",
    texto: `Barras de ${REGLAS.largoRielM} m, durmientes cada ${REGLAS.espaciamientoM.concreto} m en concreto, pernos por junta, clips por durmiente y cada cuánto se repone cada pieza. Hoy son reglas de partida y la respuesta lo dice.`,
  },
  {
    titulo: "Guardar las cotizaciones",
    texto: "Una tabla en la base de datos para que el tablero muestre las cotizaciones reales y el seguimiento sepa a quién le toca escribir.",
  },
];

export default function PaginaAgente() {
  return (
    <div className="bg-gris/60">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:pt-10">
        <p className="t-etiqueta text-tenue">Prototipo · UAI LAB para GAVICOM</p>
        <h1 className="t-titulo mt-3 max-w-3xl text-azul">La cotización, lista antes del primer tinto</h1>
        <p className="t-entrada mt-3 max-w-3xl text-tinta">
          A las 6 de la mañana el agente ya leyó las solicitudes que llegaron a gerencia@, entendió qué piden y cuánto, y dejó la respuesta formal en borradores. También escribe primero: seguimiento a lo que nadie contestó y aviso de reposición. Geimar pone los precios y envía.
        </p>

        <div className="mt-6">
          <Bandeja />
        </div>

        <section aria-labelledby="titulo-falta" className="mt-16">
          <h2 id="titulo-falta" className="t-seccion text-azul">
            Lo que falta para que trabaje con correos de verdad
          </h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {FALTA.map((f, i) => (
              <li key={f.titulo} className="rounded-2xl border border-linea bg-white p-5">
                <p className="t-dato text-tenue">Paso {i + 1}</p>
                <h3 className="t-tarjeta mt-1 text-azul">{f.titulo}</h3>
                <p className="t-texto mt-2 text-tinta">{f.texto}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
