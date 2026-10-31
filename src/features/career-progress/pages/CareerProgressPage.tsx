import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { CareerProgressData } from "@/features/career-progress/types/careerProgressTypes";
import { loadCareerProgress } from "@/features/career-progress/utils/careerProgressData";
import ProgressHeader from "@/features/career-progress/components/ProgressHeader";
import OverallProgress from "@/features/career-progress/components/OverallProgress";
import ModuleProgressGrid from "@/features/career-progress/components/ModuleProgressGrid";
import RecentActivity from "@/features/career-progress/components/RecentActivity";
import NextAction from "@/features/career-progress/components/NextAction";

export default function CareerProgressPage() {
  const [data, setData] = useState<CareerProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // Defer to next tick so localStorage access doesn't run during SSR/strict-mode double-invoke surprises.
    const id = window.setTimeout(() => {
      if (!active) return;
      const loaded = loadCareerProgress();
      setData(loaded);
      setLoading(false);
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(id);
    };
  }, []);

  if (loading || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" aria-hidden="true" />
        <span className="ml-2 text-sm text-slate-500">Loading your career progress…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <ProgressHeader />

          <OverallProgress overall={data.overall} />

          <NextAction action={data.nextAction} />

          <ModuleProgressGrid data={data} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentActivity activity={data.recentActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}
