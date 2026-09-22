"use client";

import Image from "next/image";
import Link from "next/link";
import { COMPANIA_INFO } from "@/constants/productos";

export default function Footer() {
  const mensajeInicio = encodeURIComponent(
    "Hola GAVICOM SAS, requiero atención."
  );
  const enlaceWhatsApp = `${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=${mensajeInicio}`;

  return (
    <footer className="border-t border-[#D35400]/10 bg-[#f8f9fa] mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Image
              src="/logo-gavicom.png"
              alt="GAVICOM SAS"
              width={40}
              height={40}
              className="opacity-60"
            />
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              {COMPANIA_INFO.disclaimerLegal}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={enlaceWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-zinc-200 text-zinc-500 hover:text-[#D35400] hover:border-[#D35400]/50 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href={`mailto:${COMPANIA_INFO.email}`}
                className="w-8 h-8 flex items-center justify-center border border-zinc-200 text-zinc-500 hover:text-[#D35400] hover:border-[#D35400]/50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
              Enlaces
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Inicio",    href: "/" },
                { label: "Catálogo",  href: "/catalogo" },
                { label: "Servicios", href: "/servicios" },
                { label: "Contacto",  href: "/contacto" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-zinc-500 hover:text-[#1a1a2e] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
              Contacto
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-xs text-zinc-600 block">
                  <span className="text-zinc-400">Gerente:</span> {COMPANIA_INFO.gerente}
                </span>
              </li>
              <li>
                <span className="text-xs text-zinc-600 block">
                  <span className="text-zinc-400">Directora:</span> {COMPANIA_INFO.directora}
                </span>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANIA_INFO.email}`}
                  className="text-xs text-zinc-500 hover:text-[#1a1a2e] transition-colors"
                >
                  {COMPANIA_INFO.email}
                </a>
              </li>
              <li className="pt-2">
                <address className="not-italic">
                  <span className="text-xs text-zinc-600 block">
                    {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento}
                  </span>
                  <span className="text-xs text-zinc-500 block">
                    {COMPANIA_INFO.pais}
                  </span>
                </address>
              </li>
              <li>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D35400]">
                  {COMPANIA_INFO.cobertura}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-xs text-zinc-500">
                  © {new Date().getFullYear()} {COMPANIA_INFO.nombre}
                </span>
              </li>
              <li>
                <span className="text-xs text-zinc-500">
                  Todos los derechos reservados
                </span>
              </li>
              <li>
                <span className="text-xs text-zinc-500">
                  Sociedad por Acciones Simplificada
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-zinc-200 my-12" />
        <p className="text-[9px] text-zinc-500 text-center leading-relaxed max-w-2xl mx-auto">
          {COMPANIA_INFO.disclaimerLegal}
        </p>
      </div>
    </footer>
  );
}
