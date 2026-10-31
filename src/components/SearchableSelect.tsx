import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

interface Props {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  allowCustom?: boolean;
  id?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  allowCustom = false,
  id,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`input flex cursor-pointer items-center justify-between text-left ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        }`}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && !disabled && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('');
              }}
              className="rounded p-0.5 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg animate-fade-in">
          <div className="flex items-center border-b border-slate-100 px-3 py-2">
            <Search size={14} className="mr-2 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Search..."
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 && allowCustom && search && (
              <button
                type="button"
                onClick={() => handleSelect(search)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Use "{search}"
                <Check size={14} className="text-teal-600" />
              </button>
            )}
            {filtered.length === 0 && !allowCustom && (
              <div className="px-3 py-2 text-sm text-slate-400">No matches found</div>
            )}
            {filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-slate-50 ${
                  value === opt ? 'bg-teal-50 text-teal-700' : 'text-slate-700'
                }`}
              >
                {opt}
                {value === opt && <Check size={14} className="text-teal-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
