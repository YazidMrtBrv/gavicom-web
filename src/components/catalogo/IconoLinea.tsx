import { Bolt, Link2, Package, TrafficCone, Wrench, type LucideIcon } from "lucide-react";

// One generic icon per product line, used where a reference has no clean
// photo yet: it says what kind of part it is without faking a picture.
const ICONOS: Record<string, LucideIcon> = {
  "Fijaciones Pesadas": Bolt,
  "Sistemas Elásticos": Link2,
  "Herramientas de Vía": Wrench,
  "Suministros Ferroviarios": Package,
  "Señalización": TrafficCone,
};

export default function IconoLinea({ categoria, size = 28 }: { categoria: string; size?: number }) {
  const Icono = ICONOS[categoria] ?? Package;
  return <Icono size={size} aria-hidden strokeWidth={1.5} />;
}
