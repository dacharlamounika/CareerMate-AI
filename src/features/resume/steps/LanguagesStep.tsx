import { Plus, Trash2, Languages } from 'lucide-react';
import type { StepProps } from './stepTypes';
import type { LanguageEntry } from '@/types';

const PROFICIENCIES: LanguageEntry['proficiency'][] = ['Basic', 'Intermediate', 'Advanced', 'Native'];

export function LanguagesStep({ content, updateContent }: StepProps) {
  const entries = content.languages;

  const addEntry = () => {
    updateContent({
      languages: [
        ...entries,
        { id: crypto.randomUUID(), language: '', proficiency: '' },
      ],
    });
  };

  const updateEntry = (id: string, patch: Partial<LanguageEntry>) => {
    updateContent({
      languages: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };

  const removeEntry = (id: string) => {
    updateContent({ languages: entries.filter((e) => e.id !== id) });
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900">Languages</h2>
      <p className="mt-2 text-sm text-slate-500">Add languages and your proficiency level.</p>

      <div className="mt-6 space-y-3">
        {entries.map((entry, i) => (
          <div key={entry.id} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="label">Language #{i + 1}</label>
              <input
                type="text"
                value={entry.language}
                onChange={(e) => updateEntry(entry.id, { language: e.target.value })}
                className="input"
                placeholder="e.g. English"
              />
            </div>
            <div className="w-40">
              <label className="label">Proficiency</label>
              <select
                value={entry.proficiency}
                onChange={(e) => updateEntry(entry.id, { proficiency: e.target.value as LanguageEntry['proficiency'] })}
                className="input"
              >
                <option value="">Select...</option>
                {PROFICIENCIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => removeEntry(entry.id)}
              className="mb-2.5 rounded-lg p-2.5 text-red-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <Languages className="mx-auto text-slate-300" size={32} />
            <p className="mt-2 text-sm text-slate-500">No languages added yet.</p>
          </div>
        )}

        <button onClick={addEntry} className="btn-secondary w-full text-xs">
          <Plus size={14} /> Add Language
        </button>
      </div>
    </div>
  );
}
