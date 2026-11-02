import Image from "next/image";
import { SERVICIOS, imagenProducto } from "@/lib/catalogo";
import { enlaceWhatsApp } from "@/lib/whatsapp";

export default function Servicios() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 md:pt-12">
      <h1 className="text-3xl md:text-4xl font-bold">Servicios</h1>
      <p className="text-tenue mt-2 max-w-2xl">
        Además del suministro, hacemos topografía con dron, mantenimiento de equipos, servicio hidráulico, alquiler de motosoldadores Lincoln, planos y consultoría ferroviaria.
      </p>

      <ul data-aparecer="grupo" className="mt-8 flex flex-col gap-px bg-linea border border-linea rounded overflow-hidden">
        {SERVICIOS.map((s) => {
          const img = imagenProducto(s);
          return (
            <li key={s.sku} id={s.sku.toLowerCase()} className="foco bg-white grid gap-5 p-5 md:p-6 md:grid-cols-[220px_1fr] items-start">
              <div className="relative aspect-[4/3] bg-gris rounded overflow-hidden">
                {img && <Image src={img} alt={s.nombre} fill sizes="(min-width:768px) 220px, 100vw" className="object-cover" />}
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-sm text-tenue">{s.subcategoria}</p>
                  <h2 className="text-xl md:text-2xl font-bold mt-0.5">{s.nombre}</h2>
                </div>
                <p className="leading-relaxed">{s.descripcion}</p>
                <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2 text-sm">
                  {Object.entries(s.especificaciones).map(([k, v]) => (
                    <li key={k}>
                      <span className="text-tenue">{k}:</span> {v}
                    </li>
                  ))}
                </ul>
                <a
                  href={enlaceWhatsApp(`Hola GAVICOM, quiero información sobre: ${s.nombre}.`)}
                  className="self-start inline-flex items-center min-h-11 px-4 rounded bg-azul text-white text-sm font-semibold hover:bg-azul-hover"
                >
                  Consultar este servicio
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
