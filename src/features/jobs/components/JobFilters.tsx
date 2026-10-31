import { MapPin, Globe, Briefcase, GraduationCap, Laptop, Code2, Database, Filter, RotateCcw } from 'lucide-react';
import type { JobFilters } from '../types/jobTypes';

interface JobFiltersProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  onClear: () => void;
  countries: string[];
  jobTypes: string[];
}

export function JobFiltersPanel({ filters, onChange, onClear, countries, jobTypes }: JobFiltersProps) {
  const updateFilter = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const isDefault =
    filters.search === '' &&
    filters.location === '' &&
    filters.country === '' &&
    !filters.internship &&
    !filters.fresher &&
    !filters.remote &&
    filters.jobType === '' &&
    filters.experience === '' &&
    filters.skills === '' &&
    filters.source === '';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-slate-700" />
          <h3 className="text-sm font-semibold text-slate-800">Filters</h3>
        </div>
        <button
          onClick={onClear}
          disabled={isDefault}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <MapPin className="h-3.5 w-3.5" /> Location
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
            placeholder="Enter location..."
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Globe className="h-3.5 w-3.5" /> Country
          </label>
          <select
            value={filters.country}
            onChange={(e) => updateFilter('country', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          >
            {countries
  .filter((country) => country.toLowerCase() !== 'worldwide')
  .map((country) => (
    <option key={country} value={country}>
      {country}
    </option>
  ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Briefcase className="h-3.5 w-3.5" /> Job Type
          </label>
          <select
            value={filters.jobType}
            onChange={(e) => updateFilter('jobType', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Temporary">Temporary</option>
            <option value="Remote">Remote</option>
            {jobTypes
              .filter((t) => !['Full Time', 'Part Time', 'Contract', 'Internship', 'Temporary', 'Remote'].includes(t))
              .map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <GraduationCap className="h-3.5 w-3.5" /> Experience
          </label>
          <input
            type="text"
            value={filters.experience}
            onChange={(e) => updateFilter('experience', e.target.value)}
            placeholder="e.g. Fresher, 2-3 years..."
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Code2 className="h-3.5 w-3.5" /> Skills
          </label>
          <input
            type="text"
            value={filters.skills}
            onChange={(e) => updateFilter('skills', e.target.value)}
            placeholder="e.g. Python, React..."
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Database className="h-3.5 w-3.5" /> Job Source
          </label>
          <select
            value={filters.source}
            onChange={(e) => updateFilter('source', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          >
            
            <option value="arbeitnow">Arbeitnow</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={filters.internship}
              onChange={(e) => updateFilter('internship', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 rounded-full bg-slate-200 peer-checked:bg-blue-500 transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">Internship</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={filters.fresher}
              onChange={(e) => updateFilter('fresher', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 rounded-full bg-slate-200 peer-checked:bg-emerald-500 transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">Fresher / Entry-level</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={filters.remote}
              onChange={(e) => updateFilter('remote', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 rounded-full bg-slate-200 peer-checked:bg-cyan-500 transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <Laptop className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">Remote</span>
        </label>
      </div>
    </div>
  );
}

