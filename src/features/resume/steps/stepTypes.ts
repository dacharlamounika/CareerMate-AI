import type { ResumeContent } from '@/types';

export interface StepProps {
  content: ResumeContent;
  updateContent: (patch: Partial<ResumeContent>) => void;
  goToStep?: (stepId: string) => void;
}
