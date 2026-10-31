import type { ResumeContent } from '@/types';
import { TemplateHeader } from './TemplateHeader';
import { TemplateSections } from './TemplateSections';
import { prepareTemplateData } from './templateData';

interface Props {
  content: ResumeContent;
}

export function TechnicalTemplate({ content }: Props) {
  const data = prepareTemplateData(content);

  return (
    <article
      className="box-border w-full bg-white text-slate-900"
      style={{ padding: '16px 24px', fontFamily: '"Courier New", "Consolas", monospace', fontSize: '9.5pt', lineHeight: 1.45 }}
    >
      <TemplateHeader data={data} variant="technical" />
      <TemplateSections content={content} variant="technical" />
    </article>
  );
}
