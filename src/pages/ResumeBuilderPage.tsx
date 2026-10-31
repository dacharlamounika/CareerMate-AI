import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Loader2, ArrowRight, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserResumes, createResume } from '@/services/resumeService';
import type { Resume } from '@/types';

export function ResumeBuilderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const data = await fetchUserResumes(user.id);
      setResumes(data);
      setLoading(false);
    };
    load();
  }, [user]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const r = await createResume('IT', '');
      navigate(`/resume-builder/${r.id}`);
    } catch {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Resume Builder</h1>
            <p className="mt-1 text-slate-500">Create and manage your ATS-friendly resumes.</p>
          </div>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            New Resume
          </Button>
        </div>

        {/* Feature explanation */}
        <div className="mb-6 card p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Build an evidence-based resume</h2>
              <p className="mt-1 text-sm text-slate-600">
                CareerMate AI helps you create a professional, ATS-friendly resume from your real
                skills, projects, and achievements. The AI improves wording and presentation —
                it never fabricates information.
              </p>
            </div>
          </div>
        </div>

        {/* Resume list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-teal-600" size={28} />
          </div>
        ) : resumes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <FileText className="mx-auto text-slate-300" size={40} />
            <h3 className="mt-4 font-semibold text-slate-900">No resumes yet</h3>
            <p className="mt-1 text-sm text-slate-500">Create your first resume to get started.</p>
            <Button onClick={handleCreate} disabled={creating} className="mt-5">
              {creating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              Build My Resume
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((r) => (
              <button
                key={r.id}
                onClick={() => navigate(`/resume-builder/${r.id}`)}
                className="card group p-5 text-left transition-all hover:border-teal-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-700 group-hover:text-white">
                    <FileText size={20} />
                  </div>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    r.status === 'published' ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900">{r.title}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {r.career_type} · {r.target_role || 'No target role'}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {new Date(r.updated_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 text-teal-600 group-hover:gap-2 transition-all">
                    Continue <ArrowRight size={12} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
