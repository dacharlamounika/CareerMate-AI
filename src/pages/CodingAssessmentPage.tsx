import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  RotateCcw,
  XCircle,
} from 'lucide-react';

import { DashboardLayout } from '@/components/DashboardLayout';
import {
  codingQuestions,
  type CodingQuestion,
} from '@/features/coding/utils/codingQuestions';
import {
  runPythonTestCases,
  type TestCaseResult,
} from '@/features/coding/utils/pythonRunner';

const topics = [
  'Variables & Data Types',
  'Conditions',
  'Loops',
  'Strings',
  'Lists',
  'Functions',
  'Dictionaries',
  'Searching',
  'Sorting',
  'Basic Algorithms',
];

function shuffleQuestions(
  questions: CodingQuestion[]
): CodingQuestion[] {
  const shuffled = [...questions];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function CodingAssessmentPage() {
  const navigate = useNavigate();

  const [selectedTopic, setSelectedTopic] =
    useState<string | null>(null);

  const [practiceStarted, setPracticeStarted] =
    useState(false);

  const [questions, setQuestions] =
    useState<CodingQuestion[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [code, setCode] = useState('');

  const [result, setResult] = useState<
    'correct' | 'incorrect' | null
  >(null);

  const [testResults, setTestResults] =
    useState<TestCaseResult[]>([]);

  const [executionError, setExecutionError] =
    useState<string | null>(null);

  const [isRunning, setIsRunning] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleStartPractice = () => {
    if (!selectedTopic) {
      return;
    }

    const topicQuestions = codingQuestions.filter(
      (question) => question.topic === selectedTopic
    );

    if (topicQuestions.length === 0) {
      return;
    }

    const shuffled = shuffleQuestions(topicQuestions);

    setQuestions(shuffled);
    setCurrentIndex(0);
    setCode(shuffled[0].starterCode);
    setResult(null);
    setTestResults([]);
    setExecutionError(null);
    setPracticeStarted(true);
  };

  const handleCheckCode = async () => {
    if (!currentQuestion || isRunning) {
      return;
    }

    setIsRunning(true);
    setResult(null);
    setTestResults([]);
    setExecutionError(null);

    try {
      const runResult = await runPythonTestCases(
        code,
        currentQuestion.functionName,
        currentQuestion.testCases
      );

      setTestResults(runResult.testResults);
      setExecutionError(runResult.error);

      if (!runResult.error) {
        setResult(
          runResult.success
            ? 'correct'
            : 'incorrect'
        );
      } else {
        setResult('incorrect');
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleNextQuestion = () => {
    if (!questions.length) {
      return;
    }

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;

      setCurrentIndex(nextIndex);
      setCode(questions[nextIndex].starterCode);
      setResult(null);
      setTestResults([]);
      setExecutionError(null);

      return;
    }

    const reshuffled = shuffleQuestions(questions);

    setQuestions(reshuffled);
    setCurrentIndex(0);
    setCode(reshuffled[0].starterCode);
    setResult(null);
    setTestResults([]);
    setExecutionError(null);
  };

  const handleRestart = () => {
    handleStartPractice();
  };

  const handleChangeTopic = () => {
    setPracticeStarted(false);
    setSelectedTopic(null);
    setQuestions([]);
    setCurrentIndex(0);
    setCode('');
    setResult(null);
    setTestResults([]);
    setExecutionError(null);
  };

  const passedTests = testResults.filter(
    (test) => test.passed
  ).length;

  const totalTests = testResults.length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl">

          {!practiceStarted && (
            <button
              onClick={() => navigate('/dashboard')}
              className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          )}

          {!practiceStarted ? (
            <>
              <div className="mb-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Code2 className="h-7 w-7" />
                </div>

                <h1 className="text-3xl font-bold">
                  Coding Assessment
                </h1>

                <p className="mt-2 text-muted-foreground">
                  Choose a Python topic and practice coding
                  problems at your own pace.
                </p>
              </div>

              <h2 className="mb-4 text-xl font-semibold">
                Choose a Topic
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => {
                  const selected =
                    selectedTopic === topic;

                  return (
                    <button
                      key={topic}
                      onClick={() =>
                        setSelectedTopic(topic)
                      }
                      className={`rounded-xl border p-5 text-left transition ${
                        selected
                          ? 'border-primary bg-primary/5'
                          : 'bg-card hover:border-primary/50'
                      }`}
                    >
                      <h3
                        className={`font-semibold ${
                          selected
                            ? 'text-primary'
                            : ''
                        }`}
                      >
                        {topic}
                      </h3>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Practice Python problems from
                        this topic.
                      </p>
                    </button>
                  );
                })}
              </div>

              {selectedTopic && (
                <div className="mt-8 rounded-2xl border bg-card p-6 shadow-sm">
                  <p className="text-sm text-muted-foreground">
                    Selected topic
                  </p>

                  <h3 className="mt-1 text-xl font-semibold">
                    {selectedTopic}
                  </h3>

                  <button
                    onClick={handleStartPractice}
                    className="mt-5 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
                  >
                    Start Practice
                  </button>
                </div>
              )}
            </>
          ) : currentQuestion ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <button
                  onClick={handleChangeTopic}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Change Topic
                </button>

                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restart
                </button>
              </div>

              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Python · {selectedTopic}
                  </p>

                  <h1 className="mt-1 text-2xl font-bold">
                    {currentQuestion.title}
                  </h1>
                </div>

                <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  Question {currentIndex + 1}
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">

                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      currentQuestion.difficulty ===
                      'Easy'
                        ? 'bg-green-500/10 text-green-600'
                        : currentQuestion.difficulty ===
                            'Medium'
                          ? 'bg-yellow-500/10 text-yellow-600'
                          : 'bg-red-500/10 text-red-600'
                    }`}
                  >
                    {currentQuestion.difficulty}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {currentQuestion.topic}
                  </span>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold">
                    Problem
                  </h2>

                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {currentQuestion.description}
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="font-semibold">
                      Your Code
                    </h2>

                    <span className="text-xs text-muted-foreground">
                      Python
                    </span>
                  </div>

                  <textarea
                    value={code}
                    onChange={(event) => {
                      setCode(event.target.value);
                      setResult(null);
                      setTestResults([]);
                      setExecutionError(null);
                    }}
                    spellCheck={false}
                    className="min-h-[320px] w-full resize-y rounded-xl border bg-muted/30 p-4 font-mono text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {(result ||
                  testResults.length > 0 ||
                  executionError) && (
                  <div className="mt-6 space-y-4">

                    {result && (
                      <div
                        className={`rounded-xl border p-5 ${
                          result === 'correct'
                            ? 'border-green-500/30 bg-green-500/10'
                            : 'border-red-500/30 bg-red-500/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {result === 'correct' ? (
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-600" />
                          )}

                          <div>
                            <h3 className="font-semibold">
                              {result === 'correct'
                                ? 'Correct!'
                                : 'Incorrect'}
                            </h3>

                            {totalTests > 0 && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {passedTests} of{' '}
                                {totalTests} test cases
                                passed
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="mt-3 text-sm text-muted-foreground">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    )}

                    {testResults.length > 0 && (
                      <div className="rounded-xl border bg-muted/20 p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="font-semibold">
                            Test Cases
                          </h3>

                          <span className="text-sm text-muted-foreground">
                            {passedTests}/{totalTests}
                            {' '}passed
                          </span>
                        </div>

                        <div className="space-y-3">
                          {testResults.map(
                            (test, index) => (
                              <div
                                key={index}
                                className={`rounded-lg border p-4 ${
                                  test.passed
                                    ? 'border-green-500/20 bg-green-500/5'
                                    : 'border-red-500/20 bg-red-500/5'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {test.passed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-600" />
                                  )}

                                  <span className="font-medium">
                                    Test Case {index + 1}
                                  </span>

                                  <span
                                    className={`ml-auto text-sm font-medium ${
                                      test.passed
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                    }`}
                                  >
                                    {test.passed
                                      ? 'Passed'
                                      : 'Failed'}
                                  </span>
                                </div>

                                {!test.passed && (
                                  <div className="mt-3 space-y-2 text-sm">
                                    <div>
                                      <span className="font-medium">
                                        Expected:
                                      </span>{' '}
                                      <code className="rounded bg-background px-2 py-1 font-mono">
                                        {formatValue(
                                          test.expectedOutput
                                        )}
                                      </code>
                                    </div>

                                    {test.error ? (
                                      <div>
                                        <span className="font-medium">
                                          Error:
                                        </span>{' '}
                                        <code className="text-red-600">
                                          {test.error}
                                        </code>
                                      </div>
                                    ) : (
                                      <div>
                                        <span className="font-medium">
                                          Your output:
                                        </span>{' '}
                                        <code className="rounded bg-background px-2 py-1 font-mono">
                                          {formatValue(
                                            test.actualOutput
                                          )}
                                        </code>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {executionError && (
                      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
                        <h3 className="font-semibold text-red-700 dark:text-red-400">
                          Python Error
                        </h3>

                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-sm text-red-600 dark:text-red-400">
                          {executionError}
                        </pre>
                      </div>
                    )}

                  </div>
                )}

                <div className="mt-6 flex flex-wrap justify-end gap-3">

                  <button
                    onClick={handleCheckCode}
                    disabled={isRunning}
                    className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isRunning
                      ? 'Running Tests...'
                      : 'Run Code'}
                  </button>

                  {result && (
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 rounded-lg border px-6 py-3 font-medium hover:bg-muted"
                    >
                      Next Question
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}

                </div>
              </div>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Practice without a timer or fixed question
                limit.
              </p>
            </>
          ) : null}

        </div>
      </div>
    </DashboardLayout>
  );
}