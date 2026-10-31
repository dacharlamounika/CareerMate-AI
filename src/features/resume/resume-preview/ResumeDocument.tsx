import type { ResumeContent } from '@/types';
import { ResumeTemplateRenderer } from './templates/ResumeTemplateRenderer';

interface Props {
  content: ResumeContent;
}

export function ResumeDocument({ content }: Props) {
  return <ResumeTemplateRenderer content={content} />;
}