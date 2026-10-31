import type { ResumeContent } from '@/types';
import {
  getCareerRecommendations,
  type CareerRecommendation,
} from './careerRecommendation';

export type SkillPriority = 'High' | 'Medium' | 'Low';

export interface SkillGap {
  skill: string;
  priority: SkillPriority;
  reason: string;
}

export interface SkillGapResult {
  role: string;
  matchScore: number;
  knownSkills: string[];
  skillGaps: SkillGap[];
  gapPercentage: number;
  summary: string;
  careerRecommendation: CareerRecommendation | null;
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function splitSkills(value: string): string[] {
  return value
    .split(/[,/|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function skillMatches(skill: string, profileSkills: string[], profileText: string): boolean {
  const target = normalize(skill);

  return (
    profileSkills.some((profileSkill) => {
      const current = normalize(profileSkill);

      return (
        current === target ||
        current.includes(target) ||
        target.includes(current)
      );
    }) || profileText.includes(target)
  );
}

function getKnownSkills(content: ResumeContent): string[] {
  const skills: string[] = [];

  content.projects.forEach((project) => {
    skills.push(...splitSkills(project.technologies));
  });

  content.experience.forEach((experience) => {
    skills.push(...splitSkills(experience.technology));
  });

  content.certifications.forEach((certification) => {
    if (certification.name) {
      skills.push(certification.name);
    }
  });

  return unique(skills);
}

function getProfileText(content: ResumeContent): string {
  const parts: string[] = [];

  parts.push(content.introduction);
  parts.push(content.targetRole);
  parts.push(content.customRole);

  content.education.forEach((education) => {
    parts.push(
      education.degree,
      education.specialization,
      education.institution
    );
  });

  content.projects.forEach((project) => {
    parts.push(
      project.title,
      project.technologies,
      project.description,
      project.keyFeatures,
      project.contribution
    );
  });

  content.experience.forEach((experience) => {
    parts.push(
      experience.role,
      experience.technology,
      experience.company,
      experience.description
    );
  });

  content.certifications.forEach((certification) => {
    parts.push(
      certification.name,
      certification.organization
    );
  });

  content.achievements.forEach((achievement) => {
    parts.push(
      achievement.title,
      achievement.description,
      achievement.organization
    );
  });

  content.interests.forEach((interest) => {
    parts.push(interest.name);
  });

  return normalize(parts.filter(Boolean).join(' '));
}

function getPriority(index: number, total: number): SkillPriority {
  if (index < Math.ceil(total / 3)) {
    return 'High';
  }

  if (index < Math.ceil((total * 2) / 3)) {
    return 'Medium';
  }

  return 'Low';
}

function buildReason(skill: string, priority: SkillPriority, role: string): string {
  if (priority === 'High') {
    return `${skill} is an important skill for the ${role} career path and should be prioritized.`;
  }

  if (priority === 'Medium') {
    return `${skill} can strengthen your preparation for ${role} opportunities.`;
  }

  return `${skill} is useful for broader preparation and can be developed after higher-priority skills.`;
}

export function analyzeSkillGap(
  content: ResumeContent,
  selectedRole?: string
): SkillGapResult {
  const recommendations = getCareerRecommendations(content);

  const role =
    selectedRole ||
    (content.targetRole === 'Other'
      ? content.customRole
      : content.targetRole);

  const recommendation =
    recommendations.find(
      (item) => normalize(item.role) === normalize(role || '')
    ) ||
    recommendations[0] ||
    null;

  const finalRole = recommendation?.role || role || 'Selected Career Role';

  if (!recommendation) {
    return {
      role: finalRole,
      matchScore: 0,
      knownSkills: getKnownSkills(content),
      skillGaps: [],
      gapPercentage: 0,
      summary: 'Add more profile information to generate a meaningful skill gap analysis.',
      careerRecommendation: null,
    };
  }

  const knownSkills = getKnownSkills(content);
  const profileText = getProfileText(content);

  const requiredSkills = unique([
    ...recommendation.skillsToDevelop,
    ...recommendation.relevantSkills,
  ]);

  const missingSkills = requiredSkills.filter(
    (skill) => !skillMatches(skill, knownSkills, profileText)
  );

  const orderedMissingSkills = unique(missingSkills);

  const skillGaps: SkillGap[] = orderedMissingSkills.map((skill, index) => {
    const priority = getPriority(index, orderedMissingSkills.length);

    return {
      skill,
      priority,
      reason: buildReason(skill, priority, finalRole),
    };
  });

  const totalRelevantSkills =
    knownSkills.length + orderedMissingSkills.length;

  const gapPercentage =
    totalRelevantSkills > 0
      ? Math.round(
          (orderedMissingSkills.length / totalRelevantSkills) * 100
        )
      : 0;

  let summary = '';

  if (skillGaps.length === 0) {
    summary = `Your current profile covers the skills identified for ${finalRole}. Continue strengthening these skills through projects and practical experience.`;
  } else {
    summary = `Your profile has ${skillGaps.length} skill area${
      skillGaps.length === 1 ? '' : 's'
    } to develop for ${finalRole}. Focus on the high-priority skills first.`;
  }

  return {
    role: finalRole,
    matchScore: recommendation.matchScore,
    knownSkills,
    skillGaps,
    gapPercentage,
    summary,
    careerRecommendation: recommendation,
  };
}