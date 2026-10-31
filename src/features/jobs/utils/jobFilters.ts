import type { JobFilters, NormalizedJob } from '../types/jobTypes';

export const defaultFilters: JobFilters = {
  search: '',
  location: '',
  country: '',
  internship: false,
  fresher: false,
  remote: false,
  jobType: '',
  experience: '',
  skills: '',
  source: '',
};

export function applyFilters(jobs: NormalizedJob[], filters: JobFilters): NormalizedJob[] {
  return jobs.filter((job) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase().trim();
      const searchableText = [
        job.title,
        job.company,
        job.description,
        job.location,
        job.experience,
        job.skills.join(' '),
        job.tags.join(' '),
        job.educationAndSkills,
        job.roleAndResponsibilities,
      ].join(' ').toLowerCase();

      if (!searchableText.includes(searchLower)) return false;
    }

    if (filters.location) {
      const locLower = filters.location.toLowerCase().trim();
      if (!job.location.toLowerCase().includes(locLower)) return false;
    }

    if (filters.country) {
      if (filters.country === 'Worldwide' && job.country !== 'Worldwide' && job.country !== 'Remote') {
        return false;
      } else if (filters.country !== 'Worldwide' && job.country !== filters.country) {
        return false;
      }
    }

    if (filters.internship && !job.isInternship) return false;

    if (filters.fresher && !job.isFresher) return false;

    if (filters.remote && !job.remote) return false;

    if (filters.jobType) {
      const filterTypeLower = filters.jobType.toLowerCase();
      const jobTypeLower = job.jobType.toLowerCase();
      if (!jobTypeLower.includes(filterTypeLower)) return false;
    }

    if (filters.experience) {
      const expLower = filters.experience.toLowerCase().trim();
      if (!job.experience.toLowerCase().includes(expLower)) return false;
    }

    if (filters.skills) {
      const skillsLower = filters.skills.toLowerCase().trim();
      const jobSkillsText = [...job.skills, ...job.tags].join(' ').toLowerCase();
      const jobDescLower = job.description.toLowerCase();
      if (!jobSkillsText.includes(skillsLower) && !jobDescLower.includes(skillsLower)) return false;
    }

    if (filters.source) {
      if (job.source !== filters.source) return false;
    }

    return true;
  });
}

export function getAvailableCountries(jobs: NormalizedJob[]): string[] {
  const countries = new Set<string>();
  jobs.forEach((job) => {
    if (job.country && job.country !== 'Unknown') {
      countries.add(job.country);
    }
  });
  return Array.from(countries).sort();
}

export function getAvailableJobTypes(jobs: NormalizedJob[]): string[] {
  const types = new Set<string>();
  jobs.forEach((job) => {
    if (job.jobType) {
      types.add(job.jobType);
    }
  });
  return Array.from(types).sort();
}
