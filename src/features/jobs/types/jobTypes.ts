export type JobSource = 'indian' | 'arbeitnow';

export type JobType =
  | 'Full Time'
  | 'Part Time'
  | 'Contract'
  | 'Internship'
  | 'Temporary'
  | 'Remote'
  | 'Other';

export interface NormalizedJob {
  id: string;
  source: JobSource;
  title: string;
  company: string;
  companyDescription: string;
  description: string;
  jobType: string;
  location: string;
  country: string;
  experience: string;
  skills: string[];
  educationAndSkills: string;
  roleAndResponsibilities: string;
  applyUrl: string;
  postedDate: string | null;
  remote: boolean;
  isFresher: boolean;
  isInternship: boolean;
  tags: string[];
}

export interface JobFilters {
  search: string;
  location: string;
  country: string;
  internship: boolean;
  fresher: boolean;
  remote: boolean;
  jobType: string;
  experience: string;
  skills: string;
  source: string;
}

export interface UserProfile {
  name: string;
  skills: string[];
  education: string[];
  projects: string[];
  certifications: string[];
  interests: string[];
  targetRole: string;
  experience: number;
}

export interface JobMatchResult {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
}

export interface ProviderResult {
  jobs: NormalizedJob[];
  error: string | null;
  source: JobSource;
}

export interface FetchResult {
  jobs: NormalizedJob[];
  errors: { source: JobSource; message: string }[];
  successCount: number;
}
