import { Plus, Trash2, Wrench } from 'lucide-react';
import type { StepProps } from './stepTypes';
import type { ExperienceEntry } from '@/types';
import { AIFieldAssistant } from '@/components/AIFieldAssistant';
import type { AIContext } from '@/features/resume/utils/aiText';

const TECH_SUGGESTIONS = [
  'Python', 'Java', 'SQL', 'HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Express',
  'Flask', 'AI/ML', 'Data Analytics', 'Cloud', 'Git/GitHub', 'Other',
];

const CONTEXTS: ExperienceEntry['context'][] = [
  'Personal Practice', 'Academic', 'Internship', 'Professional',
];

export function ExperienceStep({ content, updateContent }: StepProps) {
  const entries = content.experience;

  const addEntry = () => {
    updateContent({
      experience: [
        ...entries,
        {
          id: crypto.randomUUID(),
          technology: '',
          context: '',
          company: '',
          role: '',
          duration: '',
          description: '',
        },
      ],
    });
  };

  const updateEntry = (id: string, patch: Partial<ExperienceEntry>) => {
    updateContent({
      experience: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };

  const removeEntry = (id: string) => {
    updateContent({ experience: entries.filter((e) => e.id !== id) });
  };

  const makeAIContext = (entry: ExperienceEntry): AIContext => ({
    fieldLabel: 'Experience Description',
    targetRole: content.targetRole === 'Other' ? content.customRole : content.targetRole,
    careerType: content.careerType,
    content,
    extra: { rawInput: entry.description, title: entry.technology, technologies: entry.technology, role: entry.role },
  });

  const isInternOrProfessional = (context: string) => context === 'Internship' || context === 'Professional';

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-slate-900">Internship</h2>
      <p className="mt-2 text-sm text-slate-500">
        Record your practical experience with technologies. Clearly distinguish the type of
        experience — CareerMate will not convert beginner practice into professional experience.
      </p>

      <div className="mt-6 space-y-4">
        {entries.map((entry, i) => (
          <div key={entry.id} className="rounded-lg border border-slate-200 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Wrench size={16} className="text-teal-600" />
                Experience #{i + 1}
              </div>
              <button onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Technology</label>
                <input
                  type="text"
                  list="tech-suggestions"
                  value={entry.technology}
                  onChange={(e) => updateEntry(entry.id, { technology: e.target.value })}
                  className="input"
                  placeholder="e.g. Python"
                />
                <datalist id="tech-suggestions">
                  {TECH_SUGGESTIONS.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="label">Context</label>
                <select
                  value={entry.context}
                  onChange={(e) => updateEntry(entry.id, { context: e.target.value as ExperienceEntry['context'] })}
                  className="input"
                >
                  <option value="">Select context...</option>
                  {CONTEXTS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {isInternOrProfessional(entry.context) && (
                <>
                  <div>
                    <label className="label">Company / Organization</label>
                    <input
                      type="text"
                      value={entry.company}
                      onChange={(e) => updateEntry(entry.id, { company: e.target.value })}
                      className="input"
                      placeholder="e.g. TechCorp India"
                    />
                  </div>
                  <div>
                    <label className="label">Role / Position</label>
                    <input
                      type="text"
                      value={entry.role}
                      onChange={(e) => updateEntry(entry.id, { role: e.target.value })}
                      className="input"
                      placeholder="e.g. Intern Software Developer"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="label">Duration</label>
                <input
                  type="text"
                  value={entry.duration}
                  onChange={(e) => updateEntry(entry.id, { duration: e.target.value })}
                  className="input"
                  placeholder="e.g. 6 months"
                />
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="label">Description</label>
                  <AIFieldAssistant
                    context={makeAIContext(entry)}
                    currentText={entry.description}
                    onApply={(result) => updateEntry(entry.id, { description: result })}
                  />
                </div>
                <textarea
                  rows={2}
                  value={entry.description}
                  onChange={(e) => updateEntry(entry.id, { description: e.target.value })}
                  className="input resize-none"
                  placeholder="What did you build or work on?"
                />
              </div>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <Wrench className="mx-auto text-slate-300" size={32} />
            <p className="mt-2 text-sm text-slate-500">No experience entries yet.</p>
          </div>
        )}

        <button onClick={addEntry} className="btn-secondary w-full text-xs">
          <Plus size={14} /> Add Experience
        </button>
      </div>
    </div>
  );
}
