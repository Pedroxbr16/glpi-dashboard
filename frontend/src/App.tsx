import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">GLPI — Painel</h1>
          <div className="text-xs text-slate-400">v0.1</div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-6">
        <Dashboard />
      </main>
    </div>
  );
}
