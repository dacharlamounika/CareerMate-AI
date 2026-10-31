import { useState, useMemo } from 'react';
import { X, TrendingUp, CheckCircle2, AlertCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import type { ResumeContent, AtsResult } from '@/types';
import { analyzeATS } from '@/features/resume/utils/analysis';

interface Props {
  content: ResumeContent;
  onClose: () => void;
}

export function AtsAnalysisPanel({ content, onClose }: Props) {
  const { score, result } = useMemo(() => analyzeATS(content), [content]);

  const scoreColor =
    score >= 75 ? 'text-teal-600' : score >= 50 ? 'text-amber-600' : 'text-red-500';
  const scoreBg =
    score >= 75 ? 'bg-teal-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="section-title flex items-center gap-2">
          <TrendingUp size={20} className="text-teal-600" />
          ATS Analysis
        </h2>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
          <X size={18} />
        </button>
      </div>

      <p className="mt-1 text-xs text-slate-400">
        This score is an estimate and does not guarantee ATS approval.
      </p>

      {/* Score */}
      <div className="mt-4 flex items-center gap-4">
        <div className={`text-4xl font-bold ${scoreColor}`}>{score}</div>
        <div className="flex-1">
          <div className="h-3 w-full rounded-full bg-slate-100">
            <div className={`h-3 rounded-full ${scoreBg} transition-all`} style={{ width: `${score}%` }} />
          </div>
          <p className="mt-1 text-xs text-slate-500">ATS Score (0–100)</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Matching keywords */}
        {result.matchingKeywords.length > 0 && (
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
              <CheckCircle2 size={16} className="text-teal-600" /> Matching Keywords
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {result.matchingKeywords.map((k) => (
                <span key={k} className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing keywords */}
        {result.missingKeywords.length > 0 && (
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
              <AlertCircle size={16} className="text-amber-500" /> Missing Keywords
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {result.missingKeywords.map((k) => (
                <span key={k} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skill gaps */}
        {result.skillGaps.length > 0 && (
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
              <AlertCircle size={16} className="text-red-400" /> Skill Gaps
            </h3>
            <ul className="space-y-1 text-sm text-slate-600">
              {result.skillGaps.slice(0, 8).map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section completeness */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">Section Completeness</h3>
          <div className="space-y-1.5">
            {result.sectionCompleteness.map((s) => (
              <div key={s.section} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{s.section}</span>
                {s.complete ? (
                  <CheckCircle2 size={14} className="text-teal-600" />
                ) : (
                  <AlertCircle size={14} className="text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formatting warnings */}
      {result.formattingWarnings.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
            <AlertTriangle size={16} className="text-amber-500" /> Formatting Warnings
          </h3>
          <ul className="space-y-1 text-sm text-slate-600">
            {result.formattingWarnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" /> {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Buzzwords */}
      {result.buzzwords.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
            <AlertTriangle size={16} className="text-slate-500" /> Buzzwords &amp; Clichés
          </h3>
          <div className="space-y-2">
            {result.buzzwords.map((bw, i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-3 text-sm ring-1 ring-slate-200">
                <p className="font-medium text-slate-800">"{bw.phrase}"</p>
                <p className="mt-0.5 text-slate-600">{bw.reason}</p>
                <p className="mt-1 text-slate-700"><strong>Suggestion:</strong> {bw.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Repetitive verbs */}
      {result.repetitiveVerbs.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
            <AlertTriangle size={16} className="text-slate-500" /> Repetitive Action Verbs
          </h3>
          <div className="space-y-2">
            {result.repetitiveVerbs.map((rv, i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-3 text-sm ring-1 ring-slate-200">
                <p className="font-medium text-slate-800">"{rv.verb}" — used {rv.count} times</p>
                <p className="mt-0.5 text-slate-600">
                  Alternatives: {rv.alternatives.join(', ')} — only if they accurately represent your work.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation issues */}
      {result.validationIssues.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
            <AlertTriangle size={16} className="text-amber-500" /> Validation Issues
          </h3>
          <div className="space-y-2">
            {result.validationIssues.map((v, i) => (
              <div key={i} className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">
                {v.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
            <Lightbulb size={16} className="text-teal-600" /> Suggestions
          </h3>
          <ul className="space-y-1.5 text-sm text-slate-700">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <Lightbulb size={14} className="mt-0.5 shrink-0 text-teal-500" /> {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
