// Centralized, defensive data reader for the Career Progress Dashboard.
//
// This utility reads ONLY from data sources that actually exist in the user's
// browser: localStorage keys that other CareerMate modules write to, plus a
// couple of well-known resume/profile keys. It never invents values. When a
// source is missing or malformed, the corresponding field stays `null` /
// "not-started" so the UI can render an empty state.
//
// Add a new key mapping here when a new CareerMate module is introduced —
// do not add fake fallbacks.

import type {
  ActivityEntry,
  AptitudePracticeData,
  AptitudeTopicProgress,
  AtsAnalysisData,
  CareerProgressData,
  CodingAssessmentData,
  JobDescriptionAnalyzerData,
  LiveJobsData,
  LearningRoadmapData,
  MockInterviewData,
  ModuleStatus,
  NextActionSuggestion,
  OverallProgressData,
  ResumeBuilderData,
  SkillGapAnalysisData,
} from "@/features/career-progress/types/careerProgressTypes";

// ---------------------------------------------------------------------------
// localStorage key registry
//
// Each key is namespaced under `careermate.*` so other modules can write to
// them independently. Unknown / missing keys simply yield null.
// ---------------------------------------------------------------------------

const KEYS = {
  resume: "careermate.resume",
  ats: "careermate.ats.analyses",
  jobDescription: "careermate.jd.analyses",
  skillGap: "careermate.skillgap",
  learning: "careermate.learning.roadmap",
  aptitude: "careermate.aptitude",
  coding: "careermate.coding.assessments",
  mockInterview: "careermate.mockinterview.sessions",
  liveJobs: "careermate.livejobs.tracking",
  profile: "careermate.profile",
} as const;

// ---------------------------------------------------------------------------
// Low-level safe readers
// ---------------------------------------------------------------------------

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function strArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const filtered = value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  return filtered.length > 0 ? filtered : null;
}

