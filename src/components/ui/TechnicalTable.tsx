interface TechnicalTableProps {
  especificaciones?: Record<string, string>;
}

export default function TechnicalTable({
  especificaciones,
}: TechnicalTableProps) {
  if (!especificaciones || Object.keys(especificaciones).length === 0)
    return null;

  return (
    <div className="w-full border border-zinc-200">
      <table className="w-full text-left text-xs font-mono">
        <thead>
          <tr className="border-b border-zinc-200 bg-[#f8f9fa] text-[#1a1a2e]">
            <th className="px-3 py-2 font-bold uppercase text-[9px] tracking-[0.2em] border-r border-zinc-200 w-2/5">
              Parámetro
            </th>
            <th className="px-3 py-2 font-bold uppercase text-[9px] tracking-[0.2em]">
              Especificación
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {Object.entries(especificaciones).map(([clave, valor]) => (
            <tr
              key={clave}
              className="hover:bg-[#f5f5f7] transition-colors duration-150"
            >
              <td className="spec-row px-3 py-2 font-semibold text-zinc-500 border-r border-zinc-200 text-[10px]">
                {clave}
              </td>
              <td className="px-3 py-2 text-[#1a1a2e] font-medium text-[10px]">
                {String(valor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
