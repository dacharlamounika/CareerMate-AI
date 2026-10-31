import { Laptop, Building2, CheckCircle2 } from 'lucide-react';
import type { StepProps } from './stepTypes';
import type { CareerType } from '@/types';

export function CareerTypeStep({ content, updateContent }: StepProps) {
  const options: { value: CareerType; label: string; desc: string; icon: typeof Laptop }[] = [
    { value: 'IT', label: 'IT', desc: 'Software, data, cloud, cybersecurity, and related technical roles', icon: Laptop },
    { value: 'NON-IT', label: 'Non-IT', desc: 'Business, marketing, operations, HR, and other non-technical roles', icon: Building2 },
  ];

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900">What type of career are you targeting?</h2>
      <p className="mt-2 text-sm text-slate-500">
        This helps us tailor your resume sections and recommendations.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {options.map((opt) => {
          const selected = content.careerType === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => updateContent({ careerType: opt.value, targetRole: '', customRole: '' })}
              className={`relative flex flex-col items-start rounded-xl border-2 p-6 text-left transition-all ${
                selected
                  ? 'border-teal-600 bg-teal-50/50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {selected && (
                <CheckCircle2 className="absolute right-4 top-4 text-teal-600" size={20} />
              )}
              <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-lg ${selected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <opt.icon size={22} />
              </div>
              <h3 className="text-base font-semibold text-slate-900">{opt.label}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{opt.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
