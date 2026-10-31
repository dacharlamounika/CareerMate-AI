import { TrendingUp, Check, AlertTriangle, FileText } from 'lucide-react';
import type { EvaluationResult } from '../types/mockInterviewTypes';

interface EvaluationResultCardProps {
  result: EvaluationResult;
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-16">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700">
          {score}
        </span>
      </div>
      <span className="mt-1 text-xs font-medium text-slate-500 text-center">{label}</span>
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 70) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function overallLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
}

export default function EvaluationResultCard({ result }: EvaluationResultCardProps) {
  const overallColor = scoreColor(result.overallScore);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm animate-fade-in-up">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="h-5 w-5 text-teal-600" />
        <h4 className="text-base font-semibold text-slate-800">Automated Practice Evaluation</h4>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        AI-assisted practice evaluation — a deterministic rubric, not a live LLM. Use it as guidance, not a final grade.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 items-center sm:items-stretch justify-between mb-5">
        <div className="flex flex-col items-center justify-center px-4 shrink-0">
          <div
            className="text-3xl font-bold"
            style={{ color: overallColor }}
          >
            {result.overallScore}
            <span className="text-lg font-medium text-slate-400">/100</span>
          </div>
          <span className="text-xs font-semibold text-slate-500">{overallLabel(result.overallScore)}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
          <ScoreRing score={result.relevanceScore} label="Relevance" color={scoreColor(result.relevanceScore)} />
          <ScoreRing score={result.technicalScore} label="Content" color={scoreColor(result.technicalScore)} />
          <ScoreRing score={result.clarityScore} label="Clarity" color={scoreColor(result.clarityScore)} />
          <ScoreRing score={result.completenessScore} label="Completeness" color={scoreColor(result.completenessScore)} />
          <ScoreRing score={result.lengthScore} label="Length" color={scoreColor(result.lengthScore)} />
          <ScoreRing score={result.exampleScore} label="Examples" color={scoreColor(result.exampleScore)} />
        </div>
      </div>

      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 mb-4">
        <p className="text-sm text-slate-700 font-medium">{result.shortFeedback}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <h5 className="text-sm font-semibold text-emerald-800">What went well</h5>
          </div>
          {result.didWell.length > 0 ? (
            <ul className="space-y-1">
              {result.didWell.map((item, i) => (
                <li key={i} className="text-xs text-emerald-800/90 flex gap-1.5">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-700/70">Nothing flagged yet — keep practising.</p>
          )}
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h5 className="text-sm font-semibold text-amber-800">Could be improved</h5>
          </div>
          {result.couldImprove.length > 0 ? (
            <ul className="space-y-1">
              {result.couldImprove.map((item, i) => (
                <li key={i} className="text-xs text-amber-800/90 flex gap-1.5">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-amber-700/70">No specific improvements flagged.</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <FileText className="h-4 w-4 text-slate-600" />
          <h5 className="text-sm font-semibold text-slate-700">Suggested answer structure</h5>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{result.suggestedStructure}</p>
      </div>
    </div>
  );
}
