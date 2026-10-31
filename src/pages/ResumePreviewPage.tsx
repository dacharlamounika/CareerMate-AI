import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Edit3, Loader2, FileSearch, RefreshCw, Printer } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/Button';
import { fetchResume } from '@/services/resumeService';
import { useAuth } from '@/hooks/useAuth';
import { ResumeDocument } from '@/features/resume/resume-preview/ResumeDocument';
import { AtsAnalysisPanel } from '@/features/resume/resume-analysis/AtsAnalysisPanel';
import { analyzeATS, generateProfessionalSummary } from '@/features/resume/utils/analysis';
import { saveAtsAnalysis, saveResumeContent } from '@/services/resumeService';
import type { Resume, ResumeContent } from '@/types';
import { emptyResumeContent, normalizeResumeContent } from '@/types';

export function ResumePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [content, setContent] = useState<ResumeContent>(emptyResumeContent);
  const [loading, setLoading] = useState(true);
  const [atsOpen, setAtsOpen] = useState(false);
  const [atsRunning, setAtsRunning] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const r = await fetchResume(id);
      if (!r) {
        navigate('/dashboard');
        return;
      }
      if (user && r.user_id !== user.id) {
        navigate('/dashboard');
        return;
      }
      setResume(r);
      setContent(normalizeResumeContent(r.content as Partial<ResumeContent>));
      setLoading(false);
    };
    load();
  }, [id, navigate, user]);

  const handleDownloadPDF = () => {
  window.print();
};

  const handleRunAts = async () => {
    if (!resume) return;
    setAtsRunning(true);
    setTimeout(async () => {
      const { score, result } = analyzeATS(content);
      try {
        await saveAtsAnalysis(resume.id, score, result as unknown as Record<string, unknown>);
      } catch {
        // non-critical
      }
      setAtsRunning(false);
      setAtsOpen(true);
    }, 800);
  };

  const handleRegenerateIntro = async () => {
    if (!resume) return;
    const summary = generateProfessionalSummary(content);
    const newContent = { ...content, introduction: summary };
    setContent(newContent);
    await saveResumeContent(resume.id, newContent, 4, resume.status);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-teal-600" size={28} />
        </div>
      </DashboardLayout>
    );
  }

  if (!resume) return null;

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{resume.title}</h1>
              <p className="text-sm text-slate-500">Resume Preview</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={() => navigate(`/resume-builder/${resume.id}`)}>
              <Edit3 size={16} /> Edit
            </Button>
            <Button variant="secondary" onClick={handleRegenerateIntro}>
              <RefreshCw size={16} /> Regenerate Summary
            </Button>
            <Button variant="secondary" onClick={handleRunAts} disabled={atsRunning}>
              {atsRunning ? <Loader2 size={16} className="animate-spin" /> : <FileSearch size={16} />}
              ATS Analysis
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download size={16} /> Download PDF
            </Button>
          </div>
        </div>

        {/* ATS Panel */}
        {atsOpen && (
          <div className="mb-6 print:hidden">
            <AtsAnalysisPanel content={content} onClose={() => setAtsOpen(false)} />
          </div>
        )}

        {/* Resume document */}
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-slate-400 print:hidden">
            <Printer size={16} /> Use "Download PDF" to save as a print-ready PDF
          </div>
          <div ref={printRef} data-print-root className="mx-auto shadow-lg print:shadow-none">
            <ResumeDocument content={content} />
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
  @media print {
    @page {
      size: A4;
      margin: 12mm;
    }

    html,
    body {
      background: white !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Hide the preview page controls */
    .print\\:hidden {
      display: none !important;
    }

    /* Make the resume itself the printable area */
    [data-print-root] {
      display: block !important;
      position: static !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
      box-shadow: none !important;
      background: white !important;
    }

    /* Hide common dashboard navigation elements */
    nav,
    aside,
    header {
      display: none !important;
    }

    /* Prevent dashboard layout spacing from affecting the resume */
    main {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      max-width: none !important;
    }
  }
`}</style>
    </DashboardLayout>
  );
}
