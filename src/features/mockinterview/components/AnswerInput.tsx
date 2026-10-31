import { useEffect, useRef } from 'react';

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function AnswerInput({
  value,
  onChange,
  disabled = false,
  placeholder = 'Type your answer here...',
}: AnswerInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${Math.max(ref.current.scrollHeight, 180)}px`;
    }
  }, [value]);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition disabled:bg-slate-50 disabled:text-slate-500"
        rows={7}
      />
      <div className="mt-1.5 flex items-center justify-end">
        <span className={`text-xs ${wordCount < 30 ? 'text-slate-400' : 'text-slate-500'}`}>
          {wordCount} word{wordCount === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  );
}
