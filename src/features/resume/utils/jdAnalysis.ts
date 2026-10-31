import type {
  ResumeContent,
  JobDescriptionAnalysis,
  JdMatchResult,
} from '@/types';

const TECH_SKILL_DICTIONARY: string[] = [
  'Python', 'Java', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go', 'Rust', 'Kotlin',
  'Swift', 'Ruby', 'PHP', 'Scala', 'R', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Oracle',
  'Redis', 'SQLite', 'HTML', 'CSS', 'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Flask',
  'Django', 'Spring', 'Spring Boot', 'Hibernate', 'Next.js', 'Tailwind', 'Redux', 'Bootstrap',
  'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'GCP', 'Terraform', 'Ansible', 'Linux',
  'Git', 'GitHub', 'Postman', 'Jira', 'REST API', 'REST', 'GraphQL', 'gRPC', 'Microservices',
  'CI/CD', 'JUnit', 'Maven', 'Gradle', 'Selenium', 'PyTest', 'JUnit', 'Pandas', 'NumPy',
  'Scikit-learn', 'TensorFlow', 'PyTorch', 'Keras', 'Matplotlib', 'Tableau', 'Power BI',
  'Excel', 'Hadoop', 'Spark', 'Kafka', 'Elasticsearch', 'Firebase', 'Supabase', 'GraphQL',
  'OOP', 'Data Structures', 'Algorithms', 'DBMS', 'Operating Systems', 'Computer Networks',
  'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Data Analysis',
  'Data Visualization', 'Statistics', 'Cybersecurity', 'Penetration Testing', 'OWASP',
  'Cryptography', 'Networking', 'Firewalls', 'IAM', 'Troubleshooting', 'Debugging',
  'Testing', 'Unit Testing', 'Agile', 'Scrum', 'DevOps', 'Cloud Computing', 'SDLC',
];

const SOFT_SKILLS_DICTIONARY: string[] = [
  'communication', 'teamwork', 'leadership', 'problem-solving', 'problem solving',
  'analytical', 'collaboration', 'adaptability', 'time management', 'attention to detail',
  'critical thinking', 'creativity', 'interpersonal', 'organizational', 'self-motivated',
  'decision-making', 'decision making', 'negotiation', 'presentation', 'mentoring',
  'conflict resolution', 'stakeholder management', 'written communication', 'verbal communication',
];

const TOOL_DICTIONARY: string[] = [
  'Git', 'GitHub', 'GitLab', 'Jira', 'Confluence', 'Slack', 'Postman', 'Docker',
  'Kubernetes', 'Jenkins', 'VS Code', 'IntelliJ', 'Eclipse', 'Figma', 'Notion',
  'Trello', 'Asana', 'AWS Console', 'Azure Portal', 'Tableau', 'Power BI',
  'Excel', 'Google Analytics', 'JMeter', 'Selenium', 'Terraform', 'Ansible',
  'Nagios', 'Grafana', 'Prometheus', 'Kibana', 'Splunk', 'Wireshark',
];

const QUALIFICATION_PATTERNS: string[] = [
  'B.Tech', 'B.E.', 'B.E', 'B.Sc', 'BCA', 'MCA', 'M.Tech', 'M.E.', 'M.E', 'M.Sc',
  'MBA', 'BBA', 'BA', 'MA', 'Diploma', 'PhD', 'Bachelor', 'Master', 'degree',
  'Bachelors', 'Masters', 'B.S.', 'M.S.', 'B.S', 'M.S',
];

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'just', 'should', 'now', 'will', 'also', 'able', 'about',
  'across', 'after', 'before', 'between', 'during', 'through', 'within', 'without', 'per',
  'etc', 'eg', 'ie', 'including', 'include', 'includes', 'included', 'must', 'should',
  'strong', 'excellent', 'good', 'proficient', 'proficiency', 'experience', 'experienced',
  'knowledge', 'understanding', 'familiarity', 'familiar', 'ability', 'skills', 'skill',
  'years', 'year', 'minimum', 'required', 'preferred', 'desired', 'plus', 'nice', 'have',
  'work', 'working', 'role', 'position', 'candidate', 'team', 'teams', 'environment',
  'company', 'organization', 'responsible', 'responsibility', 'responsibilities', 'job',
  'description', 'requirements', 'qualifications', 'looking', 'seeking', 'join',
]);

