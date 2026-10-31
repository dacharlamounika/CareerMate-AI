import type { ResumeContent, AtsResult, ExperienceEntry, ProjectEntry } from '@/types';

const BUZZWORDS: { phrase: string; reason: string }[] = [
  { phrase: 'hardworking', reason: 'Generic — every candidate claims this. Show it through measurable results instead.' },
  { phrase: 'passionate', reason: 'Overused and subjective. Point to specific projects or actions that demonstrate interest.' },
  { phrase: 'enthusiastic', reason: 'Generic filler. Replace with evidence of initiative you took.' },
  { phrase: 'dynamic', reason: 'Vague buzzword. Describe a situation where you adapted to change instead.' },
  { phrase: 'team player', reason: 'Cliché. Describe a specific collaboration or contribution to a team outcome.' },
  { phrase: 'excellent communication', reason: 'Generic claim. Show a presentation, documentation, or coordination you did.' },
  { phrase: 'problem-solving skills', reason: 'Overused. Reference a specific problem you solved with context and result.' },
  { phrase: 'time management', reason: 'Generic. Mention a project delivered on a deadline or multiple priorities handled.' },
  { phrase: 'adaptability', reason: 'Vague. Describe a situation where you learned a new tool or adjusted to a change.' },
  { phrase: 'quick learner', reason: 'Generic. Point to a concrete example of picking up a technology fast.' },
  { phrase: 'results-driven', reason: 'Overused filler. Show actual results with numbers or outcomes instead.' },
];

const REPETITIVE_VERB_ALTS: Record<string, string[]> = {
  developed: ['Built', 'Implemented', 'Designed', 'Engineered', 'Created'],
  built: ['Developed', 'Implemented', 'Constructed', 'Assembled'],
  created: ['Developed', 'Designed', 'Produced', 'Constructed'],
  used: ['Applied', 'Leveraged', 'Utilized', 'Employed'],
  worked: ['Contributed', 'Participated', 'Collaborated', 'Engaged'],
  helped: ['Supported', 'Assisted', 'Facilitated', 'Enabled'],
  made: ['Built', 'Created', 'Developed', 'Produced'],
  done: ['Completed', 'Delivered', 'Accomplished', 'Finished'],
};

// Role-specific keyword maps for IT roles
const ROLE_KEYWORDS: Record<string, string[]> = {
  'Software Developer': ['Java', 'Python', 'JavaScript', 'SQL', 'Git', 'API', 'REST', 'Debugging', 'Testing', 'Agile'],
  'Java Developer': ['Java', 'Spring', 'Hibernate', 'JDBC', 'Maven', 'JUnit', 'REST API', 'MySQL', 'PostgreSQL', 'JVM'],
  'Python Developer': ['Python', 'Django', 'Flask', 'Pandas', 'NumPy', 'REST API', 'PostgreSQL', 'Git', 'Unit Testing', 'Celery'],
  'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'Express', 'REST API', 'SQL', 'MongoDB', 'Git', 'CSS', 'TypeScript'],
  'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Tailwind', 'Redux', 'Responsive Design', 'REST API', 'Git'],
  'Backend Developer': ['Node.js', 'Express', 'Java', 'Python', 'SQL', 'PostgreSQL', 'REST API', 'Docker', 'Redis', 'Authentication'],
  'Data Analyst': ['SQL', 'Python', 'Excel', 'Pandas', 'Tableau', 'Power BI', 'Data Visualization', 'Statistics', 'R', 'ETL'],
  'Data Scientist': ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'Statistics', 'SQL', 'R', 'Data Visualization'],
  'AI/ML Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Scikit-learn', 'MLOps', 'SQL'],
  'Cloud Engineer': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Networking', 'IAM'],
  'DevOps Engineer': ['Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'AWS', 'Terraform', 'Ansible', 'Linux', 'Git', 'Monitoring'],
  'Cybersecurity Analyst': ['Network Security', 'Penetration Testing', 'SIEM', 'Cryptography', 'OWASP', 'Linux', 'Firewalls', 'Incident Response', 'Risk Assessment', 'Python'],
  'Database Developer': ['SQL', 'PostgreSQL', 'MySQL', 'Oracle', 'MongoDB', 'Database Design', 'Indexing', 'Stored Procedures', 'Triggers', 'Performance Tuning'],
  'Application Support Engineer': ['SQL', 'Python', 'Troubleshooting', 'Debugging', 'Issue Tracking', 'Database', 'Testing', 'Application Support'],
};

