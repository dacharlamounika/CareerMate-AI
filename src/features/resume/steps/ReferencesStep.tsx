import { Plus, Trash2, Users, X } from 'lucide-react';
import type { StepProps } from './stepTypes';
import type { ReferenceEntry } from '@/types';

export function ReferencesStep({ content, updateContent }: StepProps) {
  const entries = content.references;
  const skip = content.skipReferences;

  const addEntry = () => {
    updateContent({
      references: [
        ...entries,
        { id: crypto.randomUUID(), name: '', designation: '', organization: '', email: '', phone: '' },
      ],
      skipReferences: false,
    });
  };

  const updateEntry = (id: string, patch: Partial<ReferenceEntry>) => {
    updateContent({
      references: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };

  const removeEntry = (id: string) => {
    updateContent({ references: entries.filter((e) => e.id !== id) });
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900">References</h2>
      <p className="mt-2 text-sm text-slate-500">
        This section is optional. If no references are added or you skip this section,
        it will not appear in your final resume.
      </p>

      <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50">
        <input
          type="checkbox"
          checked={skip}
          onChange={(e) => updateContent({ skipReferences: e.target.checked })}
          className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
        />
        <span className="text-sm font-medium text-slate-800">Skip References</span>
      </label>

      {!skip && (
        <div className="mt-6 space-y-4">
          {entries.map((entry, i) => (
            <div key={entry.id} className="rounded-lg border border-slate-200 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Users size={16} className="text-teal-600" />
                  Reference #{i + 1}
                </div>
                <button onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Name</label>
                  <input
                    type="text"
                    value={entry.name}
                    onChange={(e) => updateEntry(entry.id, { name: e.target.value })}
                    className="input"
                    placeholder="e.g. Dr. Smith"
                  />
                </div>
                <div>
                  <label className="label">Designation</label>
                  <input
                    type="text"
                    value={entry.designation}
                    onChange={(e) => updateEntry(entry.id, { designation: e.target.value })}
                    className="input"
                    placeholder="e.g. Professor"
                  />
                </div>
                <div>
                  <label className="label">Organization</label>
                  <input
                    type="text"
                    value={entry.organization}
                    onChange={(e) => updateEntry(entry.id, { organization: e.target.value })}
                    className="input"
                    placeholder="e.g. Pune University"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={entry.email}
                    onChange={(e) => updateEntry(entry.id, { email: e.target.value })}
                    className="input"
                    placeholder="ref@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    value={entry.phone}
                    onChange={(e) => updateEntry(entry.id, { phone: e.target.value })}
                    className="input"
                    placeholder="e.g. +91 9876543210"
                  />
                </div>
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
              <Users className="mx-auto text-slate-300" size={32} />
              <p className="mt-2 text-sm text-slate-500">No references added yet.</p>
            </div>
          )}

          <button onClick={addEntry} className="btn-secondary w-full text-xs">
            <Plus size={14} /> Add Reference
          </button>
        </div>
      )}

      {skip && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
          <X size={16} /> References section will be excluded from your resume.
        </div>
      )}
    </div>
  );
}
