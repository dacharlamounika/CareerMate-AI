import type { ResumeContent } from '@/types';
import { TemplateHeader } from './TemplateHeader';
import { TemplateSections } from './TemplateSections';
import { prepareTemplateData } from './templateData';

interface Props {
  content: ResumeContent;
}

export function ModernTemplate({ content }: Props) {
  const data = prepareTemplateData(content);

  return (
    <article
      className="box-border w-full bg-white text-slate-900"
      style={{ padding: '18px 24px', fontFamily: '"Inter", "Segoe UI", Arial, sans-serif', fontSize: '10pt', lineHeight: 1.45 }}
    >
      <TemplateHeader data={data} variant="modern" />
      <TemplateSections content={content} variant="modern" />
    </article>
  );
}
