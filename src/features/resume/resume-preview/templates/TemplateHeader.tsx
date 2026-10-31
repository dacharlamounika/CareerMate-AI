import type { TemplateData } from './templateData';

type TemplateVariant = 'professional' | 'modern' | 'minimal' | 'technical' | 'executive';

interface Props {
  data: TemplateData;
  variant: TemplateVariant;
}

const headerStyles: Record<TemplateVariant, React.CSSProperties> = {
  professional: {
    borderBottom: '2px solid #1e293b',
    paddingBottom: '10px',
    marginBottom: '12px',
  },
  modern: {
    borderBottom: '3px solid #0d9488',
    paddingBottom: '12px',
    marginBottom: '12px',
  },
  minimal: {
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '12px',
    marginBottom: '14px',
  },
  technical: {
    borderBottom: '1px dashed #94a3b8',
    paddingBottom: '10px',
    marginBottom: '12px',
  },
  executive: {
    borderBottom: '4px double #1e293b',
    paddingBottom: '12px',
    marginBottom: '14px',
  },
};

const nameStyles: Record<TemplateVariant, React.CSSProperties> = {
  professional: { fontSize: '18pt', letterSpacing: '1px', fontWeight: 700 },
  modern: { fontSize: '20pt', fontWeight: 800 },
  minimal: { fontSize: '22pt', fontWeight: 300, letterSpacing: '0.5px' },
  technical: { fontSize: '17pt', letterSpacing: '1px', fontWeight: 700 },
  executive: { fontSize: '20pt', letterSpacing: '2px', fontWeight: 700 },
};

export function TemplateHeader({ data, variant }: Props) {
  return (
    <div
      className={data.photoUrl ? 'grid grid-cols-[minmax(0,3fr)_minmax(76px,1fr)] items-center gap-4 sm:gap-5' : ''}
      style={headerStyles[variant]}
    >
      <div className="min-w-0 text-left">
        <h1 className="break-words leading-tight text-slate-900" style={nameStyles[variant]}>
          {variant === 'professional' || variant === 'technical' || variant === 'executive'
            ? data.fullName.toUpperCase()
            : data.fullName}
        </h1>
        {data.targetRole && (
          <p className="mt-1 font-medium text-slate-600" style={{ fontSize: '10.5pt' }}>
            {data.targetRole}
          </p>
        )}
        {data.contactParts.length > 0 && (
          <div
            className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-slate-600"
            style={{ fontSize: '8.5pt', lineHeight: 1.35 }}
          >
            {data.contactParts.map((part, index) => (
              <span key={`${index}-${part}`} className="min-w-0 break-words [overflow-wrap:anywhere]">
                {part}
                {index < data.contactParts.length - 1 && (
                  <span className="ml-2 text-slate-400">|</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
      {data.photoUrl && (
        <img
          src={data.photoUrl}
          alt={`${data.fullName} profile`}
          className="justify-self-end rounded-full border border-slate-200 object-cover"
          style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
}
