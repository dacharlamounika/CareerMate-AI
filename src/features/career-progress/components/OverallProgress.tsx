import { CheckCircle2, CircleSlash, Loader2 } from "lucide-react";
import type { OverallProgressData } from "@/features/career-progress/types/careerProgressTypes";

interface OverallProgressProps {
  overall: OverallProgressData;
}

function StatusPill({ label, count, tone }: { label: string; count: number; tone: "emerald" | "amber" | "slate" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    slate: "bg-slate-50 text-slate-600 ring-slate-200",
  };
  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ${tones[tone]}`}>
      <span className="text-xl font-bold tabular-nums">{count}</span>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

function Ring({ percentage }: { percentage: number | null }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = percentage !== null ? circumference - (percentage / 100) * circumference : circumference;

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} className="fill-none stroke-slate-100" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          className="fill-none stroke-emerald-500 transition-[stroke-dashoffset] duration-700 ease-out"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {percentage !== null ? (
          <>
            <span className="text-2xl font-bold tabular-nums text-slate-900">{percentage}%</span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Overall</span>
          </>
        ) : (
          <span className="text-xs font-medium text-slate-400">No data</span>
        )}
      </div>
    </div>
  );
}

export default function OverallProgress({ overall }: OverallProgressProps) {
  const { overallPercentage, completedModules, inProgressModules, notStartedModules } = overall;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <Ring percentage={overallPercentage} />
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">Overall Career Progress</h2>
            <p className="max-w-sm text-sm text-slate-500">
              {overallPercentage !== null
                ? "Calculated from modules that have produced real progress data."
                : "Start using CareerMate modules to build your overall progress score."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatusPill label="Completed" count={completedModules.length} tone="emerald" />
          <StatusPill label="In progress" count={inProgressModules.length} tone="amber" />
          <StatusPill label="Not started" count={notStartedModules.length} tone="slate" />
        </div>
      </div>

      {(completedModules.length > 0 || inProgressModules.length > 0 || notStartedModules.length > 0) && (
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <ModuleList icon="completed" title="Completed" items={completedModules} />
          <ModuleList icon="in-progress" title="In progress" items={inProgressModules} />
          <ModuleList icon="not-started" title="Not started" items={notStartedModules} />
        </div>
      )}
    </section>
  );
}

function ModuleList({
  icon,
  title,
  items,
}: {
  icon: "completed" | "in-progress" | "not-started";
  title: string;
  items: string[];
}) {
  const Icon = icon === "completed" ? CheckCircle2 : icon === "in-progress" ? Loader2 : CircleSlash;
  const color =
    icon === "completed" ? "text-emerald-600" : icon === "in-progress" ? "text-amber-600" : "text-slate-400";
  return (
    <div>
      <div className={`mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${color}`}>
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {title}
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-slate-400">None</p>
      ) : (
        <ul className="space-y-1">
          {items.map((m) => (
            <li key={m} className="text-sm text-slate-600">
              {m}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
