import { TrendingUp } from "lucide-react";

interface ProgressHeaderProps {
  userName?: string | null;
}

export default function ProgressHeader({ userName }: ProgressHeaderProps) {
  return (
    <header className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-900">
        <TrendingUp className="h-6 w-6 text-emerald-600" aria-hidden="true" />
        <h1 className="text-2xl font-bold tracking-tight">Career Progress</h1>
      </div>
      <p className="text-sm text-slate-500">
        {userName ? `Welcome back, ${userName}.` : "Welcome back."} Here is a snapshot of your career-development progress across CareerMate.
      </p>
    </header>
  );
}
