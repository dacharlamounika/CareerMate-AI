import type { NormalizedJob, ProviderResult } from '../types/jobTypes';
import { normalizeArbeitnowJob } from '../utils/jobNormalization';

const ARBEITNOW_API_URL = 'https://www.arbeitnow.com/api/job-board-api';

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[];
  links?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

export async function fetchArbeitnowJobs(): Promise<ProviderResult> {
  try {
    const response = await fetch(ARBEITNOW_API_URL, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return {
        jobs: [],
        error: `Arbeitnow API returned ${response.status}. Request failed.`,
        source: 'arbeitnow',
      };
    }

    const data: unknown = await response.json();

    let rawJobs: ArbeitnowJob[];
    if (Array.isArray(data)) {
      rawJobs = data as ArbeitnowJob[];
    } else if (data && typeof data === 'object' && Array.isArray((data as ArbeitnowResponse).data)) {
      rawJobs = (data as ArbeitnowResponse).data;
    } else {
      rawJobs = [];
    }

    const normalizedJobs = rawJobs.map(normalizeArbeitnowJob);

    return {
      jobs: normalizedJobs,
      error: null,
      source: 'arbeitnow',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error fetching Arbeitnow jobs.';
    return {
      jobs: [],
      error: message,
      source: 'arbeitnow',
    };
  }
}