function latestTimestamp(entries: unknown[]): string | null {
  for (const entry of entries) {
    if (isObject(entry)) {
      const ts = str(entry.updatedAt) ?? str(entry.timestamp) ?? str(entry.date);
      if (ts) return ts;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Module-level readers — each returns an explicit "no data" shape.
// ---------------------------------------------------------------------------

interface ResumeStorage {
  sections?: unknown;
  sectionStatus?: Record<string, unknown>;
  updatedAt?: unknown;
}

function readResume(): ResumeBuilderData {
  const data = readJSON<ResumeStorage>(KEYS.resume);
  if (!data) {
    return notStartedResume();
  }

  const sectionStatus = data.sectionStatus;
  let sectionsCompleted: string[] | null = null;
  let totalSections: number | null = null;
  let completionPercentage: number | null = null;

  if (sectionStatus && isObject(sectionStatus)) {
    const entries = Object.entries(sectionStatus);
    totalSections = entries.length;
    const completed = entries
      .filter(([, v]) => v === true || v === "completed" || v === "done")
      .map(([k]) => k);
    sectionsCompleted = completed.length > 0 ? completed : null;
    if (totalSections > 0) {
      completionPercentage = Math.round((completed.length / totalSections) * 100);
    }
  }

  const status = deriveStatus(sectionsCompleted, completionPercentage);
  return {
    status,
    sectionsCompleted,
    totalSections,
    completionPercentage,
    lastUpdated: str(data.updatedAt),
  };
}

function notStartedResume(): ResumeBuilderData {
  return {
    status: "not-started",
    sectionsCompleted: null,
    totalSections: null,
    completionPercentage: null,
    lastUpdated: null,
  };
}

interface AtsStorageEntry {
  score?: unknown;
  updatedAt?: unknown;
  timestamp?: unknown;
}

function readAts(): AtsAnalysisData {
  const entries = readJSON<unknown>(KEYS.ats);
  if (!Array.isArray(entries) || entries.length === 0) {
    return { status: "not-started", latestScore: null, analysisCount: null, lastUpdated: null };
  }
  const typed = entries.filter(isObject) as AtsStorageEntry[];
  const latest = typed[typed.length - 1];
  const latestScore = latest ? num(latest.score) : null;
  const lastUpdated = latestTimestamp(typed);
  return {
    status: latestScore !== null ? "in-progress" : "not-started",
    latestScore,
    analysisCount: typed.length,
    lastUpdated,
  };
}

interface JdStorageEntry {
  jobTitle?: unknown;
  title?: unknown;
  updatedAt?: unknown;
  timestamp?: unknown;
}

function readJobDescription(): JobDescriptionAnalyzerData {
  const entries = readJSON<unknown>(KEYS.jobDescription);
  if (!Array.isArray(entries) || entries.length === 0) {
    return { status: "not-started", analysisCount: null, latestAnalysisTitle: null, lastUpdated: null };
  }
  const typed = entries.filter(isObject) as JdStorageEntry[];
  const latest = typed[typed.length - 1];
  return {
    status: "in-progress",
    analysisCount: typed.length,
    latestAnalysisTitle: latest ? str(latest.jobTitle) ?? str(latest.title) : null,
    lastUpdated: latestTimestamp(typed),
  };
}

interface SkillGapStorage {
  identified?: unknown;
  matched?: unknown;
  improvement?: unknown;
  missing?: unknown;
  updatedAt?: unknown;
}

function readSkillGap(): SkillGapAnalysisData {
  const data = readJSON<SkillGapStorage>(KEYS.skillGap);
  if (!data) {
    return {
      status: "not-started",
      skillsIdentified: null,
      skillsMatched: null,
      skillsNeedingImprovement: null,
      lastUpdated: null,
    };
  }
  const skillsIdentified = strArray(data.identified);
  const skillsMatched = strArray(data.matched);
  const skillsNeedingImprovement = strArray(data.improvement) ?? strArray(data.missing);
  const hasAny = skillsIdentified || skillsMatched || skillsNeedingImprovement;
  return {
    status: hasAny ? "in-progress" : "not-started",
    skillsIdentified,
    skillsMatched,
    skillsNeedingImprovement,
    lastUpdated: str(data.updatedAt),
  };
}

interface LearningItem {
  id?: unknown;
  title?: unknown;
  status?: unknown;
  completed?: unknown;
}

interface LearningStorage {
  items?: unknown;
  roadmap?: unknown;
  currentItemId?: unknown;
  nextItemId?: unknown;
  updatedAt?: unknown;
}

function readLearning(): LearningRoadmapData {
  const data = readJSON<LearningStorage>(KEYS.learning);
  if (!data) {
    return emptyLearning();
  }
  const items = Array.isArray(data.items) ? data.items : Array.isArray(data.roadmap) ? data.roadmap : null;
  if (!items) return emptyLearning(str(data.updatedAt));

  const typed = items.filter(isObject) as LearningItem[];
  const completed: string[] = [];
  const remaining: string[] = [];
  for (const item of typed) {
    const title = str(item.title) ?? str(item.id);
    if (!title) continue;
    const done = item.status === "completed" || item.completed === true;
    if (done) completed.push(title);
    else remaining.push(title);
  }

  const completedItems = completed.length > 0 ? completed : null;
  const remainingItems = remaining.length > 0 ? remaining : null;
  const total = typed.length;
  const progressPercentage = total > 0 ? Math.round((completed.length / total) * 100) : null;
  const status: ModuleStatus = progressPercentage === null ? "not-started" : progressPercentage >= 100 ? "completed" : "in-progress";

  return {
    status,
    completedItems,
    remainingItems,
    currentItemId: str(data.currentItemId),
    nextRecommendedItemId: str(data.nextItemId),
    progressPercentage,
    lastUpdated: str(data.updatedAt),
  };
}

function emptyLearning(updatedAt?: string | null): LearningRoadmapData {
  return {
    status: "not-started",
    completedItems: null,
    remainingItems: null,
    currentItemId: null,
    nextRecommendedItemId: null,
    progressPercentage: null,
    lastUpdated: updatedAt ?? null,
  };
}

interface AptitudeStorage {
  questionsAttempted?: unknown;
  averageScore?: unknown;
  topics?: unknown;
  updatedAt?: unknown;
}

function readAptitude(): AptitudePracticeData {
  const data = readJSON<AptitudeStorage>(KEYS.aptitude);
  if (!data) {
    return { status: "not-started", questionsAttempted: null, averageScore: null, topicProgress: null, lastUpdated: null };
  }
  let topicProgress: AptitudeTopicProgress[] | null = null;
  if (Array.isArray(data.topics)) {
    const parsed: AptitudeTopicProgress[] = [];
    for (const t of data.topics) {
      if (!isObject(t)) continue;
      const topic = str(t.topic) ?? str(t.name) ?? str(t.category);
      if (!topic) continue;
      parsed.push({
        topic,
        attempted: num(t.attempted) ?? num(t.questionsAttempted),
        averageScore: num(t.averageScore) ?? num(t.score),
      });
    }
    topicProgress = parsed.length > 0 ? parsed : null;
  }
  const questionsAttempted = num(data.questionsAttempted);
  const averageScore = num(data.averageScore);
  const hasAny = questionsAttempted !== null || averageScore !== null || topicProgress;
  return {
    status: hasAny ? "in-progress" : "not-started",
    questionsAttempted,
    averageScore,
    topicProgress,
    lastUpdated: str(data.updatedAt),
  };
}

interface CodingStorage {
  problemsAttempted?: unknown;
  problemsSolved?: unknown;
  averageScore?: unknown;
  updatedAt?: unknown;
}

function readCoding(): CodingAssessmentData {
  const data = readJSON<CodingStorage>(KEYS.coding);
  if (!data) {
    return { status: "not-started", problemsAttempted: null, problemsSolved: null, averageScore: null, lastUpdated: null };
  }
  const problemsAttempted = num(data.problemsAttempted);
  const problemsSolved = num(data.problemsSolved);
  const averageScore = num(data.averageScore);
  const hasAny = problemsAttempted !== null || problemsSolved !== null || averageScore !== null;
  return {
    status: hasAny ? "in-progress" : "not-started",
    problemsAttempted,
    problemsSolved,
    averageScore,
    lastUpdated: str(data.updatedAt),
  };
}

interface MockSession {
  score?: unknown;
  updatedAt?: unknown;
  timestamp?: unknown;
}

function readMockInterview(): MockInterviewData {
  const sessions = readJSON<unknown>(KEYS.mockInterview);
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return { status: "not-started", interviewsCompleted: null, latestScore: null, averageScore: null, lastUpdated: null };
  }
  const typed = sessions.filter(isObject) as MockSession[];
  const scores = typed.map((s) => num(s.score)).filter((s): s is number => s !== null);
  const latest = typed[typed.length - 1];
  const latestScore = latest ? num(latest.score) : null;
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  return {
    status: "in-progress",
    interviewsCompleted: typed.length,
    latestScore,
    averageScore,
    lastUpdated: latestTimestamp(typed),
  };
}

interface LiveJobsStorage {
  viewed?: unknown;
  applied?: unknown;
  updatedAt?: unknown;
}

function readLiveJobs(): LiveJobsData {
  const data = readJSON<LiveJobsStorage>(KEYS.liveJobs);
  if (!data) {
    return { status: "not-started", jobsViewed: null, jobsAppliedTo: null, lastUpdated: null };
  }
  const jobsViewed = num(data.viewed);
  const jobsAppliedTo = num(data.applied);
  const hasAny = jobsViewed !== null || jobsAppliedTo !== null;
  return {
    status: hasAny ? "in-progress" : "not-started",
    jobsViewed,
    jobsAppliedTo,
    lastUpdated: str(data.updatedAt),
  };
}

// ---------------------------------------------------------------------------
// Derivation helpers
// ---------------------------------------------------------------------------

function deriveStatus(completed: string[] | null, percentage: number | null): ModuleStatus {
  if (percentage !== null) return percentage >= 100 ? "completed" : "in-progress";
  if (completed && completed.length > 0) return "in-progress";
  return "not-started";
}

const MODULE_LABELS: Record<string, string> = {
  resume: "Resume Builder",
  ats: "ATS Analysis",
  "job-description": "Job Description Analyzer",
  "skill-gap": "Skill Gap Analysis",
  learning: "Learning Roadmap",
  aptitude: "Aptitude Practice",
  coding: "Coding Assessment",
  "mock-interview": "AI Mock Interview",
  "live-jobs": "Live Jobs",
};

function buildRecentActivity(data: CareerProgressData): ActivityEntry[] {
  const activity: ActivityEntry[] = [];
  const push = (module: string, description: string, timestamp: string | null) => {
    if (timestamp) activity.push({ module, description, timestamp });
  };
  push("Resume Builder", "Resume updated", data.resumeBuilder.lastUpdated);
  push("ATS Analysis", "ATS analysis completed", data.atsAnalysis.lastUpdated);
  push("Job Description Analyzer", "Job description analyzed", data.jobDescriptionAnalyzer.lastUpdated);
  push("Skill Gap Analysis", "Skill gap reviewed", data.skillGapAnalysis.lastUpdated);
  push("Learning Roadmap", "Learning roadmap updated", data.learningRoadmap.lastUpdated);
  push("Aptitude Practice", "Aptitude practice updated", data.aptitudePractice.lastUpdated);
  push("Coding Assessment", "Coding assessment updated", data.codingAssessment.lastUpdated);
  push("AI Mock Interview", "Mock interview completed", data.mockInterview.lastUpdated);
  push("Live Jobs", "Job tracking updated", data.liveJobs.lastUpdated);
  return activity.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)).slice(0, 8);
}

