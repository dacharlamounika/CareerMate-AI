import type { JobMatchResult, NormalizedJob, UserProfile } from '../types/jobTypes';

export const demoProfile: UserProfile = {
  name: 'Demo Candidate',
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
  education: ['B.Tech in Computer Science'],
  projects: ['E-commerce Platform', 'Task Management App', 'Portfolio Website'],
  certifications: ['AWS Cloud Practitioner', 'Meta Frontend Developer'],
  interests: ['Web Development', 'Cloud Computing', 'Open Source'],
  targetRole: 'Frontend Developer',
  experience: 1,
};

function normalizeSkill(skill: string): string {
  return skill.toLowerCase().replace(/[^a-z0-9+#./]/g, '').trim();
}

function extractJobKeywords(job: NormalizedJob): string[] {
  const allText = [
    job.title,
    job.description,
    job.educationAndSkills,
    job.roleAndResponsibilities,
    job.skills.join(' '),
    job.tags.join(' '),
  ].join(' ');

  const keywords = new Set<string>();

  for (const skill of job.skills) {
    keywords.add(normalizeSkill(skill));
  }
  for (const tag of job.tags) {
    keywords.add(normalizeSkill(tag));
  }

  const knownSkills = [
    'javascript', 'typescript', 'react', 'angular', 'vue', 'nodejs', 'node.js',
    'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'rails', 'php',
    'swift', 'kotlin', 'flutter', 'dart', 'html', 'css', 'sass', 'tailwind',
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'docker', 'kubernetes',
    'aws', 'azure', 'gcp', 'tensorflow', 'pytorch', 'machinelearning',
    'deeplearning', 'datascience', 'dataanalysis', 'pandas', 'numpy',
    'scikitlearn', 'nlp', 'computervision', 'tableau', 'powerbi',
    'excel', 'powerpoint', 'git', 'github', 'jenkins', 'cicd', 'terraform',
    'ansible', 'linux', 'bash', 'shellscripting', 'restapi', 'graphql',
    'microservices', 'springboot', 'django', 'flask', 'fastapi', 'express',
    'nextjs', 'next.js', 'redux', 'webpack', 'vite', 'jest', 'cypress',
    'selenium', 'automation', 'testing', 'qa', 'devops', 'agile', 'scrum',
    'jira', 'figma', 'uiux', 'wireframing', 'prototyping', 'photoshop',
    'illustrator', 'seo', 'digitalmarketing', 'contentwriting', 'copywriting',
    'salesforce', 'sap', 'oracle', 'hadoop', 'spark', 'kafka', 'airflow',
    'scala', 'haskell', 'perl', 'r', 'matlab', 'unity', 'unrealengine',
    'gamedevelopment', 'blockchain', 'solidity', 'ethereum', 'cybersecurity',
    'penetrationtesting', 'networksecurity', 'cryptography', 'pki',
  ];

  const lowerText = allText.toLowerCase();
  for (const skill of knownSkills) {
    if (lowerText.includes(skill)) {
      keywords.add(skill.replace(/[^a-z0-9+#./]/g, ''));
    }
  }

  return Array.from(keywords).filter(Boolean);
}

export function calculateJobMatch(job: NormalizedJob, profile: UserProfile): JobMatchResult {
  const profileSkills = new Set(profile.skills.map(normalizeSkill));
  const profileKeywords = new Set([
    ...profileSkills,
    ...profile.certifications.map(normalizeSkill),
    ...profile.interests.map(normalizeSkill),
    ...profile.projects.map(normalizeSkill),
  ]);

  const targetRoleNorm = normalizeSkill(profile.targetRole);
  const educationNorm = profile.education.map(normalizeSkill);
  const experienceNorm = profile.experience;

  const jobKeywords = extractJobKeywords(job);

  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const keyword of jobKeywords) {
    if (profileKeywords.has(keyword)) {
      matchingSkills.push(keyword);
    } else {
      missingSkills.push(keyword);
    }
  }

  let score = 0;
  let maxScore = 0;

  if (jobKeywords.length > 0) {
    maxScore += 50;
    const skillRatio = matchingSkills.length / jobKeywords.length;
    score += skillRatio * 50;
  }

  if (targetRoleNorm) {
    maxScore += 20;
    const jobTitleNorm = normalizeSkill(job.title);
    const jobDescNorm = normalizeSkill(job.description.substring(0, 500));
    if (jobTitleNorm.includes(targetRoleNorm) || jobDescNorm.includes(targetRoleNorm)) {
      score += 20;
    } else {
      const targetWords = profile.targetRole.toLowerCase().split(/\s+/).map(normalizeSkill).filter((w) => w.length > 2);
      let wordMatches = 0;
      for (const word of targetWords) {
        if (jobTitleNorm.includes(word) || jobDescNorm.includes(word)) {
          wordMatches++;
        }
      }
      if (targetWords.length > 0) {
        score += (wordMatches / targetWords.length) * 20;
      }
    }
  }

  if (educationNorm.length > 0) {
    maxScore += 10;
    const jobTextNorm = normalizeSkill(job.educationAndSkills + ' ' + job.description);
    let eduMatches = 0;
    for (const edu of educationNorm) {
      if (edu.length > 2 && jobTextNorm.includes(edu)) {
        eduMatches++;
      }
    }
    score += (eduMatches / educationNorm.length) * 10;
  }

  if (job.isFresher && experienceNorm <= 1) {
    maxScore += 10;
    score += 10;
  } else if (!job.isFresher && job.experience !== 'Not specified') {
    maxScore += 10;
    const expLower = job.experience.toLowerCase();
    const expMatch = expLower.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (expMatch) {
      const minExp = parseInt(expMatch[1], 10);
      if (experienceNorm >= minExp) {
        score += 10;
      } else if (experienceNorm >= minExp - 1) {
        score += 5;
      }
    } else if (expLower.includes('fresher') || expLower.includes('entry')) {
      if (experienceNorm <= 1) {
        score += 10;
      }
    }
  } else {
    maxScore += 10;
    score += 5;
  }

  if (profile.interests.length > 0) {
    maxScore += 10;
    const jobTextNorm = normalizeSkill(job.title + ' ' + job.description.substring(0, 300));
    let interestMatches = 0;
    for (const interest of profile.interests.map(normalizeSkill)) {
      if (interest.length > 2 && jobTextNorm.includes(interest)) {
        interestMatches++;
      }
    }
    score += (interestMatches / profile.interests.length) * 10;
  }

  const matchPercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  const uniqueMatching = [...new Set(matchingSkills)];
  const uniqueMissing = [...new Set(missingSkills)];

  return {
    matchPercentage: Math.min(matchPercentage, 100),
    matchingSkills: uniqueMatching,
    missingSkills: uniqueMissing,
  };
}
