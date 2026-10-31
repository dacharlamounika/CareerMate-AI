import { useEffect, useState } from 'react';
import { Mic, LayoutDashboard, History as HistoryIcon, Sparkles } from 'lucide-react';
import type {
  EvaluationResult,
  ExperienceLevel,
  InterviewQuestion,
  InterviewRole,
  InterviewSession,
  InterviewType,
} from '../types/mockInterviewTypes';
import { getQuestions } from '../utils/interviewQuestions';
import { aggregateSession } from '../utils/answerEvaluation';
import { getSession, loadHistory, saveSession } from '../utils/interviewStorage';
import InterviewSetup from '../components/InterviewSetup';
import InterviewSessionView from '../components/InterviewSession';
import InterviewResults from '../components/InterviewResults';
import InterviewHistory from '../components/InterviewHistory';

type View = 'setup' | 'active' | 'results' | 'history';

interface SessionConfig {
  role: InterviewRole;
  type: InterviewType;
  experience: ExperienceLevel;
  count: number;
}

interface SessionAnswer {
  question: InterviewQuestion;
  answer: string;
  skipped: boolean;
  evaluation: EvaluationResult;
}

export default function MockInterviewPage() {
  const [view, setView] = useState<View>('setup');
  const [config, setConfig] = useState<SessionConfig | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [resultsSession, setResultsSession] = useState<InterviewSession | null>(null);
  const [history, setHistory] = useState(loadHistory());

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  function handleStart(cfg: SessionConfig) {
    const qs = getQuestions(cfg.role, cfg.type, cfg.count);
    setConfig(cfg);
    setQuestions(qs);
    setView('active');
  }

  function handleFinish(answers: SessionAnswer[]) {
    if (!config) return;
    const aggregate = aggregateSession(answers);
    const session: InterviewSession = {
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      role: config.role,
      type: config.type,
      experience: config.experience,
      totalQuestions: questions.length,
      answers: answers.map((a) => ({
        questionId: a.question.id,
        questionText: a.question.text,
        answerText: a.answer,
        skipped: a.skipped,
        evaluation: a.evaluation,
      })),
      ...aggregate,
    };
    const updated = saveSession(session);
    setHistory(updated);
    setResultsSession(session);
    setView('results');
  }

  function handleViewHistoryEntry(id: string) {
    const session = getSession(id);
    if (session) {
      setResultsSession(session);
      setView('results');
    }
  }

  function handleRestart() {
    if (config) {
      handleStart(config);
    } else {
      setView('setup');
    }
  }

  const tabs: { id: View; label: string; icon: typeof Mic }[] = [
    { id: 'setup', label: 'Practice', icon: Mic },
    { id: 'history', label: 'History', icon: HistoryIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Module header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-sm">
              <Mic className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800">AI Mock Interview</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Practice structured interviews with automated feedback
              </p>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="mt-4 flex gap-1">
            {tabs.map((tab) => {
              const active =
                (tab.id === 'setup' && (view === 'setup' || view === 'active' || view === 'results')) ||
                (tab.id === 'history' && view === 'history');
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setView(tab.id === 'setup' ? 'setup' : 'history')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {view === 'setup' && <InterviewSetup onStart={handleStart} />}

        {view === 'active' && config && (
          <InterviewSessionView
            questions={questions}
            type={config.type}
            role={config.role}
            onFinish={handleFinish}
            onExit={() => setView('setup')}
          />
        )}

        {view === 'results' && resultsSession && (
          <InterviewResults
            session={resultsSession}
            onRestart={handleRestart}
            onBackToSetup={() => {
              setResultsSession(null);
              setView('setup');
            }}
          />
        )}

        {view === 'results' && !resultsSession && (
          <div className="max-w-3xl mx-auto text-center py-12">
            <LayoutDashboard className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No result to display yet.</p>
            <button
              type="button"
              onClick={() => setView('setup')}
              className="mt-3 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition"
            >
              Start a new interview
            </button>
          </div>
        )}

        {view === 'history' && (
          <InterviewHistory
            history={history}
            onView={handleViewHistoryEntry}
            onChanged={() => setHistory(loadHistory())}
          />
        )}
      </div>

      {/* Footer note */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex items-start gap-2 rounded-lg bg-teal-50/70 border border-teal-100 p-3 text-xs text-teal-700">
          <Sparkles className="h-4 w-4 mt-0.5 shrink-0 text-teal-500" />
          <span>
            This module uses an automated practice evaluation rubric — not a live AI model — to give you
            instant, consistent feedback on your answers. Use it to build confidence and structure before
            real interviews.
          </span>
        </div>
      </div>
    </div>
  );
}
