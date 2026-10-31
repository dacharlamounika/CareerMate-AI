import { Fragment, type ReactNode } from 'react';
import type { ResumeContent } from '@/types';
import {
  getProjectBullets,
  prepareTemplateData,
  resolveDegree,
  resolveInstitution,
  resolveSpecialization,
  type TemplateData,
} from './templateData';

type TemplateVariant = 'professional' | 'modern' | 'minimal' | 'technical' | 'executive';
type ResumeSection =
  | 'summary'
  | 'education'
  | 'certifications'
  | 'achievements'
  | 'internship'
  | 'handsOn'
  | 'industryReady'
  | 'projects'
  | 'languages';

interface Props {
  content: ResumeContent;
  variant: TemplateVariant;
}

const RESUME_SECTION_ORDER: readonly ResumeSection[] = [
  'summary',
  'education',
  'certifications',
  'achievements',
  'internship',
  'handsOn',
  'industryReady',
  'projects',
  'languages',
];

const headingStyles: Record<TemplateVariant, React.CSSProperties> = {
  professional: { borderBottom: '1px solid #94a3b8', color: '#1e293b' },
  modern: { borderBottom: '2px solid #0d9488', color: '#1e293b' },
  minimal: { color: '#334155', fontWeight: 600 },
  technical: { borderBottom: '2px solid #1e293b', color: '#0f172a' },
  executive: { borderBottom: '2px solid #1e293b', color: '#0f172a' },
};

const metadataRowStyle: React.CSSProperties = {
  display: 'grid',
  width: '100%',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(5.5rem, 22%)',
  alignItems: 'baseline',
  columnGap: '0.75rem',
};

function formatHandsOnEntry(entry: TemplateData['handsOnEntries'][number]): string {
  const details = [entry.context, entry.company, entry.technology, entry.duration]
    .filter((value) => value && value !== entry.title);
  const description = entry.description;
  const title = entry.title;

  return [
    [title, ...details].join(' · '),
    description.trim() && description !== title ? description : '',
  ]
    .filter(Boolean)
    .join(' — ');
}

