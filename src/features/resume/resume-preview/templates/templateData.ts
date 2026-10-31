import type { ResumeContent, ProjectEntry, EducationEntry, ExperienceEntry } from '@/types';
import { categorizeTechnicalSkills, generateProjectBullets } from '@/features/resume/utils/analysis';

export interface TemplateData {
  fullName: string;
  photoUrl: string;
  targetRole: string;
  locationText: string;
  fullAddress: string;
  contactParts: string[];
  email: string;
  mobile: string;
  introduction: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  achievements: ResumeContent['achievements'];
  certifications: ResumeContent['certifications'];
  handsOnEntries: {
    id: string;
    title: string;
    context: string;
    company: string;
    technology: string;
    duration: string;
    description: string;
  }[];
  languages: ResumeContent['languages'];
  skillCategories: { label: string; skills: string[] }[];
  hasIntro: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
  hasProjects: boolean;
  hasAchievements: boolean;
  hasCertifications: boolean;
  hasExperience: boolean;
  hasHandsOnExperience: boolean;
  hasLanguages: boolean;
}

export function prepareTemplateData(content: ResumeContent): TemplateData {
  const {
    profile,
    contact,
    introduction,
    education,
    experience,
    projects,
    achievements,
    certifications,
    interests,
    languages,
  } = content;

  const targetRole = content.targetRole === 'Other' ? content.customRole : content.targetRole;
  const locationText = [profile.district, profile.state].filter(Boolean).join(', ');
  const fullAddress = contact.fullAddress?.trim() || locationText;
  const contactParts = [contact.mobile, contact.email, fullAddress].filter(Boolean);
  const skillCategories = categorizeTechnicalSkills(content.technicalSkills ?? []);
  const handsOnExperience = experience
    .filter((entry) =>
      entry.context !== 'Internship' &&
      entry.context !== 'Professional' &&
      (
        entry.role.trim() ||
        entry.company.trim() ||
        entry.technology.trim() ||
        entry.duration.trim() ||
        entry.description.trim()
      )
    )
    .map((entry) => ({
      id: entry.id,
      title:
        entry.role.trim() ||
        entry.technology.trim() ||
        entry.company.trim() ||
        entry.context ||
        'Hands-on Experience',
      context: entry.context,
      company: entry.company,
      technology: entry.technology,
      duration: entry.duration,
      description: entry.description,
    }));
  const handsOnEntries = [
    ...interests
      .filter((entry) => entry.name.trim())
      .map((entry) => ({
        id: `interest-${entry.id}`,
        title: entry.name,
        context: '',
        company: '',
        technology: '',
        duration: '',
        description: '',
      })),
    ...handsOnExperience,
  ];

  const hasAchievements = achievements.length > 0 && achievements.some((a) => a.title.trim());
  const hasCertifications = certifications.length > 0 && certifications.some((c) => c.name.trim());
  const hasExperience = experience.some((e) => e.context === 'Internship' || e.context === 'Professional');
  const hasHandsOnExperience = handsOnEntries.length > 0;
  const hasLanguages = languages.length > 0 && languages.some((l) => l.language.trim());

  return {
    fullName: profile.fullName || 'Your Name',
    photoUrl: profile.photoUrl,
    targetRole,
    locationText,
    fullAddress,
    contactParts,
    email: contact.email,
    mobile: contact.mobile,
    introduction,
    education,
    experience,
    projects,
    achievements,
    certifications,
    handsOnEntries,
    languages,
    skillCategories,
    hasIntro: !!introduction.trim(),
    hasEducation: education.length > 0,
    hasSkills: skillCategories.length > 0,
    hasProjects: projects.length > 0,
    hasAchievements,
    hasCertifications,
    hasExperience,
    hasHandsOnExperience,
    hasLanguages,
  };
}

export function getProjectBullets(project: ProjectEntry): string[] {
  return generateProjectBullets(project);
}

export function resolveDegree(e: EducationEntry): string {
  return e.degree === 'Other' && e.customDegree ? e.customDegree : e.degree;
}

export function resolveSpecialization(e: EducationEntry): string {
  return e.specialization === 'Other' && e.customSpecialization ? e.customSpecialization : e.specialization;
}

export function resolveInstitution(e: EducationEntry): string {
  return e.institution === 'Other' && e.customInstitution ? e.customInstitution : e.institution;
}
