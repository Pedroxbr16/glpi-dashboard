import { useFilters } from '../../store/filters';
import { useTickets } from '../../hooks/useTickets';

export default function TicketsTable() {
  const filters = useFilters();
  const { resp, loading } = useTickets(filters);

  const rows = resp.data || [];
  const total = resp.totalcount ?? rows.length;

  return (
    <div className="table-container">
      <div className="table-header">
        {loading ? 'Carregando...' : `${total} resultados`}
      </div>
      <div className="table-body">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Categoria</th>
              <th>Técnico</th>
              <th>Solicitante</th>
              <th>Atualizado</th>
              <th>Resolvido</th>
              <th>Fechado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.id ?? r['2'] ?? '-'}</td>
                <td>{r.status ?? r['12'] ?? '-'}</td>
                <td>{r.itilcategories_id ?? r['14'] ?? '-'}</td>
                <td>{r.assign_tech ?? r['5'] ?? '-'}</td>
                <td>{r.users_id_recipient ?? r['6'] ?? '-'}</td>
                <td>{r.date_mod ?? r['7'] ?? '-'}</td>
                <td>{r.solvedate ?? r['8'] ?? '-'}</td>
                <td>{r.closedate ?? r['9'] ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div>Página {filters.page}</div>
        <div>
          <button
            className="pagination-button"
            disabled={filters.page <= 1}
            onClick={() => filters.set({ page: filters.page - 1 })}
          >Anterior</button>
          <button
            className="pagination-button"
            onClick={() => filters.set({ page: filters.page + 1 })}
          >Próxima</button>
        </div>
      </div>
    </div>
  );
}
