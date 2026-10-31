import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  generateLearningRoadmap,
  type LearningRoadmap,
} from '@/features/career/utils/learningRoadmap';

import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Loader2,
  Target,
} from 'lucide-react';

import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';

import type { Resume, ResumeContent } from '@/types';
import { emptyResumeContent } from '@/types';

import { getCareerRecommendations } from '@/features/career/utils/careerRecommendation';

export function LearningRoadmapPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [content, setContent] =
    useState<ResumeContent>(emptyResumeContent);

  const [loading, setLoading] = useState(true);
  const [noResume, setNoResume] = useState(false);

  const [selectedRole, setSelectedRole] = useState('');
  const [roadmap, setRoadmap] =
    useState<LearningRoadmap | null>(null);

  const [generating, setGenerating] = useState(false);

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

      const resumeContent = {
        ...emptyResumeContent,
        ...(currentResume.content as Partial<ResumeContent>),
      };

      setContent(resumeContent);

      const recommendations =
        getCareerRecommendations(resumeContent);

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

  const handleGenerateRoadmap = () => {
    if (!selectedRole) return;

    setGenerating(true);

    setTimeout(() => {
      /*
       * The existing roadmap generator expects the role
       * and the identified skill gaps.
       *
       * We calculate the skill gaps here using the existing
       * Skill Gap Analysis utility so the roadmap remains
       * consistent with the current implementation.
       */
      import('@/features/career/utils/skillGapAnalysis').then(
        ({ analyzeSkillGap }) => {
          const result = analyzeSkillGap(
            content,
            selectedRole
          );

          const generatedRoadmap =
            generateLearningRoadmap(
              result.role,
              result.skillGaps
            );

          setRoadmap(generatedRoadmap);
          setGenerating(false);
        }
      );
    }, 300);
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
            Create a resume first so CareerMate can create
            your personalized learning roadmap.
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
              Learning Roadmap
            </h1>

            <p className="text-sm text-slate-500">
              Follow a personalized learning path based on your
              career goal and skill gaps.
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
            Choose a career role to generate your learning roadmap.
          </p>

          <div className="relative mt-4 max-w-xl">
            <select
              value={selectedRole}
              onChange={(event) => {
                setSelectedRole(event.target.value);
                setRoadmap(null);
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
            onClick={handleGenerateRoadmap}
            disabled={!selectedRole || generating}
            className="btn-primary mt-4"
          >
            {generating ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Generating...
              </>
            ) : (
              <>
                <BookOpen size={16} />
                Generate Learning Roadmap
              </>
            )}
          </button>
        </div>

        {/* Empty State */}
        {!roadmap && !generating && (
          <div className="card p-10 text-center">
            <BookOpen
              size={48}
              className="mx-auto text-teal-500"
            />

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Build Your Learning Roadmap
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              CareerMate will create a personalized learning path
              based on your selected career role and identified
              skill gaps.
            </p>
          </div>
        )}

        {/* Loading */}
        {generating && (
          <div className="card p-10 text-center">
            <Loader2
              size={36}
              className="mx-auto animate-spin text-teal-600"
            />

            <p className="mt-4 text-sm text-slate-500">
              Creating your personalized learning roadmap...
            </p>
          </div>
        )}

        {/* Roadmap */}
        {roadmap && !generating && (
          <div className="card p-6">

            <div className="flex items-center gap-2">
              <BookOpen
                size={20}
                className="text-teal-600"
              />

              <div>
                <h2 className="section-title">
                  Personalized Learning Roadmap
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  A learning path based on your identified skill
                  gaps for {roadmap.role}.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {roadmap.stages.map((stage, stageIndex) => (
                <div
                  key={stage.stage}
                  className="relative"
                >
                  <div className="flex gap-4">

                    {/* Stage Number */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-700">
                      {stageIndex + 1}
                    </div>

                    <div className="min-w-0 flex-1">

                      {/* Stage Title */}
                      <h3 className="font-semibold text-slate-900">
                        {stage.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {stage.description}
                      </p>

                      {/* Skills */}
                      <div className="mt-4 space-y-4">
                        {stage.items.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg border border-slate-200 p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h4 className="font-semibold text-slate-900">
                                {item.skill}
                              </h4>

                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                {item.stage}
                              </span>
                            </div>

                            {/* Why it matters */}
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                              {item.whyItMatters}
                            </p>

                            {/* Learning Focus */}
                            <div className="mt-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Learning Focus
                              </p>

                              <ul className="mt-2 space-y-1.5">
                                {item.learningFocus.map(
                                  (focus) => (
                                    <li
                                      key={focus}
                                      className="flex gap-2 text-sm text-slate-600"
                                    >
                                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                      {focus}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>

                            {/* Practice + Project */}
                            <div className="mt-4 grid gap-3 md:grid-cols-2">

                              <div className="rounded-lg bg-slate-50 p-3">
                                <p className="text-xs font-semibold text-slate-500">
                                  Practice Task
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                  {item.practiceTask}
                                </p>
                              </div>

                              <div className="rounded-lg bg-teal-50 p-3">
                                <p className="text-xs font-semibold text-teal-700">
                                  Project Idea
                                </p>

                                <p className="mt-1 text-sm text-teal-900">
                                  {item.projectIdea}
                                </p>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Capstone */}
            <div className="mt-6 rounded-lg border border-teal-200 bg-teal-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                Recommended Capstone
              </p>

              <p className="mt-2 text-sm leading-6 text-teal-900">
                {roadmap.capstoneProject}
              </p>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default LearningRoadmapPage;