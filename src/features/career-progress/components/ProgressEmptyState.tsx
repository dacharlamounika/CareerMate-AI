import { FileX2 } from "lucide-react";

interface ProgressEmptyStateProps {
  title?: string;
  message?: string;
}

export default function ProgressEmptyState({
  title = "No data available yet",
  message = "Once you start using this part of CareerMate, your progress will show up here.",
}: ProgressEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
      <FileX2 className="h-7 w-7 text-slate-300" aria-hidden="true" />
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className="max-w-xs text-xs text-slate-400">{message}</p>
    </div>
  );
}
