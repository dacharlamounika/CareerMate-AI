import { ArrowRight, Sparkles } from "lucide-react";
import type { NextActionSuggestion } from "@/features/career-progress/types/careerProgressTypes";

interface NextActionProps {
  action: NextActionSuggestion | null;
}

export default function NextAction({ action }: NextActionProps) {
  if (!action) {
    return null;
  }
  return (
    <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Next recommended action</p>
            <h2 className="text-base font-semibold text-slate-900">{action.title}</h2>
            <p className="text-sm text-slate-600">{action.detail}</p>
          </div>
        </div>
        <a
          href={action.link}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Go to action
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
