import { useFilters } from "../../store/filters";

export default function DateRangeFilter() {
  const { dateFrom, dateTo, set } = useFilters();
  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">De</label>
        <input
          type="date"
          className="bg-slate-900 border border-slate-800 rounded px-3 py-2"
          value={dateFrom || ""}
          onChange={(e) => set({ dateFrom: e.target.value, page: 1 })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Até</label>
        <input
          type="date"
          className="bg-slate-900 border border-slate-800 rounded px-3 py-2"
          value={dateTo || ""}
          onChange={(e) => set({ dateTo: e.target.value, page: 1 })}
        />
      </div>
    </div>
  );
}
