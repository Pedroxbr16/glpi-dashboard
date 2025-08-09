import { useFilters } from '../../store/filters';

export default function TechnicianFilter() {
  const { technicianId, set } = useFilters();
  return (
    <div className="filter-container">
      <label className="filter-label">Técnico (ID)</label>
      <input
        className="filter-input"
        placeholder="ex.: 12"
        value={technicianId || ''}
        onChange={(e) => set({ technicianId: e.target.value, page: 1 })}
      />
    </div>
  );
}
