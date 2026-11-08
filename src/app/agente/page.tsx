import type { Metadata } from "next";
import Simulador from "@/components/agente/Simulador";
import { REGLAS } from "@/lib/agente/pedido";
import { PLANTILLAS } from "@/lib/agente/seguimiento";

// Demo of GAVICOM's WhatsApp agent for Geimar. Not part of the public site:
// no menu link and no index until GAVICOM decides to launch it.
export const metadata: Metadata = {
  title: "Agente de WhatsApp",
  description: "Prototipo del asistente de WhatsApp de GAVICOM: escribe primero, arma el pedido por metros de vía y deja los precios a Geimar.",
  robots: { index: false, follow: false },
};

const FALTA = [
  {
    titulo: "Conectar el número",
    texto: "Un número de WhatsApp para el agente, la cuenta de Meta Business de GAVICOM y las claves puestas en Vercel. El código que recibe y responde mensajes ya está listo.",
  },
  {
    titulo: "Que Meta apruebe los mensajes que el agente manda primero",
    texto: `WhatsApp solo deja escribirle primero a un cliente con plantillas aprobadas. Hay ${Object.keys(PLANTILLAS).length} listas para enviar a revisión: seguimiento de cotización y aviso de reposición.`,
  },
  {
    titulo: "Que Geimar confirme las reglas de cálculo",
    texto: `Barras de ${REGLAS.largoRielM} m, durmientes cada ${REGLAS.espaciamientoM.concreto} m en concreto, pernos por junta, clips por durmiente, cada cuánto se repone cada pieza. Hoy son reglas de partida y el agente se lo dice al cliente.`,
  },
  {
    titulo: "Guardar las conversaciones",
    texto: "Una tabla en la base de datos para que una cotización no se pierda entre mensajes y el tablero muestre las cotizaciones reales, no las de ejemplo.",
  },
];

export default function PaginaAgente() {
  return (
    <div className="bg-gris/60">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:pt-10">
        <p className="t-etiqueta text-tenue">Prototipo · UAI LAB para GAVICOM</p>
        <h1 className="t-titulo mt-3 max-w-3xl text-azul">El vendedor que escribe primero</h1>
        <p className="t-entrada mt-3 max-w-3xl text-tinta">
          No espera a que el cliente escriba: le escribe cuando le toca reponer o cuando una cotización se quedó quieta. Los precios los pone Geimar con un toque.
        </p>

        <div className="mt-6">
          <Simulador />
        </div>

        <section aria-labelledby="titulo-falta" className="mt-16">
          <h2 id="titulo-falta" className="t-seccion text-azul">
            Lo que falta para que hable con clientes de verdad
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
