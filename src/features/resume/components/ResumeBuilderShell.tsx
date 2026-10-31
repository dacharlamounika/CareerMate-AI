import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Loader2, CheckCircle2, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/Button';
import { fetchResume, saveResumeContent, deleteResume } from '@/services/resumeService';
import { useAuth } from '@/hooks/useAuth';
import type { ResumeContent, Resume } from '@/types';
import { emptyResumeContent, normalizeResumeContent } from '@/types';
import { TruthStep } from '@/features/resume/steps/TruthStep';
import { CareerTypeStep } from '@/features/resume/steps/CareerTypeStep';
import { TargetRoleStep } from '@/features/resume/steps/TargetRoleStep';
import { ProfileStep } from '@/features/resume/steps/ProfileStep';
import { IntroductionStep } from '@/features/resume/steps/IntroductionStep';
import { TechnicalSkillsStep } from '@/features/resume/components/TechnicalSkillsStep';
import { EducationStep } from '@/features/resume/steps/EducationStep';
import { AchievementsStep } from '@/features/resume/steps/AchievementsStep';
import { CertificationsStep } from '@/features/resume/steps/CertificationsStep';
import { ProjectsStep } from '@/features/resume/steps/ProjectsStep';
import { ExperienceStep } from '@/features/resume/steps/ExperienceStep';
import { InterestsStep } from '@/features/resume/steps/InterestsStep';
import { LanguagesStep } from '@/features/resume/steps/LanguagesStep';
import { ContactStep } from '@/features/resume/steps/ContactStep';
import { ReferencesStep } from '@/features/resume/steps/ReferencesStep';
import { ReviewStep } from '@/features/resume/steps/ReviewStep';
import { TemplateSelector } from '@/features/resume/resume-preview/TemplateSelector';

const STEPS = [
  { id: 'truth', label: 'Truth & Accuracy' },
  { id: 'careerType', label: 'Career Type' },
  { id: 'targetRole', label: 'Target Role' },
  { id: 'profile', label: 'Profile' },
  { id: 'introduction', label: 'Professional Summary' },
  { id: 'technicalSkills', label: 'Technical Skills / Industry Ready' },
  { id: 'education', label: 'Education' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'projects', label: 'Projects Done' },
  { id: 'experience', label: 'Internship' },
  { id: 'interests', label: 'Hands-on Experience' },
  { id: 'languages', label: 'Languages' },
  { id: 'contact', label: 'Contact' },
  { id: 'references', label: 'References' },
  { id: 'review', label: 'Review' },
 
];

interface Props {
  resumeId: string;
}

export function ResumeBuilderShell({ resumeId }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [content, setContent] = useState<ResumeContent>(emptyResumeContent);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const r = await fetchResume(resumeId);
      if (!r) {
        navigate('/resume-builder');
        return;
      }
      setResume(r);
      setContent(normalizeResumeContent(r.content as Partial<ResumeContent>));
      setStep(r.current_step || 0);
      setLoading(false);
    };
    load();
  }, [resumeId, navigate]);

  const updateContent = useCallback((patch: Partial<ResumeContent>) => {
    setContent((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSaveDraft = async () => {
    if (!resume) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      await saveResumeContent(resume.id, content, step, 'draft');
      setSaveMsg('Draft saved');
      setTimeout(() => setSaveMsg(null), 2500);
    } catch {
      setSaveMsg('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!resume) return;
    setSaving(true);
    try {
      await saveResumeContent(resume.id, content, step, 'published');
      navigate(`/resume-preview/${resume.id}`);
    } catch {
      setSaveMsg('Failed to publish. Please try again.');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!resume) return;
    if (!confirm('Delete this resume? This cannot be undone.')) return;
    await deleteResume(resume.id);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-teal-600" size={28} />
        </div>
      </DashboardLayout>
    );
  }

  if (!user || (resume && resume.user_id !== user.id)) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-slate-500">You do not have access to this resume.</div>
      </DashboardLayout>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  const canProceed = (() => {
    switch (STEPS[step].id) {
      case 'truth':
        return content.truthAcknowledged;
      case 'careerType':
        return !!content.careerType;
      case 'targetRole':
        return !!(content.targetRole && (content.targetRole !== 'Other' || content.customRole));
      case 'profile':
        return !!content.profile.fullName;
      default:
        return true;
    }
  })();

  const stepProps = { content, updateContent, goToStep: (stepId: string) => {
    const idx = STEPS.findIndex((s) => s.id === stepId);
    if (idx >= 0) setStep(idx);
  } };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {resume?.title || 'Resume Builder'}
            </h1>
            <p className="text-sm text-slate-500">Step {step + 1} of {STEPS.length} · {STEPS[step].label}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-teal-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="card p-6 sm:p-8 animate-fade-in" key={step}>
        {STEPS[step].id === 'truth' && <TruthStep {...stepProps} />}
        {STEPS[step].id === 'careerType' && <CareerTypeStep {...stepProps} />}
        {STEPS[step].id === 'targetRole' && <TargetRoleStep {...stepProps} />}
        {STEPS[step].id === 'profile' && <ProfileStep {...stepProps} />}
        {STEPS[step].id === 'introduction' && <IntroductionStep {...stepProps} />}
{STEPS[step].id === 'technicalSkills' && <TechnicalSkillsStep {...stepProps} />}
{STEPS[step].id === 'education' && <EducationStep {...stepProps} />}
        {STEPS[step].id === 'achievements' && <AchievementsStep {...stepProps} />}
        {STEPS[step].id === 'certifications' && <CertificationsStep {...stepProps} />}
        {STEPS[step].id === 'projects' && <ProjectsStep {...stepProps} />}
        {STEPS[step].id === 'experience' && <ExperienceStep {...stepProps} />}
        {STEPS[step].id === 'interests' && <InterestsStep {...stepProps} />}
        {STEPS[step].id === 'languages' && <LanguagesStep {...stepProps} />}
        {STEPS[step].id === 'contact' && <ContactStep {...stepProps} />}
       {STEPS[step].id === 'references' && <ReferencesStep {...stepProps} />}
{STEPS[step].id === 'review' && (
  <div className="space-y-8">
    <ReviewStep {...stepProps} />

    <div className="border-t border-slate-200 pt-8">
      <TemplateSelector
        selected={content.template}
        onSelect={(template) => updateContent({ template })}
      />
    </div>
  </div>
)}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft size={16} /> Back
          </Button>
          {saveMsg && (
            <span className="text-sm text-teal-600 flex items-center gap-1">
              <CheckCircle2 size={14} /> {saveMsg}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleSaveDraft} disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Draft
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={!canProceed}>
              Continue <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handlePublish} disabled={saving}>
              <FileText size={16} /> Generate Resume
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
