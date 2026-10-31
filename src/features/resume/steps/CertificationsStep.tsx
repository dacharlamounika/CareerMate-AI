import { Plus, Trash2, Award } from 'lucide-react';
import type { StepProps } from './stepTypes';
import type { CertificationEntry } from '@/types';

export function CertificationsStep({ content, updateContent }: StepProps) {
  const entries = content.certifications;

  const addEntry = () => {
    updateContent({
      certifications: [
        ...entries,
        { id: crypto.randomUUID(), name: '', organization: '', completionDate: '', credentialUrl: '' },
      ],
    });
  };

  const updateEntry = (id: string, patch: Partial<CertificationEntry>) => {
    updateContent({
      certifications: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };

  const removeEntry = (id: string) => {
    updateContent({ certifications: entries.filter((e) => e.id !== id) });
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-slate-900">Certifications</h2>
      <p className="mt-2 text-sm text-slate-500">
        Add relevant certifications and course completion credentials.
      </p>

      <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200">
        Do not falsely label a course completion certificate as a professional certification.
        Only relevant certifications should be included for your target role.
      </div>

      <div className="mt-6 space-y-4">
        {entries.map((entry, i) => (
          <div key={entry.id} className="rounded-lg border border-slate-200 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Award size={16} className="text-teal-600" />
                Certification #{i + 1}
              </div>
              <button onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Certificate / Course Name</label>
                <input
                  type="text"
                  value={entry.name}
                  onChange={(e) => updateEntry(entry.id, { name: e.target.value })}
                  className="input"
                  placeholder="e.g. AWS Certified Solutions Architect"
                />
              </div>
              <div>
                <label className="label">Issuing Organization</label>
                <input
                  type="text"
                  value={entry.organization}
                  onChange={(e) => updateEntry(entry.id, { organization: e.target.value })}
                  className="input"
                  placeholder="e.g. Amazon Web Services"
                />
              </div>
              <div>
                <label className="label">Completion Date</label>
                <input
                  type="text"
                  value={entry.completionDate}
                  onChange={(e) => updateEntry(entry.id, { completionDate: e.target.value })}
                  className="input"
                  placeholder="e.g. June 2024"
                />
              </div>
              <div>
                <label className="label">Credential URL (optional)</label>
                <input
                  type="text"
                  value={entry.credentialUrl}
                  onChange={(e) => updateEntry(entry.id, { credentialUrl: e.target.value })}
                  className="input"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <Award className="mx-auto text-slate-300" size={32} />
            <p className="mt-2 text-sm text-slate-500">No certifications added yet.</p>
          </div>
        )}

        <button onClick={addEntry} className="btn-secondary w-full text-xs">
          <Plus size={14} /> Add Certification
        </button>
      </div>
    </div>
  );
}
