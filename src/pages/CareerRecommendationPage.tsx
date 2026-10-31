import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Compass,
  Loader2,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X,
  Briefcase,
  BookOpen,
  Lightbulb,
  Target,
  FolderGit2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import type { Resume, ResumeContent } from '@/types';
import { emptyResumeContent, normalizeResumeContent } from '@/types';
import {
  getCareerRecommendations,
  type CareerRecommendation,
  type MatchLevel,
} from '@/features/career/utils/careerRecommendation';

export function CareerRecommendationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [content, setContent] = useState<ResumeContent>(emptyResumeContent);
  const [loading, setLoading] = useState(true);
  const [noResume, setNoResume] = useState(false);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedRec, setSelectedRec] = useState<CareerRecommendation | null>(null);

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
      const r = data as Resume;
      setResume(r);
      setContent(normalizeResumeContent(r.content as Partial<ResumeContent>));
      setLoading(false);
    };
    load();
  }, [user]);

  const hasProfileData = useMemo(() => {
    return (
      content.education.length > 0 ||
      content.projects.length > 0 ||
      content.experience.length > 0 ||
      content.certifications.length > 0 ||
      content.achievements.length > 0 ||
      content.interests.length > 0 ||
      !!content.introduction
    );
  }, [content]);

  const handleGetRecommendations = () => {
    setGenerating(true);
    setTimeout(() => {
      const recs = getCareerRecommendations(content);
      setRecommendations(recs);
      setGenerating(false);
    }, 800);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-teal-600" size={28} />
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
            <h1 className="text-xl font-bold text-slate-900">Career Recommendation</h1>
            <p className="text-sm text-slate-500">Based on your profile</p>
          </div>
        </div>

        {/* No resume state */}
        {noResume && (
          <div className="card p-8 text-center">
            <Compass className="mx-auto text-slate-300" size={48} />
            <h2 className="mt-4 text-lg font-semibold text-slate-900">No resume found</h2>
            <p className="mt-2 text-sm text-slate-500">
              Career recommendations use your existing resume profile. Create a resume first
              to get personalized career suggestions.
            </p>
            <button
              onClick={() => navigate('/resume-builder')}
              className="btn-primary mt-6 text-sm"
            >
              Go to Resume Builder
            </button>
          </div>
        )}

        {/* Resume exists but no profile data */}
        {!noResume && !hasProfileData && (
          <div className="card p-8 text-center">
            <AlertCircle className="mx-auto text-amber-400" size={48} />
            <h2 className="mt-4 text-lg font-semibold text-slate-900">Your resume needs more information</h2>
            <p className="mt-2 text-sm text-slate-500">
              Add skills, projects, education, or experience to your resume to get meaningful
              career recommendations.
            </p>
            {resume && (
              <button
                onClick={() => navigate(`/resume-builder/${resume.id}`)}
                className="btn-primary mt-6 text-sm"
              >
                Complete Your Resume
              </button>
            )}
          </div>
        )}

        {/* Main content */}
        {!noResume && hasProfileData && (
          <>
            {/* Profile summary */}
            <div className="card mb-6 p-5">
              <h2 className="section-title flex items-center gap-2">
                <Briefcase size={18} className="text-teal-600" />
                Your Profile
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <ProfileStat label="Target Role" value={content.targetRole === 'Other' ? content.customRole : content.targetRole || 'Not set'} />
                <ProfileStat label="Education" value={content.education.length > 0 ? `${content.education[0].degree}` : 'Not added'} />
                <ProfileStat label="Projects" value={`${content.projects.length} added`} />
                <ProfileStat label="Experience" value={`${content.experience.length} added`} />
                <ProfileStat label="Certifications" value={`${content.certifications.length} added`} />
                <ProfileStat label="Achievements" value={`${content.achievements.length} added`} />
                <ProfileStat label="Interests" value={`${content.interests.length} added`} />
                <ProfileStat label="Specialization" value={content.education[0]?.specialization || 'Not set'} />
              </div>
            </div>

            {/* Get recommendations button */}
            {!recommendations && !generating && (
              <div className="card p-8 text-center">
                <Compass className="mx-auto text-teal-600" size={48} />
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  Discover Career Paths for You
                </h2>
                <p className="mt-2 max-w-lg mx-auto text-sm text-slate-500">
                  Get personalized career recommendations based on your education, skills,
                  projects, experience, certifications, and interests. The analysis uses only
                  information from your existing resume profile.
                </p>
                <button onClick={handleGetRecommendations} className="btn-primary mt-6 text-sm">
                  <Compass size={16} /> Get Career Recommendations
                </button>
              </div>
            )}

            {/* Generating state */}
            {generating && (
              <div className="card p-8 text-center">
                <Loader2 className="mx-auto animate-spin text-teal-600" size={36} />
                <p className="mt-4 text-sm text-slate-500">
                  Analyzing your profile and matching career paths...
                </p>
              </div>
            )}

            {/* Recommendations */}
            {recommendations && !generating && (
              <div className="space-y-4">
                {/* Disclaimer */}
                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 ring-1 ring-slate-200">
                  Profile match is an estimate based on the information provided. It is not a
                  prediction of employment or career success.
                </div>

                {recommendations.map((rec, idx) => (
                  <RecommendationCard
                    key={`${rec.role}-${idx}`}
                    recommendation={rec}
                    onViewDetails={() => setSelectedRec(rec)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail modal */}
      {selectedRec && (
        <RecommendationDetailModal
          recommendation={selectedRec}
          onClose={() => setSelectedRec(null)}
        />
      )}
    </DashboardLayout>
  );
}

// --- Sub-components ---

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800 truncate">{value}</p>
    </div>
  );
}

const MATCH_STYLES: Record<MatchLevel, { badge: string; icon: typeof TrendingUp }> = {
  High: { badge: 'bg-teal-50 text-teal-700 ring-teal-200', icon: TrendingUp },
  Medium: { badge: 'bg-amber-50 text-amber-700 ring-amber-200', icon: AlertCircle },
  Developing: { badge: 'bg-slate-100 text-slate-600 ring-slate-200', icon: BookOpen },
};

function RecommendationCard({
  recommendation: rec,
  onViewDetails,
}: {
  recommendation: CareerRecommendation;
  onViewDetails: () => void;
}) {
  const matchStyle = MATCH_STYLES[rec.matchLevel];
  const MatchIcon = matchStyle.icon;

  return (
    <div className="card p-5 transition-all hover:border-teal-300 hover:shadow-md">
      {/* Role + match */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{rec.role}</h3>
          <span
            className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${matchStyle.badge}`}
          >
            <MatchIcon size={12} />
            Profile Match: {rec.matchLevel}
          </span>
        </div>
        <div className="text-right">
          <div
            className={`text-2xl font-bold ${
              rec.matchLevel === 'High'
                ? 'text-teal-600'
                : rec.matchLevel === 'Medium'
                ? 'text-amber-600'
                : 'text-slate-500'
            }`}
          >
            {rec.matchScore}%
          </div>
        </div>
      </div>

      {/* Why it matches */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-slate-900">Why this matches</h4>
        <p className="mt-1 text-sm text-slate-600">{rec.whyItMatches}</p>
      </div>

      {/* Relevant skills */}
      {rec.relevantSkills.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900">Your Relevant Skills</h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {rec.relevantSkills.map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"
              >
                <CheckCircle2 size={11} />
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills to develop */}
      {rec.skillsToDevelop.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900">Skills to Develop</h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {rec.skillsToDevelop.map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
              >
                <Target size={11} />
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Learning areas */}
      {rec.learningAreas.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900">Learning Areas</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {rec.learningAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-2">
                <BookOpen size={14} className="mt-0.5 shrink-0 text-slate-400" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* View details button */}
      <div className="mt-5 flex justify-end">
        <button onClick={onViewDetails} className="btn-secondary text-xs">
          View Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function RecommendationDetailModal({
  recommendation: rec,
  onClose,
}: {
  recommendation: CareerRecommendation;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{rec.role}</h2>
            <span
              className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${MATCH_STYLES[rec.matchLevel].badge}`}
            >
              <MatchLevelIcon level={rec.matchLevel} />
              Profile Match: {rec.matchLevel} · {rec.matchScore}%
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          {/* Overview */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Briefcase size={16} className="text-teal-600" />
              Role Overview
            </h3>
            <p className="mt-2 text-sm text-slate-600">{rec.roleOverview}</p>
          </section>

          {/* Why it matches */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <TrendingUp size={16} className="text-teal-600" />
              Why It Matches Your Profile
            </h3>
            <p className="mt-2 text-sm text-slate-600">{rec.whyItMatches}</p>
          </section>

          {/* Typical responsibilities */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Target size={16} className="text-teal-600" />
              Typical Responsibilities
            </h3>
            <p className="mt-2 text-sm text-slate-600">{rec.typicalResponsibilities}</p>
          </section>

          {/* Relevant skills */}
          {rec.relevantSkills.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <CheckCircle2 size={16} className="text-teal-600" />
                Skills You Already Have
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {rec.relevantSkills.map((skill, i) => (
                  <span
                    key={`${skill}-${i}`}
                    className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"
                  >
                    <CheckCircle2 size={11} />
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Skills to develop */}
          {rec.skillsToDevelop.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <AlertCircle size={16} className="text-amber-500" />
                Skills to Develop
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {rec.skillsToDevelop.map((skill, i) => (
                  <span
                    key={`${skill}-${i}`}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
                  >
                    <Target size={11} />
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Learning areas */}
          {rec.learningAreas.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <BookOpen size={16} className="text-teal-600" />
                Learning Areas
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                {rec.learningAreas.map((area, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <BookOpen size={14} className="mt-0.5 shrink-0 text-slate-400" />
                    {area}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Suggested project areas */}
          {rec.suggestedProjectAreas.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <FolderGit2 size={16} className="text-teal-600" />
                Suggested Project Areas
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                {rec.suggestedProjectAreas.map((proj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Lightbulb size={14} className="mt-0.5 shrink-0 text-amber-400" />
                    {proj}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-400">
                These are suggestions to help you build relevant experience. Only pursue
                projects that genuinely interest you.
              </p>
            </section>
          )}

          {/* Disclaimer */}
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 ring-1 ring-slate-200">
            Profile match is an estimate based on the information provided. It is not a
            prediction of employment or career success.
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchLevelIcon({ level }: { level: MatchLevel }) {
  const icon = MATCH_STYLES[level].icon;
  const Icon = icon;
  return <Icon size={12} />;
}
