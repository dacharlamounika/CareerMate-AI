// Centralized types for the Career Progress Dashboard.
// Every field that represents user progress is optional on purpose:
// if an underlying CareerMate module has not produced data yet, the
// dashboard must show "No data available yet" rather than fake values.

export type ModuleStatus = "completed" | "in-progress" | "not-started";

export interface ProgressRingData {
  /** 0-100 inclusive. null when it cannot be calculated from real data. */
  percentage: number | null;
  label: string;
}

export interface ResumeBuilderData {
  status: ModuleStatus;
  sectionsCompleted: string[] | null;
  totalSections: number | null;
  /** null when no real completion percentage is available. */
  completionPercentage: number | null;
  lastUpdated: string | null;
}

export interface AtsAnalysisData {
  status: ModuleStatus;
  latestScore: number | null;
  analysisCount: number | null;
  lastUpdated: string | null;
}

export interface JobDescriptionAnalyzerData {
  status: ModuleStatus;
  analysisCount: number | null;
  latestAnalysisTitle: string | null;
  lastUpdated: string | null;
}

export interface SkillGapAnalysisData {
  status: ModuleStatus;
  skillsIdentified: string[] | null;
  skillsMatched: string[] | null;
  skillsNeedingImprovement: string[] | null;
  lastUpdated: string | null;
}

export interface LearningRoadmapData {
  status: ModuleStatus;
  completedItems: string[] | null;
  remainingItems: string[] | null;
  currentItemId: string | null;
  nextRecommendedItemId: string | null;
  /** null when no real progress percentage is available. */
  progressPercentage: number | null;
  lastUpdated: string | null;
}

export interface AptitudePracticeData {
  status: ModuleStatus;
  questionsAttempted: number | null;
  averageScore: number | null;
  topicProgress: AptitudeTopicProgress[] | null;
  lastUpdated: string | null;
}

export interface AptitudeTopicProgress {
  topic: string;
  attempted: number | null;
  averageScore: number | null;
}

export interface CodingAssessmentData {
  status: ModuleStatus;
  problemsAttempted: number | null;
  problemsSolved: number | null;
  averageScore: number | null;
  lastUpdated: string | null;
}

export interface MockInterviewData {
  status: ModuleStatus;
  interviewsCompleted: number | null;
  latestScore: number | null;
  averageScore: number | null;
  lastUpdated: string | null;
}

export interface LiveJobsData {
  status: ModuleStatus;
  jobsViewed: number | null;
  jobsAppliedTo: number | null;
  lastUpdated: string | null;
}

export interface ActivityEntry {
  module: string;
  description: string;
  timestamp: string;
}

export interface NextActionSuggestion {
  moduleId: string;
  title: string;
  detail: string;
  link: string;
}

export interface CareerProgressData {
  resumeBuilder: ResumeBuilderData;
  atsAnalysis: AtsAnalysisData;
  jobDescriptionAnalyzer: JobDescriptionAnalyzerData;
  skillGapAnalysis: SkillGapAnalysisData;
  learningRoadmap: LearningRoadmapData;
  aptitudePractice: AptitudePracticeData;
  codingAssessment: CodingAssessmentData;
  mockInterview: MockInterviewData;
  liveJobs: LiveJobsData;
  overall: OverallProgressData;
  recentActivity: ActivityEntry[];
  nextAction: NextActionSuggestion | null;
}

export interface OverallProgressData {
  /** null when it cannot be computed from real data. */
  overallPercentage: number | null;
  completedModules: string[];
  inProgressModules: string[];
  notStartedModules: string[];
}

export interface ProgressCardConfig {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  linkLabel: string;
  data: CardDataSlice;
}

export type CardDataSlice =
  | { kind: "resume"; payload: ResumeBuilderData }
  | { kind: "ats"; payload: AtsAnalysisData }
  | { kind: "job-description"; payload: JobDescriptionAnalyzerData }
  | { kind: "skill-gap"; payload: SkillGapAnalysisData }
  | { kind: "learning"; payload: LearningRoadmapData }
  | { kind: "aptitude"; payload: AptitudePracticeData }
  | { kind: "coding"; payload: CodingAssessmentData }
  | { kind: "mock-interview"; payload: MockInterviewData }
  | { kind: "live-jobs"; payload: LiveJobsData };
