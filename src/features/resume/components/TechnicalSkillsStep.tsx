import { useState } from 'react';
import type { ResumeContent } from '@/types';

interface TechnicalSkillsStepProps {
  content: ResumeContent;
  updateContent: (updates: Partial<ResumeContent>) => void;
}

export function TechnicalSkillsStep({
  content,
  updateContent,
}: TechnicalSkillsStepProps) {
  const [skillInput, setSkillInput] = useState('');

  const skills = content.technicalSkills ?? [];

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (
      !skills.some(
        (existingSkill) =>
          existingSkill.toLowerCase() === skill.toLowerCase()
      )
    ) {
      updateContent({
        technicalSkills: [...skills, skill],
      });
    }

    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    updateContent({
      technicalSkills: skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">
          Technical Skills / Industry Ready
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Add the technical skills you genuinely have. These skills will be
          used in your resume and ATS analysis.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={skillInput}
          onChange={(event) => setSkillInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Python, SQL, React"
          className="flex-1 rounded-md border px-4 py-2"
        />

        <button
          type="button"
          onClick={addSkill}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Add
        </button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-2 rounded-full border bg-muted px-3 py-1.5 text-sm"
            >
              <span>{skill}</span>

              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="font-semibold hover:text-destructive"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {skills.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No technical skills added yet.
        </p>
      )}
    </div>
  );
}