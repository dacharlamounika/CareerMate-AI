export type InterviewRole =
  | 'Software Developer'
  | 'Python Developer'
  | 'Java Developer'
  | 'Full Stack Developer'
  | 'Data Analyst'
  | 'AI/ML Engineer'
  | 'Web Developer'
  | 'Database Developer';

export type InterviewType = 'Technical' | 'HR' | 'Mixed';

export type ExperienceLevel = 'Fresher' | 'Beginner' | 'Intermediate';

export type QuestionCategory =
  | 'Technical'
  | 'HR'
  | 'Role-Specific'
  | 'Project-Based'
  | 'Behavioral';

export interface InterviewQuestion {
  id: string;
  role: InterviewRole;
  type: InterviewType;
  category: QuestionCategory;
  text: string;
  /** Keywords used by the deterministic evaluator to gauge relevance. */
  keywords: string[];
  /** A concise model answer used for completeness comparison. */
  modelAnswer: string;
}

export interface InterviewAnswer {
  questionId: string;
  questionText: string;
  answerText: string;
  skipped: boolean;
  evaluation: EvaluationResult;
}

export interface EvaluationResult {
  overallScore: number;
  relevanceScore: number;
  technicalScore: number;
  clarityScore: number;
  completenessScore: number;
  lengthScore: number;
  exampleScore: number;
  shortFeedback: string;
  didWell: string[];
  couldImprove: string[];
  suggestedStructure: string;
}

export type InterviewSessionStatus = 'setup' | 'active' | 'results';

export interface InterviewSession {
  id: string;
  date: string;
  role: InterviewRole;
  type: InterviewType;
  experience: ExperienceLevel;
  totalQuestions: number;
  answers: InterviewAnswer[];
  overallScore: number;
  attempted: number;
  skipped: number;
  averageScore: number;
  categoryPerformance: Record<QuestionCategory, number>;
  strengths: string[];
  areasToImprove: string[];
}

export interface InterviewHistoryEntry {
  id: string;
  date: string;
  role: InterviewRole;
  type: InterviewType;
  totalQuestions: number;
  overallScore: number;
  session: InterviewSession;
}
