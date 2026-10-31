import { MapPin, Building2, Clock, ExternalLink, Eye, GraduationCap, Tags, Calendar } from 'lucide-react';
import type { NormalizedJob } from '../types/jobTypes';
import { JobMatchBadge } from './JobMatchBadge';
import type { JobMatchResult } from '../types/jobTypes';

interface JobCardProps {
  job: NormalizedJob;
  match?: JobMatchResult;
  onViewDetails: (job: NormalizedJob) => void;
}

function getSourceLabel(source: string): string {
  return source === 'indian' ? 'Indian API' : 'Arbeitnow';
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Recently';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

export function JobCard({ job, match, onViewDetails }: JobCardProps) {
  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 p-5 cursor-pointer flex flex-col gap-3"
      onClick={() => onViewDetails(job)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${job.source === 'indian' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
              {getSourceLabel(job.source)}
            </span>
            {job.isInternship && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Internship
              </span>
            )}
            {job.isFresher && !job.isInternship && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Fresher
              </span>
            )}
            {job.remote && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                Remote
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
            {job.title}
          </h3>
          <p className="text-sm text-slate-600 mt-0.5 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            {job.company}
          </p>
        </div>
        {match && (
          <JobMatchBadge matchPercentage={match.matchPercentage} size="sm" />
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {job.jobType}
        </span>
        {job.experience && job.experience !== 'Not specified' && (
          <span className="flex items-center gap-1">
            <GraduationCap className="h-3.5 w-3.5" />
            {job.experience}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(job.postedDate)}
        </span>
      </div>

      {job.skills.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Tags className="h-3.5 w-3.5 text-slate-400" />
          {job.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="text-[10px] text-slate-400">+{job.skills.length - 5} more</span>
          )}
        </div>
      )}

      {job.description && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {job.description.replace(/<[^>]*>/g, '').replace(/[#*]/g, '').trim().substring(0, 200)}
        </p>
      )}

      <div className="flex items-center gap-2 pt-2 mt-auto border-t border-slate-100">
        <button
          onClick={() => onViewDetails(job)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          View Details
        </button>
        <button
          onClick={handleApply}
          disabled={!job.applyUrl}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

