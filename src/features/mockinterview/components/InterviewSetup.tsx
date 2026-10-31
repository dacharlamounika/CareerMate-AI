import { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  ListChecks,
  Hash,
  Play,
} from 'lucide-react';
import type {
  ExperienceLevel,
  InterviewRole,
  InterviewType,
} from '../types/mockInterviewTypes';
import {
  experienceLevels,
  interviewTypes,
  questionCountOptions,
  roles,
} from '../utils/interviewQuestions';

interface InterviewSetupProps {
  onStart: (config: {
    role: InterviewRole;
    type: InterviewType;
    experience: ExperienceLevel;
    count: number;
  }) => void;
}

interface OptionCard<T> {
  value: T;
  label: string;
  icon?: typeof Briefcase;
}

export default function InterviewSetup({ onStart }: InterviewSetupProps) {
  const [role, setRole] = useState<InterviewRole>('Software Developer');
  const [type, setType] = useState<InterviewType>('Mixed');
  const [experience, setExperience] = useState<ExperienceLevel>('Fresher');
  const [count, setCount] = useState<number>(5);

  const typeDescriptions: Record<InterviewType, string> = {
    Technical: 'Core CS, programming & role-specific questions',
    HR: 'Behavioural, cultural fit & communication questions',
    Mixed: 'A balanced blend of technical and HR questions',
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Set up your mock interview</h2>
        <p className="mt-2 text-slate-500 text-sm sm:text-base">
          Choose your target role, interview type, and length to begin a guided practice session.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
        {/* Role */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Briefcase className="h-4 w-4 text-teal-600" />
            Target Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {roles.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-lg border px-3 py-2.5 text-xs sm:text-sm font-medium text-center transition ${
                  role === r
                    ? 'border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-slate-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <GraduationCap className="h-4 w-4 text-teal-600" />
            Experience Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {experienceLevels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setExperience(lvl)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  experience === lvl
                    ? 'border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-slate-50'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Interview type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <ListChecks className="h-4 w-4 text-teal-600" />
            Interview Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {interviewTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-lg border px-3 py-3 text-left transition ${
                  type === t
                    ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-400'
                    : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`block text-sm font-semibold ${
                    type === t ? 'text-teal-700' : 'text-slate-700'
                  }`}
                >
                  {t}
                </span>
                <span className="block text-xs text-slate-400 mt-0.5">{typeDescriptions[t]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question count */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Hash className="h-4 w-4 text-teal-600" />
            Number of Questions
          </label>
          <div className="grid grid-cols-3 gap-2">
            {questionCountOptions.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  count === n
                    ? 'border-teal-500 bg-teal-50 text-teal-700 ring-1 ring-teal-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-slate-50'
                }`}
              >
                {n} Questions
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStart({ role, type, experience, count })}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3.5 text-white font-semibold text-sm sm:text-base shadow-sm hover:from-teal-700 hover:to-emerald-700 hover:shadow-md transition active:scale-[0.99]"
        >
          <Play className="h-5 w-5" />
          Start Interview
        </button>
      </div>
    </div>
  );
}
