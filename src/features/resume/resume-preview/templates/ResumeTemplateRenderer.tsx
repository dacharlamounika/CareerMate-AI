import type { ResumeContent, ResumeTemplate } from '@/types';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { TechnicalTemplate } from './TechnicalTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';

interface Props {
  content: ResumeContent;
}

export function ResumeTemplateRenderer({ content }: Props) {
  const template: ResumeTemplate = content.template ?? 'professional';

  switch (template) {
    case 'modern':
      return <ModernTemplate content={content} />;
    case 'minimal':
      return <MinimalTemplate content={content} />;
    case 'technical':
      return <TechnicalTemplate content={content} />;
    case 'executive':
      return <ExecutiveTemplate content={content} />;
    default:
      return <ProfessionalTemplate content={content} />;
  }
}
