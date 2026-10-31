import type { ResumeContent } from '@/types';

export type AIAction =
  | 'generate'
  | 'improve'
  | 'rewrite'
  | 'shorten'
  | 'expand'
  | 'ats'
  | 'grammar';

export interface AIContext {
  fieldLabel: string;
  targetRole: string;
  careerType: string;
  content: ResumeContent;
  extra?: Record<string, string>;
}

const BUZZWORD_REPLACEMENTS: Record<string, string> = {
  'passionate about': 'focused on',
  'enthusiastic': 'dedicated',
  'hardworking': 'diligent',
  'dynamic': 'versatile',
  'highly motivated': 'committed',
  'results-driven': 'outcome-focused',
  'quick learner': 'adaptable learner',
  'excellent communication skills': 'collaborative communicator',
  'strong problem-solving skills': 'analytical problem-solver',
  'team player': 'collaborative contributor',
  'time management': 'effective at prioritization',
  'adaptability': 'flexible across changing requirements',
};

function removeFirstPerson(text: string): string {
  return text
    .replace(/\bI\b/gi, '')
    .replace(/\bI'm\b/gi, '')
    .replace(/\bI am\b/gi, '')
    .replace(/\bmy\b/gi, '')
    .replace(/\bme\b/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/\s+\./g, '.')
    .trim();
}

function replaceBuzzwords(text: string): string {
  let result = text;
  for (const [bad, good] of Object.entries(BUZZWORD_REPLACEMENTS)) {
    result = result.replace(new RegExp(bad, 'gi'), good);
  }
  return result;
}

function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const ACTION_VERBS = new Set([
  'built', 'implemented', 'designed', 'developed', 'created', 'integrated',
  'configured', 'analyzed', 'tested', 'automated', 'engineered', 'deployed',
  'constructed', 'produced', 'established', 'resolved', 'debugged', 'maintained',
  'updated', 'enhanced', 'improved', 'optimized', 'supported', 'applied',
  'leveraged', 'utilized', 'contributed', 'worked', 'used', 'won', 'participated',
  'completed', 'delivered', 'coded', 'wrote', 'architected', 'spearheaded',
  'led', 'managed', 'coordinated', 'received', 'recognized', 'awarded',
  'achieved', 'earned', 'secured', 'gained', 'performed', 'conducted',
  'researched', 'investigated', 'collaborated', 'facilitated', 'presented',
]);

function startsWithActionVerb(text: string): boolean {
  const firstWord = text.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
  return firstWord ? ACTION_VERBS.has(firstWord) : false;
}

function ensureActionVerb(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (startsWithActionVerb(trimmed)) {
    return capitalizeFirst(trimmed);
  }
  const lower = trimmed.toLowerCase();
  if (/\b(website|app|application|system|platform|tool|dashboard|api|feature|module|portal|site)\b/i.test(trimmed)) {
    return capitalizeFirst(`Built a ${lower.replace(/^(the|a|an)\s+/, '')}`);
  }
  if (/\b(report|analysis|document|presentation|model|algorithm|script|query)\b/i.test(trimmed)) {
    return capitalizeFirst(`Developed ${lower.replace(/^(the|a|an)\s+/, '')}`);
  }
  if (/\b(hackathon|competition|contest|award|prize|scholarship|certification)\b/i.test(trimmed)) {
    return capitalizeFirst(`Achieved ${lower.replace(/^(the|a|an)\s+/, '')}`);
  }
  if (/\b(using|with|for|to|in|on)\b/i.test(trimmed)) {
    return capitalizeFirst(`Worked on ${lower.replace(/^(the|a|an)\s+/, '')}`);
  }
  return capitalizeFirst(trimmed);
}

/**
 * Core AI text processing — runs entirely client-side using rule-based transforms.
 * Never invents facts. Only restructures, rephrases, and improves user-provided content.
 */
export function processAIText(
  action: AIAction,
  currentText: string,
  context: AIContext
): string {
  switch (action) {
    case 'generate':
      return generateContent(context);

    case 'improve': {
      if (!currentText.trim()) return generateContent(context);
      let result = replaceBuzzwords(currentText);
      result = removeFirstPerson(result);
      result = capitalizeFirst(result);
      // Fix common grammar issues
      result = result.replace(/\s+/g, ' ').replace(/\s+\./g, '.').replace(/\.\s*\./g, '.');
      if (result && !result.endsWith('.')) result += '.';
      return result;
    }

    case 'rewrite': {
      if (!currentText.trim()) return '';
      let result = removeFirstPerson(currentText);
      result = replaceBuzzwords(result);
      // Convert casual language to professional
      result = result
        .replace(/\bmade\b/gi, 'built')
        .replace(/\bdid\b/gi, 'completed')
        .replace(/\bworked on\b/gi, 'contributed to')
        .replace(/\bhelped with\b/gi, 'supported')
        .replace(/\bused\b/gi, 'applied')
        .replace(/\bfixed\b/gi, 'resolved')
        .replace(/\bmade a\b/gi, 'built a');
      result = ensureActionVerb(result);
      result = result.replace(/\s+/g, ' ').trim();
      if (result && !result.endsWith('.')) result += '.';
      return capitalizeFirst(result);
    }

    case 'shorten': {
      if (!currentText.trim()) return '';
      const sentences = currentText.split(/\.\s+/).filter(Boolean);
      // Keep first 1-2 sentences, trim each
      const kept = sentences.slice(0, 2).map((s) => {
        const words = s.trim().split(/\s+/);
        if (words.length > 20) {
          return words.slice(0, 20).join(' ') + '...';
        }
        return s.trim();
      });
      let result = kept.join('. ');
      result = removeFirstPerson(result);
      if (result && !result.endsWith('.')) result += '.';
      return capitalizeFirst(result);
    }

    case 'expand': {
      if (!currentText.trim()) return '';
      let result = currentText.trim();
      // Add more descriptive connecting phrases (without inventing facts)
      const role = context.targetRole;
      if (role && !result.toLowerCase().includes(role.toLowerCase())) {
        // Don't force the role in if it's not already relevant
      }
      // Expand by making language more descriptive
      result = result
        .replace(/\bbuilt\b/gi, 'designed and built')
        .replace(/\bmade\b/gi, 'developed and built')
        .replace(/\bcreated\b/gi, 'designed and created')
        .replace(/\bused\b/gi, 'leveraged')
        .replace(/\bfixed\b/gi, 'identified and resolved');
      result = removeFirstPerson(result);
      if (result && !result.endsWith('.')) result += '.';
      return capitalizeFirst(result);
    }

    case 'ats': {
      if (!currentText.trim()) return '';
      const role = context.targetRole;
      let result = removeFirstPerson(currentText);
      result = replaceBuzzwords(result);
      result = ensureActionVerb(result);
      // ATS optimization: ensure action-verb start, concise structure
      // Don't keyword-stuff — just make existing language more scannable
      result = result.replace(/\s+/g, ' ').trim();
      if (result && !result.endsWith('.')) result += '.';
      return capitalizeFirst(result);
    }

    case 'grammar': {
      if (!currentText.trim()) return '';
      let result = currentText.trim();
      // Fix capitalization
      result = capitalizeFirst(result);
      // Fix double spaces
      result = result.replace(/\s+/g, ' ');
      // Fix spacing around punctuation
      result = result.replace(/\s+([,.])/g, '$1');
      result = result.replace(/([,.])(?=[^\s])/g, '$1 ');
      // Fix multiple punctuation
      result = result.replace(/\.\s*\./g, '.');
      // Ensure ending period
      if (result && !result.match(/[.!?]$/)) result += '.';
      return result;
    }

    default:
      return currentText;
  }
}

function generateContent(context: AIContext): string {
  const { fieldLabel, extra } = context;
  const rawInput = extra?.rawInput || '';

  // If there is existing description text, transform it into professional language
  if (rawInput.trim()) {
    return professionalize(rawInput);
  }

  // No description yet — generate from structured fields based on the field type
  if (fieldLabel === 'Professional Summary') {
    return generateSummaryFromContext(context.content, context.targetRole);
  }

  if (fieldLabel === 'Project Description' || fieldLabel === 'Project Key Features' || fieldLabel === 'Project Contribution') {
    return generateProjectDescription(context);
  }

  if (fieldLabel === 'Achievement Description') {
    return generateAchievementDescription(context);
  }

  if (fieldLabel === 'Experience Description') {
    return generateExperienceDescription(context);
  }

  return '';
}

/**
 * Convert rough first-person notes into clean professional resume language.
 * Never invents facts — only restructures and rephrases.
 */
function professionalize(rawInput: string): string {
  let result = rawInput.trim();

  // Replace casual first-person phrasing with professional equivalents
  result = result
    .replace(/\bI made\b/gi, 'Built')
    .replace(/\bI built\b/gi, 'Built')
    .replace(/\bI created\b/gi, 'Created')
    .replace(/\bI developed\b/gi, 'Developed')
    .replace(/\bI used\b/gi, 'using')
    .replace(/\bI wrote\b/gi, 'Wrote')
    .replace(/\bI coded\b/gi, 'Coded')
    .replace(/\bI implemented\b/gi, 'Implemented')
    .replace(/\bI designed\b/gi, 'Designed')
    .replace(/\bI worked on\b/gi, 'Worked on')
    .replace(/\bI did\b/gi, 'Completed')
    .replace(/\bI fixed\b/gi, 'Resolved')
    .replace(/\bI helped\b/gi, 'Supported')
    .replace(/\bI won\b/gi, 'Won')
    .replace(/\bI received\b/gi, 'Received')
    .replace(/\bI earned\b/gi, 'Earned')
    .replace(/\bI\s+/gi, '')
    .replace(/\bmy\b/gi, '')
    .replace(/\bme\b/gi, '')
    .replace(/\bmade\b/gi, 'built')
    .replace(/\bdid\b/gi, 'completed')
    .replace(/\bfixed\b/gi, 'resolved');

  // Clean up spacing artifacts from removals
  result = result.replace(/\s+/g, ' ').replace(/\s+,/g, ',').replace(/\s+\./g, '.').trim();

  // Capitalize standalone tech terms that users often type lowercase
  const techCapitalizations: Record<string, string> = {
    'html': 'HTML', 'css': 'CSS', 'sql': 'SQL', 'api': 'API', 'ui': 'UI',
    'ux': 'UX', 'js': 'JS', 'npm': 'npm', 'git': 'Git', 'ai': 'AI',
    'ml': 'ML', 'py': 'Python', 'db': 'database',
  };
  for (const [lower, proper] of Object.entries(techCapitalizations)) {
    result = result.replace(new RegExp(`\\b${lower}\\b`, 'g'), proper);
  }

  // Ensure action-verb start
  if (!startsWithActionVerb(result)) {
    result = ensureActionVerb(result);
  }

  result = result.replace(/\s+/g, ' ').trim();
  if (result && !result.endsWith('.')) result += '.';
  return capitalizeFirst(result);
}

/**
 * Generate a project description from title + technologies + features.
 * Uses the description text if available, otherwise builds from structured fields.
 */
function generateProjectDescription(context: AIContext): string {
  const { extra } = context;
  const title = extra?.title?.trim() || '';
  const technologies = extra?.technologies?.trim() || '';
  const features = extra?.features?.trim() || '';

  const parts: string[] = [];

  // Opening: what was built
  const projectNoun = title || 'project';
  const article = /^[aeiou]/i.test(projectNoun) ? 'an' : 'a';
  let opening: string;
  if (technologies) {
    const techList = formatTechList(technologies);
    opening = `Built ${article} ${projectNoun.toLowerCase()} using ${techList}`;
  } else {
    opening = `Built ${article} ${projectNoun.toLowerCase()}`;
  }
  parts.push(opening);

  // Add features if present
  if (features) {
    const cleanFeatures = features
      .replace(/\.$/, '')
      .replace(/^(features?:?\s*)/i, '')
      .trim()
      .toLowerCase();
    parts.push(`featuring ${cleanFeatures}`);
  }

  let result = parts.join(', ');
  result = removeFirstPerson(result);
  result = result.replace(/\s+/g, ' ').trim();
  if (result && !result.endsWith('.')) result += '.';
  return capitalizeFirst(result);
}

/**
 * Generate an achievement description from title + description + organization.
 */
function generateAchievementDescription(context: AIContext): string {
  const { extra } = context;
  const title = extra?.title?.trim() || '';
  const organization = extra?.organization?.trim() || '';

  const parts: string[] = [];

  if (title) {
    if (/^won/i.test(title)) {
      parts.push(title);
    } else {
      parts.push(`Won ${title.toLowerCase()}`);
    }
  }

  if (organization) {
    parts.push(`at ${organization}`);
  }

  let result = parts.join(' ');
  if (result) {
    result = removeFirstPerson(result);
    result = result.replace(/\s+/g, ' ').trim();
    if (result && !result.endsWith('.')) result += '.';
    return capitalizeFirst(result);
  }

  return '';
}

/**
 * Generate an experience description from role + technology + description.
 */
function generateExperienceDescription(context: AIContext): string {
  const { extra, content } = context;
  const role = extra?.role?.trim() || '';
  const technologies = extra?.technologies?.trim() || '';

  // Look up the matching experience entry to get the full context
  const entry = content.experience.find(
    (e) => (extra?.title && e.technology === extra.title) || (role && e.role === role)
  );

  const techField = entry?.technology?.trim() || technologies;
  const contextType = entry?.context?.trim() || '';

  const parts: string[] = [];

  if (techField) {
    const techList = formatTechList(techField);
    if (contextType === 'Internship') {
      parts.push(`Gained internship experience working with ${techList}`);
    } else if (contextType === 'Professional') {
      parts.push(`Applied ${techList} in a professional setting`);
    } else if (contextType === 'Academic') {
      parts.push(`Completed academic work using ${techList}`);
    } else {
      parts.push(`Worked with ${techList}`);
    }
  }

  if (role && contextType !== 'Internship' && contextType !== 'Professional') {
    parts.push(`in the role of ${role.toLowerCase()}`);
  }

  let result = parts.join(' ');
  if (result) {
    result = removeFirstPerson(result);
    result = result.replace(/\s+/g, ' ').trim();
    if (result && !result.endsWith('.')) result += '.';
    return capitalizeFirst(result);
  }

  return '';
}

/**
 * Format a comma-separated technology string into a clean, capitalized list.
 */
function formatTechList(technologies: string): string {
  const techs = technologies
    .split(/[,/]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (techs.length === 0) return technologies;
  return formatList(techs);
}

function generateSummaryFromContext(content: ResumeContent, targetRole: string): string {
  const { education, experience, projects } = content;

  const topEdu = education[0];
  let identity = '';
  if (topEdu) {
    const degree = topEdu.degree === 'Other' && topEdu.customDegree ? topEdu.customDegree : topEdu.degree;
    const spec = topEdu.specialization === 'Other' && topEdu.customSpecialization ? topEdu.customSpecialization : topEdu.specialization;
    const isStudent = !topEdu.yearGraduation || parseInt(topEdu.yearGraduation) >= new Date().getFullYear();
    const suffix = isStudent ? 'student' : 'graduate';
    if (spec) {
      identity = `${degree} ${spec} ${suffix}`;
    } else if (degree) {
      identity = `${degree} ${suffix}`;
    }
  }

  const allTechs = experience.map((e) => e.technology).filter(Boolean);
  const topProject = projects[0];

  const sentences: string[] = [];

  // Sentence 1: identity + skills
  if (identity && allTechs.length > 0) {
    sentences.push(
      `${capitalizeFirst(identity)} with hands-on experience in ${formatList(allTechs.slice(0, 5))}.`
    );
  } else if (identity) {
    sentences.push(`${capitalizeFirst(identity)}.`);
  } else if (allTechs.length > 0) {
    sentences.push(`Candidate with hands-on experience in ${formatList(allTechs.slice(0, 5))}.`);
  }

  // Sentence 2: practical work / project
  const expParts: string[] = [];
  const expDescs = experience.filter((e) => e.description).map((e) => e.description);
  if (expDescs.length > 0) {
    expParts.push(`practical exposure to ${expDescs[0].toLowerCase()}`);
  }
  if (topProject?.title) {
    if (topProject.description) {
      expParts.push(`built ${topProject.title} — ${truncateText(topProject.description, 90).toLowerCase()}`);
    } else {
      expParts.push(`built ${topProject.title}`);
    }
  }
  const internships = experience.filter((e) => e.context === 'Internship');
  if (internships.length > 0) {
    const internTech = internships.map((i) => i.technology).filter(Boolean);
    if (internTech.length > 0) {
      expParts.push(`gained internship experience in ${formatList(internTech.slice(0, 3))}`);
    }
  }
  if (expParts.length > 0) {
    sentences.push(`${capitalizeFirst(expParts.slice(0, 3).join(', '))}.`);
  }

  if (sentences.length === 0) {
    // Leave empty rather than generating generic filler
    return '';
  }

  let result = sentences.join(' ');
  result = removeFirstPerson(result);
  result = result.replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim();
  if (result && !result.endsWith('.')) result += '.';
  return capitalizeFirst(result);
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
