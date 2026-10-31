import type { StepProps } from './stepTypes';
import { IT_ROLES } from '@/types';

export function TargetRoleStep({ content, updateContent }: StepProps) {
  const isOther = content.targetRole === 'Other';

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900">What is your target job role?</h2>
      <p className="mt-2 text-sm text-slate-500">
        {content.careerType === 'IT'
          ? 'Select the IT role you are targeting. This tailors your resume and ATS analysis.'
          : 'Select a role from the list, or choose "Other" to enter your own.'}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {IT_ROLES.map((role) => {
          const selected = content.targetRole === role;
          return (
            <button
              key={role}
              onClick={() => updateContent({ targetRole: role, customRole: '' })}
              className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                selected
                  ? 'border-teal-600 bg-teal-50/50 text-teal-800'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {role}
              {selected && <span className="h-2 w-2 rounded-full bg-teal-600" />}
            </button>
          );
        })}
      </div>

      {isOther && (
        <div className="mt-4 animate-fade-in">
          <label className="label" htmlFor="customRole">Enter your target role</label>
          <input
            id="customRole"
            type="text"
            value={content.customRole}
            onChange={(e) => updateContent({ customRole: e.target.value })}
            className="input"
            placeholder="e.g. Product Manager"
          />
        </div>
      )}
    </div>
  );
}
