interface JobMatchBadgeProps {
  matchPercentage: number;
  size?: 'sm' | 'md';
}

export function JobMatchBadge({ matchPercentage, size = 'md' }: JobMatchBadgeProps) {
  let colorClass = '';
  let bgColor = '';
  let label = '';

  if (matchPercentage >= 75) {
    colorClass = 'text-emerald-700';
    bgColor = 'bg-emerald-50 border-emerald-200';
    label = 'Excellent Match';
  } else if (matchPercentage >= 50) {
    colorClass = 'text-blue-700';
    bgColor = 'bg-blue-50 border-blue-200';
    label = 'Good Match';
  } else if (matchPercentage >= 25) {
    colorClass = 'text-amber-700';
    bgColor = 'bg-amber-50 border-amber-200';
    label = 'Partial Match';
  } else {
    colorClass = 'text-slate-600';
    bgColor = 'bg-slate-50 border-slate-200';
    label = 'Low Match';
  }

  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${bgColor} ${colorClass} ${sizeClass} font-semibold whitespace-nowrap`}>
      <span className="tabular-nums">{matchPercentage}%</span>
      <span className="hidden sm:inline">Profile Match</span>
      <span className="sm:hidden">Match</span>
    </div>
  );
}
