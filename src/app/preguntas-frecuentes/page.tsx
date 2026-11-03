import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { PREGUNTAS } from "@/constants/preguntas";
import { LINEAS, rutaLinea } from "@/lib/catalogo";
import { metaPagina } from "@/lib/meta";
import { urlAbsoluta } from "@/lib/sitio";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import { BotonWhatsAppVenta } from "@/components/venta/Venta";

export const metadata = metaPagina({
  titulo: "Preguntas frecuentes sobre suministro férreo",
  descripcion:
    "Cómo cotizar por WhatsApp, eclisas para riel de 115 lb, perfiles de eclisa, tirafondos, clips elásticos, cobertura desde Barranquilla y GAVICOM Energy.",
  ruta: "/preguntas-frecuentes",
});

export default function PreguntasFrecuentes() {
  // The answers are the same strings the page prints, so the markup never
  // claims more than the visitor can read.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${urlAbsoluta("/preguntas-frecuentes")}#pagina`,
      url: urlAbsoluta("/preguntas-frecuentes"),
      inLanguage: "es-CO",
      about: { "@id": `${urlAbsoluta("/")}#organizacion` },
      mainEntity: PREGUNTAS.map((q) => ({
        "@type": "Question",
        name: q.pregunta,
        acceptedAnswer: { "@type": "Answer", text: q.respuesta },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: urlAbsoluta("/") },
        { "@type": "ListItem", position: 2, name: "Preguntas frecuentes", item: urlAbsoluta("/preguntas-frecuentes") },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 md:pt-14 pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start">
        {/* Index stays in view on wide screens so a long answer never hides
            the other questions. */}
        <aside className="lg:sticky lg:top-24 flex flex-col gap-4">
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-tenue">Preguntas frecuentes</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-[1.08] tracking-tight">Lo que nos preguntan antes de cotizar</h1>
          <p className="text-tenue">
            Suministro ferroviario, fabricación en Colombia y GAVICOM Energy, desde Barranquilla para todo el país.
          </p>
          {/* A buyer reading answers is close to deciding: the next step is
              right here, not only at the end of the page. */}
          <BotonWhatsAppVenta mensaje="Hola GAVICOM, tengo una pregunta antes de cotizar: " ancho className="lg:w-full">
            Preguntar por WhatsApp
          </BotonWhatsAppVenta>
          <nav aria-label="Preguntas" className="hidden lg:block border-t border-linea pt-2">
            <ul className="flex flex-col">
              {PREGUNTAS.map((q) => (
                <li key={q.id}>
                  <a href={`#${q.id}`} className="flex items-center min-h-11 py-1 text-sm text-tinta hover:text-azul hover:underline">
                    {q.pregunta}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex flex-col">
          {PREGUNTAS.map((q, i) => (
            <section key={q.id} id={q.id} aria-labelledby={`h-${q.id}`} data-aparecer className="scroll-mt-24 border-t border-linea py-7 first:border-t-0 first:pt-0">
              <p className="font-mono text-xs tabular-nums text-tenue">{String(i + 1).padStart(2, "0")}</p>
              <h2 id={`h-${q.id}`} className="mt-1 text-xl md:text-2xl font-bold tracking-tight">
                {q.pregunta}
              </h2>
              <p className="mt-3 text-[17px] leading-relaxed text-tinta">{q.respuesta}</p>
              {q.enlaces && (
                <ul className="mt-2 flex flex-wrap gap-x-6">
                  {q.enlaces.map((e) => (
                    <li key={e.href}>
                      <Link href={e.href} className="inline-flex items-center gap-1.5 min-h-11 text-sm font-semibold text-azul hover:underline">
                        {e.texto} <ArrowRight size={16} aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>

      <section aria-labelledby="h-lineas-faq" className="mt-14 md:mt-20">
        <h2 id="h-lineas-faq" className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
          Las líneas del catálogo
        </h2>
        <ul data-aparecer="grupo" className="grid gap-px bg-linea border border-linea rounded overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {LINEAS.map((l) => (
            <li key={l.slug} className="bg-white">
              <Link href={rutaLinea(l)} className="foco group flex flex-col gap-1 h-full min-h-11 p-5 hover:bg-gris">
                <span className="font-semibold text-tinta group-hover:text-azul">{l.nombre}</span>
                <span className="text-sm text-tenue">{l.resumen}</span>
              </Link>
            </li>
          ))}
          <li className="sobre-azul bg-azul">
            <a
              href={enlaceWhatsApp("Hola GAVICOM, tengo una pregunta: ")}
              target="_blank"
              rel="noopener noreferrer"
              className="foco flex flex-col gap-1 h-full min-h-11 p-5 text-white"
            >
              <span className="flex items-center gap-2 font-semibold">
                <MessageCircle size={18} aria-hidden /> ¿Otra pregunta?
              </span>
              <span className="text-sm text-white/80">Escríbenos por WhatsApp.</span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
