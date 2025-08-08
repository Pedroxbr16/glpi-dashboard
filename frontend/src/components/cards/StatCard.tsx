type Props = { title: string; value: number | string; };

export default function StatCard({ title, value }: Props) {
  return (
    <div className="rounded-2xl bg-slate-900/60 p-6 shadow border border-slate-800">
      <div className="text-slate-400 text-sm">{title}</div>
      <div className="text-5xl font-bold mt-2">{value}</div>
    </div>
  );
}
