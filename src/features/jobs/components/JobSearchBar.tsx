import { Search, X } from 'lucide-react';

interface JobSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function JobSearchBar({ value, onChange, onClear }: JobSearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by job title, company, or keyword..."
        className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
