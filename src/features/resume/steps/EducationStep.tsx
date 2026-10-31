import { Plus, Trash2, GraduationCap } from 'lucide-react';
import type { StepProps } from './stepTypes';
import type { EducationEntry } from '@/types';
import { DEGREE_OPTIONS, SPECIALIZATION_OPTIONS, INSTITUTION_OPTIONS } from '@/types';
import { SearchableSelect } from '@/components/SearchableSelect';

function generateYearOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let y = currentYear - 20; y <= currentYear + 6; y++) {
    years.push(String(y));
  }
  return years;
}

const YEAR_OPTIONS = generateYearOptions();

export function EducationStep({ content, updateContent }: StepProps) {
  const entries = content.education;

  const addEntry = () => {
    const newEntry: EducationEntry = {
      id: crypto.randomUUID(),
      degree: '',
      customDegree: '',
      specialization: '',
      customSpecialization: '',
      institution: '',
      customInstitution: '',
      cgpa: '',
      yearGraduation: '',
    };
    updateContent({ education: [...entries, newEntry] });
  };

  const updateEntry = (id: string, patch: Partial<EducationEntry>) => {
    updateContent({
      education: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };

  const removeEntry = (id: string) => {
    updateContent({ education: entries.filter((e) => e.id !== id) });
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-slate-900">Educational Background</h2>
      <p className="mt-2 text-sm text-slate-500">Add your education entries. You can add multiple.</p>

      <div className="mt-6 space-y-4">
        {entries.map((entry, i) => (
          <div key={entry.id} className="rounded-lg border border-slate-200 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <GraduationCap size={16} className="text-teal-600" />
                Education #{i + 1}
              </div>
              <button onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Degree</label>
                <SearchableSelect
                  options={DEGREE_OPTIONS}
                  value={entry.degree}
                  onChange={(val) => updateEntry(entry.id, { degree: val, customDegree: '' })}
                  placeholder="Select degree..."
                />
                {entry.degree === 'Other' && (
                  <input
                    type="text"
                    value={entry.customDegree}
                    onChange={(e) => updateEntry(entry.id, { customDegree: e.target.value })}
                    className="input mt-2"
                    placeholder="Enter your degree"
                  />
                )}
              </div>
              <div>
                <label className="label">Specialization</label>
                <SearchableSelect
                  options={SPECIALIZATION_OPTIONS}
                  value={entry.specialization}
                  onChange={(val) => updateEntry(entry.id, { specialization: val, customSpecialization: '' })}
                  placeholder="Select specialization..."
                />
                {entry.specialization === 'Other' && (
                  <input
                    type="text"
                    value={entry.customSpecialization}
                    onChange={(e) => updateEntry(entry.id, { customSpecialization: e.target.value })}
                    className="input mt-2"
                    placeholder="Enter your specialization"
                  />
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="label">College / University</label>
                <SearchableSelect
                  options={INSTITUTION_OPTIONS}
                  value={entry.institution}
                  onChange={(val) => updateEntry(entry.id, { institution: val, customInstitution: '' })}
                  placeholder="Search college / university..."
                />
                {entry.institution === 'Other' && (
                  <input
                    type="text"
                    value={entry.customInstitution}
                    onChange={(e) => updateEntry(entry.id, { customInstitution: e.target.value })}
                    className="input mt-2"
                    placeholder="Enter your college / university name"
                  />
                )}
              </div>
              <div>
                <label className="label">CGPA</label>
                <input
                  type="text"
                  value={entry.cgpa}
                  onChange={(e) => updateEntry(entry.id, { cgpa: e.target.value })}
                  className="input"
                  placeholder="e.g. 8.5"
                />
              </div>
              <div>
                <label className="label">Year of Graduation</label>
                <SearchableSelect
                  options={YEAR_OPTIONS}
                  value={entry.yearGraduation}
                  onChange={(val) => updateEntry(entry.id, { yearGraduation: val })}
                  placeholder="Select year..."
                />
              </div>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <GraduationCap className="mx-auto text-slate-300" size={32} />
            <p className="mt-2 text-sm text-slate-500">No education entries yet.</p>
          </div>
        )}

        <button onClick={addEntry} className="btn-secondary w-full text-xs">
          <Plus size={14} /> Add Education
        </button>
      </div>
    </div>
  );
}
