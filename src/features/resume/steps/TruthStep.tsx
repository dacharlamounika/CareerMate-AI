import { ShieldCheck, AlertTriangle } from 'lucide-react';
import type { StepProps } from './stepTypes';

export function TruthStep({ content, updateContent }: StepProps) {
  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Truth &amp; Accuracy Notice</h2>
          <p className="text-sm text-slate-500">Before you begin, read this carefully.</p>
        </div>
      </div>

      <div className="rounded-lg bg-teal-50/60 p-5 ring-1 ring-teal-100">
        <h3 className="text-lg font-bold text-slate-900">
          Build your resume with truth, not exaggeration.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          CareerMate AI can improve the wording, structure, and presentation of your resume —
          but it must never create fake information. It will never fabricate:
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            'Skills',
            'Achievements',
            'Certifications',
            'Education',
            'Projects',
            'Experience',
            'Job titles',
            'Companies',
            'Responsibilities',
            'CGPA',
            'Dates',
            'Rankings',
            'Metrics',
            'Project results',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-lg bg-amber-50 p-4 ring-1 ring-amber-200">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          Providing false information on a resume can lead to rejection, termination, and
          long-term damage to your professional reputation. Be honest.
        </p>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50">
        <input
          type="checkbox"
          checked={content.truthAcknowledged}
          onChange={(e) => updateContent({ truthAcknowledged: e.target.checked })}
          className="mt-0.5 h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
        />
        <span className="text-sm font-medium text-slate-800">
          I confirm that the information I provide is genuine and accurate.
        </span>
      </label>
    </div>
  );
}
