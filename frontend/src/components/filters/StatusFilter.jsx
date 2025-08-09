import { useFilters } from '../../store/filters';

export default function StatusFilter() {
  const { status, set } = useFilters();
  return (
    <div className="filter-container">
      <label className="filter-label">Status (IDs, ex: 1,2,3)</label>
      <input
        className="filter-input"
        placeholder="1,2,3,4"
        value={status}
        onChange={(e) => set({ status: e.target.value, page: 1 })}
      />
    </div>
  );
}