// Skills that belong to each category for the Technical Skills section
const SKILL_CATEGORIES: { label: string; matchers: string[] }[] = [
  {
    label: 'Programming',
    matchers: ['python', 'java', 'c', 'c++', 'c#', 'javascript', 'typescript', 'go', 'rust', 'kotlin', 'swift', 'ruby', 'php', 'scala', 'r'],
  },
  {
    label: 'Web Technologies',
    matchers: ['html', 'css', 'html/css', 'javascript', 'react', 'angular', 'vue', 'node.js', 'node', 'express', 'flask', 'django', 'spring', 'next.js', 'tailwind', 'redux', 'bootstrap'],
  },
  {
    label: 'Databases',
    matchers: ['sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'mongo', 'oracle', 'sqlite', 'redis', 'firebase', 'supabase', 'mysql workbench'],
  },
  {
    label: 'Tools & Platforms',
    matchers: ['git', 'github', 'git/github', 'docker', 'kubernetes', 'jenkins', 'aws', 'azure', 'gcp', 'vs code', 'postman', 'jira', 'notion', 'figma', 'linux', 'eclipse', 'intellij', 'maven'],
  },
  {
    label: 'Technical Areas',
    matchers: ['ai/ml', 'machine learning', 'deep learning', 'nlp', 'data analytics', 'data analysis', 'data visualization', 'cloud computing', 'cybersecurity', 'mobile development', 'rest api', 'api', 'crud', 'testing', 'debugging', 'troubleshooting', 'issue tracking', 'database integration', 'application support'],
  },
];

function roleLabel(content: ResumeContent): string {
  return content.targetRole === 'Other' ? content.customRole : content.targetRole;
}

/**
 * Generate a professional summary using ONLY verified user data.
 * Role-aware: prioritizes information relevant to the target role.
 * Never fabricates. Never uses first-person. Never starts with the name.
 * Never uses generic buzzwords.
 */
export function generateProfessionalSummary(content: ResumeContent): string {
  const { education, experience, projects, certifications, achievements, interests } = content;
  const role = roleLabel(content);

  // --- Gather verified facts ---

  const topEdu = education[0];
  let academicIdentity = '';
  let degreeLabel = '';
  if (topEdu) {
    const degree = topEdu.degree === 'Other' && topEdu.customDegree ? topEdu.customDegree : topEdu.degree;
    const spec = topEdu.specialization === 'Other' && topEdu.customSpecialization ? topEdu.customSpecialization : topEdu.specialization;
    degreeLabel = degree;
    if (degree) {
      const isStudent = !topEdu.yearGraduation || parseInt(topEdu.yearGraduation) >= new Date().getFullYear();
      const suffix = isStudent ? 'student' : 'graduate';
      academicIdentity = spec ? `${spec} ${suffix}` : `${degree} ${suffix}`;
    }
  }

  // Collect technologies from BOTH experience entries AND projects (split comma-separated values)
  const splitTechs = (raw: string): string[] => raw.split(/[,/]+/).map((s) => s.trim()).filter(Boolean);
  const expTechs = experience.map((e) => e.technology).filter(Boolean).flatMap(splitTechs);
  const projTechRaw = projects.map((p) => p.technologies).filter(Boolean).flatMap(splitTechs);
  const allTechs = [...new Set([...expTechs, ...projTechRaw])];

  // Role-relevant technology prioritization
  const rolePriorityMap: Record<string, string[]> = {
    'Python Developer': ['python', 'flask', 'django', 'sql', 'mysql', 'postgresql', 'rest api', 'api', 'pandas', 'numpy'],
    'Data Analyst': ['python', 'sql', 'mysql', 'excel', 'pandas', 'tableau', 'power bi', 'data visualization', 'statistics'],
    'Data Scientist': ['python', 'machine learning', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'sql', 'statistics'],
    'AI/ML Engineer': ['python', 'tensorflow', 'pytorch', 'machine learning', 'deep learning', 'nlp', 'scikit-learn'],
    'Java Developer': ['java', 'spring', 'hibernate', 'jdbc', 'maven', 'junit', 'mysql', 'postgresql', 'rest api'],
    'Full Stack Developer': ['javascript', 'react', 'node.js', 'express', 'sql', 'mongodb', 'css', 'html', 'rest api'],
    'Frontend Developer': ['html', 'css', 'javascript', 'react', 'typescript', 'tailwind', 'redux'],
    'Backend Developer': ['node.js', 'express', 'java', 'python', 'sql', 'postgresql', 'rest api', 'redis'],
    'Software Developer': ['java', 'python', 'javascript', 'sql', 'git', 'api', 'rest'],
    'Cloud Engineer': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'linux'],
    'DevOps Engineer': ['docker', 'kubernetes', 'jenkins', 'aws', 'terraform', 'linux', 'git'],
    'Cybersecurity Analyst': ['network security', 'python', 'linux', 'owasp', 'cryptography'],
    'Database Developer': ['sql', 'postgresql', 'mysql', 'oracle', 'mongodb', 'database design'],
    'Application Support Engineer': ['sql', 'python', 'troubleshooting', 'debugging', 'issue tracking', 'database', 'testing', 'application support'],
  };

  const priorityTechs = rolePriorityMap[role || ''] || [];
  const sortedTechs = [...allTechs].sort((a, b) => {
    const aMatch = priorityTechs.some((p) => a.toLowerCase().includes(p));
    const bMatch = priorityTechs.some((p) => b.toLowerCase().includes(p));
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  const roleRelevantProjects = priorityTechs.length > 0
    ? projects.filter((p) => priorityTechs.some((pt) => `${p.technologies} ${p.description}`.toLowerCase().includes(pt)))
    : projects;

  const internships = experience.filter((e) => e.context === 'Internship');
  const professionalExp = experience.filter((e) => e.context === 'Professional');

  // --- Build sentences ---
  const sentences: string[] = [];

  // Sentence 1: Academic identity + key skills
  const skillList = sortedTechs.slice(0, 5).filter(Boolean);

  let sentence1 = '';
  if (academicIdentity) {
    sentence1 = capitalize(academicIdentity);
    if (skillList.length > 0) {
      sentence1 += ` with hands-on experience in ${formatList(skillList)}`;
    }
  } else if (skillList.length > 0) {
    sentence1 = `Candidate with hands-on experience in ${formatList(skillList)}`;
  }
  if (sentence1) {
    sentences.push(sentence1 + '.');
  }

  // Sentence 2: Projects, internship, experience
  const parts: string[] = [];

  const topProject = roleRelevantProjects[0] || projects[0];
  if (topProject?.title) {
    let projectPhrase = `including development of ${topProject.title}`;
    const tech = topProject.technologies?.trim();
    const desc = topProject.description?.replace(/\.$/, '').trim();
    if (desc) {
      projectPhrase += ` — ${truncateText(desc, 80)}`;
    } else if (tech) {
      projectPhrase += ` using ${tech}`;
    }
    parts.push(projectPhrase);
  }

  if (internships.length > 0) {
    const internTech = internships.map((i) => i.technology).filter(Boolean).flatMap(splitTechs);
    const internRoles = internships.map((i) => i.role).filter(Boolean);
    if (internRoles.length > 0 && internTech.length > 0) {
      parts.push(`${internRoles[0]} internship experience in ${formatList(internTech.slice(0, 3))}`);
    } else if (internTech.length > 0) {
      parts.push(`internship experience in ${formatList(internTech.slice(0, 3))}`);
    } else {
      parts.push('practical internship experience');
    }
  }

  if (professionalExp.length > 0) {
    const profTech = professionalExp.map((e) => e.technology).filter(Boolean).flatMap(splitTechs);
    if (profTech.length > 0) {
      parts.push(`professional experience in ${formatList(profTech.slice(0, 3))}`);
    }
  }

  // Experience descriptions as fallback
  const expDescriptions = experience
    .filter((e) => e.description)
    .map((e) => e.description)
    .filter(Boolean);
  if (expDescriptions.length > 0 && parts.length === 0) {
    const relevant = priorityTechs.length > 0
      ? expDescriptions.find((d) => priorityTechs.some((pt) => d.toLowerCase().includes(pt))) || expDescriptions[0]
      : expDescriptions[0];
    parts.push(`practical work in ${relevant.replace(/\.$/, '').trim().toLowerCase()}`);
  }

  if (parts.length > 0) {
    sentences.push(capitalize(parts.join(', ')) + '.');
  }

  // Sentence 3: Role focus + achievements
  const sentence3Parts: string[] = [];

  // Connect to target role through actual work areas
  if (role) {
    const roleFocusMap: Record<string, string> = {
      'Software Developer': 'building reliable software solutions',
      'Java Developer': 'building scalable Java-based applications',
      'Python Developer': 'developing Python-based applications and backend systems',
      'Full Stack Developer': 'developing end-to-end web applications',
      'Frontend Developer': 'building responsive and user-focused web interfaces',
      'Backend Developer': 'building robust backend systems and APIs',
      'Data Analyst': 'analyzing data to support business decisions',
      'Data Scientist': 'applying machine learning and statistical methods',
      'AI/ML Engineer': 'developing and deploying machine learning models',
      'Cloud Engineer': 'designing and managing cloud infrastructure',
      'DevOps Engineer': 'automating deployment pipelines and infrastructure',
      'Cybersecurity Analyst': 'identifying and mitigating security risks',
      'Database Developer': 'designing and optimizing database systems',
      'Application Support Engineer': 'resolving application issues and ensuring system reliability',
    };
    const focus = roleFocusMap[role];
    if (focus) {
      sentence3Parts.push(`with a focus on ${focus}`);
    }
  }

  // Add achievements if available
  const achievementTitles = achievements
    .slice(0, 2)
    .map((a) => a.title)
    .filter(Boolean);
  if (achievementTitles.length > 0) {
    sentence3Parts.push(`recognition through ${formatList(achievementTitles)}`);
  }

  if (sentence3Parts.length > 0 && sentences.length > 0) {
    sentences.push(capitalize(sentence3Parts.join(', ')) + '.');
  }

  // Fallback: certifications or interests (never generic filler)
  if (sentences.length === 0) {
    if (certifications.length > 0) {
      const certNames = certifications.slice(0, 2).map((c) => c.name).filter(Boolean);
      if (certNames.length > 0) {
        sentences.push(`Holds ${formatList(certNames)} certification${certNames.length > 1 ? 's' : ''}.`);
      }
    }
    if (sentences.length === 0 && interests.length > 0) {
      const interestList = interests.slice(0, 3).map((i) => i.name).filter(Boolean);
      if (interestList.length > 0) {
        sentences.push(`Candidate with interest in ${formatList(interestList)}.`);
      }
    }
  }

  if (sentences.length === 0) return '';

  let summary = sentences.join(' ');
  summary = summary.replace(/\b(I|my|me|I'm|I am)\b/gi, '');
  summary = summary.replace(/\s+/g, ' ').replace(/\s+,/g, ',').replace(/,\s*,/g, ',').trim();
  summary = summary.replace(/\.\s*\./g, '.');
  summary = summary.charAt(0).toUpperCase() + summary.slice(1);
  if (summary && !summary.endsWith('.')) summary += '.';
  return summary.trim();
}

// Keep the old export name for backward compatibility in imports
export const generateIntroduction = generateProfessionalSummary;

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatList(items: string[]): string {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return '';
  if (filtered.length === 1) return filtered[0];
  if (filtered.length === 2) return `${filtered[0]} and ${filtered[1]}`;
  return `${filtered.slice(0, -1).join(', ')}, and ${filtered[filtered.length - 1]}`;
}

function truncateText(text: string, max: number): string {
  if (text.length <= max) return text;
  const truncated = text.slice(0, max);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.slice(0, lastSpace > 0 ? lastSpace : max) + '...';
}

/**
 * Categorize the user's experience entries into skill categories for display.
 * Only includes categories that have at least one skill.
 */
export function categorizeSkills(experience: ExperienceEntry[]): { label: string; skills: string[] }[] {
  const allTechs = experience.map((e) => e.technology).filter(Boolean);
  if (allTechs.length === 0) return [];

  const result: { label: string; skills: string[] }[] = [];
  const usedTechs = new Set<string>();

  for (const cat of SKILL_CATEGORIES) {
    const matched: string[] = [];
    for (const tech of allTechs) {
      const techLower = tech.toLowerCase();
      if (matched.includes(tech)) continue;
      // Check if this technology matches any matcher in this category
      const isMatch = cat.matchers.some((m) => {
        if (m.includes('/') || m.includes(' ')) {
          return techLower === m || techLower.includes(m);
        }
        return techLower === m || techLower.includes(m) || m.includes(techLower);
      });
      if (isMatch) {
        matched.push(tech);
        usedTechs.add(tech);
      }
    }
    if (matched.length > 0) {
      result.push({ label: cat.label, skills: matched });
    }
  }

  // Put unmatched skills into "Other"
  const unmatched = allTechs.filter((t) => !usedTechs.has(t));
  if (unmatched.length > 0) {
    result.push({ label: 'Other', skills: unmatched });
  }

  return result;
}

/**
 * Generate professional bullet points from a project's verified data.
 * Each bullet is derived from description, keyFeatures, and contribution.
 * Never invents functionality or metrics.
 */
export function generateProjectBullets(project: ProjectEntry): string[] {
  const bullets: string[] = [];

  // Combine description and key features into bullet points
  if (project.description) {
    // Split description into sentences; each becomes a bullet
    const sentences = project.description.split(/\.\s+/).map((s) => s.trim()).filter(Boolean);
    for (const sentence of sentences.slice(0, 2)) {
      bullets.push(ensureActionVerb(sentence));
    }
  }

  if (project.keyFeatures) {
    // Split by commas or newlines into feature bullets
    const features = project.keyFeatures.split(/[,;\n]+/).map((f) => f.trim()).filter(Boolean);
    for (const feature of features.slice(0, 3)) {
      bullets.push(ensureActionVerb(`Features include ${feature}`));
    }
  }

  if (project.contribution) {
    bullets.push(ensureActionVerb(project.contribution));
  }

  // If we have no bullets but have a title, use a minimal factual line
  if (bullets.length === 0 && project.title) {
    bullets.push(`Worked on ${project.title}.`);
  }

  return bullets;
}

function ensureActionVerb(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  // If it already starts with a capital action verb, leave it
  const firstWord = trimmed.split(/\s+/)[0];
  const actionVerbs = ['Built', 'Implemented', 'Designed', 'Developed', 'Created', 'Integrated',
    'Configured', 'Analyzed', 'Tested', 'Automated', 'Engineered', 'Deployed', 'Built',
    'Constructed', 'Produced', 'Established', 'Features', 'Worked', 'Contributed', 'Used',
    'Applied', 'Leveraged', 'Utilized', 'Resolved', 'Debugged', 'Maintained', 'Updated',
    'Enhanced', 'Improved', 'Optimized', 'Supported'];
  const startsWithVerb = actionVerbs.some((v) => firstWord.toLowerCase() === v.toLowerCase());
  if (startsWithVerb) {
    return capitalize(trimmed);
  }
  // If it starts with a lowercase word, prepend "Built" or "Implemented"
  return `Implemented ${trimmed.toLowerCase().replace(/^(the|a|an)\s+/, '')}`;
}

export function customRoleLabel(content: ResumeContent): string {
  return content.customRole || content.targetRole || '';
}

export function validateResumeInformation(content: ResumeContent): { message: string }[] {
  const issues: { message: string }[] = [];
  const role = content.targetRole || content.customRole;

  if (!content.profile.fullName) {
    issues.push({ message: 'Profile section is missing a full name. Please verify this information.' });
  }
  if (content.education.length === 0) {
    issues.push({ message: 'No education entries found. Please add at least one to strengthen your resume.' });
  }
  if (content.projects.length === 0 && content.experience.length === 0) {
    issues.push({ message: 'No projects or hands-on experience listed. Please verify — this section is important for recruiters.' });
  }
  if (!content.contact.email && !content.contact.mobile) {
    issues.push({ message: 'Contact section has no email or phone number. Recruiters need a way to reach you.' });
  }

  // Duplicate education check
  const eduKeys = content.education.map((e) => `${e.degree}-${e.institution}`);
  const dupEdu = eduKeys.filter((k, i) => eduKeys.indexOf(k) !== i);
  if (dupEdu.length > 0) {
    issues.push({ message: 'Duplicate education entry detected. Please verify this information.' });
  }

  // Generic introduction check
  if (content.introduction) {
    const lowerIntro = content.introduction.toLowerCase();
    if (['passionate', 'enthusiastic', 'hardworking', 'dynamic', 'results-driven'].some((w) => lowerIntro.includes(w))) {
      issues.push({ message: 'Your introduction contains generic phrases. Please verify and consider replacing with specific evidence.' });
    }
    // Check for first-person usage
    if (/\b(i|i'm|i am|my|me)\b/i.test(content.introduction)) {
      issues.push({ message: 'Your introduction uses first-person language ("I", "my"). Professional resumes typically avoid first-person pronouns.' });
    }
  }

  // Target role mismatch (basic)
  if (role && content.projects.length > 0) {
    const roleKeywords = (ROLE_KEYWORDS[role] || []).map((k) => k.toLowerCase());
    const projectText = content.projects.map((p) => `${p.technologies} ${p.description}`.toLowerCase()).join(' ');
    if (roleKeywords.length > 0 && !roleKeywords.some((k) => projectText.includes(k.toLowerCase()))) {
      issues.push({ message: `Your projects do not mention technologies commonly associated with ${role}. Please verify this is your target role.` });
    }
  }

  // Possible exaggeration in achievements
  for (const a of content.achievements) {
    const lower = (a.title + ' ' + a.description).toLowerCase();
    if (lower.includes('won') && lower.includes('participat')) {
      issues.push({ message: `Achievement "${a.title}" mentions both "won" and "participated". Please verify this information.` });
    }
  }

  // Check for empty project entries (title but no content)
  for (const p of content.projects) {
    if (p.title && !p.description && !p.keyFeatures && !p.contribution) {
      issues.push({ message: `Project "${p.title}" has no description, features, or contribution. Please add details for a stronger resume.` });
    }
  }

  return issues;
}

export function detectBuzzwords(content: ResumeContent): { phrase: string; reason: string; suggestion: string }[] {
  const findings: { phrase: string; reason: string; suggestion: string }[] = [];
  const allText = [
    content.introduction,
    ...content.projects.map((p) => `${p.description} ${p.keyFeatures} ${p.contribution}`),
    ...content.experience.map((e) => e.description),
    ...content.achievements.map((a) => `${a.title} ${a.description}`),
  ].join(' ').toLowerCase();

  // Find user's actual evidence to suggest
  const evidence = content.projects.map((p) => p.description).filter(Boolean)[0] || '';

  for (const bw of BUZZWORDS) {
    if (allText.includes(bw.phrase)) {
      findings.push({
        phrase: bw.phrase,
        reason: bw.reason,
        suggestion: evidence
          ? `Replace with evidence from your experience, e.g. reference work on: "${evidence.slice(0, 120)}${evidence.length > 120 ? '...' : ''}"`
          : 'Replace with a specific example or measurable result from your own experience.',
      });
    }
  }

  return findings;
}

export function detectRepetitiveVerbs(content: ResumeContent): { verb: string; count: number; alternatives: string[] }[] {
  const bullets: string[] = [];
  content.projects.forEach((p) => {
    if (p.description) bullets.push(p.description);
    if (p.contribution) bullets.push(p.contribution);
  });
  content.experience.forEach((e) => {
    if (e.description) bullets.push(e.description);
  });
  content.achievements.forEach((a) => {
    if (a.description) bullets.push(a.description);
  });

  const verbCounts: Record<string, number> = {};
  for (const bullet of bullets) {
    const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
    if (firstWord && firstWord.length > 2) {
      verbCounts[firstWord] = (verbCounts[firstWord] || 0) + 1;
    }
  }

  const findings: { verb: string; count: number; alternatives: string[] }[] = [];
  for (const [verb, count] of Object.entries(verbCounts)) {
    if (count >= 3 && REPETITIVE_VERB_ALTS[verb]) {
      findings.push({ verb, count, alternatives: REPETITIVE_VERB_ALTS[verb] });
    }
  }

  return findings;
}

export function analyzeATS(content: ResumeContent): { score: number; result: AtsResult } {
  const role = content.targetRole || content.customRole || '';
  const roleKeywords = ROLE_KEYWORDS[role] || [];

  // Collect all text from resume
  const allText = [
    content.introduction,
    ...content.projects.map((p) => `${p.title} ${p.technologies} ${p.description} ${p.keyFeatures}`),
    ...content.experience.map((e) => `${e.technology} ${e.description}`),
    ...content.certifications.map((c) => c.name),
    ...content.achievements.map((a) => `${a.title} ${a.description}`),
    ...content.interests.map((i) => i.name),
  ].join(' ').toLowerCase();

  const matchingKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of roleKeywords) {
    if (allText.includes(kw.toLowerCase())) {
      matchingKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  // Relevant skills from experience
  const relevantSkills = content.experience.map((e) => e.technology).filter(Boolean);
  const skillGaps = missingKeywords.filter((kw) => !relevantSkills.some((s) => s.toLowerCase().includes(kw.toLowerCase())));

  // Section completeness
  const sectionCompleteness = [
    { section: 'Profile', complete: !!content.profile.fullName },
    { section: 'Introduction', complete: !!content.introduction },
    { section: 'Education', complete: content.education.length > 0 },
    { section: 'Projects', complete: content.projects.length > 0 },
    { section: 'Experience', complete: content.experience.length > 0 },
    { section: 'Achievements', complete: content.achievements.length > 0 },
    { section: 'Certifications', complete: content.certifications.length > 0 },
    { section: 'Interests', complete: content.interests.length > 0 },
    { section: 'Languages', complete: content.languages.length > 0 },
    { section: 'Contact', complete: !!content.contact.email || !!content.contact.mobile },
    { section: 'References', complete: content.skipReferences || content.references.length > 0 },
  ];

  const completeCount = sectionCompleteness.filter((s) => s.complete).length;
  const completenessPct = (completeCount / sectionCompleteness.length) * 100;

  // Formatting warnings
  const formattingWarnings: string[] = [];
  if (content.profile.photoUrl) {
    formattingWarnings.push('Photos are not recommended for ATS systems in many markets. Consider removing for maximum ATS compatibility.');
  }
  if (content.projects.some((p) => p.description.length > 300)) {
    formattingWarnings.push('Some project descriptions are very long. Keep bullet points concise (1-2 lines) for ATS readability.');
  }

  // Suggestions
  const suggestions: string[] = [];
  if (missingKeywords.length > 0) {
    suggestions.push(`Add experience or projects involving: ${missingKeywords.slice(0, 5).join(', ')} to better match ${role} roles.`);
  }
  if (completenessPct < 70) {
    suggestions.push('Complete more resume sections to improve your ATS score.');
  }
  if (content.projects.length < 2) {
    suggestions.push('Add at least 2 projects to demonstrate practical skills.');
  }
  if (!content.introduction) {
    suggestions.push('Generate and include a professional introduction.');
  }

  // Buzzwords
  const buzzwords = detectBuzzwords(content);
  const repetitiveVerbs = detectRepetitiveVerbs(content);
  const validationIssues = validateResumeInformation(content);

  // Score calculation (weighted)
  let score = 0;
  // Keyword match: 40%
  if (roleKeywords.length > 0) {
    score += (matchingKeywords.length / roleKeywords.length) * 40;
  } else {
    score += 20; // partial credit if no role keywords mapped
  }
  // Section completeness: 35%
  score += (completenessPct / 100) * 35;
  // Quality: 15% (deduct for buzzwords and repetition)
  let qualityScore = 15;
  qualityScore -= buzzwords.length * 2;
  qualityScore -= repetitiveVerbs.length * 2;
  qualityScore -= validationIssues.length * 1.5;
  score += Math.max(0, qualityScore);
  // Contact info: 10%
  if (content.contact.email) score += 5;
  if (content.contact.mobile) score += 5;

  score = Math.round(Math.max(0, Math.min(100, score)));

  const result: AtsResult = {
    matchingKeywords,
    missingKeywords,
    relevantSkills,
    skillGaps,
    sectionCompleteness,
    formattingWarnings,
    suggestions,
    buzzwords,
    repetitiveVerbs,
    validationIssues,
  };

  return { score, result };
}
export function categorizeTechnicalSkills(
  skills: string[]
): { label: string; skills: string[] }[] {
  const categories = {
    Programming: [] as string[],
    'Web Development': [] as string[],
    'Databases & SQL': [] as string[],
    'Tools & Technologies': [] as string[],
    'Data & AI': [] as string[],
    Other: [] as string[],
  };

  for (const skill of skills) {
    const normalized = skill.toLowerCase().trim();

    if (
      ['python', 'java', 'javascript', 'typescript', 'c', 'c++', 'c#', 'php'].some(
        (s) => normalized.includes(s)
      )
    ) {
      categories.Programming.push(skill);
    } else if (
      ['html', 'css', 'react', 'angular', 'vue', 'node', 'node.js', 'flask', 'django'].some(
        (s) => normalized.includes(s)
      )
    ) {
      categories['Web Development'].push(skill);
    } else if (
      ['sql', 'mysql', 'postgresql', 'mongodb', 'oracle', 'database'].some(
        (s) => normalized.includes(s)
      )
    ) {
      categories['Databases & SQL'].push(skill);
    } else if (
      ['git', 'github', 'docker', 'vs code', 'visual studio', 'postman', 'firebase'].some(
        (s) => normalized.includes(s)
      )
    ) {
      categories['Tools & Technologies'].push(skill);
    } else if (
      [
        'machine learning',
        'deep learning',
        'ai',
        'artificial intelligence',
        'numpy',
        'pandas',
        'tensorflow',
        'pytorch',
      ].some((s) => normalized.includes(s))
    ) {
      categories['Data & AI'].push(skill);
    } else {
      categories.Other.push(skill);
    }
  }

  return Object.entries(categories)
    .filter(([, categorySkills]) => categorySkills.length > 0)
    .map(([label, categorySkills]) => ({
      label,
      skills: categorySkills,
    }));
}