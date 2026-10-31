
import type { FetchResult, JobSource, NormalizedJob } from '../types/jobTypes';
import { fetchArbeitnowJobs } from './arbeitnowProvider';
import { deduplicateJobs } from '../utils/jobNormalization';

export async function fetchAllJobs(): Promise<FetchResult> {
  const results = await Promise.allSettled([fetchArbeitnowJobs()]);

  const allJobs: NormalizedJob[] = [];
  const errors: { source: JobSource; message: string }[] = [];
  let successCount = 0;

  const sources: JobSource[] = ['arbeitnow'];

  results.forEach((result, index) => {
    const source = sources[index];

    if (result.status === 'fulfilled') {
      if (result.value.jobs.length > 0) {
        allJobs.push(...result.value.jobs);
        successCount++;
      }

      if (result.value.error) {
        errors.push({ source, message: result.value.error });
      }
    } else {
      const message =
        result.reason instanceof Error
          ? result.reason.message
          : 'Unknown error.';

      errors.push({ source, message });
    }
  });

  const deduplicatedJobs = deduplicateJobs(allJobs);

  return {
    jobs: deduplicatedJobs,
    errors,
    successCount,
  };
}

export type { JobSource };
