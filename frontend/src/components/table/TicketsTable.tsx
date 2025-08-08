import { useFilters } from "../../store/filters";
import { useTickets } from "../../hooks/useTickets";

export default function TicketsTable() {
  const filters = useFilters();
  const { resp, loading } = useTickets(filters);

  const rows = resp.data || [];
  const total = resp.totalcount ?? rows.length;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 text-sm text-slate-400 border-b border-slate-800">
        {loading ? "Carregando..." : `${total} resultados`}
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900 text-slate-300 border-b border-slate-800">
            <tr>
              <Th>ID</Th>
              <Th>Status</Th>
              <Th>Categoria</Th>
              <Th>Técnico</Th>
              <Th>Solicitante</Th>
              <Th>Atualizado</Th>
              <Th>Resolvido</Th>
              <Th>Fechado</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any, i: number) => (
              <tr key={i} className="border-b border-slate-800 hover:bg-slate-900/50">
                <Td>{r.id ?? r["2"] ?? "-"}</Td>
                <Td>{r.status ?? r["12"] ?? "-"}</Td>
                <Td>{r.itilcategories_id ?? r["14"] ?? "-"}</Td>
                <Td>{r.assign_tech ?? r["5"] ?? "-"}</Td>
                <Td>{r.users_id_recipient ?? r["6"] ?? "-"}</Td>
                <Td>{r.date_mod ?? r["7"] ?? "-"}</Td>
                <Td>{r.solvedate ?? r["8"] ?? "-"}</Td>
                <Td>{r.closedate ?? r["9"] ?? "-"}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* paginação simples */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 text-sm">
        <div>página {filters.page}</div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-slate-800 disabled:opacity-50"
            disabled={filters.page <= 1}
            onClick={() => filters.set({ page: filters.page - 1 })}
          >Anterior</button>
          <button
            className="px-3 py-1 rounded bg-slate-800"
            onClick={() => filters.set({ page: filters.page + 1 })}
          >Próxima</button>
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left font-medium px-4 py-2">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2">{children}</td>;
}
