import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Cifras from "@/components/movimiento/Cifras";
import RutaFabricacion from "@/components/fabricacion/RutaFabricacion";
import { enlaceWhatsApp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Fabricación en Colombia",
  description:
    "GAVICOM fabrica componentes ferroviarios en Colombia: ingeniería inversa, planos propios, fundición en hierro nodular y cinco controles de calidad por lote.",
  alternates: { canonical: "/fabricacion" },
};

const CONTROLES = [
  ["quimica", "Composición química", "Espectrómetro de emisión óptica por chispa para validar la aleación."],
  ["metalografia", "Metalografía", "Revisión de la nodularidad y la matriz del hierro dúctil."],
  ["dureza", "Dureza", "Durómetros de banco y portátiles sobre la pieza terminada."],
  ["dimensional", "Control dimensional", "Medición contra plano con instrumentos de precisión."],
  ["ndt", "Ensayos no destructivos", "Ultrasonido y tintas penetrantes para detectar discontinuidades."],
];

// Only what the client sees on delivery: the drawing's dimensions stay
// private, they are GAVICOM's engineering work.
const FICHA = [
  ["Pieza", "Eclisa angular, riel de 75 lb"],
  ["Material", "Hierro nodular ASTM A536"],
  ["Origen", "Fabricada en Colombia"],
  ["Calidad", "Cinco controles por lote"],
  ["Entregadas", "400 unidades (200 pares)"],
  ["Cliente", "Operador ferroviario nacional"],
];

// Rail profiles and standards GAVICOM can produce joint bars for.
const PERFILES = [
  ["90RA-A, 100RE, 115-119RE, 132-140RE", "Acero bajo y alto carbono", "AREMA", "Fundición, forja, laminado"],
  ["50 kg, 30 kg, 37 kg", "Hierro fundido, acero bajo carbono", "GB, JIS E1110", "Fundición, forja"],
  ["P50", "Hierro fundido, acero bajo carbono", "—", "Fundición, forja"],
  ["UIC60, UIC54, S49", "Acero bajo y alto carbono, hierro fundido", "UIC 864-6", "Fundición, forja"],
  ["BS80A", "Acero bajo y alto carbono, hierro fundido", "BS", "Fundición, forja"],
];

