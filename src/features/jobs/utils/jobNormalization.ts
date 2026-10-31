import type { NormalizedJob } from '../types/jobTypes';

const FRESHER_TERMS = [
  'fresher',
  'freshers',
  'graduate',
  'entry level',
  'entry-level',
  'junior',
  'trainee',
  '0 years',
  '0-1 years',
  '0-2 years',
  'no experience',
  'beginner',
];

const INTERNSHIP_TERMS = [
  'intern',
  'internship',
  'graduate intern',
  'student intern',
  'working student',
  'internship program',
];

function containsTerm(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function detectCountry(location: string): string {
  if (!location) return 'Unknown';
  const lower = location.toLowerCase();
  const countryMap: Record<string, string> = {
    india: 'India',
    'united states': 'USA',
    usa: 'USA',
    'u.s.a': 'USA',
    germany: 'Germany',
    'united kingdom': 'UK',
    uk: 'UK',
    'u.k': 'UK',
    london: 'UK',
    canada: 'Canada',
    australia: 'Australia',
    singapore: 'Singapore',
    'remote worldwide': 'Worldwide',
    worldwide: 'Worldwide',
    remote: 'Remote',
    dubai: 'UAE',
    'united arab emirates': 'UAE',
    uae: 'UAE',
    philippines: 'Philippines',
    ireland: 'Ireland',
    netherlands: 'Netherlands',
    france: 'France',
    japan: 'Japan',
    'south korea': 'South Korea',
    brazil: 'Brazil',
    mexico: 'Mexico',
    poland: 'Poland',
    spain: 'Spain',
    portugal: 'Portugal',
    sweden: 'Sweden',
    switzerland: 'Switzerland',
    'new zealand': 'New Zealand',
    'south africa': 'South Africa',
    nigeria: 'Nigeria',
    kenya: 'Kenya',
    pakistan: 'Pakistan',
    bangladesh: 'Bangladesh',
    'sri lanka': 'Sri Lanka',
    nepal: 'Nepal',
    indonesia: 'Indonesia',
    malaysia: 'Malaysia',
    thailand: 'Thailand',
    vietnam: 'Vietnam',
    china: 'China',
    'hong kong': 'Hong Kong',
    israel: 'Israel',
    turkey: 'Turkey',
    italy: 'Italy',
    belgium: 'Belgium',
    austria: 'Austria',
    denmark: 'Denmark',
    finland: 'Finland',
    norway: 'Norway',
    'czech republic': 'Czech Republic',
    romania: 'Romania',
    hungary: 'Hungary',
    greece: 'Greece',
    argentina: 'Argentina',
    chile: 'Chile',
    colombia: 'Colombia',
    egypt: 'Egypt',
    morocco: 'Morocco',
    ghana: 'Ghana',
  };

  for (const [key, value] of Object.entries(countryMap)) {
    if (lower.includes(key)) return value;
  }

  const indianCities = [
    'bangalore', 'bengaluru', 'mumbai', 'delhi', 'new delhi', 'hyderabad',
    'pune', 'chennai', 'kolkata', 'ahmedabad', 'gurgaon', 'gurugram',
    'noida', 'jaipur', 'lucknow', 'indore', 'bhopal', 'kochi', 'cochin',
    'coimbatore', 'chandigarh', 'surat', 'vadodara', 'visakhapatnam',
    'nagpur', 'thiruvananthapuram', 'trivandrum', 'bhubaneswar', 'mangalore',
    'mysore', 'mysuru', 'faridabad', 'ghaziabad', 'rajkot', 'kota',
    'guwahati', 'dehradun', 'raipur', 'jodhpur', 'amritsar', 'varanasi',
    'patna', 'ranchi', 'jamshedpur', 'cuttack', 'trichy', 'tiruchirappalli',
  ];

  if (indianCities.some((city) => lower.includes(city))) return 'India';

  return 'Unknown';
}

function extractSkillsFromText(...texts: string[]): string[] {
  const combined = texts.join(' ').toLowerCase();
  const knownSkills = [
    'javascript', 'typescript', 'react', 'angular', 'vue', 'node.js', 'nodejs',
    'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'rails', 'php',
    'swift', 'kotlin', 'flutter', 'dart', 'html', 'css', 'sass', 'tailwind',
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'docker', 'kubernetes',
    'aws', 'azure', 'gcp', 'google cloud', 'tensorflow', 'pytorch', 'machine learning',
    'deep learning', 'data science', 'data analysis', 'pandas', 'numpy',
    'scikit-learn', 'nlp', 'computer vision', 'tableau', 'power bi',
    'excel', 'powerpoint', 'git', 'github', 'jenkins', 'ci/cd', 'terraform',
    'ansible', 'linux', 'bash', 'shell scripting', 'rest api', 'graphql',
    'microservices', 'spring boot', 'django', 'flask', 'fastapi', 'express',
    'next.js', 'nextjs', 'redux', 'webpack', 'vite', 'jest', 'cypress',
    'selenium', 'automation', 'testing', 'qa', 'devops', 'agile', 'scrum',
    'jira', 'figma', 'ui/ux', 'wireframing', 'prototyping', 'photoshop',
    'illustrator', 'seo', 'digital marketing', 'content writing', 'copywriting',
    'salesforce', 'sap', 'oracle', 'hadoop', 'spark', 'kafka', 'airflow',
    'elixir', 'clojure', 'scala', 'haskell', 'perl', 'r', 'matlab',
    'unity', 'unreal engine', 'game development', 'blockchain', 'solidity',
    'ethereum', 'cybersecurity', 'penetration testing', 'network security',
    'cryptography', 'pki', 'qa engineer', 'manual testing', 'test automation',
  ];

  const found = new Set<string>();
  for (const skill of knownSkills) {
    if (combined.includes(skill)) {
      found.add(skill);
    }
  }
  return Array.from(found);
}

interface IndianApiJob {
  id: number;
  title: string;
  company: string;
  about_company?: string;
  job_description?: string;
  job_title?: string;
  job_type?: string;
  location?: string;
  experience?: string;
  role_and_responsibility?: string;
  education_and_skills?: string;
  apply_link?: string;
  posted_date?: string;
}

export function normalizeIndianJob(job: IndianApiJob): NormalizedJob {
  const fullText = [
    job.title || '',
    job.job_title || '',
    job.job_description || '',
    job.experience || '',
    job.education_and_skills || '',
    job.role_and_responsibility || '',
  ].join(' ');

  const location = job.location || 'Not specified';
  const jobType = job.job_type || 'Full Time';
  const isFresher = containsTerm(fullText, FRESHER_TERMS);
  const isInternship = containsTerm(fullText, INTERNSHIP_TERMS);

  return {
    id: `indian-${job.id}`,
    source: 'indian',
    title: job.job_title || job.title || 'Untitled Position',
    company: job.company || 'Unknown Company',
    companyDescription: job.about_company || '',
    description: job.job_description || job.role_and_responsibility || '',
    jobType: isInternship ? 'Internship' : jobType,
    location,
    country: detectCountry(location),
    experience: job.experience || 'Not specified',
    skills: extractSkillsFromText(job.education_and_skills || '', job.job_description || '', job.role_and_responsibility || '', job.title || ''),
    educationAndSkills: job.education_and_skills || '',
    roleAndResponsibilities: job.role_and_responsibility || '',
    applyUrl: job.apply_link || '',
    postedDate: job.posted_date || null,
    remote: /remote|wfh|work from home/i.test(location) || /remote|wfh|work from home/i.test(fullText),
    isFresher,
    isInternship,
    tags: [],
  };
}

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

export function normalizeArbeitnowJob(job: ArbeitnowJob): NormalizedJob {
  const fullText = [job.title || '', job.description || ''].join(' ');
  const location = job.location || 'Not specified';

  const isFresher = containsTerm(fullText, FRESHER_TERMS);
  const isInternship = containsTerm(fullText, INTERNSHIP_TERMS);
  const remoteFlag = job.remote || /remote|worldwide|anywhere/i.test(location);

  const jobTypeRaw = (job.job_types && job.job_types.length > 0 ? job.job_types.join(', ') : 'Full Time');
  let jobType = jobTypeRaw;
  if (isInternship) {
    jobType = 'Internship';
  } else if (remoteFlag && jobTypeRaw.toLowerCase().includes('remote')) {
    jobType = 'Remote';
  }

  const createdDate = job.created_at
    ? new Date(job.created_at * 1000).toISOString()
    : null;

  const skills = extractSkillsFromText(job.description || '', job.title || '', (job.tags || []).join(' '));
  const allTags = job.tags || [];

  return {
    id: `arbeitnow-${job.slug}`,
    source: 'arbeitnow',
    title: job.title || 'Untitled Position',
    company: job.company_name || 'Unknown Company',
    companyDescription: '',
    description: job.description || '',
    jobType,
    location,
    country: detectCountry(location),
    experience: isFresher ? 'Fresher / Entry Level' : 'Not specified',
    skills,
    educationAndSkills: '',
    roleAndResponsibilities: '',
    applyUrl: job.url || '',
    postedDate: createdDate,
    remote: remoteFlag,
    isFresher,
    isInternship,
    tags: allTags,
  };
}

export function deduplicateJobs(jobs: NormalizedJob[]): NormalizedJob[] {
  const seen = new Map<string, NormalizedJob>();

  for (const job of jobs) {
    const key = dedupKey(job);
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, job);
    }
  }

  return Array.from(seen.values());
}

function dedupKey(job: NormalizedJob): string {
  const titleNorm = job.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const companyNorm = job.company.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const locationNorm = job.location.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  return `${titleNorm}|${companyNorm}|${locationNorm}`;
}
