import { Suspense } from "react";
import { PRODUCTOS } from "@/lib/catalogo";
import CatalogoFiltrable from "./CatalogoFiltrable";

export default function Catalogo() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 md:pt-12">
      <h1 className="text-3xl md:text-4xl font-bold">Catálogo</h1>
      <p className="text-tenue mt-2 max-w-2xl">
        {PRODUCTOS.length} referencias con ficha técnica. Agrega las que necesites a tu cotización y envíalas juntas.
      </p>
      {/* The filters read the URL (?linea, ?q), so links from the home page land
          already filtered; Suspense keeps the page static around them. */}
      <Suspense fallback={<div className="h-96" />}>
        <CatalogoFiltrable />
      </Suspense>
    </div>
  );
}
