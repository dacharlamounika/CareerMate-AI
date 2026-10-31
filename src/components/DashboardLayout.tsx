import { useState, type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Compass,
  Briefcase,
  Mic,
  Target,
  Brain,
  Code2,
  MessageSquare,
  TrendingUp,
  GraduationCap,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/Logo';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', active: true },
  { label: 'Resume Builder', icon: FileText, path: '/resume-builder', active: true },
  { label: 'Career Recommendations', icon: Compass, path: '/career-recommendation', active: true },

{
  label: 'Live Jobs',
  icon: Briefcase,
  path: '/jobs',
  active: true
},

 {
  label: 'Skill Gap Analysis',
  icon: Target,
  path: '/skill-gap',
  active: true,
},
{ label: 'Learning Roadmap', icon: GraduationCap, path: '/learning-roadmap', active: true },

 
{ label: 'Aptitude', icon: Brain, path: '/aptitude-assessment', active: true},
  {
  label: 'Coding Assessment',
  icon: Code2,
  path: '/coding-assessment',
  active: true,
},

{
  label: 'AI Mock Interview',
  icon: Mic,
  path: '/mock-interview',
  active: true
},
{
  label: 'Career Progress',
  icon: TrendingUp,
  path: '/career-progress',
  active: true
},
  
  
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const initials = (profile?.full_name || user?.email || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile header */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden print:hidden">
        <Logo size="sm" />
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
  className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white transition-transform lg:translate-x-0 print:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <Link to="/dashboard">
              <Logo size="sm" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {navItems.map((item) => {
              const isActive = item.active && location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={(e) => {
                    if (!item.active) e.preventDefault();
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-800'
                      : item.active
                      ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      : 'cursor-not-allowed text-slate-400'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-teal-700' : ''} />
                  <span className="flex-1">{item.label}</span>
                  {!item.active && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-400">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-100 p-3">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white">
                {initials}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-slate-900">
                  {profile?.full_name || 'User'}
                </p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
  className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden print:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-72 print:pl-0">
  <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 print:max-w-none print:px-0 print:py-0">
    {children}
  </main>
</div>
    </div>
  );
}
