"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

// Search box for pages other than the catalogue: it hands the query over to
// /catalogo, which does the filtering.
export default function Buscador({ className = "", inicial = "" }: { className?: string; inicial?: string }) {
  const router = useRouter();
  const [texto, setTexto] = useState(inicial);
  return (
    <form
      role="search"
      className={`flex border-[1.5px] border-azul rounded bg-white ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        const q = texto.trim();
        router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
      }}
    >
      <label htmlFor="buscar-inicio" className="sr-only">
        Buscar en el catálogo
      </label>
      <input
        id="buscar-inicio"
        type="search"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Nombre o código: eclisa, SKL-14…"
        className="flex-1 min-w-0 px-4 py-3 text-base bg-transparent outline-none placeholder:text-tenue/80"
        autoComplete="off"
      />
      <button type="submit" className="inline-flex items-center justify-center gap-2 min-h-12 min-w-11 px-4 sm:px-5 bg-azul text-white font-semibold hover:bg-azul-hover">
        <Search size={18} aria-hidden />
        <span className="hidden sm:inline">Buscar</span>
        <span className="sr-only sm:hidden">Buscar</span>
      </button>
    </form>
  );
}
