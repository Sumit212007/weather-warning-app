import { useState, type KeyboardEvent } from "react";

interface Props {
  onSearch: (city: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [value, setValue] = useState("");

  function handleSearch() {
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="flex gap-2 w-full max-w-lg mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Search city..."
        disabled={loading}
        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition disabled:opacity-60"
      />
      <button
        onClick={handleSearch}
        disabled={loading || !value.trim()}
        className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "..." : "Search"}
      </button>
    </div>
  );
}
