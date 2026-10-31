
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Briefcase, AlertTriangle, SearchX, Loader2, Info } from 'lucide-react';
import type { FetchResult, JobFilters, NormalizedJob } from '../types/jobTypes';
import { fetchAllJobs } from '../api/jobApi';
import { applyFilters, defaultFilters, getAvailableCountries, getAvailableJobTypes } from '../utils/jobFilters';
import { calculateJobMatch, demoProfile } from '../utils/jobMatching';
import { JobSearchBar } from '../components/JobSearchBar';
import { JobFiltersPanel } from '../components/JobFilters';
import { JobCard } from '../components/JobCard';
import { JobDetails } from '../components/JobDetails';

export function JobsPage() {
  const [fetchResult, setFetchResult] = useState<FetchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const [selectedJob, setSelectedJob] = useState<NormalizedJob | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAllJobs();
      setFetchResult(result);

      if (result.jobs.length === 0 && result.errors.length > 0) {
        const errorMessages = result.errors
          .map((e) => `[${e.source}] ${e.message}`)
          .join('; ');

        setError(`Could not load jobs. ${errorMessages}`);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while fetching jobs.';

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const allJobs = useMemo(() => fetchResult?.jobs ?? [], [fetchResult]);

  const countries = useMemo(
    () => getAvailableCountries(allJobs),
    [allJobs]
  );

  const jobTypes = useMemo(
    () => getAvailableJobTypes(allJobs),
    [allJobs]
  );

  const filteredJobs = useMemo(
    () => applyFilters(allJobs, filters),
    [allJobs, filters]
  );

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  const providerWarnings = fetchResult?.errors ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Live Job Vacancies
              </h1>

              <p className="text-sm text-slate-500 mt-1.5 max-w-xl">
                Explore job vacancies for freshers, interns, and entry-level candidates in India.
              </p>
            </div>

            <button
              onClick={loadJobs}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors disabled:opacity-60 shrink-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh Jobs
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="space-y-3 mb-5">
          <JobSearchBar
            value={filters.search}
            onChange={(value) =>
              setFilters({ ...filters, search: value })
            }
            onClear={() =>
              setFilters({ ...filters, search: '' })
            }
          />

          <JobFiltersPanel
            filters={filters}
            onChange={setFilters}
            onClear={handleClearFilters}
            countries={countries}
            jobTypes={jobTypes}
          />
        </div>

        {/* Provider warnings */}
        {providerWarnings.length > 0 && !loading && (
          <div className="mb-4 space-y-2">
            {providerWarnings.map((warn, i) => (
              <div
                key={`${warn.source}-${i}`}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200"
              >
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />

                <p className="text-xs text-amber-800">
                  <span className="font-semibold">
                    {warn.source === 'arbeitnow' ? 'Arbeitnow' : warn.source}:
                  </span>{' '}
                  {warn.message}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="text-sm text-slate-500 font-medium">
              Fetching live jobs from Arbeitnow...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="p-4 rounded-full bg-red-50">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>

            <div className="text-center max-w-md">
              <h3 className="text-lg font-semibold text-slate-800">
                Unable to Load Jobs
              </h3>
              <p className="text-sm text-slate-500 mt-1.5">
                {error}
              </p>
            </div>

            <button
              onClick={loadJobs}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Jobs list */}
        {!loading && !error && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-slate-600" />

              <p className="text-sm text-slate-700">
                <span className="font-semibold tabular-nums">
                  {filteredJobs.length}
                </span>
                {filteredJobs.length === 1 ? ' job' : ' jobs'} found

                {allJobs.length !== filteredJobs.length && (
                  <span className="text-slate-400">
                    {' '}of {allJobs.length} total
                  </span>
                )}
              </p>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="p-4 rounded-full bg-slate-100">
                  <SearchX className="h-10 w-10 text-slate-400" />
                </div>

                <div className="text-center max-w-md">
                  <h3 className="text-lg font-semibold text-slate-800">
                    No Jobs Match Your Filters
                  </h3>
                  <p className="text-sm text-slate-500 mt-1.5">
                    Try adjusting or clearing your filters to see more results.
                  </p>
                </div>

                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                {filteredJobs.map((job) => {
                  const match = calculateJobMatch(job, demoProfile);

                  return (
                    <JobCard
                      key={job.id}
                      job={job}
                      match={match}
                      onViewDetails={setSelectedJob}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Job details modal */}
      {selectedJob && (
        <JobDetails
          job={selectedJob}
          match={calculateJobMatch(selectedJob, demoProfile)}
          profile={demoProfile}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
