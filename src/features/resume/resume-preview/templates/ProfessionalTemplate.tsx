import type { ResumeContent } from '@/types';
import { TemplateHeader } from './TemplateHeader';
import { TemplateSections } from './TemplateSections';
import { prepareTemplateData } from './templateData';

interface Props {
  content: ResumeContent;
}

export function ProfessionalTemplate({ content }: Props) {
  const data = prepareTemplateData(content);

  return (
    <article
      className="box-border w-full bg-white text-slate-900"
      style={{ padding: '18px 24px', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '10pt', lineHeight: 1.45 }}
    >
      <TemplateHeader data={data} variant="professional" />
      <TemplateSections content={content} variant="professional" />
    </article>
  );
}
