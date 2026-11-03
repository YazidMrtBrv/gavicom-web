import { Factory, MapPin } from "lucide-react";

// Two claims, two badges: "Fabricado por GAVICOM" for every GAVICOM product
// (the owner's statement, see marcaDe in catalogoExtra) and "Fabricado en
// Colombia" only where local manufacture is documented (origenVisible
// "fabricacion-propia").
export default function InsigniaFabricado({ compacta = false, colombia = false }: { compacta?: boolean; colombia?: boolean }) {
  const Icono = colombia ? MapPin : Factory;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-semibold whitespace-nowrap ${
        colombia ? "bg-azul text-white" : "bg-azul-suave text-azul border border-azul/25"
      } ${compacta ? "px-2 py-1 text-xs" : "px-2.5 py-1 text-xs"}`}
    >
      <Icono size={compacta ? 12 : 14} aria-hidden />
      {colombia ? "Fabricado en Colombia" : "Fabricado por GAVICOM"}
    </span>
  );
}
