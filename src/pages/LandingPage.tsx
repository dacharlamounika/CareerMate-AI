import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Compass,
  Target,
  Code2,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';

const features = [
  {
    icon: FileText,
    title: 'Build an evidence-based resume',
    desc: 'Create a professional, ATS-friendly resume from your real skills, projects, and achievements — no filler, no exaggeration.',
  },
  {
    icon: Compass,
    title: 'Discover suitable career paths',
    desc: 'Get guidance on career directions that align with your education, skills, and interests.',
  },
  {
    icon: Target,
    title: 'Identify skill gaps',
    desc: 'See exactly which skills you need for your target role and where you stand today.',
  },
  {
    icon: Code2,
    title: 'Prepare for job-specific assessments',
    desc: 'Practice coding challenges and aptitude tests tailored to the roles you are applying for.',
  },
  {
    icon: MessageSquare,
    title: 'Practice AI mock interviews',
    desc: 'Simulate real interviews for your target role and get feedback on your answers.',
  },
  {
    icon: TrendingUp,
    title: 'Track career readiness',
    desc: 'Monitor your progress across resume, skills, assessments, and interviews in one dashboard.',
  },
];

const stats = [
  { label: 'Resume Sections', value: '11' },
  { label: 'Career Modules', value: '8' },
  { label: 'ATS Score', value: '0–100' },
  { label: 'Your Data', value: 'Private' },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button onClick={() => navigate('/signup')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-50 via-white to-white" />
        <div
          className="absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-40 -left-20 -z-10 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl"
          aria-hidden
        />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700 ring-1 ring-teal-200">
              <Sparkles size={15} />
              AI-powered career companion
            </div>
            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-6xl">
              CareerMate <span className="text-teal-700">AI</span>
            </h1>
            <p className="mt-4 text-xl font-semibold text-slate-700 sm:text-2xl">
              Your Career. Your Skills. Your Path.
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
              An AI-powered career companion that helps students build stronger resumes,
              identify skill gaps, prepare for jobs, and become career-ready.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button onClick={() => navigate('/signup')} className="px-7 py-3 text-base">
                Build My Resume
                <ArrowRight size={18} />
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/signup')}
                className="px-7 py-3 text-base"
              >
                Explore Career Paths
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="card p-5 text-center">
                <div className="text-2xl font-bold text-teal-700">{s.value}</div>
                <div className="mt-1 text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Everything you need to become career-ready
          </h2>
          <p className="mt-4 text-slate-600">
            CareerMate AI guides you through every stage — from building your first resume
            to practicing interviews — all in one place.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card group p-6 transition-all hover:shadow-md animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-700 group-hover:text-white">
                <f.icon size={24} />
              </div>
              <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">How it works</h2>
            <p className="mt-4 text-slate-600">
              A guided, step-by-step process that turns your real experience into a
              polished, job-ready resume.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {[
              { step: '01', title: 'Create your profile', desc: 'Add your education, skills, projects, and interests.' },
              { step: '02', title: 'Choose your target role', desc: 'Pick from IT or non-IT roles to tailor your resume.' },
              { step: '03', title: 'Build your resume', desc: 'Follow guided steps with AI-generated summaries and validation.' },
              { step: '04', title: 'Download & apply', desc: 'Get an ATS-friendly PDF and an ATS score to track readiness.' },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="text-3xl font-extrabold text-teal-200">{s.step}</div>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Truth notice */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <div className="card border-teal-100 bg-teal-50/50 p-8 text-center">
          <CheckCircle2 className="mx-auto text-teal-700" size={40} />
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Truth over exaggeration</h2>
          <p className="mt-3 text-slate-600">
            CareerMate AI improves the wording, structure, and presentation of your resume —
            but it will never fabricate skills, achievements, or experience. Your resume is
            built on real evidence you provide.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-teal-700 to-teal-900 px-8 py-14 text-center shadow-lg sm:px-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to start your career journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-teal-100">
            Create a free account and build your first resume today.
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate('/signup')}
            className="mt-8 border-transparent bg-white px-8 py-3 text-base text-teal-800 hover:bg-teal-50"
          >
            Get Started Free
            <ArrowRight size={18} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Logo size="sm" />
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CareerMate AI. Your career companion.
          </p>
        </div>
      </footer>
    </div>
  );
}
