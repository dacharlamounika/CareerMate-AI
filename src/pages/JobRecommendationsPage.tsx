import { useEffect, useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  Loader2,
  Target,
  XCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserResumes } from '@/services/resumeService';
import { getJobRecommendations, type JobRecommendation } from '@/features/career/utils/jobRecommendations';
import type { Resume } from '@/types';

export function JobRecommendationsPage() {
  const { user } = useAuth();

  const [resume, setResume] = useState<Resume | null>(null);
  const [jobs, setJobs] = useState<JobRecommendation[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError('');

        const resumes = await fetchUserResumes(user.id);
        const latest = resumes[0] || null;

        setResume(latest);

        if (latest?.content) {
          const recommendations = getJobRecommendations(
            latest.content as never
          );

          setJobs(recommendations);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load job recommendations.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto animate-spin text-teal-600" size={32} />
            <p className="mt-3 text-sm text-slate-500">
              Analyzing your profile...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!resume) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl py-16 text-center">
          <Briefcase className="mx-auto text-slate-300" size={52} />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Job Recommendations
          </h1>

          <p className="mt-2 text-slate-500">
            Build your resume first so CareerMate can recommend relevant job
            roles based on your actual profile.
          </p>

          <a href="/resume-builder" className="btn-primary mt-6 inline-flex">
            Build Resume
          </a>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Briefcase size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Job Recommendations
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Job roles matched to the skills and information in your profile.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-6 text-amber-800">
            <strong>Important:</strong> These are profile-based job-role
            recommendations, not live vacancies. Match percentages are
            estimates of profile alignment and are not predictions of hiring,
            selection, salary, or employment.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="card p-10 text-center">
            <Target className="mx-auto text-slate-300" size={48} />

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No matching job roles found
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              Add more genuine skills, projects, certifications, or experience
              to your resume and return here to generate updated
              recommendations.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recommended Job Roles
                </h2>

                <p className="text-sm text-slate-500">
                  {jobs.length} roles found from your current profile.
                </p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onView={() => setSelectedJob(job)}
                />
              ))}
            </div>
          </>
        )}

        {selectedJob && (
          <JobDetails
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

function JobCard({
  job,
  onView,
}: {
  job: JobRecommendation;
  onView: () => void;
}) {
  const scoreClass =
    job.matchLevel === 'High'
      ? 'bg-teal-50 text-teal-700 border-teal-200'
      : job.matchLevel === 'Medium'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';

  return (
    <div className="card p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">
            {job.careerCategory}
          </span>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {job.title}
          </h3>
        </div>

        <div
          className={`rounded-lg border px-3 py-2 text-center ${scoreClass}`}
        >
          <p className="text-lg font-bold">{job.matchScore}%</p>
          <p className="text-[10px] font-semibold uppercase">
            {job.matchLevel} Match
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {job.description}
      </p>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Your matched skills
        </p>

        <div className="flex flex-wrap gap-2">
          {job.matchedSkills.length > 0 ? (
            job.matchedSkills.slice(0, 7).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">
              No matching skills detected yet.
            </span>
          )}
        </div>
      </div>

      {job.skillsToDevelop.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Skills to develop
          </p>

          <div className="flex flex-wrap gap-2">
            {job.skillsToDevelop.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-400">
          {job.jobType}
        </span>

        <button onClick={onView} className="btn-secondary text-xs">
          View Match Details
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}

function JobDetails({
  job,
  onClose,
}: {
  job: JobRecommendation;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">
              {job.careerCategory}
            </span>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {job.title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {job.jobType}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <ChevronDown size={20} className="rotate-45" />
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-5">
          <div className="flex items-center gap-3">
            <Target className="text-teal-600" size={20} />

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Profile Match: {job.matchScore}%
              </p>

              <p className="text-xs text-slate-500">
                {job.matchLevel} profile alignment
              </p>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {job.whyItMatches}
          </p>
        </div>

        <section className="mt-6">
          <h3 className="font-semibold text-slate-900">
            Role Description
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {job.description}
          </p>
        </section>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section>
            <h3 className="mb-3 font-semibold text-slate-900">
              Skills You Have
            </h3>

            {job.matchedSkills.length > 0 ? (
              <div className="space-y-2">
                {job.matchedSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <CheckCircle2 size={16} className="text-teal-600" />
                    {skill}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No matching skills detected.
              </p>
            )}
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-slate-900">
              Skills to Develop
            </h3>

            {job.skillsToDevelop.length > 0 ? (
              <div className="space-y-2">
                {job.skillsToDevelop.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <XCircle size={16} className="text-amber-500" />
                    {skill}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-teal-600">
                Your current profile covers the listed skills.
              </p>
            )}
          </section>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-teal-600" />
              <h3 className="font-semibold text-slate-900">
                Relevant Education
              </h3>
            </div>

            <ul className="mt-3 space-y-2">
              {job.educationRequirements.map((item) => (
                <li key={item} className="text-sm text-slate-600">
                  • {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <Briefcase size={18} className="text-teal-600" />
              <h3 className="font-semibold text-slate-900">
                Typical Experience
              </h3>
            </div>

            <ul className="mt-3 space-y-2">
              {job.experienceRequirements.map((item) => (
                <li key={item} className="text-sm text-slate-600">
                  • {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs leading-5 text-blue-800">
            These are career-role recommendations generated from your profile.
            They are not live job vacancies and do not represent a guarantee of
            hiring or employment.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}