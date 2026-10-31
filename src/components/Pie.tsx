import Image from "next/image";
import Link from "next/link";
import { COMPANIA_INFO } from "@/constants/productos";

const telefonoLegible = (n: string) => n.replace(/^\+57(\d{3})(\d{3})(\d{4})$/, "+57 $1 $2 $3");

export default function Pie() {
  return (
    <footer className="bg-azul text-white mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Image src="/marca/gavicom-blanco.png" alt="GAVICOM" width={160} height={41} className="h-10 w-auto self-start" />
          <p className="text-sm text-white/75 max-w-sm">
            Materiales, herramientas y servicios para vía férrea. {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento}.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold">Contacto</p>
          <a className="text-white/80 hover:text-white" href={`https://wa.me/${COMPANIA_INFO.whatsappSales.replace(/\D/g, "")}`}>
            WhatsApp ventas {telefonoLegible(COMPANIA_INFO.whatsappSales)}
          </a>
          <a className="text-white/80 hover:text-white" href={`mailto:${COMPANIA_INFO.email}`}>
            {COMPANIA_INFO.email}
          </a>
          <p className="text-white/80">
            {COMPANIA_INFO.gerente}, {COMPANIA_INFO.cargo.toLowerCase()}
          </p>
        </div>
        <nav aria-label="Pie de página" className="flex flex-col gap-2 text-sm">
          <p className="font-semibold">Sitio</p>
          {[
            ["/catalogo", "Catálogo"],
            ["/servicios", "Servicios"],
            ["/energy", "GAVICOM Energy"],
            ["/nosotros", "Nosotros"],
            ["/cotizacion", "Mi cotización"],
            ["/contacto", "Contacto"],
          ].map(([href, texto]) => (
            <Link key={href} href={href} className="text-white/80 hover:text-white">
              {texto}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-6xl px-4 sm:px-6 py-5 text-xs text-white/60">
          © {new Date().getFullYear()} {COMPANIA_INFO.nombre}. {COMPANIA_INFO.disclaimerLegal}
        </p>
      </div>
    </footer>
  );
}
