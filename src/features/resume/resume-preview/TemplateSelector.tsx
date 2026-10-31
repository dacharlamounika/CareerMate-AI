import { Check } from 'lucide-react';
import type { ResumeTemplate } from '@/types';

interface Props {
  selected: ResumeTemplate;
  onSelect: (template: ResumeTemplate) => void;
}

const TEMPLATES: { id: ResumeTemplate; name: string; description: string }[] = [
  { id: 'professional', name: 'Professional', description: 'Classic corporate ATS layout' },
  { id: 'modern', name: 'Modern', description: 'Contemporary professional layout' },
  { id: 'minimal', name: 'Minimal', description: 'Clean and spacious layout' },
  { id: 'technical', name: 'Technical', description: 'Software and IT focused layout' },
  { id: 'executive', name: 'Executive', description: 'Formal leadership-focused layout' },
];

function MiniPreview({ template, isSelected }: { template: ResumeTemplate; isSelected: boolean }) {
  const headerColor = isSelected ? 'bg-teal-600' : 'bg-slate-700';
  const accentColor = isSelected ? 'bg-teal-400' : 'bg-slate-400';
  const lineColor = isSelected ? 'bg-teal-200' : 'bg-slate-200';

  switch (template) {
    case 'professional':
      return (
        <div className="flex h-full flex-col bg-white p-2">
          <div className={`mx-auto h-3 w-3/4 rounded ${headerColor}`} />
          <div className="mx-auto mt-1 h-1.5 w-1/2 rounded bg-slate-300" />
          <div className={`mt-2 h-0.5 w-full ${lineColor}`} />
          <div className="mt-2 space-y-1">
            <div className={`h-1.5 w-1/3 rounded ${accentColor}`} />
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-2/3 rounded bg-slate-200" />
          </div>
          <div className="mt-2 space-y-1">
            <div className={`h-1.5 w-1/4 rounded ${accentColor}`} />
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-5/6 rounded bg-slate-200" />
          </div>
        </div>
      );
    case 'modern':
      return (
        <div className="flex h-full flex-col bg-white">
          <div className={`px-2 py-1.5 ${headerColor} bg-opacity-10`} style={{ backgroundColor: isSelected ? '#0d9488' : '#334155', borderBottom: `2px solid ${isSelected ? '#0d9488' : '#475569'}` }}>
            <div className="h-2.5 w-1/2 rounded bg-white/90" />
            <div className="mt-1 h-1 w-1/3 rounded bg-white/50" />
          </div>
          <div className="p-2 space-y-1.5">
            <div className="flex items-center gap-1">
              <div className={`h-2 w-1 rounded ${accentColor}`} />
              <div className={`h-1.5 w-1/3 rounded ${accentColor}`} />
            </div>
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="flex items-center gap-1">
              <div className={`h-2 w-1 rounded ${accentColor}`} />
              <div className={`h-1.5 w-1/4 rounded ${accentColor}`} />
            </div>
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-5/6 rounded bg-slate-200" />
          </div>
        </div>
      );
    case 'minimal':
      return (
        <div className="flex h-full flex-col bg-white p-3">
          <div className="h-3 w-2/5 rounded bg-slate-300" />
          <div className="mt-1.5 h-1.5 w-1/4 rounded bg-slate-200" />
          <div className="mt-3 h-px w-full bg-slate-100" />
          <div className="mt-3 space-y-2">
            <div>
              <div className="h-1 w-1/4 rounded bg-slate-300" />
              <div className="mt-1 h-1 w-full rounded bg-slate-100" />
              <div className="mt-0.5 h-1 w-5/6 rounded bg-slate-100" />
            </div>
            <div>
              <div className="h-1 w-1/5 rounded bg-slate-300" />
              <div className="mt-1 h-1 w-full rounded bg-slate-100" />
              <div className="mt-0.5 h-1 w-3/4 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      );
    case 'technical':
      return (
        <div className="flex h-full flex-col bg-white p-2">
          <div className={`border-l-2 ${isSelected ? 'border-teal-600' : 'border-slate-700'} pl-1.5`}>
            <div className={`h-2.5 w-1/2 rounded ${headerColor}`} />
            <div className="mt-1 h-1 w-1/3 rounded bg-slate-300" />
          </div>
          <div className={`mt-2 border-b ${isSelected ? 'border-teal-300' : 'border-slate-300'} pb-0.5`} />
          <div className="mt-1.5 space-y-1">
            <div className="flex gap-1">
              <div className={`h-1.5 w-1/5 rounded ${accentColor}`} />
              <div className="h-1 w-3/5 rounded bg-slate-200" />
            </div>
            <div className="flex gap-1">
              <div className={`h-1.5 w-1/5 rounded ${accentColor}`} />
              <div className="h-1 w-2/5 rounded bg-slate-200" />
            </div>
          </div>
          <div className={`mt-2 border-l-2 ${isSelected ? 'border-teal-300' : 'border-slate-200'} pl-1.5`}>
            <div className="h-1.5 w-2/5 rounded bg-slate-300" />
            <div className="mt-1 h-1 w-full rounded bg-slate-200" />
            <div className="mt-0.5 h-1 w-3/4 rounded bg-slate-200" />
          </div>
        </div>
      );
    case 'executive':
      return (
        <div className="flex h-full flex-col bg-white">
          <div className={`px-2 py-1.5 ${headerColor}`} style={{ borderBottom: `2px double ${isSelected ? '#0d9488' : '#1e293b'}` }}>
            <div className="h-2.5 w-1/2 rounded bg-white/90" />
            <div className="mt-1 h-1 w-1/3 rounded bg-white/50" />
          </div>
          <div className="p-2 space-y-1.5">
            <div className={`h-1.5 w-1/3 rounded ${accentColor}`} />
            <div className={`border-l-2 ${isSelected ? 'border-teal-300' : 'border-slate-300'} pl-1.5`}>
              <div className="h-1 w-2/5 rounded bg-slate-300" />
              <div className="mt-0.5 h-1 w-full rounded bg-slate-200" />
              <div className="mt-0.5 h-1 w-5/6 rounded bg-slate-200" />
            </div>
            <div className={`h-1.5 w-1/4 rounded ${accentColor}`} />
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-3/4 rounded bg-slate-200" />
          </div>
        </div>
      );
  }
}

export function TemplateSelector({ selected, onSelect }: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">Resume Template</h3>
      <p className="mt-1 text-xs text-slate-500">
        Choose a template for your resume. All templates are ATS-friendly and single-column.
        You can switch anytime — your content stays the same.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {TEMPLATES.map((tpl) => {
          const isSelected = selected === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl.id)}
              className={`group relative overflow-hidden rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-teal-600 ring-2 ring-teal-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {isSelected && (
                <div className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white">
                  <Check size={12} />
                </div>
              )}
              {/* Mini preview */}
              <div className="h-28 border-b border-slate-100 bg-slate-50">
                <MiniPreview template={tpl.id} isSelected={isSelected} />
              </div>
              {/* Label */}
              <div className="p-2.5 text-left">
                <p className={`text-xs font-bold ${isSelected ? 'text-teal-700' : 'text-slate-800'}`}>
                  {tpl.name}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">{tpl.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
