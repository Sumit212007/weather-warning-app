export default function Loading() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
      <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
      <p className="text-sm font-medium">Fetching weather…</p>
    </div>
  );
}
