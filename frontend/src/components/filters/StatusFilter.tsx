import { useFilters } from "../../store/filters";

export default function StatusFilter() {
  const { status, set } = useFilters();
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-400">Status (IDs, ex: 1,2,3)</label>
      <input
        className="bg-slate-900 border border-slate-800 rounded px-3 py-2"
        placeholder="1,2,3,4"
        value={status}
        onChange={(e) => set({ status: e.target.value, page: 1 })}
      />
    </div>
  );
}
