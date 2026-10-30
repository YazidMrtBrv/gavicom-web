import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { COMPANIA_INFO } from "@/constants/productos";

export const metadata: Metadata = {
  title: "Nosotros",
  description: `${COMPANIA_INFO.nombre}: suministro de materiales, herramientas y servicios para vía férrea desde ${COMPANIA_INFO.ciudad}, Colombia.`,
  alternates: { canonical: "/nosotros" },
};

export default function Nosotros() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 md:pt-12 flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">Nosotros</h1>
        <p className="text-lg leading-relaxed">
          GAVICOM es una empresa de {COMPANIA_INFO.ciudad} que suministra materiales, herramientas y servicios para la construcción y el mantenimiento de vía férrea en Colombia.
        </p>
        <p className="leading-relaxed">
          Somos una empresa creada desde la experiencia directa en infraestructura férrea y el conocimiento de sus exigencias técnicas y operativas.
        </p>
        <p className="leading-relaxed text-tenue">
          Distribuimos fijaciones, sistemas elásticos de sujeción, herramientas de vía y señalización, y prestamos servicios de topografía con dron, mantenimiento de equipos, hidráulica, alquiler de motosoldadores, planos y consultoría.
        </p>
      </section>

      {/* Text approved by the family, without the name, kept to this page on
          purpose: the logo already carries the seagull everywhere else. */}
      <section aria-labelledby="h-gaviota" className="grid gap-6 sm:grid-cols-[200px_1fr] items-center border-y border-linea py-8">
        <Image src="/marca/gavicom-azul.png" alt="Logo de GAVICOM con la gaviota sobre la I" width={200} height={52} className="w-[200px] h-auto" />
        <div>
          <h2 id="h-gaviota" className="text-xl font-bold">
            La gaviota
          </h2>
          <p className="mt-2 text-lg leading-relaxed">La gaviota de nuestro logo es por nuestra abuela, a quien de cariño le decían «Gaviota».</p>
        </div>
      </section>

      <section aria-labelledby="h-equipo" className="flex flex-col gap-4">
        <h2 id="h-equipo" className="text-2xl font-bold">
          Con quién hablas
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          <li className="border border-linea rounded p-5">
            <p className="font-semibold">{COMPANIA_INFO.gerente}</p>
            <p className="text-sm text-tenue">{COMPANIA_INFO.cargo}</p>
          </li>
          <li className="border border-linea rounded p-5">
            <p className="font-semibold">{COMPANIA_INFO.directora}</p>
            <p className="text-sm text-tenue">Directora ejecutiva</p>
          </li>
        </ul>
        <p className="text-tenue">
          {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento}. {COMPANIA_INFO.cobertura}.
        </p>
        <Link href="/contacto" className="self-start inline-flex items-center min-h-11 px-4 rounded bg-azul text-white font-semibold hover:bg-azul-hover">
          Contactarnos
        </Link>
      </section>
    </div>
  );
}
