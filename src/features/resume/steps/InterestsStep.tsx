import { Plus, Trash2, Heart } from 'lucide-react';
import type { StepProps } from './stepTypes';
import type { InterestEntry } from '@/types';

const SUGGESTED_INTERESTS = [
  'Artificial Intelligence', 'Software Development', 'Data Analytics',
  'Web Development', 'Cloud Computing', 'Cybersecurity', 'Mobile Development',
];

export function InterestsStep({ content, updateContent }: StepProps) {
  const entries = content.interests;

  const addEntry = (name: string) => {
    if (!name.trim()) return;
    updateContent({
      interests: [...entries, { id: crypto.randomUUID(), name: name.trim() }],
    });
  };

  const removeEntry = (id: string) => {
    updateContent({ interests: entries.filter((e) => e.id !== id) });
  };

  const existingNames = entries.map((e) => e.name.toLowerCase());
  const availableSuggestions = SUGGESTED_INTERESTS.filter(
    (s) => !existingNames.includes(s.toLowerCase())
  );

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900">Hands-on Experience</h2>
      <p className="mt-2 text-sm text-slate-500">
        Add relevant hands-on experience areas. You can choose from suggestions or add your own.
      </p>

      {availableSuggestions.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium text-slate-500 mb-2">Suggested interests</p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => addEntry(s)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2.5">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Heart size={14} className="text-teal-500" />
              {entry.name}
            </div>
            <button onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-600">
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <Heart className="mx-auto text-slate-300" size={32} />
            <p className="mt-2 text-sm text-slate-500">No hands-on experience areas added yet.</p>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem('interest') as HTMLInputElement;
          addEntry(input.value);
          input.value = '';
        }}
        className="mt-4 flex gap-2"
      >
        <input
          name="interest"
          type="text"
          className="input"
          placeholder="Add a custom hands-on experience area..."
        />
        <button type="submit" className="btn-secondary shrink-0">
          <Plus size={16} /> Add
        </button>
      </form>
    </div>
  );
}
