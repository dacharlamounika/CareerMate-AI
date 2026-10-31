import { Sparkles, Edit3, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { StepProps } from './stepTypes';
import { generateProfessionalSummary } from '@/features/resume/utils/analysis';
import { AIFieldAssistant } from '@/components/AIFieldAssistant';
import type { AIContext } from '@/features/resume/utils/aiText';

export function IntroductionStep({ content, updateContent }: StepProps) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setError(null);
    setTimeout(() => {
      try {
        const summary = generateProfessionalSummary(content);
        if (!summary || summary.trim().length < 20) {
          setError(
            'Not enough resume data to generate a summary. Please add your education, skills, projects, or experience first.'
          );
        } else {
          updateContent({ introduction: summary });
        }
      } catch {
        setError('Something went wrong while generating the summary. Please try again.');
      }
      setGenerating(false);
    }, 600);
  };

  const genericWords = [
    'enthusiastic', 'passionate', 'hardworking', 'dynamic', 'highly motivated',
    'excellent communication', 'strong problem-solving', 'results-driven',
    'seeking a position', 'looking for an opportunity', 'seeking to apply',
  ];
  const containsGeneric = genericWords.some((w) => content.introduction.toLowerCase().includes(w));

  const usesFirstPerson = /\b(i|i'm|i am|my|me)\b/i.test(content.introduction);

  const aiContext: AIContext = {
    fieldLabel: 'Professional Summary',
    targetRole: content.targetRole === 'Other' ? content.customRole : content.targetRole,
    careerType: content.careerType,
    content,
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900">Professional Summary</h2>
      <p className="mt-2 text-sm text-slate-500">
        CareerMate generates a concise professional summary using only the verified information
        you have provided. It prioritizes details relevant to your target role. You can edit it at any time.
      </p>

      <div className="mt-6 rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
        <p className="text-xs font-medium text-slate-500 mb-2">Rules</p>
        <ul className="space-y-1 text-sm text-slate-600">
          <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-teal-600" /> 2–3 concise sentences, clear and goal-oriented</li>
          <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-teal-600" /> Target-role specific — prioritizes relevant skills and projects</li>
          <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-teal-600" /> No first-person language ("I", "my", "me")</li>
          <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-teal-600" /> No fake claims, generic phrases, or buzzwords</li>
          <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-teal-600" /> Does not start with your name or repeat the target role</li>
        </ul>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label className="label" htmlFor="intro">Your Professional Summary</label>
          <AIFieldAssistant
            context={aiContext}
            currentText={content.introduction}
            onApply={(result) => updateContent({ introduction: result })}
          />
        </div>
        <textarea
          id="intro"
          rows={4}
          value={content.introduction}
          onChange={(e) => updateContent({ introduction: e.target.value })}
          className="input resize-none"
          placeholder="Generate a professional summary or write your own..."
        />
        {containsGeneric && content.introduction && (
          <p className="mt-2 text-xs text-amber-600">
            This summary contains generic phrases. Consider replacing them with specific evidence from your experience.
          </p>
        )}
        {usesFirstPerson && content.introduction && (
          <p className="mt-2 text-xs text-amber-600">
            This summary uses first-person language. Professional resumes typically avoid "I", "my", and "me".
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button onClick={handleGenerate} disabled={generating} className="btn-primary text-xs">
          {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {content.introduction ? 'Regenerate Summary' : 'Generate Summary'}
        </button>
        {content.introduction && (
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Edit3 size={12} /> You can edit the generated text above
          </span>
        )}
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