function normalize(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

function lower(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Extract all resume tokens — skills, technologies, descriptions — for matching.
 */
function extractResumeTokens(content: ResumeContent): { skills: string[]; allText: string } {
  const skills: string[] = [];
  const textParts: string[] = [];

  // Technologies from experience and projects
  for (const exp of content.experience) {
    if (exp.technology) {
      exp.technology.split(/[,/]+/).forEach((t) => {
        const trimmed = t.trim();
        if (trimmed) skills.push(trimmed);
      });
    }
    if (exp.description) textParts.push(exp.description);
    if (exp.role) textParts.push(exp.role);
  }

  for (const proj of content.projects) {
    if (proj.technologies) {
      proj.technologies.split(/[,/]+/).forEach((t) => {
        const trimmed = t.trim();
        if (trimmed) skills.push(trimmed);
      });
    }
    if (proj.description) textParts.push(proj.description);
    if (proj.keyFeatures) textParts.push(proj.keyFeatures);
    if (proj.contribution) textParts.push(proj.contribution);
    if (proj.title) textParts.push(proj.title);
  }

  // Certifications
  for (const cert of content.certifications) {
    if (cert.name) {
      skills.push(cert.name);
      textParts.push(cert.name);
    }
  }

  // Education
  for (const edu of content.education) {
    if (edu.specialization) textParts.push(edu.specialization);
    if (edu.degree) textParts.push(edu.degree);
  }

  // Introduction
  if (content.introduction) textParts.push(content.introduction);

  // Achievements
  for (const ach of content.achievements) {
    if (ach.title) textParts.push(ach.title);
    if (ach.description) textParts.push(ach.description);
  }

  // Interests
  for (const interest of content.interests) {
    if (interest.name) textParts.push(interest.name);
  }

  // Deduplicate skills
  const uniqueSkills = [...new Set(skills.map((s) => s.trim()).filter(Boolean))];

  return {
    skills: uniqueSkills,
    allText: lower(textParts.join(' ')),
  };
}

/**
 * Find a skill in a dictionary that appears in the JD text.
 */
function findInText(text: string, dictionary: string[]): string[] {
  const found: string[] = [];
  const lowerText = lower(text);
  for (const item of dictionary) {
    const lowerItem = lower(item);
    // Use word boundary for short items to avoid false positives
    if (lowerItem.length <= 3) {
      const regex = new RegExp(`\\b${lowerItem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerText)) {
        found.push(item);
      }
    } else {
      if (lowerText.includes(lowerItem)) {
        found.push(item);
      }
    }
  }
  return found;
}

/**
 * Extract sentences from a JD text.
 */
function extractSentences(text: string): string[] {
  return text
    .split(/[\n.]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

/**
 * Extract experience-year requirements from JD.
 */
function extractExperienceRequirements(text: string): string[] {
  const results: string[] = [];
  const patterns = [
    /(\d+)\+?\s*years?\s+of\s+(?:experience|professional\s+experience)/gi,
    /(\d+)\+?\s*years?\s+experience/gi,
    /minimum\s+of\s+(\d+)\s+years?/gi,
    /at\s+least\s+(\d+)\s+years?/gi,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      results.push(match[0].trim());
    }
  }
  return [...new Set(results)];
}

/**
 * Extract keywords from the JD — important single/multi-word terms that are not stop words.
 */
function extractKeywords(text: string, excludeTerms: string[]): string[] {
  const excludeSet = new Set(excludeTerms.map(lower));
  const words = text
    .replace(/[^a-zA-Z\s+#./]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(lower(w)) && !excludeSet.has(lower(w)));

  // Count frequency
  const freq: Record<string, number> = {};
  for (const word of words) {
    const key = lower(word);
    freq[key] = (freq[key] || 0) + 1;
  }

  // Return top keywords by frequency, capitalized
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1))
    .filter((w) => w.length > 2);
}

/**
 * Extract job title from the JD — usually near the top or after "Job Title:".
 */
function extractJobTitle(text: string): string {
  // Check for explicit "Job Title:" label
  const titleMatch = text.match(/job\s*title\s*[:\-]\s*(.+)/i);
  if (titleMatch) {
    return normalize(titleMatch[1].split(/[\n.]/)[0]).substring(0, 100);
  }

  // Try first non-empty line
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length > 0) {
    const firstLine = lines[0];
    // If first line looks like a title (not too long, no period at end)
    if (firstLine.length < 80 && !firstLine.endsWith('.') && !firstLine.toLowerCase().startsWith('we are')) {
      return firstLine.substring(0, 100);
    }
  }

  return '';
}

/**
 * Extract responsibilities from JD — bullet points or sentences with action verbs.
 */
function extractResponsibilities(text: string): string[] {
  const responsibilities: string[] = [];
  const actionVerbPattern = /\b(develop|design|build|implement|maintain|manage|create|test|debug|troubleshoot|analyze|deploy|configure|optimize|collaborate|lead|write|review|monitor|support|integrate|automate|document|research|investigate|resolve|ensure|provide|participate|contribute|deliver|architect|engineer)\w*\b/i;

  // Try bullet-point sections first
  const bulletSection = text.match(/(?:responsibilities|duties|what you'?ll do|role|what you will do)\s*[:\-]?\s*([\s\S]*?)(?:\n\s*\n|(?:requirements|qualifications|skills|what you need|about you)\s*[:\-])/i);
  if (bulletSection) {
    const bullets = bulletSection[1]
      .split(/[\n•·\-*]/)
      .map((b) => b.trim())
      .filter((b) => b.length > 15);
    for (const bullet of bullets) {
      if (actionVerbPattern.test(bullet) || bullet.length > 20) {
        responsibilities.push(normalize(bullet).substring(0, 150));
      }
    }
  }

  // Fallback: scan all sentences for action-verb starts
  if (responsibilities.length === 0) {
    const sentences = extractSentences(text);
    for (const sentence of sentences) {
      if (actionVerbPattern.test(sentence) && sentence.length > 20 && sentence.length < 200) {
        responsibilities.push(normalize(sentence).substring(0, 150));
      }
    }
  }

  return responsibilities.slice(0, 10);
}

/**
 * Parse a job description text and extract structured requirements.
 * Only extracts information that actually appears in the JD.
 */
export function analyzeJobDescription(jdText: string): JobDescriptionAnalysis {
  const text = jdText.trim();
  if (!text) {
    return {
      jobTitle: '',
      requiredSkills: [],
      preferredSkills: [],
      tools: [],
      qualifications: [],
      experienceRequirements: [],
      responsibilities: [],
      keywords: [],
      softSkills: [],
    };
  }

  // Split JD into sections — required vs preferred
  const preferredSection = text.match(/(?:preferred|nice to have|bonus|plus|desired)\s*[:\-]?([\s\S]*?)(?:\n\s*\n|$)/i);
  const preferredText = preferredSection ? preferredSection[1] : '';
  const requiredText = preferredSection ? text.replace(preferredSection[0], '') : text;

  // Extract skills from both sections
  const requiredSkillsRaw = findInText(requiredText, TECH_SKILL_DICTIONARY);
  const preferredSkillsRaw = findInText(preferredText, TECH_SKILL_DICTIONARY);
  // Remove preferred skills from required if they appear only in preferred section
  const requiredSkills = requiredSkillsRaw.filter(
    (s) => !preferredSkillsRaw.includes(s) || lower(requiredText).includes(lower(s))
  );
  const preferredSkills = preferredSkillsRaw.filter((s) => !requiredSkills.includes(s));

  // Tools
  const tools = findInText(text, TOOL_DICTIONARY);

  // Qualifications
  const qualifications = findInText(text, QUALIFICATION_PATTERNS);

  // Experience requirements
  const experienceRequirements = extractExperienceRequirements(text);

  // Responsibilities
  const responsibilities = extractResponsibilities(text);

  // Soft skills
  const softSkills = findInText(text, SOFT_SKILLS_DICTIONARY);

  // Keywords (excluding already-found skills/tools)
  const allFoundTerms = [...requiredSkills, ...preferredSkills, ...tools, ...softSkills];
  const keywords = extractKeywords(text, allFoundTerms);

  // Job title
  const jobTitle = extractJobTitle(text);

  return {
    jobTitle,
    requiredSkills: [...new Set(requiredSkills)],
    preferredSkills: [...new Set(preferredSkills)],
    tools: [...new Set(tools)],
    qualifications: [...new Set(qualifications)],
    experienceRequirements,
    responsibilities,
    keywords,
    softSkills: [...new Set(softSkills)].map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
  };
}

/**
 * Check if a skill from the JD appears in the resume's skill list or text.
 */
function findSkillInResume(skill: string, resumeSkills: string[], resumeText: string): { found: boolean; source: string } {
  const lowerSkill = lower(skill);

  // Check exact skill match
  for (const rs of resumeSkills) {
    if (lower(rs) === lowerSkill || lower(rs).includes(lowerSkill) || lowerSkill.includes(lower(rs))) {
      return { found: true, source: rs };
    }
  }

  // Check in full resume text
  if (resumeText.includes(lowerSkill)) {
    // Find which section it came from by checking skills
    for (const rs of resumeSkills) {
      if (lower(rs).includes(lowerSkill) || lowerSkill.includes(lower(rs))) {
        return { found: true, source: rs };
      }
    }
    return { found: true, source: 'resume content' };
  }

  return { found: false, source: '' };
}

/**
 * Check for partial/related matches — same technology family but not exact.
 */
function findPartialMatch(skill: string, resumeSkills: string[], resumeText: string): string | null {
  const lowerSkill = lower(skill);

  // Related technology families
  const families: string[][] = [
    ['python', 'django', 'flask', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch'],
    ['java', 'spring', 'spring boot', 'hibernate', 'maven', 'junit'],
    ['javascript', 'typescript', 'react', 'angular', 'vue', 'node.js', 'express', 'next.js'],
    ['sql', 'mysql', 'postgresql', 'mongodb', 'oracle', 'sqlite', 'redis'],
    ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'cloud'],
    ['html', 'css', 'tailwind', 'bootstrap', 'responsive'],
    ['git', 'github', 'gitlab'],
    ['testing', 'unit testing', 'selenium', 'junit', 'pytest'],
    ['ci/cd', 'jenkins', 'github actions', 'gitlab ci'],
    ['machine learning', 'deep learning', 'nlp', 'computer vision', 'ai'],
  ];

  // Find which family the JD skill belongs to
  let family: string[] | null = null;
  for (const f of families) {
    if (f.some((m) => lowerSkill.includes(m) || m.includes(lowerSkill))) {
      family = f;
      break;
    }
  }

  if (!family) return null;

  // Check if resume has any member of the same family but not the exact skill
  for (const rs of resumeSkills) {
    const lowerRs = lower(rs);
    if (lowerRs === lowerSkill) continue; // exact match handled elsewhere
    if (family.some((m) => lowerRs.includes(m) || m.includes(lowerRs))) {
      return rs;
    }
  }

  // Also check in resume text
  for (const member of family) {
    if (member === lowerSkill) continue;
    if (resumeText.includes(member)) {
      return member;
    }
  }

  return null;
}

/**
 * Compare a JD responsibility with resume content to find related experience.
 */
function matchResponsibility(jdResp: string, content: ResumeContent): { resumeItem: string; matchType: 'match' | 'partial' } | null {
  const lowerResp = lower(jdResp);

  // Extract key action words from the responsibility
  const actionWords = lowerResp
    .match(/\b(develop|design|build|implement|maintain|manage|create|test|debug|troubleshoot|analyze|deploy|configure|optimize|collaborate|lead|write|review|monitor|support|integrate|automate|document|research|investigate|resolve|ensure|provide)\w*\b/g) || [];

  // Extract key nouns/subjects
  const keyNouns = lowerResp
    .match(/\b(application|system|database|api|frontend|backend|user|customer|feature|bug|issue|incident|report|dashboard|service|component|module|pipeline|infrastructure|security|performance|test|deployment|code|requirement)\w*\b/g) || [];

  const searchTerms = [...actionWords, ...keyNouns];

  // Check experience descriptions
  for (const exp of content.experience) {
    const expText = lower(`${exp.description} ${exp.role} ${exp.technology}`);
    let overlapCount = 0;
    for (const term of searchTerms) {
      if (expText.includes(term)) overlapCount++;
    }
    if (overlapCount >= 2) {
      const matchType: 'match' | 'partial' = overlapCount >= 3 ? 'match' : 'partial';
      const desc = exp.description || exp.role || exp.technology;
      return { resumeItem: desc, matchType };
    }
  }

  // Check project descriptions
  for (const proj of content.projects) {
    const projText = lower(`${proj.description} ${proj.title} ${proj.keyFeatures} ${proj.contribution} ${proj.technologies}`);
    let overlapCount = 0;
    for (const term of searchTerms) {
      if (projText.includes(term)) overlapCount++;
    }
    if (overlapCount >= 2) {
      const matchType: 'match' | 'partial' = overlapCount >= 3 ? 'match' : 'partial';
      const desc = proj.description || proj.title;
      return { resumeItem: desc, matchType };
    }
  }

  return null;
}

/**
 * Compare the resume against the JD analysis and produce a match result.
 */
export function compareResumeWithJD(content: ResumeContent, analysis: JobDescriptionAnalysis): JdMatchResult {
  const { skills: resumeSkills, allText: resumeText } = extractResumeTokens(content);

  const matched: { skill: string; resumeSource: string }[] = [];
  const missing: { skill: string; jdCategory: string }[] = [];
  const partial: { jdItem: string; resumeItem: string; reason: string }[] = [];

  // Check required skills
  for (const skill of analysis.requiredSkills) {
    const { found, source } = findSkillInResume(skill, resumeSkills, resumeText);
    if (found) {
      matched.push({ skill, resumeSource: source });
    } else {
      const partialMatch = findPartialMatch(skill, resumeSkills, resumeText);
      if (partialMatch) {
        partial.push({
          jdItem: skill,
          resumeItem: partialMatch,
          reason: `Resume contains related technology "${partialMatch}" but not "${skill}" directly.`,
        });
      } else {
        missing.push({ skill, jdCategory: 'Required Skill' });
      }
    }
  }

  // Check preferred skills (only show as missing if not found)
  for (const skill of analysis.preferredSkills) {
    const { found } = findSkillInResume(skill, resumeSkills, resumeText);
    if (found) {
      matched.push({ skill, resumeSource: 'resume' });
    } else {
      const partialMatch = findPartialMatch(skill, resumeSkills, resumeText);
      if (partialMatch) {
        partial.push({
          jdItem: skill,
          resumeItem: partialMatch,
          reason: `Resume contains related technology "${partialMatch}" but not "${skill}" directly.`,
        });
      } else {
        missing.push({ skill, jdCategory: 'Preferred Skill' });
      }
    }
  }

  // Check tools
  for (const tool of analysis.tools) {
    const { found, source } = findSkillInResume(tool, resumeSkills, resumeText);
    if (found) {
      matched.push({ skill: tool, resumeSource: source });
    } else {
      missing.push({ skill: tool, jdCategory: 'Tool' });
    }
  }

  // Check soft skills
  for (const soft of analysis.softSkills) {
    const { found } = findSkillInResume(soft, resumeSkills, resumeText);
    if (found) {
      matched.push({ skill: soft, resumeSource: 'resume content' });
    }
    // Don't list soft skills as missing — they're harder to verify
  }

  // Check qualifications
  for (const qual of analysis.qualifications) {
    const { found, source } = findSkillInResume(qual, resumeSkills, resumeText);
    if (found) {
      matched.push({ skill: qual, resumeSource: source });
    } else {
      missing.push({ skill: qual, jdCategory: 'Qualification' });
    }
  }

  // Responsibility comparison
  const responsibilityMatches: { jdResponsibility: string; resumeItem: string; matchType: 'match' | 'partial' }[] = [];
  for (const resp of analysis.responsibilities) {
    const match = matchResponsibility(resp, content);
    if (match) {
      responsibilityMatches.push({
        jdResponsibility: resp,
        resumeItem: match.resumeItem,
        matchType: match.matchType,
      });
    }
  }

  // Calculate match percentage
  const totalJdRequirements =
    analysis.requiredSkills.length +
    analysis.preferredSkills.length +
    analysis.tools.length +
    analysis.qualifications.length;

  const totalMatched = matched.length;
  const totalPartial = partial.length;

  let matchPercentage = 0;
  if (totalJdRequirements > 0) {
    // Matched = full weight, partial = half weight
    matchPercentage = Math.round(((totalMatched + totalPartial * 0.5) / totalJdRequirements) * 100);
    matchPercentage = Math.min(100, Math.max(0, matchPercentage));
  }

  // Suggested keywords — JD keywords not already in resume
  const matchedSet = new Set(matched.map((m) => lower(m.skill)));
  const partialSet = new Set(partial.map((p) => lower(p.jdItem)));
  const suggestedKeywords = analysis.keywords
    .filter((k) => !matchedSet.has(lower(k)) && !partialSet.has(lower(k)))
    .slice(0, 10);

  return {
    matched,
    missing,
    partial,
    responsibilityMatches,
    matchPercentage,
    suggestedKeywords,
  };
}

/**
 * AI improvement: improve a resume section's wording using JD context.
 * Uses ONLY existing resume information + JD keywords. Never invents experience.
 */
export function improveSectionForJD(
  sectionType: 'introduction' | 'project' | 'experience' | 'achievement',
  currentText: string,
  jdKeywords: string[],
  targetRole: string
): string {
  if (!currentText.trim()) return currentText;

  let result = currentText.trim();

  // Remove first person
  result = result
    .replace(/\bI\s+/gi, '')
    .replace(/\bmy\b/gi, '')
    .replace(/\bme\b/gi, '')
    .replace(/\bI'm\b/gi, '');

  // Replace casual language
  result = result
    .replace(/\bmade\b/gi, 'built')
    .replace(/\bdid\b/gi, 'completed')
    .replace(/\bworked on\b/gi, 'contributed to')
    .replace(/\bused\b/gi, 'applied')
    .replace(/\bfixed\b/gi, 'resolved')
    .replace(/\bhelped\b/gi, 'supported');

  // Capitalize tech terms
  const techCaps: Record<string, string> = {
    html: 'HTML', css: 'CSS', sql: 'SQL', api: 'API', ui: 'UI', ux: 'UX',
    js: 'JS', git: 'Git', ai: 'AI', ml: 'ML',
  };
  for (const [lower, proper] of Object.entries(techCaps)) {
    result = result.replace(new RegExp(`\\b${lower}\\b`, 'g'), proper);
  }

  // If the text doesn't mention any JD keywords and the current text is relevant,
  // weave in naturally-applicable JD keywords ONLY if they already appear in the text context.
  // We do NOT add keywords that aren't already in the user's text.
  // Instead, we ensure existing relevant terms are presented prominently.

  // Ensure action verb start
  const actionVerbs = [
    'built', 'developed', 'designed', 'implemented', 'created', 'managed',
    'led', 'contributed', 'resolved', 'analyzed', 'tested', 'deployed',
    'configured', 'optimized', 'engineered', 'wrote', 'architected',
    'gained', 'applied', 'completed', 'won', 'received', 'earned', 'work',
  ];
  const firstWord = lower(result).split(/\s+/)[0]?.replace(/[^a-z]/g, '');
  if (firstWord && !actionVerbs.includes(firstWord)) {
    // Don't force — just capitalize
  }

  // Clean up spacing
  result = result.replace(/\s+/g, ' ').replace(/\s+,/g, ',').replace(/\s+\./g, '.').trim();
  result = result.replace(/\.\s*\./g, '.');

  // Ensure ending period
  if (result && !result.endsWith('.') && !result.endsWith('!') && !result.endsWith('?')) {
    result += '.';
  }

  // Capitalize first letter
  if (result) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }

  return result;
}
