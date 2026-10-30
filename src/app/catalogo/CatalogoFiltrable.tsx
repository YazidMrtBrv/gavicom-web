"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { LINEAS, PRODUCTOS, buscar, lineaPorSlug } from "@/lib/catalogo";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import TarjetaProducto from "@/components/TarjetaProducto";

export default function CatalogoFiltrable() {
  const params = useSearchParams();
  const router = useRouter();
  const ruta = usePathname();
  const linea = lineaPorSlug(params.get("linea"));
  const [texto, setTexto] = useState(params.get("q") ?? "");
  const consulta = useDeferredValue(texto);

  // Keep ?q in the URL so a filtered list can be shared or reloaded, without
  // pushing a history entry per keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      const p = new URLSearchParams(params.toString());
      if (texto.trim()) p.set("q", texto.trim());
      else p.delete("q");
      const nueva = p.toString();
      if (nueva !== params.toString()) router.replace(nueva ? `${ruta}?${nueva}` : ruta, { scroll: false });
    }, 300);
    return () => clearTimeout(t);
  }, [texto, params, router, ruta]);

  const elegirLinea = (slug: string | null) => {
    const p = new URLSearchParams(params.toString());
    if (slug) p.set("linea", slug);
    else p.delete("linea");
    const nueva = p.toString();
    router.replace(nueva ? `${ruta}?${nueva}` : ruta, { scroll: false });
  };

  const base = linea ? PRODUCTOS.filter((p) => p.categoria === linea.categoria) : PRODUCTOS;
  const resultado = buscar(base, consulta);

  return (
    <div className="mt-6 flex flex-col gap-5">
      <div className="flex border-[1.5px] border-azul rounded bg-white max-w-xl">
        <label htmlFor="buscar-catalogo" className="grid place-items-center pl-4 text-tenue">
          <Search size={18} aria-hidden />
          <span className="sr-only">Buscar en el catálogo</span>
        </label>
        <input
          id="buscar-catalogo"
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Nombre o código: eclisa, SKL-14…"
          className="flex-1 min-w-0 px-3 py-3 text-base bg-transparent outline-none"
          autoComplete="off"
        />
        {texto && (
          <button type="button" onClick={() => setTexto("")} className="grid place-items-center w-11 text-tenue hover:text-azul" aria-label="Borrar búsqueda">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Horizontal scroll on phones keeps the filters in one row. */}
      <div className="-mx-4 px-4 overflow-x-auto">
        <div role="group" aria-label="Filtrar por línea" className="flex gap-2 w-max">
          {[{ slug: null, nombre: "Todas" }, ...LINEAS].map((l) => {
            const activa = (linea?.slug ?? null) === l.slug;
            return (
              <button
                key={l.nombre}
                type="button"
                onClick={() => elegirLinea(l.slug)}
                aria-pressed={activa}
                className={`min-h-11 px-4 rounded border text-sm font-medium whitespace-nowrap transition-colors ${
                  activa ? "bg-azul text-white border-azul" : "bg-white text-tinta border-linea hover:border-azul hover:text-azul"
                }`}
              >
                {l.nombre}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-tenue" aria-live="polite">
        {resultado.length === 1 ? "1 referencia" : `${resultado.length} referencias`}
        {linea ? ` en ${linea.nombre.toLowerCase()}` : ""}
        {consulta.trim() ? ` para «${consulta.trim()}»` : ""}
      </p>

      {resultado.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {resultado.map((p, i) => (
            <TarjetaProducto key={p.sku} producto={p} prioridad={i < 4} />
          ))}
        </div>
      ) : (
        <div className="border border-linea rounded bg-gris p-6 flex flex-col gap-2 items-start">
          <p className="font-semibold">No encontramos esa referencia en el catálogo.</p>
          <p className="text-sm text-tenue">Igual podemos conseguirla: escríbenos con el nombre o el código y te respondemos.</p>
          <a
            href={enlaceWhatsApp(`Hola GAVICOM, busco: ${consulta.trim()}`)}
            className="mt-1 inline-flex items-center min-h-11 px-4 rounded bg-azul text-white text-sm font-semibold"
          >
            Preguntar por WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
