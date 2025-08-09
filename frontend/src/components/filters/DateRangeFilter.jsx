import { useFilters } from '../../store/filters';

export default function DateRangeFilter() {
  const { dateFrom, dateTo, set } = useFilters();
  return (
    <div className="filter-container">
      <div className="date-filter">
        <label className="filter-label">De</label>
        <input
          type="date"
          className="filter-input"
          value={dateFrom || ''}
          onChange={(e) => set({ dateFrom: e.target.value, page: 1 })}
        />
      </div>
      <div className="date-filter">
        <label className="filter-label">Até</label>
        <input
          type="date"
          className="filter-input"
          value={dateTo || ''}
          onChange={(e) => set({ dateTo: e.target.value, page: 1 })}
        />
      </div>
    </div>
  );
}
