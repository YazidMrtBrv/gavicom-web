import { Factory } from "lucide-react";

// Only for references whose manufacture in Colombia is documented
// (catalogoExtra: origenVisible "fabricacion-propia").
export default function InsigniaFabricado({ compacta = false }: { compacta?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded bg-azul text-white font-semibold whitespace-nowrap ${
        compacta ? "px-2 py-1 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <Factory size={compacta ? 12 : 14} aria-hidden />
      Fabricado en Colombia
    </span>
  );
}
