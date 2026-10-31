import { ArrowRight, CheckCircle2, Loader2, CircleSlash } from "lucide-react";
import type { CardDataSlice, ModuleStatus } from "@/features/career-progress/types/careerProgressTypes";
import ProgressEmptyState from "@/features/career-progress/components/ProgressEmptyState";

interface ProgressCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  linkLabel: string;
  data: CardDataSlice;
}

const STATUS_BADGE: Record<ModuleStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 ring-emerald-200", Icon: CheckCircle2 },
  "in-progress": { label: "In progress", className: "bg-amber-50 text-amber-700 ring-amber-200", Icon: Loader2 },
  "not-started": { label: "Not started", className: "bg-slate-50 text-slate-500 ring-slate-200", Icon: CircleSlash },
};

function StatusBadge({ status }: { status: ModuleStatus }) {
  const { label, className, Icon } = STATUS_BADGE[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${className}`}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function Bar({ percentage }: { percentage: number | null }) {
  if (percentage === null) return null;
  return (
    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-emerald-500 transition-[width] duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  );
}

function renderBody(data: CardDataSlice): { stats: { label: string; value: string }[]; bar: number | null; empty: boolean } {
  switch (data.kind) {
    case "resume": {
      const p = data.payload;
      if (p.completionPercentage === null && p.sectionsCompleted === null) {
        return { stats: [], bar: null, empty: true };
      }
      return {
        stats: [
          { label: "Sections", value: p.sectionsCompleted && p.totalSections ? `${p.sectionsCompleted.length}/${p.totalSections}` : "—" },
          { label: "Completion", value: p.completionPercentage !== null ? `${p.completionPercentage}%` : "—" },
        ],
        bar: p.completionPercentage,
        empty: false,
      };
    }
    case "ats": {
      const p = data.payload;
      if (p.latestScore === null && p.analysisCount === null) {
        return { stats: [], bar: null, empty: true };
      }
      return {
        stats: [
          { label: "Latest score", value: p.latestScore !== null ? `${p.latestScore}/100` : "—" },
          { label: "Analyses", value: p.analysisCount !== null ? String(p.analysisCount) : "—" },
        ],
        bar: p.latestScore,
        empty: false,
      };
    }
    case "job-description": {
      const p = data.payload;
      if (p.analysisCount === null) {
        return { stats: [], bar: null, empty: true };
      }
      return {
        stats: [
          { label: "Analyses", value: String(p.analysisCount) },
          { label: "Latest", value: p.latestAnalysisTitle ?? "—" },
        ],
        bar: null,
        empty: false,
      };
    }
    case "skill-gap": {
      const p = data.payload;
      if (!p.skillsIdentified && !p.skillsMatched && !p.skillsNeedingImprovement) {
        return { stats: [], bar: null, empty: true };
      }
      return {
        stats: [
          { label: "Identified", value: p.skillsIdentified ? String(p.skillsIdentified.length) : "—" },
          { label: "Matched", value: p.skillsMatched ? String(p.skillsMatched.length) : "—" },
          { label: "To improve", value: p.skillsNeedingImprovement ? String(p.skillsNeedingImprovement.length) : "—" },
        ],
        bar: null,
        empty: false,
      };
    }
    case "learning": {
      const p = data.payload;
      if (p.progressPercentage === null && !p.completedItems && !p.remainingItems) {
        return { stats: [], bar: null, empty: true };
      }
      const completedCount = p.completedItems?.length ?? 0;
      const remainingCount = p.remainingItems?.length ?? 0;
      return {
        stats: [
          { label: "Completed", value: String(completedCount) },
          { label: "Remaining", value: String(remainingCount) },
          { label: "Next", value: p.nextRecommendedItemId ?? p.currentItemId ?? "—" },
        ],
        bar: p.progressPercentage,
        empty: false,
      };
    }
    case "aptitude": {
      const p = data.payload;
      if (p.questionsAttempted === null && p.averageScore === null && !p.topicProgress) {
        return { stats: [], bar: null, empty: true };
      }
      return {
        stats: [
          { label: "Attempted", value: p.questionsAttempted !== null ? String(p.questionsAttempted) : "—" },
          { label: "Avg score", value: p.averageScore !== null ? `${p.averageScore}%` : "—" },
          { label: "Topics", value: p.topicProgress ? String(p.topicProgress.length) : "—" },
        ],
        bar: p.averageScore,
        empty: false,
      };
    }
    case "coding": {
      const p = data.payload;
      if (p.problemsAttempted === null && p.problemsSolved === null && p.averageScore === null) {
        return { stats: [], bar: null, empty: true };
      }
      return {
        stats: [
          { label: "Attempted", value: p.problemsAttempted !== null ? String(p.problemsAttempted) : "—" },
          { label: "Solved", value: p.problemsSolved !== null ? String(p.problemsSolved) : "—" },
          { label: "Avg score", value: p.averageScore !== null ? `${p.averageScore}%` : "—" },
        ],
        bar: p.averageScore,
        empty: false,
      };
    }
    case "mock-interview": {
      const p = data.payload;
      if (p.interviewsCompleted === null && p.latestScore === null && p.averageScore === null) {
        return { stats: [], bar: null, empty: true };
      }
      return {
        stats: [
          { label: "Completed", value: p.interviewsCompleted !== null ? String(p.interviewsCompleted) : "—" },
          { label: "Latest", value: p.latestScore !== null ? `${p.latestScore}/100` : "—" },
          { label: "Average", value: p.averageScore !== null ? `${p.averageScore}/100` : "—" },
        ],
        bar: p.latestScore,
        empty: false,
      };
    }
    case "live-jobs": {
      const p = data.payload;
      if (p.jobsViewed === null && p.jobsAppliedTo === null) {
        return { stats: [], bar: null, empty: true };
      }
      return {
        stats: [
          { label: "Viewed", value: p.jobsViewed !== null ? String(p.jobsViewed) : "—" },
          { label: "Applied", value: p.jobsAppliedTo !== null ? String(p.jobsAppliedTo) : "—" },
        ],
        bar: null,
        empty: false,
      };
    }
  }
}

export default function ProgressCard({ title, icon: Icon, link, linkLabel, data }: ProgressCardProps) {
  const status = data.payload.status;
  const { stats, bar, empty } = renderBody(data);

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-100">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-4 flex-1">
        {empty ? (
          <ProgressEmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((s) => (
              <Stat key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        )}
        {bar !== null && <Bar percentage={bar} />}
      </div>

      <a
        href={link}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </article>
  );
}
