import { useFilters } from "../../store/filters";

export default function TechnicianFilter() {
  const { technicianId, set } = useFilters();
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-400">Técnico (ID)</label>
      <input
        className="bg-slate-900 border border-slate-800 rounded px-3 py-2"
        placeholder="ex.: 12"
        value={technicianId || ""}
        onChange={(e) => set({ technicianId: e.target.value, page: 1 })}
      />
    </div>
  );
}
