import { Plus, Trash2, FolderGit2 } from 'lucide-react';
import type { StepProps } from './stepTypes';
import type { ProjectEntry } from '@/types';
import { AIFieldAssistant } from '@/components/AIFieldAssistant';
import type { AIContext } from '@/features/resume/utils/aiText';

const PROJECT_TYPES: ProjectEntry['type'][] = ['Academic', 'Personal', 'Internship', 'Research'];

export function ProjectsStep({ content, updateContent }: StepProps) {
  const entries = content.projects;

  const addEntry = () => {
    updateContent({
      projects: [
        ...entries,
        {
          id: crypto.randomUUID(),
          title: '',
          type: '',
          description: '',
          technologies: '',
          keyFeatures: '',
          contribution: '',
          githubUrl: '',
          demoUrl: '',
        },
      ],
    });
  };

  const updateEntry = (id: string, patch: Partial<ProjectEntry>) => {
    updateContent({
      projects: entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };

  const removeEntry = (id: string) => {
    updateContent({ projects: entries.filter((e) => e.id !== id) });
  };

  const makeAIContext = (entry: ProjectEntry, fieldLabel: string): AIContext => ({
    fieldLabel,
    targetRole: content.targetRole === 'Other' ? content.customRole : content.targetRole,
    careerType: content.careerType,
    content,
    extra: {
      rawInput: entry.description,
      title: entry.title,
      technologies: entry.technologies,
      features: entry.keyFeatures,
    },
  });

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-slate-900">Projects Done</h2>
      <p className="mt-2 text-sm text-slate-500">
        Add your projects. AI may improve the presentation of descriptions but will never
        invent technologies, features, results, or metrics.
      </p>

      <div className="mt-6 space-y-4">
        {entries.map((entry, i) => (
          <div key={entry.id} className="rounded-lg border border-slate-200 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FolderGit2 size={16} className="text-teal-600" />
                Project #{i + 1}
              </div>
              <button onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Project Title</label>
                  <input
                    type="text"
                    value={entry.title}
                    onChange={(e) => updateEntry(entry.id, { title: e.target.value })}
                    className="input"
                    placeholder="e.g. E-commerce Platform"
                  />
                </div>
                <div>
                  <label className="label">Project Type</label>
                  <select
                    value={entry.type}
                    onChange={(e) => updateEntry(entry.id, { type: e.target.value as ProjectEntry['type'] })}
                    className="input"
                  >
                    <option value="">Select type...</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="label">Description</label>
                  <AIFieldAssistant
                    context={makeAIContext(entry, 'Project Description')}
                    currentText={entry.description}
                    onApply={(result) => updateEntry(entry.id, { description: result })}
                  />
                </div>
                <textarea
                  rows={3}
                  value={entry.description}
                  onChange={(e) => updateEntry(entry.id, { description: e.target.value })}
                  className="input resize-none"
                  placeholder="What does the project do? What problem does it solve?"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="label">Key Features</label>
                  <AIFieldAssistant
                    context={makeAIContext(entry, 'Project Key Features')}
                    currentText={entry.keyFeatures}
                    onApply={(result) => updateEntry(entry.id, { keyFeatures: result })}
                  />
                </div>
                <textarea
                  rows={2}
                  value={entry.keyFeatures}
                  onChange={(e) => updateEntry(entry.id, { keyFeatures: e.target.value })}
                  className="input resize-none"
                  placeholder="List the main features..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="label">Your Contribution</label>
                  <AIFieldAssistant
                    context={makeAIContext(entry, 'Project Contribution')}
                    currentText={entry.contribution}
                    onApply={(result) => updateEntry(entry.id, { contribution: result })}
                  />
                </div>
                <textarea
                  rows={2}
                  value={entry.contribution}
                  onChange={(e) => updateEntry(entry.id, { contribution: e.target.value })}
                  className="input resize-none"
                  placeholder="What did you build? What was your role?"
                />
              </div>

              <div>
                <label className="label">Technologies</label>
                <input
                  type="text"
                  value={entry.technologies}
                  onChange={(e) => updateEntry(entry.id, { technologies: e.target.value })}
                  className="input"
                  placeholder="e.g. React, Node.js, PostgreSQL"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">GitHub URL</label>
                  <input
                    type="text"
                    value={entry.githubUrl}
                    onChange={(e) => updateEntry(entry.id, { githubUrl: e.target.value })}
                    className="input"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="label">Demo URL</label>
                  <input
                    type="text"
                    value={entry.demoUrl}
                    onChange={(e) => updateEntry(entry.id, { demoUrl: e.target.value })}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <FolderGit2 className="mx-auto text-slate-300" size={32} />
            <p className="mt-2 text-sm text-slate-500">No projects added yet.</p>
          </div>
        )}

        <button onClick={addEntry} className="btn-secondary w-full text-xs">
          <Plus size={14} /> Add Project
        </button>
      </div>
    </div>
  );
}
