import StatCard from "../components/cards/StatCard";
import { useStats } from "../hooks/useStats";
import { useSSE } from "../hooks/useSSE";
import StatusFilter from "../components/filters/StatusFilter";
import TechnicianFilter from "../components/filters/TechnicianFilter";
import CategoryFilter from "../components/filters/CategoryFilter";
import DateRangeFilter from "../components/filters/DateRangeFilter";
import { useFilters } from "../store/filters";
import TicketsTable from "../components/table/TicketsTable";
import { Bell } from "lucide-react";

export default function Dashboard() {
  const { data: stats } = useStats(10000);
  const { reset } = useFilters();

  useSSE((id) => {
    // Aqui você pode disparar um toast, badge, etc.
    console.log("Novo chamado:", id);
  });

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Chamados Abertos" value={stats.open} />
        <StatCard title="Em Atendimento" value={stats.in_progress} />
        <StatCard title="Realizados Hoje" value={stats.solved_today} />
      </div>

      {/* Filtros */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5" /> Filtros
          </h2>
          <button
            onClick={reset}
            className="text-xs px-3 py-1 rounded bg-slate-800 hover:bg-slate-700"
          >
            Limpar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatusFilter />
          <TechnicianFilter />
          <CategoryFilter />
          <DateRangeFilter />
        </div>
      </div>

      {/* Tabela */}
      <TicketsTable />
    </div>
  );
}
