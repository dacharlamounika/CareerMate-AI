import { Briefcase } from 'lucide-react';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
  const icon = { sm: 18, md: 22, lg: 26 };
  const text = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' };

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${dims[size]} flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-md`}>
        <Briefcase size={icon[size]} />
      </div>
      <span className={`font-extrabold tracking-tight text-slate-900 ${text[size]}`}>
        CareerMate<span className="text-teal-700"> AI</span>
      </span>
    </div>
  );
}
