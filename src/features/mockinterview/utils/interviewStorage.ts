import type { InterviewHistoryEntry, InterviewSession } from '../types/mockInterviewTypes';

const STORAGE_KEY = 'careermate_mock_interview_history';

export function loadHistory(): InterviewHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InterviewHistoryEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export function saveSession(session: InterviewSession): InterviewHistoryEntry[] {
  const entry: InterviewHistoryEntry = {
    id: session.id,
    date: session.date,
    role: session.role,
    type: session.type,
    totalQuestions: session.totalQuestions,
    overallScore: session.overallScore,
    session,
  };
  const existing = loadHistory();
  const updated = [entry, ...existing].slice(0, 50);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore quota errors silently
  }
  return updated;
}

export function getSession(id: string): InterviewSession | null {
  const history = loadHistory();
  const entry = history.find((h) => h.id === id);
  return entry ? entry.session : null;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
