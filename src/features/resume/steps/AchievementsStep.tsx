import { Plus, Trash2, Trophy } from 'lucide-react';
import type { StepProps } from './stepTypes';
import type { AchievementEntry, ResumeContent } from '@/types';
import { AIFieldAssistant } from '@/components/AIFieldAssistant';
import type { AIContext } from '@/features/resume/utils/aiText';

export function AchievementsStep({ content, updateContent }: StepProps) {
  const entries = content.achievements;

  const addEntry = () => {
    updateContent({
      achievements: [
        ...entries,
        { id: crypto.randomUUID(), title: '', description: '', organization: '' },
      ],
    });
  };

  const updateEntry = (id: string, patch: Partial<AchievementEntry>) => {
    updateContent({
      achievements: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };

  const removeEntry = (id: string) => {
    updateContent({ achievements: entries.filter((e) => e.id !== id) });
  };

  const makeAIContext = (entry: AchievementEntry): AIContext => ({
    fieldLabel: 'Achievement Description',
    targetRole: content.targetRole === 'Other' ? content.customRole : content.targetRole,
    careerType: content.careerType,
    content,
    extra: { rawInput: entry.description, title: entry.title, organization: entry.organization },
  });

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-slate-900">Achievements</h2>
      <p className="mt-2 text-sm text-slate-500">
        Focus on actual achievements, not participation. CareerMate will never convert
        participation into a win.
      </p>

      <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-200">
        <strong>Examples:</strong> Hackathon winner, coding competition rank, academic award,
        recognized project achievement. If you participated but did not win, describe your
        contribution honestly.
      </div>

      <div className="mt-6 space-y-4">
        {entries.map((entry, i) => (
          <div key={entry.id} className="rounded-lg border border-slate-200 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Trophy size={16} className="text-amber-500" />
                Achievement #{i + 1}
              </div>
              <button onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  value={entry.title}
                  onChange={(e) => updateEntry(entry.id, { title: e.target.value })}
                  className="input"
                  placeholder="e.g. 1st Place — College Hackathon 2024"
                />
              </div>
              <div>
                <label className="label">Organization / Event</label>
                <input
                  type="text"
                  value={entry.organization}
                  onChange={(e) => updateEntry(entry.id, { organization: e.target.value })}
                  className="input"
                  placeholder="e.g. TechFest 2024, IEEE, NPTEL"
                />
              </div>
              <div>
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
                  placeholder="Describe what you achieved and your role..."
                />
              </div>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <Trophy className="mx-auto text-slate-300" size={32} />
            <p className="mt-2 text-sm text-slate-500">No achievements added yet.</p>
          </div>
        )}

        <button onClick={addEntry} className="btn-secondary w-full text-xs">
          <Plus size={14} /> Add Achievement
        </button>
      </div>
    </div>
  );
}
