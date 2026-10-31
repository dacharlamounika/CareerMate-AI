import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Compass,
  Briefcase,
  Target,
  Brain,
  Code2,
  MessageSquare,
  GraduationCap,
  Plus,
  FileEdit,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/DashboardLayout';
import { supabase } from '@/lib/supabaseClient';
import type { Resume } from '@/types';

const moduleCards = [
  { label: 'Resume Builder', icon: FileText, desc: 'Create ATS-friendly resumes', active: true, path: '/resume-builder' },
  { label: 'Career Recommendations', icon: Compass, desc: 'Find suitable career paths', active: true, path: '/career-recommendation' },

  {
  label: 'Live Jobs',
  icon: Briefcase,
  desc: 'Browse job listings',
  active: true,
  path: '/jobs'
},


  {
  label: 'Skill Gap Analysis',
  icon: Target,
  desc: 'Compare skills vs target role',
  active: true,
  path: '/skill-gap',
},
 { label: 'Learning Roadmap', icon: GraduationCap, desc: 'Personalized learning plan', active: true, path: '/learning-roadmap' },
  { label: 'Aptitude', icon: Brain, desc: 'Practice reasoning questions', active: true,  path: '/aptitude-assessment', },
 {
  label: 'Coding Assessment',
  icon: Code2,
  desc: 'Practice coding problems',
  active: true,
  path: '/coding-assessment',
},
{ label: 'AI Mock Interview', icon: MessageSquare, desc: 'Simulate real interviews', active: true, path: '/mock-interview' },     

  
 
];

export function DashboardPage() {
  const { user, profile } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResumes = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      setResumes((data ?? []) as Resume[]);
      setLoading(false);
    };
    loadResumes();
  }, [user]);

  const latestResume = resumes[0];
  const draftCount = resumes.filter((r) => r.status === 'draft').length;
  const publishedCount = resumes.filter((r) => r.status === 'published').length;

  const completion = profile?.completion_pct ?? 0;

  const firstName = (profile?.full_name || user?.email || 'there').split(' ')[0];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-slate-500">
            Here's an overview of your career readiness progress.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Profile Completion</p>
              <TrendingUp size={18} className="text-teal-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{completion}%</p>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-teal-600 transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Resumes</p>
              <FileText size={18} className="text-teal-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{resumes.length}</p>
            <p className="mt-1 text-xs text-slate-400">{publishedCount} published · {draftCount} draft</p>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Target Career</p>
              <Briefcase size={18} className="text-teal-600" />
            </div>
            <p className="mt-2 text-lg font-bold text-slate-900">
              {profile?.career_type || 'IT'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {profile?.target_role || 'Not set yet'}
            </p>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Recent Activity</p>
              <Clock size={18} className="text-teal-600" />
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {latestResume ? latestResume.title : 'No resumes yet'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {latestResume
                ? `${latestResume.status} · ${new Date(latestResume.updated_at).toLocaleDateString()}`
                : 'Start by building one'}
            </p>
          </div>
        </div>

        {/* Recent resume + Quick action */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="section-title">Recent Resume</h2>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-slate-400">Loading...</div>
            ) : latestResume ? (
              <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{latestResume.title}</p>
                    <p className="text-sm text-slate-500">
                      {latestResume.career_type} · {latestResume.target_role || 'No target role'}
                    </p>
                  </div>
                </div>
                <Link to={`/resume-builder/${latestResume.id}`} className="btn-secondary text-xs">
                  <FileEdit size={14} /> Continue
                </Link>
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-8 text-center">
                <FileText className="mx-auto text-slate-300" size={36} />
                <p className="mt-3 text-sm text-slate-500">No resumes yet. Create your first one.</p>
                <Link to="/resume-builder" className="btn-primary mt-4 text-xs">
                  <Plus size={14} /> New Resume
                </Link>
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="section-title">Career Readiness</h2>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Resume Built', done: resumes.length > 0 },
                { label: 'Target Role Set', done: !!profile?.target_role },
                { label: 'Profile Complete', done: completion >= 80 },
                { label: 'ATS Analysis', done: false },
                { label: 'Mock Interview', done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div
                    className={`h-5 w-5 rounded-full border-2 ${
                      item.done
                        ? 'border-teal-600 bg-teal-600'
                        : 'border-slate-300 bg-white'
                    } flex items-center justify-center`}
                  >
                    {item.done && (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6L5 8.5L9.5 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm ${item.done ? 'text-slate-900' : 'text-slate-400'}`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Module cards */}
        <div className="mt-10">
          <h2 className="section-title mb-4">Career Modules</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {moduleCards.map((m) => {
              const content = (
                <div
                  className={`card group h-full p-5 transition-all ${
                    m.active ? 'hover:border-teal-300 hover:shadow-md' : 'opacity-70'
                  }`}
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${
                      m.active
                        ? 'bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white'
                        : 'bg-slate-100 text-slate-400'
                    } transition-colors`}
                  >
                    <m.icon size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{m.label}</h3>
                  <p className="mt-1 text-xs text-slate-500">{m.desc}</p>
                  {!m.active && (
                    <span className="mt-3 inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-400">
                      Coming Soon
                    </span>
                  )}
                </div>
              );
              return m.active && m.path ? (
                <Link key={m.label} to={m.path}>
                  {content}
                </Link>
              ) : (
                <div key={m.label}>{content}</div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