export default function Fabricacion() {
  const whatsapp = enlaceWhatsApp("Hola GAVICOM, necesito fabricar una pieza ferroviaria. Tengo plano o muestra.");
  return (
    <>
      <section className="bg-azul text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 md:py-20 grid gap-10 md:grid-cols-[1.1fr_1fr] items-center">
          <div data-aparecer className="flex flex-col gap-5">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-white/60">Fabricación en Colombia</p>
            <h1 className="text-white text-4xl md:text-6xl font-bold leading-[1.05]">La alternativa ya está en Colombia.</h1>
            <p className="text-lg text-white/80 max-w-lg">
              Ingeniería inversa, planos propios y fundición con nuestro aliado industrial. La pieza se fabrica y se entrega dentro del país: sin tránsito marítimo ni nacionalización.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="boton-iman inline-flex items-center min-h-12 px-6 rounded bg-white text-azul font-semibold hover:bg-azul-suave">
                Tengo un plano o una muestra
              </a>
              <a href="#caso" className="boton-iman inline-flex items-center min-h-12 px-6 rounded border border-white/60 text-white font-semibold hover:bg-white/10">
                Ver el caso real
              </a>
            </div>
          </div>
          <figure data-aparecer className="relative corte-ala overflow-hidden rounded">
            <Image src="/images/fabricacion/fundicion.webp" alt="Colada de hierro en el horno de inducción del aliado industrial" width={460} height={362} priority className="w-full h-auto object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-[linear-gradient(0deg,rgba(12,38,66,0.9),rgba(12,38,66,0))]">
              <span className="block font-titulo font-bold text-4xl">1.800 kg</span>
              <span className="text-white/80">por colada, en hornos de inducción</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-label="Capacidad" className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div data-aparecer>
          <Cifras
            cifras={[
              { valor: 600, despues: " t", texto: "al mes de capacidad de fundición y suministro" },
              { valor: 2000, antes: "+", texto: "tirafondos cada 10 días" },
              { valor: 400, texto: "eclisas angulares entregadas" },
              { valor: 5, texto: "controles de calidad por lote" },
            ]}
          />
        </div>
      </section>

      <section id="caso" aria-labelledby="h-caso" className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 scroll-mt-24">
        <p data-aparecer className="text-sm font-semibold tracking-[0.2em] uppercase text-tenue">Caso real</p>
        <h2 id="h-caso" data-aparecer className="mt-2 text-3xl md:text-4xl font-bold max-w-3xl">
          Eclisa angular para riel de 75 lb, fabricada en Colombia.
        </h2>
        <p data-aparecer className="mt-3 text-tenue max-w-2xl">Toca cada paso para ver cómo la desarrollamos.</p>
        <div data-aparecer className="mt-8">
          <RutaFabricacion />
        </div>

        <div data-aparecer className="mt-12 grid gap-8 md:grid-cols-[1fr_1fr] items-start">
          <div>
            <h3 className="text-xl font-bold">El caso en resumen</h3>
            <dl className="mt-4 border-t border-linea text-[15px]">
              {FICHA.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 py-2.5 border-b border-linea hover:bg-gris transition-colors">
                  <dt className="text-tenue">{k}</dt>
                  <dd className="font-semibold text-tinta">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="relative overflow-hidden rounded bg-azul text-white">
            <Image src="/images/fabricacion/via-ferrea-puente.webp" alt="Vía férrea sobre un puente" width={444} height={610} className="w-full h-[420px] object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-[linear-gradient(0deg,rgba(12,38,66,0.92),rgba(12,38,66,0))]">
              <span className="block font-semibold">Vía férrea en Colombia</span>
              <span className="text-sm text-white/75">Donde trabajan nuestras piezas</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="h-calidad" className="bg-azul text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <h2 id="h-calidad" data-aparecer className="text-white text-3xl md:text-4xl font-bold">Fabricamos y verificamos cada pieza</h2>
          <p data-aparecer className="mt-3 text-white/75 max-w-2xl">Fundición en Colombia con nuestro aliado industrial y cinco controles de calidad.</p>
          <ol data-aparecer="grupo" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CONTROLES.map(([id, titulo, texto], i) => (
              <li key={id} className="foco rounded border border-white/15 bg-white/5 overflow-hidden">
                <Image src={`/images/fabricacion/control-${id}.webp`} alt="" width={157} height={88} className="w-full h-24 object-cover" />
                <div className="p-4">
                  <p className="text-xs tabular-nums text-white/50">0{i + 1}</p>
                  <p className="font-semibold mt-1">{titulo}</p>
                  <p className="text-sm text-white/70 mt-1">{texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="h-tirafondos" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid gap-8 md:grid-cols-[1fr_1.4fr] items-center">
        <div data-aparecer className="flex flex-col gap-4">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-tenue">Fijación de vía</p>
          <h2 id="h-tirafondos" className="text-3xl md:text-4xl font-bold">Tirafondos a la medida de cada vía</h2>
          <p className="text-tenue">
            Cabeza cuadrada o hexagonal, rosca para durmiente y acabado galvanizado, natural o bicromatado. Los fabricamos según el plano o la muestra del cliente y verificamos cada lote antes de entregarlo.
          </p>
          <Link href="/catalogo/gvc-ad-ss01" className="inline-flex items-center gap-1 min-h-11 font-semibold text-azul hover:underline">
            Ver la ficha <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div data-aparecer="grupo" className="grid grid-cols-2 gap-3">
          <figure className="inclinar col-span-2 rounded overflow-hidden border border-linea">
            <Image src="/images/fabricacion/tirafondos-acabados.webp" alt="Tirafondos con cabeza cuadrada y hexagonal en varios acabados" width={767} height={347} className="w-full h-auto" />
          </figure>
          <figure className="inclinar rounded overflow-hidden border border-linea">
            <Image src="/images/fabricacion/tirafondo-verificacion.webp" alt="Verificación dimensional de un tirafondo con calibrador" width={287} height={269} className="w-full h-full object-cover" />
          </figure>
          <figure className="inclinar rounded overflow-hidden border border-linea bg-white">
            <Image src="/images/fabricacion/tirafondo-cabeza.webp" alt="Tirafondo de cabeza cuadrada marcada" width={232} height={269} className="w-full h-full object-contain" />
          </figure>
        </div>
      </section>

      <section aria-labelledby="h-perfiles" className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <h2 id="h-perfiles" data-aparecer className="text-2xl md:text-3xl font-bold">Eclisas por perfil y norma</h2>
        <p data-aparecer className="mt-2 text-tenue max-w-2xl">Perfiles de riel para los que podemos producir eclisas.</p>
        <div data-aparecer className="mt-6 overflow-x-auto border border-linea rounded">
          <table className="w-full min-w-[640px] text-[15px]">
            <thead className="bg-azul text-white text-left">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Perfil</th>
                <th scope="col" className="px-4 py-3 font-semibold">Material</th>
                <th scope="col" className="px-4 py-3 font-semibold">Norma</th>
                <th scope="col" className="px-4 py-3 font-semibold">Proceso</th>
              </tr>
            </thead>
            <tbody>
              {PERFILES.map(([perfil, material, norma, proceso]) => (
                <tr key={perfil} className="border-t border-linea hover:bg-gris transition-colors">
                  <td className="px-4 py-3 font-semibold text-tinta">{perfil}</td>
                  <td className="px-4 py-3 text-tenue">{material}</td>
                  <td className="px-4 py-3 font-mono text-sm text-azul">{norma}</td>
                  <td className="px-4 py-3 text-tenue">{proceso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="h-volumen" className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div data-aparecer className="rounded border-2 border-azul p-6 md:p-10 grid gap-8 md:grid-cols-[1.2fr_1fr_1fr] items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-tenue">Para volúmenes mayores</p>
            <h2 id="h-volumen" className="mt-2 text-2xl md:text-3xl font-bold">Ya hemos gestionado importaciones de sistemas de sujeción para Colombia.</h2>
          </div>
          <p>
            <span className="block font-titulo font-bold text-4xl md:text-5xl text-azul">+3.200 t</span>
            <span className="text-tenue">de capacidad al mes</span>
          </p>
          <p>
            <span className="block font-titulo font-bold text-4xl md:text-5xl text-azul tabular-nums">1.660.000</span>
            <span className="text-tenue">clips para proyectos ferroviarios</span>
          </p>
        </div>
        <div data-aparecer className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gris rounded p-6">
          <p className="text-xl font-semibold text-azul">Dinos tu necesidad y la atendemos.</p>
          <div className="flex flex-wrap gap-3">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="boton-iman inline-flex items-center min-h-12 px-6 rounded bg-azul text-white font-semibold hover:bg-azul-hover">
              Escribir por WhatsApp
            </a>
            <Link href="/contacto" className="boton-iman inline-flex items-center min-h-12 px-6 rounded border border-azul text-azul font-semibold hover:bg-azul-suave">
              Contacto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
