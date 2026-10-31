import { useState, useEffect } from 'react';
import { Edit3, AlertTriangle, CheckCircle2, Loader2, FileSearch } from 'lucide-react';
import type { StepProps } from './stepTypes';
import {
  validateResumeInformation,
  detectBuzzwords,
  detectRepetitiveVerbs,
} from '@/features/resume/utils/analysis';

interface ReviewStepProps extends StepProps {}

export function ReviewStep({ content }: ReviewStepProps) {
  const [validationRun, setValidationRun] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setValidationRun(false);
  }, [content]);

  const handleValidate = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setValidationRun(true);
    }, 800);
  };

  const issues = validationRun ? validateResumeInformation(content) : [];
  const buzzwords = validationRun ? detectBuzzwords(content) : [];
  const repetitiveVerbs = validationRun ? detectRepetitiveVerbs(content) : [];
  const hasIssues = issues.length > 0 || buzzwords.length > 0 || repetitiveVerbs.length > 0;

  const sections = [
    {
      label: 'Profile',
      hasContent: !!content.profile.fullName,
      preview: [
        content.profile.fullName,
        content.targetRole === 'Other' ? content.customRole : content.targetRole,
        [content.profile.district, content.profile.state].filter(Boolean).join(', '),
      ].filter(Boolean).join(' · '),
    },
    {
      label: 'Professional Summary',
      hasContent: !!content.introduction,
      preview: content.introduction,
    },
    {
      label: 'Education',
      hasContent: content.education.length > 0,
      preview: content.education.map((e) => `${e.degree === 'Other' && e.customDegree ? e.customDegree : e.degree} — ${e.institution === 'Other' && e.customInstitution ? e.customInstitution : e.institution}`).join('; '),
    },
    {
      label: 'Achievements',
      hasContent: content.achievements.length > 0,
      preview: content.achievements.map((a) => a.title).join('; '),
    },
    {
      label: 'Certifications',
      hasContent: content.certifications.length > 0,
      preview: content.certifications.map((c) => c.name).join('; '),
    },
    {
      label: 'Projects Done',
      hasContent: content.projects.length > 0,
      preview: content.projects.map((p) => p.title).join('; '),
    },
    {
      label: 'Internship',
      hasContent: content.experience.length > 0,
      preview: content.experience.map((e) => `${e.technology} (${e.context})`).join('; '),
    },
    {
      label: 'Hands-on Experience',
      hasContent: content.interests.length > 0,
      preview: content.interests.map((i) => i.name).join(', '),
    },
    {
      label: 'Languages',
      hasContent: content.languages.length > 0,
      preview: content.languages.map((l) => `${l.language} (${l.proficiency})`).join(', '),
    },
    {
      label: 'Contact',
      hasContent: !!content.contact.mobile || !!content.contact.email || !!content.contact.fullAddress,
      preview: [content.contact.mobile, content.contact.email, content.contact.fullAddress].filter(Boolean).join(' · '),
    },
    {
      label: 'References',
      hasContent: content.skipReferences || content.references.length > 0,
      preview: content.skipReferences
        ? 'Skipped'
        : content.references.map((r) => r.name).join('; ') || 'Empty',
    },
  ];

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-slate-900">Review Your Resume</h2>
      <p className="mt-2 text-sm text-slate-500">
        Review each section before generating your resume. You can go back to edit any section.
      </p>

      <div className="mt-6 space-y-3">
        {sections.map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {s.hasContent ? (
                  <CheckCircle2 size={16} className="text-teal-600" />
                ) : (
                  <AlertTriangle size={16} className="text-amber-400" />
                )}
                <h3 className="text-sm font-semibold text-slate-900">{s.label}</h3>
              </div>
              {/* Edit is handled by going back to the step; this is visual cue */}
            </div>
            {s.preview && (
              <p className="mt-2 text-sm text-slate-600">{s.preview}</p>
            )}
            {!s.hasContent && (
              <p className="mt-1 text-xs text-amber-500">This section is empty.</p>
            )}
          </div>
        ))}
      </div>

      {/* AI Validation */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="section-title flex items-center gap-2">
            <FileSearch size={18} className="text-teal-600" />
            AI Validation
          </h3>
          <button onClick={handleValidate} disabled={running} className="btn-primary text-xs">
            {running ? <Loader2 size={14} className="animate-spin" /> : <FileSearch size={14} />}
            {validationRun ? 'Re-run Validation' : 'Run Validation'}
          </button>
        </div>

        {!validationRun && !running && (
          <p className="mt-3 text-sm text-slate-500">
            Run a validation check to detect missing information, duplicates, generic statements,
            and buzzwords before generating your resume.
          </p>
        )}

        {running && (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <Loader2 size={16} className="animate-spin" /> Analyzing your resume...
          </div>
        )}

        {validationRun && (
          <div className="mt-4 space-y-3 animate-fade-in">
            {issues.length === 0 && buzzwords.length === 0 && repetitiveVerbs.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-4 text-sm text-teal-700 ring-1 ring-teal-200">
                <CheckCircle2 size={18} /> No issues detected. Your resume looks good.
              </div>
            ) : (
              <>
                {issues.map((issue, i) => (
                  <div key={`issue-${i}`} className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">
                    <AlertTriangle size={14} className="mr-1.5 inline" />
                    {issue.message}
                  </div>
                ))}

                {buzzwords.map((bw, i) => (
                  <div key={`bw-${i}`} className="rounded-lg bg-slate-50 p-3 text-sm ring-1 ring-slate-200">
                    <p className="font-medium text-slate-800">Buzzword: "{bw.phrase}"</p>
                    <p className="mt-1 text-slate-600">{bw.reason}</p>
                    <p className="mt-1.5 text-slate-700"><strong>Suggestion:</strong> {bw.suggestion}</p>
                  </div>
                ))}

                {repetitiveVerbs.map((rv, i) => (
                  <div key={`rv-${i}`} className="rounded-lg bg-slate-50 p-3 text-sm ring-1 ring-slate-200">
                    <p className="font-medium text-slate-800">
                      Repetitive verb: "{rv.verb}" used {rv.count} times
                    </p>
                    <p className="mt-1 text-slate-600">
                      Consider alternatives: {rv.alternatives.join(', ')} — but only if they
                      accurately represent your work.
                    </p>
                  </div>
                ))}

            {hasIssues && (
                  <p className="text-xs text-slate-400 mt-2">
                    These are suggestions, not accusations. Please verify the information.
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
