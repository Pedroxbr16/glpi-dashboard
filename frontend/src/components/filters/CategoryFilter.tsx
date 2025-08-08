import { useFilters } from "../../store/filters";

export default function CategoryFilter() {
  const { categoryId, set } = useFilters();
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-400">Categoria (ID)</label>
      <input
        className="bg-slate-900 border border-slate-800 rounded px-3 py-2"
        placeholder="ex.: 5"
        value={categoryId || ""}
        onChange={(e) => set({ categoryId: e.target.value, page: 1 })}
      />
    </div>
  );
}
