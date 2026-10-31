import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Settings,
  BarChart3,
  ThumbsUp,
  Target,
  Sparkles,
} from 'lucide-react';
import type {
  InterviewSession,
  QuestionCategory,
} from '../types/mockInterviewTypes';
import { readinessSummary } from '../utils/answerEvaluation';
import EvaluationResultCard from './EvaluationResult';

interface InterviewResultsProps {
  session: InterviewSession;
  onRestart: () => void;
  onBackToSetup: () => void;
}

const categoryLabels: Record<QuestionCategory, string> = {
  Technical: 'Technical',
  HR: 'HR',
  'Role-Specific': 'Role-Specific',
  'Project-Based': 'Project-Based',
  Behavioral: 'Behavioral',
};

function scoreColor(score: number): string {
  if (score >= 70) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

export default function InterviewResults({
  session,
  onRestart,
  onBackToSetup,
}: InterviewResultsProps) {
  const categories = Object.keys(session.categoryPerformance) as QuestionCategory[];
  const activeCategories = categories.filter(
    (c) => session.categoryPerformance[c] > 0
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header summary */}
      <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="h-6 w-6" />
          <h2 className="text-xl sm:text-2xl font-bold">Interview Complete</h2>
        </div>
        <p className="text-teal-50/90 text-sm">
          {session.role} · {session.type} · {session.experience}
        </p>
        <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-3">
          <div>
            <div className="text-4xl font-bold">{session.overallScore}<span className="text-lg font-medium text-teal-100">/100</span></div>
            <div className="text-xs text-teal-100 mt-0.5">Overall Score</div>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-5 w-5" />
            <div>
              <div className="text-lg font-semibold">{session.attempted}</div>
              <div className="text-xs text-teal-100">Attempted</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <XCircle className="h-5 w-5" />
            <div>
              <div className="text-lg font-semibold">{session.skipped}</div>
              <div className="text-xs text-teal-100">Skipped</div>
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold">{session.averageScore}</div>
            <div className="text-xs text-teal-100">Average Score</div>
          </div>
        </div>
      </div>

      {/* Readiness summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-teal-600" />
          <h3 className="text-base font-semibold text-slate-800">Interview Readiness Summary</h3>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{readinessSummary(session.overallScore)}</p>
      </div>

      {/* Category performance */}
      {activeCategories.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-teal-600" />
            <h3 className="text-base font-semibold text-slate-800">Category-wise Performance</h3>
          </div>
          <div className="space-y-3">
            {activeCategories.map((cat) => {
              const score = session.categoryPerformance[cat];
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{categoryLabels[cat]}</span>
                    <span className="text-sm font-semibold" style={{ color: scoreColor(score) }}>{score}/100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full transition-all duration-700 ease-out"
                      style={{ width: `${score}%`, backgroundColor: scoreColor(score) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Strengths & areas to improve */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-semibold text-emerald-800">Strengths</h3>
          </div>
          <ul className="space-y-1.5">
            {session.strengths.map((s, i) => (
              <li key={i} className="text-sm text-emerald-800/90 flex gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-semibold text-amber-800">Areas to Improve</h3>
          </div>
          <ul className="space-y-1.5">
            {session.areasToImprove.map((s, i) => (
              <li key={i} className="text-sm text-amber-800/90 flex gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question-by-question breakdown */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800 mb-4">Question Breakdown</h3>
        <div className="space-y-4">
          {session.answers.map((a, i) => (
            <div key={a.questionId} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start gap-2 mb-2">
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  Q{i + 1}
                </span>
                <p className="text-sm font-medium text-slate-700">{a.questionText}</p>
              </div>
              {a.skipped ? (
                <p className="ml-10 text-xs text-amber-600 font-medium">Skipped</p>
              ) : (
                <div className="ml-10">
                  <p className="text-xs text-slate-500 mb-2 line-clamp-2">{a.answerText}</p>
                  <EvaluationResultCard result={a.evaluation} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3 text-white font-semibold text-sm hover:from-teal-700 hover:to-emerald-700 transition active:scale-[0.99]"
        >
          <RotateCcw className="h-4 w-4" />
          Restart Interview
        </button>
        <button
          type="button"
          onClick={onBackToSetup}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
        >
          <Settings className="h-4 w-4" />
          Back to Setup
        </button>
      </div>
    </div>
  );
}
