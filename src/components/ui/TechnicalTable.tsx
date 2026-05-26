interface TechnicalTableProps {
  especificaciones?: Record<string, string>;
}

export default function TechnicalTable({
  especificaciones,
}: TechnicalTableProps) {
  if (!especificaciones || Object.keys(especificaciones).length === 0)
    return null;

  return (
    <div className="w-full overflow-hidden rounded border border-[#e8edf2]">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-[#e8edf2] bg-[#0a2a44] text-white">
            <th className="px-3 py-2 font-bold uppercase text-[10px] tracking-wider">
              Parámetro
            </th>
            <th className="px-3 py-2 font-bold uppercase text-[10px] tracking-wider">
              Especificación
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e8edf2]">
          {Object.entries(especificaciones).map(([clave, valor]) => (
            <tr
              key={clave}
              className="hover:bg-[#f8f9fa] transition-colors duration-150"
            >
              <td className="px-3 py-2 font-semibold text-zinc-500 w-2/5">
                {clave}
              </td>
              <td className="px-3 py-2 text-[#0a2a44] font-medium">
                {String(valor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