function computeOverall(data: CareerProgressData): OverallProgressData {
  const statuses: { id: string; status: ModuleStatus; pct: number | null }[] = [
    { id: "resume", status: data.resumeBuilder.status, pct: data.resumeBuilder.completionPercentage },
    { id: "ats", status: data.atsAnalysis.status, pct: data.atsAnalysis.latestScore },
    { id: "job-description", status: data.jobDescriptionAnalyzer.status, pct: null },
    { id: "skill-gap", status: data.skillGapAnalysis.status, pct: null },
    { id: "learning", status: data.learningRoadmap.status, pct: data.learningRoadmap.progressPercentage },
    { id: "aptitude", status: data.aptitudePractice.status, pct: null },
    { id: "coding", status: data.codingAssessment.status, pct: null },
    { id: "mock-interview", status: data.mockInterview.status, pct: null },
    { id: "live-jobs", status: data.liveJobs.status, pct: null },
  ];

  const completedModules: string[] = [];
  const inProgressModules: string[] = [];
  const notStartedModules: string[] = [];
  const realPercentages: number[] = [];

  for (const m of statuses) {
    const label = MODULE_LABELS[m.id];
    if (m.status === "completed") {
      completedModules.push(label);
      realPercentages.push(100);
    } else if (m.status === "in-progress") {
      inProgressModules.push(label);
      if (m.pct !== null) realPercentages.push(m.pct);
    } else {
      notStartedModules.push(label);
    }
  }

  const overallPercentage = realPercentages.length > 0
    ? Math.round(realPercentages.reduce((a, b) => a + b, 0) / realPercentages.length)
    : null;

  return { overallPercentage, completedModules, inProgressModules, notStartedModules };
}

