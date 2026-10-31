import { useState } from 'react';
import { History, Eye, Trash2, Calendar, Inbox } from 'lucide-react';
import type { InterviewHistoryEntry } from '../types/mockInterviewTypes';
import { clearHistory } from '../utils/interviewStorage';

interface InterviewHistoryProps {
  history: InterviewHistoryEntry[];
  onView: (id: string) => void;
  onChanged: () => void;
}

function scoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-rose-600 bg-rose-50 border-rose-200';
}

export default function InterviewHistory({ history, onView, onChanged }: InterviewHistoryProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  function formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  }

  if (history.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-800">Past Sessions</h2>
        </div>
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Inbox className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm text-slate-500">
            No completed interviews yet. Finish your first session to see it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-800">Past Sessions</h2>
        </div>
        {!confirmClear ? (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-rose-600 transition"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Sure?</span>
            <button
              type="button"
              onClick={() => {
                clearHistory();
                setConfirmClear(false);
                onChanged();
              }}
              className="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700 transition"
            >
              Yes, clear
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-slate-800 truncate">{entry.role}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                  {entry.type}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                  {entry.totalQuestions} Qs
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(entry.date)}
              </div>
            </div>
            <div className="flex items-center gap-3 ml-3">
              <span
                className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-sm font-bold ${scoreColor(entry.overallScore)}`}
              >
                {entry.overallScore}/100
              </span>
              <button
                type="button"
                onClick={() => onView(entry.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 transition"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
