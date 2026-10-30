import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi cotización",
  description: "Lista de referencias para cotizar con GAVICOM por WhatsApp o correo.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
