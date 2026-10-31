import { useState } from 'react';
import {
  Send,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import type {
  EvaluationResult,
  InterviewQuestion,
  InterviewRole,
  InterviewType,
} from '../types/mockInterviewTypes';
import { evaluateAnswer } from '../utils/answerEvaluation';
import InterviewQuestionCard from './InterviewQuestion';
import AnswerInput from './AnswerInput';
import EvaluationResultCard from './EvaluationResult';
import InterviewProgress from './InterviewProgress';

interface InterviewSessionProps {
  questions: InterviewQuestion[];
  type: InterviewType;
  role: InterviewRole;
  onFinish: (answers: {
    question: InterviewQuestion;
    answer: string;
    skipped: boolean;
    evaluation: EvaluationResult;
  }[]) => void;
  onExit: () => void;
}

export default function InterviewSession({
  questions,
  type,
  role,
  onFinish,
  onExit,
}: InterviewSessionProps) {
  const [current, setCurrent] = useState(0);
  const [drafts, setDrafts] = useState<string[]>(() => questions.map(() => ''));
  const [submitted, setSubmitted] = useState<boolean[]>(() => questions.map(() => false));
  const [skipped, setSkipped] = useState<boolean[]>(() => questions.map(() => false));
  const [evaluations, setEvaluations] = useState<(EvaluationResult | null)[]>(
    () => questions.map(() => null)
  );
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const question = questions[current];
  const isAnswered = submitted[current] || skipped[current];
  const canGoPrev = current > 0;
  const canGoNext = current < questions.length - 1;

  function updateDraft(value: string) {
    setDrafts((prev) => {
      const next = [...prev];
      next[current] = value;
      return next;
    });
  }

  function handleSubmit() {
    const answer = drafts[current].trim();
    if (!answer) return;
    const evaluation = evaluateAnswer(question, answer, false);
    setEvaluations((prev) => {
      const next = [...prev];
      next[current] = evaluation;
      return next;
    });
    setSubmitted((prev) => {
      const next = [...prev];
      next[current] = true;
      return next;
    });
    setSkipped((prev) => {
      const next = [...prev];
      next[current] = false;
      return next;
    });
  }

  function handleSkip() {
    const evaluation = evaluateAnswer(question, '', true);
    setEvaluations((prev) => {
      const next = [...prev];
      next[current] = evaluation;
      return next;
    });
    setSkipped((prev) => {
      const next = [...prev];
      next[current] = true;
      return next;
    });
    setSubmitted((prev) => {
      const next = [...prev];
      next[current] = false;
      return next;
    });
  }

  function handleNext() {
    if (canGoNext) setCurrent((c) => c + 1);
  }

  function handlePrev() {
    if (canGoPrev) setCurrent((c) => c - 1);
  }

  function handleFinish() {
    const results = questions.map((q, i) => ({
      question: q,
      answer: drafts[i],
      skipped: skipped[i],
      evaluation:
        evaluations[i] ?? evaluateAnswer(q, drafts[i], skipped[i]),
    }));
    onFinish(results);
  }

  const allDone = submitted.every((s, i) => s || skipped[i]);
  const answeredFlags = questions.map((_, i) => submitted[i] || skipped[i]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="text-sm text-slate-500 hover:text-slate-700 transition"
        >
          ← Exit interview
        </button>
        {allDone && (
          <button
            type="button"
            onClick={handleFinish}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition"
          >
            View Results
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-4">
        <InterviewProgress current={current} total={questions.length} answered={answeredFlags} />
      </div>

      <div className="space-y-4">
        <InterviewQuestionCard
          question={question}
          index={current}
          total={questions.length}
          type={type}
          role={role}
        />

        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Your Answer</label>
          <AnswerInput
            value={drafts[current]}
            onChange={updateDraft}
            disabled={isAnswered}
            placeholder={
              isAnswered
                ? 'Answer locked — you can review it below.'
                : 'Type your answer here. Aim for 60-80 words with clear structure.'
            }
          />

          {!isAnswered && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!drafts[current].trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
              >
                <Send className="h-4 w-4" />
                Submit Answer
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                <SkipForward className="h-4 w-4" />
                Skip
              </button>
            </div>
          )}

          {isAnswered && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {submitted[current] && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Answer submitted
                </span>
              )}
              {skipped[current] && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Question skipped
                </span>
              )}
            </div>
          )}
        </div>

        {evaluations[current] && (
          <EvaluationResultCard result={evaluations[current] as EvaluationResult} />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          {canGoNext ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition"
            >
              Finish & View Results
            </button>
          )}
        </div>
      </div>

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-fade-in">
          <div className="max-w-sm w-full bg-white rounded-xl shadow-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-semibold text-slate-800">Exit this interview?</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Your current progress will be lost. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={onExit}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
