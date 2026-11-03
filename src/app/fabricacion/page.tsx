import type { Metadata } from "next";
import { alternas } from "@/lib/meta";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Cifras from "@/components/movimiento/Cifras";
import RutaFabricacion from "@/components/fabricacion/RutaFabricacion";
import ImportarVsFabricar from "@/components/fabricacion/ImportarVsFabricar";
import ArmaTuPedido, { BotonPerfil } from "@/components/fabricacion/ArmaTuPedido";
import { BotonWhatsAppVenta, LineaHorario } from "@/components/venta/Venta";
import { PERFILES_ECLISA } from "@/constants/perfilesEclisa";

const TITULO = "Fabricación de piezas ferroviarias en Colombia";
const DESCRIPCION =
  "Fabricamos piezas ferroviarias en Colombia: ingeniería inversa, planos propios, fundición en hierro nodular ASTM A536 y cinco controles por lote.";

// No fixed images: opengraph-image.tsx in this folder draws the card.
export const metadata: Metadata = {
  title: "Fabricación en Colombia",
  description: DESCRIPCION,
  alternates: alternas("/fabricacion"),
  openGraph: {
    title: `${TITULO} | GAVICOM SAS`,
    description: DESCRIPCION,
    url: "/fabricacion",
    siteName: "GAVICOM SAS",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITULO} | GAVICOM SAS`,
    description: DESCRIPCION,
  },
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

const PERFILES = PERFILES_ECLISA;

const H2 = "text-3xl md:text-5xl font-bold tracking-tight";
const ANTETITULO = "font-mono text-sm tracking-[0.2em] uppercase";

export default function Fabricacion() {
  return (
    // Bottom room on phones so the floating WhatsApp button never covers the
    // last call to action.
    <div className="pb-24 md:pb-0">
      <section className="sobre-azul bg-azul text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 md:py-16 lg:py-20 [@media(max-height:760px)]:md:py-12 grid gap-10 md:grid-cols-[1.1fr_1fr] items-center">
          <div data-aparecer className="flex flex-col gap-5">
            <p className={`${ANTETITULO} text-white/70`}>Fabricación en Colombia</p>
            <h1 className="text-white text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">
              Tu pieza ferroviaria, fabricada en Colombia sin esperar una importación.
            </h1>
            <p className="font-mono text-sm text-white/85">
              Hierro nodular ASTM A536 · 5 controles por lote · Planos bajo confidencialidad
            </p>
            <p className="text-lg text-white/85 max-w-lg">
              Envíanos el plano, la foto o la muestra. Hacemos la ingeniería inversa, los planos y la fundición con nuestro aliado industrial, y verificamos cada lote. Sin tránsito marítimo ni nacionalización.
            </p>
            <div data-hero-cta className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 pt-2">
              <BotonWhatsAppVenta mensaje="Hola GAVICOM, necesito fabricar una pieza ferroviaria. Les envío el plano o la foto: " grande ancho>
                Cotizar mi pieza
              </BotonWhatsAppVenta>
              <a href="#arma-tu-pedido" className="boton-iman inline-flex items-center justify-center min-h-14 px-6 rounded border border-white text-white font-semibold hover:bg-white/10">
                Arma tu pedido
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <LineaHorario claro />
              <a href="#caso" className="inline-flex items-center gap-1 min-h-11 text-sm text-white font-semibold underline underline-offset-4 decoration-white/50 hover:decoration-white">
                Ver el caso real <ArrowRight size={16} aria-hidden />
              </a>
            </div>
          </div>
          {/* On phones the 1.800 kg figure reads before the photo; from md up
              it sits over the photo's lower edge. */}
          <figure data-aparecer className="relative w-full max-w-[460px] md:justify-self-end flex flex-col">
            <figcaption className="order-first mb-4 md:order-none md:mb-0 md:absolute md:inset-x-0 md:bottom-0 md:z-10 md:p-5 md:bg-[linear-gradient(0deg,rgba(12,38,66,0.9),rgba(12,38,66,0))]">
              <span className="block font-titulo font-bold text-4xl">1.800 kg</span>
              <span className="text-white/80">por colada, en hornos de inducción</span>
            </figcaption>
            <div className="corte-ala overflow-hidden rounded">
              <Image src="/images/fabricacion/fundicion.webp" alt="Colada de hierro en el horno de inducción del aliado industrial" width={460} height={362} priority sizes="(min-width: 768px) 460px, 100vw" className="w-full h-auto object-cover" />
            </div>
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

      <section aria-labelledby="h-comparar" className="mx-auto max-w-6xl px-4 sm:px-6 pb-20 md:pb-28">
        <p data-aparecer className={`${ANTETITULO} text-tenue`}>Compara</p>
        <h2 id="h-comparar" data-aparecer className={`mt-2 max-w-3xl ${H2}`}>¿Importar la pieza o fabricarla aquí?</h2>
        <p data-aparecer className="mt-3 text-tenue max-w-2xl">Cambia de ruta y mira por dónde pasa tu pieza en cada caso.</p>
        <div data-aparecer className="mt-8">
          <ImportarVsFabricar />
        </div>
      </section>

      <section id="caso" aria-labelledby="h-caso" className="mx-auto max-w-6xl px-4 sm:px-6 pb-20 md:pb-28 scroll-mt-24">
        <p data-aparecer className={`${ANTETITULO} text-tenue`}>01 · Caso real</p>
        <h2 id="h-caso" data-aparecer className={`mt-2 max-w-4xl ${H2}`}>
          Eclisa angular para riel de 75 lb, fabricada en Colombia.
        </h2>
        <p data-aparecer className="mt-3 text-tenue max-w-2xl">Toca cada paso para ver cómo la desarrollamos.</p>
        <div data-aparecer className="mt-8">
          <RutaFabricacion controles={CONTROLES.map(([, titulo]) => titulo)} />
        </div>

        <div data-aparecer className="mt-12 grid gap-8 md:grid-cols-2 items-stretch">
          <div>
            <h3 className="text-xl font-bold">El caso en resumen</h3>
            <dl className="mt-4 border-t border-linea text-[15px]">
              {FICHA.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4 py-2.5 border-b border-linea">
                  <dt className="text-tenue">{k}</dt>
                  <dd className="font-semibold text-tinta">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          {/* Fills the row the summary sets, so the photo never outgrows it. */}
          <figure className="relative min-h-[240px] overflow-hidden rounded bg-azul text-white">
            <Image src="/images/fabricacion/via-ferrea-puente.webp" alt="Vía férrea sobre un puente" fill sizes="(min-width: 768px) 560px, 100vw" className="object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-[linear-gradient(0deg,rgba(12,38,66,0.92),rgba(12,38,66,0))] font-semibold">
              Vía férrea en Colombia
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="h-calidad" className="sobre-azul bg-azul text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
          <p data-aparecer className={`${ANTETITULO} text-white/70`}>02 · Calidad</p>
          <h2 id="h-calidad" data-aparecer className={`mt-2 text-white ${H2}`}>Fabricamos y verificamos cada pieza</h2>
          <p data-aparecer className="mt-3 text-white/75 max-w-2xl">Fundición en Colombia con nuestro aliado industrial y cinco controles de calidad.</p>
          <ol data-aparecer="grupo" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CONTROLES.map(([id, titulo, texto], i) => (
              <li key={id} className="rounded border border-white/15 bg-white/5 p-4 flex flex-col gap-3">
                {/* Small source photos: shown at their own size, never stretched. */}
                <Image src={`/images/fabricacion/control-${id}.webp`} alt="" width={157} height={89} className="h-20 w-auto self-start object-contain rounded-sm" />
                <div>
                  <p className="font-mono text-xs tabular-nums text-white/60">0{i + 1}</p>
                  <p className="font-semibold mt-1">{titulo}</p>
                  <p className="text-sm text-white/75 mt-1">{texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="h-tirafondos" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28 grid gap-8 md:grid-cols-[1fr_1.4fr] items-center">
        <div data-aparecer className="flex flex-col gap-4">
          <p className={`${ANTETITULO} text-tenue`}>03 · Fijación de vía</p>
          <h2 id="h-tirafondos" className={H2}>Tirafondos a la medida de cada vía</h2>
          <p className="text-tenue">
            Cabeza cuadrada o hexagonal, rosca para durmiente y acabado galvanizado, natural o bicromatado. Los fabricamos según el plano o la muestra del cliente y verificamos cada lote antes de entregarlo.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/catalogo/gvc-ad-ss01" className="inline-flex items-center gap-1 min-h-11 font-semibold text-azul hover:underline">
              Ver la ficha <ArrowRight size={16} aria-hidden />
            </Link>
            <a href="#arma-tu-pedido" className="inline-flex items-center gap-1 min-h-11 font-semibold text-azul hover:underline">
              Pedir tirafondos <ArrowRight size={16} aria-hidden />
            </a>
          </div>
        </div>
        <div data-aparecer="grupo" className="grid grid-cols-2 gap-3">
          <figure className="inclinar col-span-2 rounded overflow-hidden border border-linea">
            <Image src="/images/fabricacion/tirafondos-acabados.webp" alt="Tirafondos con cabeza cuadrada y hexagonal en varios acabados" width={767} height={347} className="w-full h-auto" />
          </figure>
          <figure className="inclinar rounded overflow-hidden border border-linea">
            {/* Edited copy of the original photo: the caliper display and the batch
                label are blurred, because /fabricacion never shows part dimensions. */}
            <Image src="/images/fabricacion/tirafondo-control.webp" alt="Tirafondo sujeto con pinzas junto a un calibrador en la mesa de control" width={283} height={268} className="w-full h-full object-cover" />
          </figure>
          <figure className="inclinar rounded overflow-hidden border border-linea bg-white">
            <Image src="/images/fabricacion/tirafondo-cabeza.webp" alt="Tirafondo de cabeza cuadrada marcada" width={232} height={269} className="w-full h-full object-contain" />
          </figure>
        </div>
      </section>

      <section aria-labelledby="h-perfiles" className="mx-auto max-w-6xl px-4 sm:px-6 pb-20 md:pb-28">
        <p data-aparecer className={`${ANTETITULO} text-tenue`}>04 · Eclisas</p>
        <h2 id="h-perfiles" data-aparecer className={`mt-2 ${H2}`}>Eclisas por perfil y norma</h2>
        <p data-aparecer className="mt-3 text-tenue max-w-2xl">Perfiles de riel para los que podemos producir eclisas.</p>

        {/* Phones: one card per profile instead of a table that scrolls sideways. */}
        <ul data-aparecer="grupo" className="mt-6 flex flex-col gap-3 md:hidden">
          {PERFILES.map(([perfil, material, norma, proceso]) => (
            <li key={perfil} className="rounded border border-linea p-4">
              <p className="font-semibold text-tinta">{perfil}</p>
              <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm">
                <dt className="text-tenue">Material</dt>
                <dd>{material}</dd>
                <dt className="text-tenue">Norma</dt>
                <dd className={norma ? "font-mono text-azul" : "text-tenue"}>{norma ?? "Sin norma asociada"}</dd>
                <dt className="text-tenue">Proceso</dt>
                <dd>{proceso}</dd>
              </dl>
              <div className="mt-3">
                <BotonPerfil perfil={perfil} />
              </div>
            </li>
          ))}
        </ul>

        <div data-aparecer className="mt-6 hidden md:block border border-linea rounded overflow-hidden">
          <table className="w-full text-[15px]">
            <thead className="bg-azul text-white text-left">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Perfil</th>
                <th scope="col" className="px-4 py-3 font-semibold">Material</th>
                <th scope="col" className="px-4 py-3 font-semibold">Norma</th>
                <th scope="col" className="px-4 py-3 font-semibold">Proceso</th>
                <th scope="col" className="px-4 py-3 font-semibold"><span className="sr-only">Cotizar</span></th>
              </tr>
            </thead>
            <tbody>
              {PERFILES.map(([perfil, material, norma, proceso]) => (
                <tr key={perfil} className="border-t border-linea hover:bg-gris transition-colors">
                  <th scope="row" className="px-4 py-3 text-left font-semibold text-tinta">{perfil}</th>
                  <td className="px-4 py-3 text-tenue">{material}</td>
                  <td className={`px-4 py-3 ${norma ? "font-mono text-sm text-azul" : "text-sm text-tenue"}`}>{norma ?? "Sin norma asociada"}</td>
                  <td className="px-4 py-3 text-tenue">{proceso}</td>
                  <td className="px-4 py-2 text-right">
                    <BotonPerfil perfil={perfil} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Import figures stay apart from the 600 t own capacity and are not
          animated: GAVICOM still has to confirm whose capacity they are. */}
      <section aria-labelledby="h-volumen" className="mx-auto max-w-6xl px-4 sm:px-6 pb-20 md:pb-28">
        <div data-aparecer className="rounded border-2 border-azul p-6 md:p-10 grid gap-8 md:grid-cols-[1.2fr_1fr_1fr] items-center">
          <div>
            <p className={`${ANTETITULO} text-tenue`}>Para volúmenes mayores</p>
            <h2 id="h-volumen" className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">Ya hemos gestionado importaciones de sistemas de sujeción para Colombia.</h2>
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
      </section>

      <section id="arma-tu-pedido" aria-labelledby="h-pedido" className="border-t border-linea scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 md:pt-28 pb-12">
          <p data-aparecer className={`${ANTETITULO} text-tenue`}>05 · Arma tu pedido</p>
          <h2 id="h-pedido" data-aparecer className={`mt-2 ${H2}`}>Cuéntanos qué pieza necesitas</h2>
          <p data-aparecer className="mt-3 text-tenue max-w-2xl">
            Elige lo que sepas; lo que falte lo aclaramos al responder. El mensaje se arma solo y lo envías por WhatsApp.
          </p>
          <div data-aparecer className="mt-10">
            <ArmaTuPedido perfiles={PERFILES.map(([perfil]) => perfil)} />
          </div>
        </div>
      </section>
    </div>
  );
}
