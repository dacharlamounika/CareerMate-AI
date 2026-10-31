import type { ResumeContent } from '@/types';
import { getCareerRecommendations } from './careerRecommendation';

export interface JobRecommendation {
  id: string;
  title: string;
  careerCategory: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  matchedSkills: string[];
  skillsToDevelop: string[];
  matchScore: number;
  matchLevel: 'High' | 'Medium' | 'Developing';
  whyItMatches: string;
  educationRequirements: string[];
  experienceRequirements: string[];
  jobType: string;
  sourceType: 'Career Role Recommendation';
}

interface JobTemplate {
  id: string;
  title: string;
  careerCategory: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirements: string[];
  experienceRequirements: string[];
  jobType: string;
}

const JOB_TEMPLATES: JobTemplate[] = [
  {
    id: 'python-developer',
    title: 'Python Developer',
    careerCategory: 'Software Development',
    description:
      'Develop backend applications, APIs, automation scripts, and data-processing solutions using Python and related technologies.',
    requiredSkills: ['Python', 'SQL', 'Git'],
    preferredSkills: ['Flask', 'Django', 'REST API', 'Testing', 'MySQL'],
    educationRequirements: ['Computer Science', 'Information Technology', 'Software Engineering'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'Software Development',
  },
  {
    id: 'software-developer',
    title: 'Software Developer',
    careerCategory: 'Software Development',
    description:
      'Design, develop, test, debug, and maintain software applications while working with databases, APIs, version control, and development frameworks.',
    requiredSkills: ['Programming', 'SQL', 'Git', 'Testing'],
    preferredSkills: ['Python', 'Java', 'JavaScript', 'REST API', 'Debugging'],
    educationRequirements: ['Computer Science', 'Information Technology', 'Software Engineering'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'Software Development',
  },
  {
    id: 'java-developer',
    title: 'Java Developer',
    careerCategory: 'Backend Development',
    description:
      'Develop backend and enterprise applications using Java, databases, APIs, and commonly used Java frameworks.',
    requiredSkills: ['Java', 'SQL', 'Git'],
    preferredSkills: ['Spring', 'Spring Boot', 'REST API', 'MySQL', 'JUnit'],
    educationRequirements: ['Computer Science', 'Information Technology', 'Software Engineering'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'Backend Development',
  },
  {
    id: 'full-stack-developer',
    title: 'Full Stack Developer',
    careerCategory: 'Web Development',
    description:
      'Build complete web applications by working across frontend interfaces, backend services, databases, APIs, and application deployment.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'SQL'],
    preferredSkills: ['React', 'Node.js', 'REST API', 'Git', 'TypeScript'],
    educationRequirements: ['Computer Science', 'Information Technology', 'Software Engineering'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'Web Development',
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    careerCategory: 'Web Development',
    description:
      'Build responsive and interactive web interfaces using modern frontend technologies and connect them with backend APIs.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript'],
    preferredSkills: ['React', 'TypeScript', 'Git', 'REST API', 'Responsive Design'],
    educationRequirements: ['Computer Science', 'Information Technology', 'Web Development'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'Frontend Development',
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    careerCategory: 'Backend Development',
    description:
      'Develop server-side applications, APIs, database integrations, authentication systems, and backend business logic.',
    requiredSkills: ['SQL', 'API', 'Git'],
    preferredSkills: ['Python', 'Java', 'Flask', 'Django', 'Node.js', 'REST API'],
    educationRequirements: ['Computer Science', 'Information Technology', 'Software Engineering'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'Backend Development',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    careerCategory: 'Data Analytics',
    description:
      'Analyze datasets, clean data, create reports and dashboards, and communicate insights that support business decisions.',
    requiredSkills: ['SQL', 'Excel', 'Data Analysis'],
    preferredSkills: ['Python', 'Pandas', 'NumPy', 'Power BI', 'Tableau', 'Statistics'],
    educationRequirements: ['Computer Science', 'Data Science', 'Statistics', 'Information Technology'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'Data Analytics',
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    careerCategory: 'Data Science',
    description:
      'Work with data to develop analytical and machine learning solutions, evaluate models, and communicate findings.',
    requiredSkills: ['Python', 'SQL', 'Statistics'],
    preferredSkills: ['Pandas', 'NumPy', 'Machine Learning', 'Scikit-learn', 'Data Visualization'],
    educationRequirements: ['Computer Science', 'Data Science', 'Statistics', 'Mathematics'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'Data Science',
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI/ML Engineer',
    careerCategory: 'Artificial Intelligence',
    description:
      'Develop and integrate machine learning and AI solutions using programming, data processing, model development, and evaluation techniques.',
    requiredSkills: ['Python', 'Machine Learning', 'SQL'],
    preferredSkills: ['NumPy', 'Pandas', 'Scikit-learn', 'Deep Learning', 'TensorFlow'],
    educationRequirements: ['Computer Science', 'Artificial Intelligence', 'Data Science'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'AI / Machine Learning',
  },
  {
    id: 'database-developer',
    title: 'Database Developer',
    careerCategory: 'Database',
    description:
      'Design, develop, query, and maintain database solutions while supporting application data requirements and database performance.',
    requiredSkills: ['SQL', 'Database'],
    preferredSkills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Database Design', 'Performance Tuning'],
    educationRequirements: ['Computer Science', 'Information Technology', 'Database Management'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'Database Development',
  },
  {
    id: 'application-support-engineer',
    title: 'Application Support Engineer',
    careerCategory: 'Application Support',
    description:
      'Monitor and troubleshoot applications, investigate incidents, work with databases and logs, resolve technical issues, and support application users.',
    requiredSkills: ['Troubleshooting', 'SQL', 'Debugging'],
    preferredSkills: ['Python', 'MySQL', 'Application Support', 'Issue Tracking', 'Testing'],
    educationRequirements: ['Computer Science', 'Information Technology'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'Application Support',
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    careerCategory: 'Cloud Computing',
    description:
      'Work with cloud infrastructure, application deployment, monitoring, networking, and cloud-based services.',
    requiredSkills: ['Cloud', 'Linux', 'Networking'],
    preferredSkills: ['AWS', 'Azure', 'Docker', 'Git', 'CI/CD'],
    educationRequirements: ['Computer Science', 'Information Technology', 'Cloud Computing'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'Cloud Computing',
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    careerCategory: 'DevOps',
    description:
      'Support software delivery and deployment through automation, version control, CI/CD pipelines, containers, and infrastructure tools.',
    requiredSkills: ['Git', 'Linux', 'CI/CD'],
    preferredSkills: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins'],
    educationRequirements: ['Computer Science', 'Information Technology'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'DevOps',
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    careerCategory: 'Cybersecurity',
    description:
      'Monitor systems, investigate security events, identify vulnerabilities, and support security controls and incident response.',
    requiredSkills: ['Networking', 'Cybersecurity', 'Linux'],
    preferredSkills: ['Python', 'Security Tools', 'SIEM', 'Cloud Security'],
    educationRequirements: ['Computer Science', 'Cybersecurity', 'Information Technology'],
    experienceRequirements: ['Entry Level', '0–2 years'],
    jobType: 'Cybersecurity',
  },
];

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').trim();
}

function skillMatches(skill: string, profileText: string): boolean {
  const normalizedSkill = normalize(skill);
  const normalizedProfile = normalize(profileText);

  if (!normalizedSkill) return false;

  if (normalizedProfile.includes(normalizedSkill)) {
    return true;
  }

  const aliases: Record<string, string[]> = {
    api: ['rest api', 'rest', 'web api'],
    'rest api': ['api', 'rest'],
    database: ['mysql', 'postgresql', 'mongodb', 'sql'],
    troubleshooting: ['debugging', 'issue tracking', 'problem solving'],
    'data analysis': ['data analyst', 'data analytics', 'pandas'],
    cloud: ['aws', 'azure', 'gcp', 'google cloud'],
    cybersecurity: ['cyber security', 'security'],
    programming: ['python', 'java', 'javascript', 'c'],
    testing: ['debugging', 'pytest', 'junit', 'testing'],
  };

  return (aliases[normalizedSkill] || []).some((alias) =>
    normalizedProfile.includes(normalize(alias))
  );
}

function buildProfileText(content: ResumeContent): string {
  const parts: string[] = [
    content.targetRole || '',
    content.customRole || '',
    content.introduction || '',
    content.profile?.district || '',
    content.profile?.state || '',
  ];

  content.education?.forEach((item) => {
  parts.push(
    [
      item.degree || '',
      item.specialization || '',
      item.institution || '',
      item.cgpa || '',
      
    ].join(' ')
  );
});

  content.projects?.forEach((item) => {
    parts.push(
      item.title || '',
      item.type || '',
      item.description || '',
      item.technologies || '',
      item.keyFeatures || '',
      item.contribution || ''
    );
  });

 content.experience?.forEach((item) => {
  parts.push(
    [
      item.role || '',
      item.company || '',
      item.technology || '',
      item.description || '',
    ].join(' ')
  );
});

  content.certifications?.forEach((item) => {
  parts.push(
    [
      item.name || '',
      item.organization || '',
    ].join(' ')
  );
});
  content.achievements?.forEach((item) => {
    parts.push(item.title || '', item.description || '');
  });

  content.interests?.forEach((item) => {
  parts.push(item.name || '');
});
  return parts.filter(Boolean).join(' ');
}

function calculateMatch(
  job: JobTemplate,
  profileText: string,
  careerRoles: string[]
): {
  score: number;
  matchedSkills: string[];
  skillsToDevelop: string[];
} {
  const allSkills = [...job.requiredSkills, ...job.preferredSkills];

  const matchedSkills = allSkills.filter((skill) =>
    skillMatches(skill, profileText)
  );

  const skillsToDevelop = allSkills.filter(
    (skill) => !skillMatches(skill, profileText)
  );

  const requiredMatched = job.requiredSkills.filter((skill) =>
    skillMatches(skill, profileText)
  ).length;

  const preferredMatched = job.preferredSkills.filter((skill) =>
    skillMatches(skill, profileText)
  ).length;

  const requiredScore =
    job.requiredSkills.length > 0
      ? (requiredMatched / job.requiredSkills.length) * 60
      : 0;

  const preferredScore =
    job.preferredSkills.length > 0
      ? (preferredMatched / job.preferredSkills.length) * 25
      : 0;

  const roleMatch = careerRoles.some(
    (role) => normalize(role) === normalize(job.title)
  )
    ? 15
    : 0;

  const score = Math.round(
    Math.min(100, requiredScore + preferredScore + roleMatch)
  );

  return {
    score,
    matchedSkills,
    skillsToDevelop,
  };
}

function getMatchLevel(score: number): JobRecommendation['matchLevel'] {
  if (score >= 70) return 'High';
  if (score >= 45) return 'Medium';
  return 'Developing';
}

function buildWhyItMatches(
  job: JobTemplate,
  matchedSkills: string[],
  careerRoles: string[]
): string {
  if (matchedSkills.length === 0) {
    return `This role is related to your career profile, but your current resume does not show many of the skills associated with ${job.title}. Review the skills to develop before targeting this role.`;
  }

  const skills = matchedSkills.slice(0, 4).join(', ');

  if (careerRoles.some((role) => normalize(role) === normalize(job.title))) {
    return `This role matches one of your recommended career paths. Your profile currently shows relevant skills such as ${skills}.`;
  }

  return `Your profile contains relevant skills such as ${skills}, which overlap with the requirements commonly associated with this role.`;
}

export function getJobRecommendations(
  content: ResumeContent
): JobRecommendation[] {
  const profileText = buildProfileText(content);

  const careerRecommendations = getCareerRecommendations(content);
  const careerRoles = careerRecommendations.map((item) => item.role);

  return JOB_TEMPLATES.map((job) => {
    const { score, matchedSkills, skillsToDevelop } = calculateMatch(
      job,
      profileText,
      careerRoles
    );

    return {
      id: job.id,
      title: job.title,
      careerCategory: job.careerCategory,
      description: job.description,
      requiredSkills: job.requiredSkills,
      preferredSkills: job.preferredSkills,
      matchedSkills,
      skillsToDevelop,
      matchScore: score,
      matchLevel: getMatchLevel(score),
      whyItMatches: buildWhyItMatches(
        job,
        matchedSkills,
        careerRoles
      ),
      educationRequirements: job.educationRequirements,
      experienceRequirements: job.experienceRequirements,
      jobType: job.jobType,
      sourceType: 'Career Role Recommendation' as const,
    };
  })
    .filter((job) => job.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 8);
}