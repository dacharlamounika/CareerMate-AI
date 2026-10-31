import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';

type Mode = 'login' | 'signup';

export function AuthPage({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }
        const result = await signUp(email, password, fullName);
        if (result.error) {
          setError(result.error);
        } else {
          navigate('/dashboard');
        }
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : '';
      if (/failed to fetch|networkerror|load failed/i.test(message)) {
        setError(
          'Cannot reach the authentication service. Check your internet connection and the Supabase project URL in .env, then restart the development server.'
        );
      } else {
        setError('Unable to complete authentication. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-teal-700 to-teal-900 p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-2 text-white">
          <Logo size="md" />
        </Link>
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold leading-tight">
            {isSignup ? 'Start building your career today' : 'Welcome back to your career companion'}
          </h2>
          <p className="mt-4 max-w-sm text-teal-100">
            {isSignup
              ? 'Create an account to build ATS-friendly resumes, track skill gaps, and prepare for interviews.'
              : 'Log in to continue building your resume and tracking your career readiness.'}
          </p>
          <ul className="mt-8 space-y-3">
            {['Evidence-based resume builder', 'ATS score analysis', 'Privacy — only you see your data'].map(
              (item) => (
                <li key={item} className="flex items-center gap-2 text-teal-50">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
        <p className="text-sm text-teal-200">© {new Date().getFullYear()} CareerMate AI</p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col px-6 py-8 lg:w-1/2 lg:px-16">
        <div className="flex items-center justify-between">
          <Link to="/" className="btn-ghost inline-flex items-center gap-1.5 text-sm text-slate-500">
            <ArrowLeft size={16} /> Back home
          </Link>
          <div className="lg:hidden">
            <Logo size="sm" />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-2xl font-bold text-slate-900">
            {isSignup ? 'Create your account' : 'Log in to CareerMate'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isSignup ? 'Start your career readiness journey.' : 'Welcome back. Enter your details to continue.'}
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {isSignup && (
              <div>
                <label className="label" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input pl-9"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-9"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-9"
                  placeholder={isSignup ? 'At least 6 characters' : '••••••••'}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {isSignup ? 'Create Account' : 'Log In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800">
                  Log in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-teal-700 hover:text-teal-800">
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
