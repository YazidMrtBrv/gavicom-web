"use client";

import { usePathname } from "next/navigation";
import { COMPANIA_INFO } from "@/constants/productos";

// A single floating button: in Colombia most B2B quotes start on WhatsApp.
export default function BotonWhatsApp() {
  // Pages that already lead with a WhatsApp button would show it twice, and
  // the floating one covered form fields there.
  const ruta = usePathname();
  if (ruta === "/cotizacion" || ruta === "/contacto") return null;
  const texto = encodeURIComponent("Hola GAVICOM, quiero hacer una consulta.");
  return (
    <a
      href={`https://wa.me/${COMPANIA_INFO.whatsappSales.replace(/\D/g, "")}?text=${texto}`}
      className="fixed z-30 right-4 bottom-4 sm:right-6 sm:bottom-6 w-14 h-14 rounded-full bg-whatsapp text-white grid place-items-center shadow-lg hover:brightness-110"
      aria-label="Escribir a GAVICOM por WhatsApp"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden>
        <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.9-3.9-1.9-6 0-5.9 4.9-10.6 11-10.6s11 4.8 11 10.6-4.9 10.9-10.9 10.9zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
      </svg>
    </a>
  );
}
