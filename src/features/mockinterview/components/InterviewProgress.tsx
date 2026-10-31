import { CheckCircle2, Circle } from 'lucide-react';

interface InterviewProgressProps {
  current: number;
  total: number;
  answered: boolean[];
}

export default function InterviewProgress({ current, total, answered }: InterviewProgressProps) {
  const percent = total === 0 ? 0 : Math.round(((current + 1) / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">
          Question {current + 1} of {total}
        </span>
        <span className="text-sm font-semibold text-teal-700">{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {answered.map((done, i) => (
          <span key={i} className="inline-flex">
            {done ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : (
              <Circle
                className={`h-5 w-5 ${
                  i === current ? 'text-teal-600 fill-teal-100' : 'text-slate-300'
                }`}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
