import { useFilters } from '../../store/filters';

export default function CategoryFilter() {
  const { categoryId, set } = useFilters();
  return (
    <div className="filter-container">
      <label className="filter-label">Categoria (ID)</label>
      <input
        className="filter-input"
        placeholder="ex.: 5"
        value={categoryId || ''}
        onChange={(e) => set({ categoryId: e.target.value, page: 1 })}
      />
    </div>
  );
}