export function TemplateSections({ content, variant }: Props) {
  const data = prepareTemplateData(content);

  const SectionHeading = ({ children }: { children: string }) => (
    <h2
      className="mb-2 border-b pb-1 text-left text-[10pt] font-bold uppercase tracking-wide"
      style={headingStyles[variant]}
    >
      {variant === 'modern' && (
        <span
          aria-hidden="true"
          className="mr-2 inline-block h-3.5 w-1 rounded-sm bg-teal-600 align-middle"
        />
      )}
      {children}
    </h2>
  );
  const sectionClass = 'mb-3';

  const sections: Record<ResumeSection, () => ReactNode> = {
    summary: () =>
      data.hasIntro ? (
        <section className={sectionClass}>
          <SectionHeading>Professional Summary</SectionHeading>
          <p className="whitespace-pre-line text-justify text-slate-700">{data.introduction}</p>
        </section>
      ) : null,
    education: () =>
      data.hasEducation ? (
        <section className={sectionClass}>
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-2">
            {data.education.map((entry) => (
              <div key={entry.id}>
                <div style={metadataRowStyle}>
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-slate-900">
                      {resolveDegree(entry)}
                      {resolveSpecialization(entry) ? `, ${resolveSpecialization(entry)}` : ''}
                    </p>
                    <p className="break-words text-slate-600">
                      {resolveInstitution(entry)}
                      {entry.cgpa && ` — CGPA: ${entry.cgpa}`}
                    </p>
                  </div>
                  {entry.yearGraduation && (
                    <span className="min-w-0 break-words text-right text-slate-500" style={{ fontSize: '9pt' }}>
                      {entry.yearGraduation}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null,
    certifications: () =>
      data.hasCertifications ? (
        <section className={sectionClass}>
          <SectionHeading>Certifications</SectionHeading>
          <div className="space-y-2">
            {data.certifications.filter((entry) => entry.name.trim()).map((entry) => (
              <div key={entry.id}>
                <div style={metadataRowStyle}>
                  <p className="min-w-0 break-words text-left text-slate-700">
                    <span className="font-medium text-slate-900">{entry.name}</span>
                    {entry.organization && ` — ${entry.organization}`}
                  </p>
                  {entry.completionDate && (
                    <span className="min-w-0 break-words text-right text-slate-500" style={{ fontSize: '9pt' }}>
                      {entry.completionDate}
                    </span>
                  )}
                </div>
                {entry.credentialUrl && (
                  <a href={entry.credentialUrl} className="text-teal-700" style={{ fontSize: '9pt' }}>
                    [View credential]
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null,
    achievements: () =>
      data.hasAchievements ? (
        <section className={sectionClass}>
          <SectionHeading>Achievements</SectionHeading>
          <ul className="list-disc space-y-1 pl-5 text-justify text-slate-700">
            {data.achievements.filter((entry) => entry.title.trim()).map((entry) => (
              <li key={entry.id}>
                <span className="font-medium text-slate-900">{entry.title}</span>
                {entry.organization && ` — ${entry.organization}`}
                {entry.description && ` — ${entry.description}`}
              </li>
            ))}
          </ul>
        </section>
      ) : null,
    internship: () =>
      data.hasExperience ? (
        <section className={sectionClass}>
          <SectionHeading>Internship</SectionHeading>
          <div className="space-y-2">
            {data.experience
              .filter((entry) => entry.context === 'Internship' || entry.context === 'Professional')
              .map((entry) => (
                <div key={entry.id}>
                  <div style={metadataRowStyle}>
                    <span className="min-w-0 break-words font-semibold text-slate-900">
                      {entry.role || (entry.context === 'Internship' ? 'Internship' : 'Professional Experience')}
                      {entry.company && ` — ${entry.company}`}
                      {entry.technology && ` · ${entry.technology}`}
                    </span>
                    {entry.duration && (
                      <span className="min-w-0 break-words text-right text-slate-500" style={{ fontSize: '9pt' }}>
                        {entry.duration}
                      </span>
                    )}
                  </div>
                  {entry.description && (
                    <p className="min-w-0 break-words text-justify text-slate-700">{entry.description}</p>
                  )}
                </div>
              ))}
          </div>
        </section>
      ) : null,
    handsOn: () =>
      data.hasHandsOnExperience ? (
        <section className={sectionClass}>
          <SectionHeading>Hands-on Experience</SectionHeading>
          <p className="whitespace-pre-line break-words text-justify text-slate-700 [overflow-wrap:anywhere]">
            {data.handsOnEntries.map((entry, index) => (
              <Fragment key={entry.id}>
                {formatHandsOnEntry(entry)}
                {index < data.handsOnEntries.length - 1 ? ', ' : ''}
              </Fragment>
            ))}
          </p>
        </section>
      ) : null,
    industryReady: () =>
      data.hasSkills ? (
        <section className={sectionClass}>
          <SectionHeading>Technical Skills / Industry Ready</SectionHeading>
          <div className="space-y-1">
            {data.skillCategories.map((category) => (
              <div key={category.label} className="flex flex-wrap gap-x-2 text-left text-slate-700">
                <span className="font-semibold text-slate-900">{category.label}:</span>
                <span>{category.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null,
    projects: () =>
      data.hasProjects ? (
        <section className={sectionClass}>
          <SectionHeading>Projects Done</SectionHeading>
          <div className="space-y-3">
            {data.projects.filter((project) => project.title.trim()).map((project) => {
              const bullets = getProjectBullets(project);
              return (
                <div key={project.id}>
                  <div style={metadataRowStyle}>
                    <span className="min-w-0 break-words font-semibold text-slate-900">{project.title}</span>
                    {project.type && (
                      <span className="min-w-0 break-words text-right text-slate-500" style={{ fontSize: '9pt' }}>
                        {project.type}
                      </span>
                    )}
                  </div>
                  {project.technologies && (
                    <p className="min-w-0 break-words font-medium text-slate-600">{project.technologies}</p>
                  )}
                  {bullets.length > 0 && (
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-justify text-slate-700">
                      {bullets.map((bullet, index) => <li key={index} className="text-justify">{bullet}</li>)}
                    </ul>
                  )}
                  {(project.githubUrl || project.demoUrl) && (
                    <p className="mt-1 flex gap-3" style={{ fontSize: '9pt' }}>
                      {project.githubUrl && (
                        <a href={project.githubUrl} className="text-teal-700">GitHub</a>
                      )}
                      {project.demoUrl && (
                        <a href={project.demoUrl} className="text-teal-700">Demo</a>
                      )}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : null,
    languages: () =>
      data.hasLanguages ? (
        <section className={sectionClass}>
          <SectionHeading>Languages</SectionHeading>
          <p className="text-left text-slate-700">
            {data.languages
              .filter((language) => language.language.trim())
              .map((language) => `${language.language} (${language.proficiency})`)
              .join(', ')}
          </p>
        </section>
      ) : null,
  };

  return (
    <div className="text-left">
      {RESUME_SECTION_ORDER.map((section) => (
        <Fragment key={section}>{sections[section]()}</Fragment>
      ))}
    </div>
  );
}
