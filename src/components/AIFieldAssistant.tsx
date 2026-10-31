import { useState } from 'react';
import { Sparkles, Loader2, Check, X, Wand2, Scissors, Expand, Target, SpellCheck, FileText } from 'lucide-react';
import { processAIText, type AIAction, type AIContext } from '@/features/resume/utils/aiText';

interface Props {
  context: AIContext;
  currentText: string;
  onApply: (result: string) => void;
  label?: string;
}

const ACTIONS: { id: AIAction; label: string; icon: typeof Wand2; desc: string }[] = [
  { id: 'generate', label: 'Generate', icon: Sparkles, desc: 'Create content from your provided information' },
  { id: 'improve', label: 'Improve', icon: Wand2, desc: 'Improve grammar, clarity, and professionalism' },
  { id: 'rewrite', label: 'Rewrite', icon: FileText, desc: 'Rewrite in professional resume style' },
  { id: 'shorten', label: 'Shorten', icon: Scissors, desc: 'Make the content concise' },
  { id: 'expand', label: 'Expand', icon: Expand, desc: 'Add detail while staying factual' },
  { id: 'ats', label: 'ATS Optimize', icon: Target, desc: 'Optimize wording for your target role' },
  { id: 'grammar', label: 'Fix Grammar', icon: SpellCheck, desc: 'Correct grammar and spelling' },
];

export function AIFieldAssistant({ context, currentText, onApply, label = 'AI Assist' }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [selectedAction, setSelectedAction] = useState<AIAction | null>(null);

  const handleAction = (action: AIAction) => {
    setLoading(true);
    setSelectedAction(action);
    setResult('');
    // Simulate processing delay for UX
    setTimeout(() => {
      const output = processAIText(action, currentText, context);
      setResult(output);
      setLoading(false);
    }, 500);
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
      setOpen(false);
      setResult('');
      setSelectedAction(null);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setResult('');
    setSelectedAction(null);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100"
      >
        <Sparkles size={13} />
        {label}
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-lg border border-teal-200 bg-teal-50/40 p-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">How can AI help?</p>
        <button onClick={handleCancel} className="rounded p-1 text-slate-400 hover:bg-slate-100">
          <X size={16} />
        </button>
      </div>

      {!result && !loading && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleAction(action.id)}
              className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3 text-left transition-all hover:border-teal-300 hover:shadow-sm"
            >
              <action.icon size={16} className="mt-0.5 shrink-0 text-teal-600" />
              <div>
                <p className="text-sm font-medium text-slate-800">{action.label}</p>
                <p className="text-xs text-slate-500">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin text-teal-600" />
          Processing with AI...
        </div>
      )}

      {result && !loading && (
        <div className="mt-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              {ACTIONS.find((a) => a.id === selectedAction)?.label} result:
            </span>
          </div>
          <textarea
            rows={4}
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="input resize-none bg-white"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Review the result above. You can edit it before applying. The AI only uses
            information you provided — it never invents facts.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
            >
              <Check size={14} /> Use Result
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setSelectedAction(null)}
              className="ml-auto text-xs text-teal-600 hover:text-teal-800"
            >
              Choose different action
            </button>
          </div>
        </div>
      )}

      <p className="mt-3 border-t border-teal-100 pt-2 text-[11px] text-slate-400">
        AI improves wording and structure. It never fabricates skills, experience, or achievements.
      </p>
    </div>
  );
}
