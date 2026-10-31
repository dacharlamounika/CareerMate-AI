import { Clock } from "lucide-react";
import type { ActivityEntry } from "@/features/career-progress/types/careerProgressTypes";
import ProgressEmptyState from "@/features/career-progress/components/ProgressEmptyState";

interface RecentActivityProps {
  activity: ActivityEntry[];
}

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function RecentActivity({ activity }: RecentActivityProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-slate-500" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
      </div>
      {activity.length === 0 ? (
        <ProgressEmptyState message="As you use CareerMate modules, your recent activity will appear here." />
      ) : (
        <ol className="space-y-3">
          {activity.map((entry, i) => (
            <li key={`${entry.module}-${entry.timestamp}-${i}`} className="flex items-start gap-3">
              <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-slate-800">{entry.description}</span>
                <span className="text-xs text-slate-400">
                  {entry.module} · {formatTimestamp(entry.timestamp)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
