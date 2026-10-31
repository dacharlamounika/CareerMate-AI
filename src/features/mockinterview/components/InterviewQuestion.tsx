import { Lightbulb, Tag } from 'lucide-react';
import type { InterviewQuestion, InterviewType, InterviewRole } from '../types/mockInterviewTypes';

interface InterviewQuestionProps {
  question: InterviewQuestion;
  index: number;
  total: number;
  type: InterviewType;
  role: InterviewRole;
}

const categoryColors: Record<string, string> = {
  Technical: 'bg-blue-100 text-blue-700 border-blue-200',
  HR: 'bg-amber-100 text-amber-700 border-amber-200',
  'Role-Specific': 'bg-teal-100 text-teal-700 border-teal-200',
  'Project-Based': 'bg-violet-100 text-violet-700 border-violet-200',
  Behavioral: 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function InterviewQuestion({
  question,
  index,
  total,
  type,
  role,
}: InterviewQuestionProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          Q{index + 1} / {total}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${categoryColors[question.category] ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}
        >
          <Tag className="h-3 w-3" />
          {question.category}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {type} · {role}
        </span>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-slate-800 leading-snug">
        {question.text}
      </h3>
      <div className="mt-3 flex items-start gap-2 text-xs text-slate-400">
        <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
        <span>Take your time. Structure your answer clearly before submitting.</span>
      </div>
    </div>
  );
}
