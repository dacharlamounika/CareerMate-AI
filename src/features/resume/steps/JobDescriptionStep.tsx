import { useState, useMemo } from 'react';
import {
  ClipboardList,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  X,
  Sparkles,
  Target,
} from 'lucide-react';
import type { StepProps } from './stepTypes';
import type { ResumeContent, JobDescriptionAnalysis, JdMatchResult } from '@/types';
import {
  analyzeJobDescription,
  compareResumeWithJD,
  improveSectionForJD,
} from '@/features/resume/utils/jdAnalysis';

const SAMPLE_JD = `Software Developer

We are seeking a Software Developer to join our engineering team.

Responsibilities:
- Develop and maintain web applications using Python, Flask, and MySQL
- Design and implement REST APIs for internal services
- Troubleshoot application issues and resolve incidents
- Collaborate with cross-functional teams to deliver features
- Write clean, tested, and well-documented code

Required Skills:
- Python programming
- SQL and database design
- REST API development
- Git version control
- Problem-solving and analytical skills

Preferred Skills:
- Experience with Docker
- Knowledge of AWS
- Familiarity with CI/CD pipelines

Qualifications:
- B.Tech in Computer Science or related field
- 2+ years of experience in software development`;

export function JobDescriptionStep({ content, updateContent }: StepProps) {
  const [jdText, setJdText] = useState(content.jobDescription || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JobDescriptionAnalysis | null>(
    content.jobDescriptionAnalysis
  );
  const [matchResult, setMatchResult] = useState<JdMatchResult | null>(
    content.jdMatchResult
  );
  const [improvementOpen, setImprovementOpen] = useState(false);

  const targetRole = content.targetRole === 'Other' ? content.customRole : content.targetRole;

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      const result = analyzeJobDescription(jdText);
      setAnalysis(result);
      const match = compareResumeWithJD(content, result);
      setMatchResult(match);
      updateContent({
        jobDescription: jdText,
        jobDescriptionAnalysis: result,
        jdMatchResult: match,
      });
      setAnalyzing(false);
    }, 800);
  };

  const handleClear = () => {
    setJdText('');
    setAnalysis(null);
    setMatchResult(null);
    updateContent({
      jobDescription: '',
      jobDescriptionAnalysis: null,
      jdMatchResult: null,
    });
  };

  const handleLoadSample = () => {
    setJdText(SAMPLE_JD);
  };

  const hasAnalysis = analysis && matchResult;

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-slate-900">Job Description Analyzer</h2>
      <p className="mt-2 text-sm text-slate-500">
        Paste a job description to see how your resume matches against it. This is an
        AI-based estimate — not a hiring prediction or guarantee.
      </p>

      {/* Target role display */}
      <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm ring-1 ring-slate-200">
        <span className="text-slate-500">Target Role from Resume Builder: </span>
        <span className="font-semibold text-slate-800">{targetRole || 'Not set'}</span>
      </div>

      {/* JD Input */}
      <div className="mt-6">
        <label className="label">Job Description</label>
        <textarea
          rows={8}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          className="input resize-none font-mono text-xs"
          placeholder="Paste the full job description here..."
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={handleAnalyze}
            disabled={!jdText.trim() || analyzing}
            className="btn-primary text-xs"
          >
            {analyzing ? <Loader2 size={14} className="animate-spin" /> : <Target size={14} />}
            Analyze Job Description
          </button>
          <button
            onClick={handleLoadSample}
            disabled={analyzing || !!jdText.trim()}
            className="btn-secondary text-xs"
          >
            Load Sample JD
          </button>
          {jdText.trim() && (
            <button
              onClick={handleClear}
              disabled={analyzing}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analyzing && (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
          <Loader2 size={16} className="animate-spin text-teal-600" />
          Analyzing job description and comparing with your resume...
        </div>
      )}

      {hasAnalysis && !analyzing && (
        <div className="mt-6 space-y-5 animate-fade-in">
          {/* Extracted JD Requirements */}
          <div className="card p-5">
            <h3 className="section-title flex items-center gap-2">
              <ClipboardList size={18} className="text-teal-600" />
              Extracted Job Requirements
            </h3>
            {analysis.jobTitle && (
              <p className="mt-3 text-sm">
                <span className="font-semibold text-slate-700">Job Title: </span>
                <span className="text-slate-600">{analysis.jobTitle}</span>
              </p>
            )}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {analysis.requiredSkills.length > 0 && (
                <RequirementGroup title="Required Skills" items={analysis.requiredSkills} color="teal" />
              )}
              {analysis.preferredSkills.length > 0 && (
                <RequirementGroup title="Preferred Skills" items={analysis.preferredSkills} color="blue" />
              )}
              {analysis.tools.length > 0 && (
                <RequirementGroup title="Tools / Technologies" items={analysis.tools} color="slate" />
              )}
              {analysis.softSkills.length > 0 && (
                <RequirementGroup title="Soft Skills" items={analysis.softSkills} color="purple" />
              )}
              {analysis.qualifications.length > 0 && (
                <RequirementGroup title="Qualifications" items={analysis.qualifications} color="amber" />
              )}
              {analysis.experienceRequirements.length > 0 && (
                <RequirementGroup title="Experience" items={analysis.experienceRequirements} color="amber" />
              )}
            </div>
            {analysis.responsibilities.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-slate-900">Key Responsibilities</h4>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {analysis.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Match Summary */}
          <div className="card p-5">
            <h3 className="section-title flex items-center gap-2">
              <TrendingUp size={18} className="text-teal-600" />
              Resume Match Summary
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              This is an AI-based estimate of how closely your resume content matches the JD.
              It is NOT a hiring prediction or guarantee of selection.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div
                className={`text-4xl font-bold ${
                  matchResult.matchPercentage >= 75
                    ? 'text-teal-600'
                    : matchResult.matchPercentage >= 50
                    ? 'text-amber-600'
                    : 'text-red-500'
                }`}
              >
                {matchResult.matchPercentage}%
              </div>
              <div className="flex-1">
                <div className="h-3 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      matchResult.matchPercentage >= 75
                        ? 'bg-teal-500'
                        : matchResult.matchPercentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${matchResult.matchPercentage}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">Estimated Match Score (0–100)</p>
              </div>
            </div>
          </div>

          {/* Matched / Missing / Partial */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Matched */}
            <div className="card p-4">
              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                <CheckCircle2 size={16} className="text-teal-600" />
                Matched ({matchResult.matched.length})
              </h4>
              {matchResult.matched.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {matchResult.matched.map((m, i) => (
                    <span
                      key={`${m.skill}-${i}`}
                      className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"
                      title={`Found in: ${m.resumeSource}`}
                    >
                      {m.skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-400">No matched skills.</p>
              )}
            </div>

            {/* Missing */}
            <div className="card p-4">
              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                <AlertCircle size={16} className="text-red-400" />
                Not Found ({matchResult.missing.length})
              </h4>
              {matchResult.missing.length > 0 ? (
                <div className="mt-3 space-y-1.5">
                  {matchResult.missing.map((m, i) => (
                    <div
                      key={`${m.skill}-${i}`}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-700">{m.skill}</span>
                      <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-600">
                        {m.jdCategory}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-400">No missing requirements.</p>
              )}
            </div>

            {/* Partial */}
            <div className="card p-4">
              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                <AlertCircle size={16} className="text-amber-500" />
                Partial Match ({matchResult.partial.length})
              </h4>
              {matchResult.partial.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {matchResult.partial.map((p, i) => (
                    <div key={i} className="text-xs">
                      <p className="text-slate-700">
                        <span className="font-medium">JD:</span> {p.jdItem}
                      </p>
                      <p className="text-slate-500">
                        <span className="font-medium">Resume:</span> {p.resumeItem}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-400">No partial matches.</p>
              )}
            </div>
          </div>

          {/* Responsibility Comparison */}
          {matchResult.responsibilityMatches.length > 0 && (
            <div className="card p-5">
              <h3 className="section-title flex items-center gap-2">
                <ClipboardList size={18} className="text-teal-600" />
                Responsibility Comparison
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                How your existing projects and experience relate to the JD responsibilities.
              </p>
              <div className="mt-4 space-y-3">
                {matchResult.responsibilityMatches.map((rm, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-3 text-sm ring-1 ring-slate-200">
                    <div className="flex items-start gap-2">
                      {rm.matchType === 'match' ? (
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal-600" />
                      ) : (
                        <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-500" />
                      )}
                      <div>
                        <p className="text-slate-700">
                          <span className="font-medium">JD responsibility: </span>
                          {rm.jdResponsibility}
                        </p>
                        <p className="mt-1 text-slate-600">
                          <span className="font-medium">
                            {rm.matchType === 'match' ? 'Your related experience: ' : 'Possibly related: '}
                          </span>
                          {rm.resumeItem}
                        </p>
                        <span
                          className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            rm.matchType === 'match'
                              ? 'bg-teal-50 text-teal-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {rm.matchType === 'match' ? 'Related match' : 'Partial match'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Suggestions */}
          {matchResult.suggestedKeywords.length > 0 && (
            <div className="card p-5">
              <h3 className="section-title flex items-center gap-2">
                <Lightbulb size={18} className="text-amber-500" />
                Keyword Suggestions from JD
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                These keywords appear in the JD but are not currently in your resume.
                Only add a keyword if it genuinely applies to your experience or skills —
                do NOT add keywords just to match the JD.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {matchResult.suggestedKeywords.map((k, i) => (
                  <span
                    key={`${k}-${i}`}
                    className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Improvement */}
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="section-title flex items-center gap-2">
                <Sparkles size={18} className="text-teal-600" />
                AI Improvement for This JD
              </h3>
              <button
                onClick={() => setImprovementOpen(!improvementOpen)}
                className="btn-secondary text-xs"
              >
                {improvementOpen ? 'Close' : 'Improve a Section'}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Select a resume section and improve its wording using your existing information
              and JD context. The AI will never create new experience — it only rephrases
              what you already have.
            </p>

            {improvementOpen && (
              <JdImprovementPanel
                content={content}
                jdKeywords={analysis.keywords}
                targetRole={targetRole}
                onApply={(sectionType, fieldId, newText) => {
                  applyImprovement(content, updateContent, sectionType, fieldId, newText);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function RequirementGroup({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: 'teal' | 'blue' | 'slate' | 'amber' | 'purple';
}) {
  const colorClasses: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-700',
    blue: 'bg-blue-50 text-blue-700',
    slate: 'bg-slate-100 text-slate-700',
    amber: 'bg-amber-50 text-amber-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${colorClasses[color]}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// --- AI Improvement Panel ---

type SectionType = 'introduction' | 'project' | 'experience' | 'achievement';

function JdImprovementPanel({
  content,
  jdKeywords,
  targetRole,
  onApply,
}: {
  content: ResumeContent;
  jdKeywords: string[];
  targetRole: string;
  onApply: (sectionType: SectionType, fieldId: string, newText: string) => void;
}) {
  const [selectedSection, setSelectedSection] = useState<SectionType | ''>('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [proposedText, setProposedText] = useState('');
  const [loading, setLoading] = useState(false);

  const sectionOptions: { value: SectionType; label: string; available: boolean }[] = [
    { value: 'introduction', label: 'Professional Summary', available: !!content.introduction },
    { value: 'project', label: 'Project Description', available: content.projects.length > 0 },
    { value: 'experience', label: 'Experience Description', available: content.experience.length > 0 },
    { value: 'achievement', label: 'Achievement Description', available: content.achievements.length > 0 },
  ];

  const handleSectionChange = (section: SectionType) => {
    setSelectedSection(section);
    setSelectedItemId('');
    setCurrentText('');
    setProposedText('');
  };

  const itemOptions = useMemo(() => {
    if (!selectedSection) return [];
    switch (selectedSection) {
      case 'introduction':
        return [{ id: 'intro', label: 'Professional Summary' }];
      case 'project':
        return content.projects
          .filter((p) => p.description || p.title)
          .map((p) => ({ id: p.id, label: p.title || 'Untitled Project' }));
      case 'experience':
        return content.experience
          .filter((e) => e.description || e.role || e.technology)
          .map((e) => ({ id: e.id, label: `${e.role || e.technology || 'Experience'}` }));
      case 'achievement':
        return content.achievements
          .filter((a) => a.description || a.title)
          .map((a) => ({ id: a.id, label: a.title || 'Untitled Achievement' }));
      default:
        return [];
    }
  }, [selectedSection, content]);

  const handleItemChange = (itemId: string) => {
    setSelectedItemId(itemId);
    setProposedText('');
    if (!selectedSection) return;
    switch (selectedSection) {
      case 'introduction':
        setCurrentText(content.introduction);
        break;
      case 'project': {
        const proj = content.projects.find((p) => p.id === itemId);
        setCurrentText(proj?.description || '');
        break;
      }
      case 'experience': {
        const exp = content.experience.find((e) => e.id === itemId);
        setCurrentText(exp?.description || '');
        break;
      }
      case 'achievement': {
        const ach = content.achievements.find((a) => a.id === itemId);
        setCurrentText(ach?.description || '');
        break;
      }
    }
  };

  const handleImprove = () => {
    if (!currentText.trim() || !selectedSection) return;
    setLoading(true);
    setTimeout(() => {
      const improved = improveSectionForJD(selectedSection, currentText, jdKeywords, targetRole);
      setProposedText(improved);
      setLoading(false);
    }, 600);
  };

  const handleUseResult = () => {
    if (proposedText && selectedSection && selectedItemId) {
      onApply(selectedSection, selectedItemId, proposedText);
      setProposedText('');
      setSelectedSection('');
      setSelectedItemId('');
      setCurrentText('');
    }
  };

  const handleCancel = () => {
    setProposedText('');
  };

  return (
    <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50/40 p-4 animate-fade-in">
      {/* Section selector */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Resume Section</label>
          <select
            value={selectedSection}
            onChange={(e) => handleSectionChange(e.target.value as SectionType)}
            className="input"
          >
            <option value="">Select section...</option>
            {sectionOptions.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={!opt.available}>
                {opt.label} {opt.available ? '' : '(empty)'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Item</label>
          <select
            value={selectedItemId}
            onChange={(e) => handleItemChange(e.target.value)}
            className="input"
            disabled={!selectedSection}
          >
            <option value="">Select item...</option>
            {itemOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current text */}
      {currentText && (
        <div className="mt-4">
          <label className="label">Current Text</label>
          <div className="rounded-lg bg-white p-3 text-sm text-slate-600 ring-1 ring-slate-200">
            {currentText}
          </div>
        </div>
      )}

      {/* Improve button */}
      {currentText && !proposedText && (
        <button
          onClick={handleImprove}
          disabled={loading || !currentText.trim()}
          className="btn-primary mt-4 text-xs"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          Improve for this JD
        </button>
      )}

      {loading && (
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 size={16} className="animate-spin text-teal-600" />
          Improving wording using your existing information and JD context...
        </div>
      )}

      {/* Proposed result */}
      {proposedText && !loading && (
        <div className="mt-4">
          <label className="label">Proposed Improvement</label>
          <textarea
            rows={4}
            value={proposedText}
            onChange={(e) => setProposedText(e.target.value)}
            className="input resize-none bg-white"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Review the proposed text. This only uses your existing information — no new
            experience is created. You can edit before applying.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleUseResult}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
            >
              <CheckCircle2 size={14} /> Use Result
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Apply improvement to resume content ---

function applyImprovement(
  content: ResumeContent,
  updateContent: (patch: Partial<ResumeContent>) => void,
  sectionType: SectionType,
  fieldId: string,
  newText: string
) {
  switch (sectionType) {
    case 'introduction':
      updateContent({ introduction: newText });
      break;
    case 'project':
      updateContent({
        projects: content.projects.map((p) =>
          p.id === fieldId ? { ...p, description: newText } : p
        ),
      });
      break;
    case 'experience':
      updateContent({
        experience: content.experience.map((e) =>
          e.id === fieldId ? { ...e, description: newText } : e
        ),
      });
      break;
    case 'achievement':
      updateContent({
        achievements: content.achievements.map((a) =>
          a.id === fieldId ? { ...a, description: newText } : a
        ),
      });
      break;
  }
}
