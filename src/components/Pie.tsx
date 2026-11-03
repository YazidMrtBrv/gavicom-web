import Image from "next/image";
import Link from "next/link";
import { COMPANIA_INFO } from "@/constants/productos";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import PieCotizar from "./PieCotizar";

const telefonoLegible = (n: string) => n.replace(/^\+57(\d{3})(\d{3})(\d{4})$/, "+57 $1 $2 $3");

// Links are 44 px tall with no gap between them: the touch target grows
// without the columns getting longer than before.
const ENLACE = "inline-flex items-center min-h-11 text-white/80 hover:text-white";

export default function Pie() {
  return (
    <footer className="sobre-azul bg-azul text-white mt-24">
      <PieCotizar />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Image src="/marca/gavicom-blanco.png" alt="GAVICOM" width={160} height={41} className="h-10 w-auto self-start" />
          <p className="text-sm text-white/75 max-w-sm">
            Materiales, herramientas y servicios para vía férrea. {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento}.
          </p>
        </div>
        <div className="flex flex-col gap-0 text-sm">
          <p className="font-semibold mb-1">Contacto</p>
          <a className={ENLACE} href={enlaceWhatsApp("Hola GAVICOM, quiero hacer una consulta.")} target="_blank" rel="noopener noreferrer">
            WhatsApp ventas {telefonoLegible(COMPANIA_INFO.whatsappSales)}
          </a>
          <a className={ENLACE} href={`mailto:${COMPANIA_INFO.email}`}>
            {COMPANIA_INFO.email}
          </a>
          <p className="text-white/80 py-3">
            {COMPANIA_INFO.gerente}, {COMPANIA_INFO.cargo.toLowerCase()}
          </p>
        </div>
        <nav aria-label="Pie de página" className="flex flex-col gap-0 text-sm">
          <p className="font-semibold mb-1">Sitio</p>
          {[
            ["/catalogo", "Catálogo"],
            ["/fabricacion", "Fabricación"],
            ["/servicios", "Servicios"],
            ["/energy", "GAVICOM Energy"],
            ["/nosotros", "Nosotros"],
            ["/preguntas-frecuentes", "Preguntas frecuentes"],
            ["/cotizacion", "Mi cotización"],
            ["/contacto", "Contacto"],
          ].map(([href, texto]) => (
            <Link key={href} href={href} className={`${ENLACE} self-start`}>
              {texto}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-6xl px-4 sm:px-6 py-5 text-xs text-white/75">
          © {new Date().getFullYear()} {COMPANIA_INFO.nombre}. {COMPANIA_INFO.disclaimerLegal}
        </p>
      </div>
    </footer>
  );
}
