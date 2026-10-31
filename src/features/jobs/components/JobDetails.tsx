import { X, MapPin, Building2, Clock, ExternalLink, Laptop, GraduationCap, Tags, Calendar, Globe, CheckCircle2, AlertCircle, User } from 'lucide-react';
import type { JobMatchResult, NormalizedJob, UserProfile } from '../types/jobTypes';
import { JobMatchBadge } from './JobMatchBadge';

interface JobDetailsProps {
  job: NormalizedJob;
  match?: JobMatchResult;
  profile: UserProfile;
  onClose: () => void;
}

function getSourceLabel(source: string): string {
  return source === 'indian' ? 'Indian API' : 'Arbeitnow';
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function cleanDescription(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[#*]+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function JobDetails({ job, match, profile, onClose }: JobDetailsProps) {
  const handleApply = () => {
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 overflow-y-auto bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full max-w-3xl rounded-none sm:rounded-2xl shadow-2xl my-0 sm:my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 sm:px-8 py-4 flex items-start justify-between gap-4 z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${job.source === 'indian' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                {getSourceLabel(job.source)}
              </span>
              {job.isInternship && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">Internship</span>
              )}
              {job.isFresher && !job.isInternship && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Fresher</span>
              )}
              {job.remote && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">Remote</span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{job.title}</h2>
            <p className="text-sm text-slate-600 mt-0.5 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-slate-400" />
              {job.company}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 sm:px-8 py-5 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</span>
              <span className="text-xs text-slate-800 font-medium">{job.location}</span>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1"><Globe className="h-3 w-3" /> Country</span>
              <span className="text-xs text-slate-800 font-medium">{job.country}</span>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1"><Clock className="h-3 w-3" /> Job Type</span>
              <span className="text-xs text-slate-800 font-medium">{job.jobType}</span>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1"><GraduationCap className="h-3 w-3" /> Experience</span>
              <span className="text-xs text-slate-800 font-medium">{job.experience}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Posted {formatDate(job.postedDate)}</span>
            {job.remote && <span className="flex items-center gap-1"><Laptop className="h-3.5 w-3.5" /> Remote eligible</span>}
          </div>

          {match && (
            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-semibold text-slate-800">Profile Match</span>
                  <span className="text-[10px] text-slate-400">for {profile.name}</span>
                </div>
                <JobMatchBadge matchPercentage={match.matchPercentage} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div>
                  <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Matching Skills ({match.matchingSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {match.matchingSkills.length > 0 ? (
                      match.matchingSkills.map((skill) => (
                        <span key={skill} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">No matching skills detected</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Missing Skills ({match.missingSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {match.missingSkills.length > 0 ? (
                      match.missingSkills.slice(0, 10).map((skill) => (
                        <span key={skill} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">No missing skills</span>
                    )}
                    {match.missingSkills.length > 10 && (
                      <span className="text-[10px] text-slate-400">+{match.missingSkills.length - 10} more</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {job.companyDescription && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1.5">About the Company</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{cleanDescription(job.companyDescription)}</p>
            </div>
          )}

          {job.description && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1.5">Job Description</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">{cleanDescription(job.description)}</p>
            </div>
          )}

          {job.roleAndResponsibilities && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1.5">Role & Responsibilities</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{cleanDescription(job.roleAndResponsibilities)}</p>
            </div>
          )}

          {job.educationAndSkills && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1.5">Education & Skills</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{cleanDescription(job.educationAndSkills)}</p>
            </div>
          )}

          {job.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5"><Tags className="h-4 w-4" /> Detected Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <span key={skill} className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-1.5">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {job.tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 sm:px-8 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleApply}
            disabled={!job.applyUrl}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply on {getSourceLabel(job.source)}
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
