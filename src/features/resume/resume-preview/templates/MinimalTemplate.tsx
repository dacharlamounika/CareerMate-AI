import type { ResumeContent } from '@/types';
import { TemplateHeader } from './TemplateHeader';
import { TemplateSections } from './TemplateSections';
import { prepareTemplateData } from './templateData';

interface Props {
  content: ResumeContent;
}

export function MinimalTemplate({ content }: Props) {
  const data = prepareTemplateData(content);

  return (
    <article
      className="box-border w-full bg-white text-slate-900"
      style={{ padding: '22px 24px', fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif', fontSize: '9.5pt', lineHeight: 1.5 }}
    >
      <TemplateHeader data={data} variant="minimal" />
      <TemplateSections content={content} variant="minimal" />
    </article>
  );
}
