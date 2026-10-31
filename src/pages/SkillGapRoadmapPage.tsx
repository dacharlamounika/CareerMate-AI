import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Target,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';

import type { Resume, ResumeContent } from '@/types';
import { emptyResumeContent } from '@/types';

import { getCareerRecommendations } from '@/features/career/utils/careerRecommendation';

import {
  analyzeSkillGap,
  type SkillGapResult,
} from '@/features/career/utils/skillGapAnalysis';

export function SkillGapRoadmapPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [resume, setResume] = useState<Resume | null>(null);
  const [content, setContent] =
    useState<ResumeContent>(emptyResumeContent);

  const [loading, setLoading] = useState(true);
  const [noResume, setNoResume] = useState(false);

  const [selectedRole, setSelectedRole] = useState('');

  const [analysis, setAnalysis] =
    useState<SkillGapResult | null>(null);

  const [analyzing, setAnalyzing] = useState(false);

  const careerRecommendations = useMemo(
    () => getCareerRecommendations(content),
    [content]
  );

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!data) {
        setNoResume(true);
        setLoading(false);
        return;
      }

      const currentResume = data as Resume;

      setResume(currentResume);

      const resumeContent = {
        ...emptyResumeContent,
        ...(currentResume.content as Partial<ResumeContent>),
      };

      setContent(resumeContent);

      const recommendations = getCareerRecommendations(resumeContent);

      const initialRole =
        recommendations[0]?.role ||
        (resumeContent.targetRole === 'Other'
          ? resumeContent.customRole
          : resumeContent.targetRole);

      setSelectedRole(initialRole || '');

      setLoading(false);
    };

    load();
  }, [user]);

  const handleAnalyze = () => {
    setAnalyzing(true);

    setTimeout(() => {
      const result = analyzeSkillGap(content, selectedRole);

setAnalysis(result);


      setAnalyzing(false);
    }, 500);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2
            size={28}
            className="animate-spin text-teal-600"
          />
        </div>
      </DashboardLayout>
    );
  }

  if (noResume) {
    return (
      <DashboardLayout>
        <div className="card p-8 text-center">
          <Target
            size={48}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No resume found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create a resume first so CareerMate can analyze
            your current skills.
          </p>

          <button
            onClick={() => navigate('/resume-builder')}
            className="btn-primary mt-6"
          >
            Go to Resume Builder
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Skill Gap Analysis
            </h1>

            <p className="text-sm text-slate-500">
              Compare your current skills with your selected career role.
            </p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="card mb-6 p-6">
          <div className="flex items-center gap-2">
            <Target
              size={20}
              className="text-teal-600"
            />

            <h2 className="section-title">
              Select Career Role
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Choose a career role to identify the skills you
            should develop.
          </p>

          <div className="relative mt-4 max-w-xl">
            <select
              value={selectedRole}
              onChange={(event) => {
                setSelectedRole(event.target.value);
                setAnalysis(null);
                  
              }}
              className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="">
                Select a career role
              </option>

              {careerRecommendations.map((recommendation) => (
                <option
                  key={recommendation.role}
                  value={recommendation.role}
                >
                  {recommendation.role}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-3 top-3.5 text-slate-400"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedRole || analyzing}
            className="btn-primary mt-4"
          >
            {analyzing ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Analyzing...
              </>
            ) : (
              <>
                <Target size={16} />
                Analyze Skill Gap
              </>
            )}
          </button>
        </div>

        {/* Empty state */}
        {!analysis && !analyzing && (
          <div className="card p-10 text-center">
            <Target
              size={48}
              className="mx-auto text-teal-500"
            />

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Discover Your Skill Gaps
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              CareerMate will compare your existing profile
              against the selected career path and identify
              the skills you should develop.
            </p>
          </div>
        )}

        {/* Loading */}
        {analyzing && (
          <div className="card p-10 text-center">
            <Loader2
              size={36}
              className="mx-auto animate-spin text-teal-600"
            />

            <p className="mt-4 text-sm text-slate-500">
              Comparing your profile with the selected career role...
            </p>
          </div>
        )}

        {/* Analysis */}
        {analysis && !analyzing && (
          <div className="space-y-6">

            {/* Summary */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Selected Role
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {analysis.role}
                  </h2>
                </div>

                <div className="rounded-lg bg-teal-50 px-4 py-2 text-center">
                  <p className="text-xs text-teal-700">
                    Profile Match
                  </p>

                  <p className="text-2xl font-bold text-teal-800">
                    {analysis.matchScore}%
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {analysis.summary}
              </p>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs">
                  <span className="font-medium text-slate-600">
                    Skill Gap
                  </span>

                  <span className="font-semibold text-slate-700">
                    {analysis.gapPercentage}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all"
                    style={{
                      width: `${analysis.gapPercentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Known Skills */}
            <div className="card p-6">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={20}
                  className="text-teal-600"
                />

                <h2 className="section-title">
                  Skills You Already Have
                </h2>
              </div>

              {analysis.knownSkills.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.knownSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No technical skills were detected in the
                  current resume.
                </p>
              )}
            </div>

            {/* Skill Gaps */}
            <div className="card p-6">
              <div className="flex items-center gap-2">
                <AlertCircle
                  size={20}
                  className="text-amber-600"
                />

                <h2 className="section-title">
                  Skills to Develop
                </h2>
              </div>

              {analysis.skillGaps.length === 0 ? (
                <div className="mt-5 rounded-lg bg-teal-50 p-4 text-sm text-teal-800">
                  No major skill gaps were identified from
                  the available profile information.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {analysis.skillGaps.map((gap) => (
                    <div
                      key={gap.skill}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {gap.skill}
                        </h3>

                        <PriorityBadge
                          priority={gap.priority}
                        />
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {gap.reason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            

            {/* Disclaimer */}
            <div className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500 ring-1 ring-slate-200">
              Skill gaps are estimated from the information
              available in your resume and the selected career
              role. They are not a guarantee of job requirements
              or employment outcomes.
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: 'High' | 'Medium' | 'Low';
}) {
  const classes = {
    High: 'bg-red-50 text-red-700',
    Medium: 'bg-amber-50 text-amber-700',
    Low: 'bg-slate-100 text-slate-600',
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${classes[priority]}`}
    >
      {priority} Priority
    </span>
  );
}