function computeNextAction(data: CareerProgressData): NextActionSuggestion | null {
  if (data.resumeBuilder.status === "not-started") {
    return { moduleId: "resume", title: "Build your resume", detail: "Start your resume to unlock ATS analysis and job matching.", link: "/resume-builder" };
  }
  if (data.resumeBuilder.status === "in-progress") {
    return { moduleId: "resume", title: "Complete your resume", detail: "Finish the remaining resume sections to improve your profile.", link: "/resume-builder" };
  }
  if (data.atsAnalysis.status === "not-started") {
    return { moduleId: "ats", title: "Run an ATS analysis", detail: "Check how your resume performs against applicant tracking systems.", link: "/ats-analysis" };
  }
  if (data.skillGapAnalysis.status === "not-started") {
    return { moduleId: "skill-gap", title: "Identify your skill gaps", detail: "Find out which skills you still need for your target roles.", link: "/skill-gap" };
  }
  if (data.learningRoadmap.status !== "completed" && data.learningRoadmap.nextRecommendedItemId) {
    return { moduleId: "learning", title: "Continue your learning roadmap", detail: `Up next: ${data.learningRoadmap.nextRecommendedItemId}`, link: "/learning-roadmap" };
  }
  if (data.mockInterview.status === "not-started") {
    return { moduleId: "mock-interview", title: "Try a mock interview", detail: "Practice interviewing and get instant AI feedback.", link: "/mock-interview" };
  }
  // Fall back to the first in-progress module with a link.
  const inProgress: NextActionSuggestion[] = [
    { moduleId: "ats", title: "Improve your ATS score", detail: "Review your latest ATS analysis and update your resume.", link: "/ats-analysis" },
    { moduleId: "job-description", title: "Analyze a job description", detail: "Match your profile against a target job description.", link: "/job-description-analyzer" },
    { moduleId: "skill-gap", title: "Review your skill gaps", detail: "See which skills still need work.", link: "/skill-gap" },
    { moduleId: "learning", title: "Continue learning", detail: "Pick up where you left off on your roadmap.", link: "/learning-roadmap" },
    { moduleId: "aptitude", title: "Practice aptitude", detail: "Keep practicing aptitude questions.", link: "/aptitude" },
    { moduleId: "coding", title: "Solve coding problems", detail: "Attempt your next coding challenge.", link: "/coding-assessment" },
    { moduleId: "mock-interview", title: "Do another mock interview", detail: "Keep practicing to raise your average score.", link: "/mock-interview" },
    { moduleId: "live-jobs", title: "Explore live jobs", detail: "Browse jobs matched to your profile.", link: "/live-jobs" },
  ];
  return inProgress[0] ?? null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function loadCareerProgress(): CareerProgressData {
  const resumeBuilder = readResume();
  const atsAnalysis = readAts();
  const jobDescriptionAnalyzer = readJobDescription();
  const skillGapAnalysis = readSkillGap();
  const learningRoadmap = readLearning();
  const aptitudePractice = readAptitude();
  const codingAssessment = readCoding();
  const mockInterview = readMockInterview();
  const liveJobs = readLiveJobs();

  const partial = {
    resumeBuilder,
    atsAnalysis,
    jobDescriptionAnalyzer,
    skillGapAnalysis,
    learningRoadmap,
    aptitudePractice,
    codingAssessment,
    mockInterview,
    liveJobs,
  } as CareerProgressData;

  const overall = computeOverall(partial);
  const recentActivity = buildRecentActivity(partial);
  const nextAction = computeNextAction(partial);

  return { ...partial, overall, recentActivity, nextAction };
}

export const MODULE_LINKS = {
  resume: "/resume-builder",
  ats: "/ats-analysis",
  "job-description": "/job-description-analyzer",
  "skill-gap": "/skill-gap",
  learning: "/learning-roadmap",
  aptitude: "/aptitude",
  coding: "/coding-assessment",
  "mock-interview": "/mock-interview",
  "live-jobs": "/live-jobs",
} as const;
