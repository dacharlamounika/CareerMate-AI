import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Calculator,
  CheckCircle2,
  RotateCcw,
  XCircle,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

import { DashboardLayout } from '@/components/DashboardLayout';
import {
  aptitudeQuestions,
  type AptitudeQuestion,
  type AptitudeCategory,
} from '@/features/assessment/utils/aptitudeQuestions';

type PracticeCategory = {
  name: AptitudeCategory;
  description: string;
  icon: typeof Calculator;
  topics: string[];
};

const practiceCategories: PracticeCategory[] = [
  {
    name: 'Quantitative Aptitude',
    description: 'Practice mathematical and numerical problems.',
    icon: Calculator,
    topics: [
      'Percentages',
      'Profit & Loss',
      'Average',
      'Ratio & Proportion',
      'Time & Work',
      'Time, Speed & Distance',
      'Simple Interest',
      'Compound Interest',
      'Number System',
      'HCF & LCM',
      'Ages',
      'Probability',
      'Permutation & Combination',
      'Geometry',
      'Data Interpretation',
    ],
  },
  {
    name: 'Logical Reasoning',
    description: 'Improve your logical thinking and problem-solving skills.',
    icon: Brain,
    topics: [
      'Number Series',
      'Letter Series',
      'Coding-Decoding',
      'Blood Relations',
      'Direction Sense',
      'Analogies',
      'Odd One Out',
      'Syllogisms',
      'Statements & Conclusions',
      'Seating Arrangement',
      'Clocks',
      'Calendars',
      'Logical Puzzles',
    ],
  },
  {
    name: 'Verbal Ability',
    description: 'Strengthen vocabulary, grammar and language skills.',
    icon: BookOpen,
    topics: [
      'Synonyms',
      'Antonyms',
      'Vocabulary',
      'Grammar',
      'Sentence Correction',
      'Fill in the Blanks',
      'Spellings',
      'Articles',
      'Prepositions',
      'Tenses',
      'Sentence Arrangement',
      'Reading Comprehension',
    ],
  },
];

function shuffleQuestions(
  questions: AptitudeQuestion[]
): AptitudeQuestion[] {
  const shuffled = [...questions];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function AptitudeAssessmentPage() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] =
    useState<PracticeCategory | null>(null);

  const [selectedTopic, setSelectedTopic] =
    useState<string | null>(null);

  const [practiceQuestions, setPracticeQuestions] =
    useState<AptitudeQuestion[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [answered, setAnswered] = useState(false);

  const [practiceStarted, setPracticeStarted] = useState(false);

  const currentQuestion = practiceQuestions[currentIndex];

  const isCorrect =
    answered &&
    selectedAnswer === currentQuestion?.correctAnswer;

  const progressText = useMemo(() => {
    if (!practiceQuestions.length) {
      return '';
    }

    return `Question ${currentIndex + 1}`;
  }, [currentIndex, practiceQuestions.length]);

  const handleStartPractice = () => {
    if (!selectedCategory || !selectedTopic) {
      return;
    }

    const topicQuestions = aptitudeQuestions.filter(
      (question) =>
        question.category === selectedCategory.name &&
        question.topic === selectedTopic
    );

    if (topicQuestions.length === 0) {
      return;
    }

    setPracticeQuestions(shuffleQuestions(topicQuestions));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setPracticeStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) {
      return;
    }

    setSelectedAnswer(answerIndex);
    setAnswered(true);
  };

  const handleNextQuestion = () => {
    if (!practiceQuestions.length) {
      return;
    }

    if (currentIndex < practiceQuestions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      return;
    }

    // All questions for this topic have been used.
    // Shuffle them again so practice can continue indefinitely.
    setPracticeQuestions((previous) =>
      shuffleQuestions(previous)
    );

    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
  };

  const handleRestartTopic = () => {
    if (!selectedCategory || !selectedTopic) {
      return;
    }

    handleStartPractice();
  };

  const handleChangeTopic = () => {
    setPracticeStarted(false);
    setSelectedAnswer(null);
    setAnswered(false);
    setCurrentIndex(0);
    setPracticeQuestions([]);
  };

  const handleChangeCategory = () => {
    setPracticeStarted(false);
    setSelectedCategory(null);
    setSelectedTopic(null);
    setSelectedAnswer(null);
    setAnswered(false);
    setCurrentIndex(0);
    setPracticeQuestions([]);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-5xl">
          {/* Back to dashboard */}
          {!practiceStarted && (
            <button
              onClick={() => navigate('/dashboard')}
              className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          )}

          {/* Practice screen */}
          {practiceStarted && currentQuestion ? (
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
                  onClick={handleRestartTopic}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restart
                </button>
              </div>

              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {selectedCategory?.name}
                    </p>

                    <h1 className="text-2xl font-bold">
                      {selectedTopic}
                    </h1>
                  </div>

                  <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    {progressText}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
                <div className="mb-6">
                  <p className="text-sm font-medium text-muted-foreground">
                    Practice Question
                  </p>

                  <h2 className="mt-3 text-xl font-semibold leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected =
                      selectedAnswer === index;

                    const isCorrectOption =
                      index === currentQuestion.correctAnswer;

                    let optionClass =
                      'border-border bg-background hover:border-primary/50 hover:bg-muted/50';

                    if (answered && isCorrectOption) {
                      optionClass =
                        'border-green-500 bg-green-500/10';
                    } else if (answered && isSelected) {
                      optionClass =
                        'border-red-500 bg-red-500/10';
                    } else if (isSelected) {
                      optionClass =
                        'border-primary bg-primary/10';
                    }

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          handleAnswerSelect(index)
                        }
                        disabled={answered}
                        className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${optionClass}`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold">
                          {String.fromCharCode(65 + index)}
                        </span>

                        <span className="flex-1">
                          {option}
                        </span>

                        {answered &&
                          isCorrectOption && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}

                        {answered &&
                          isSelected &&
                          !isCorrectOption && (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div
                    className={`mt-6 rounded-xl border p-5 ${
                      isCorrect
                        ? 'border-green-500/30 bg-green-500/10'
                        : 'border-red-500/30 bg-red-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold text-green-700 dark:text-green-400">
                            Correct!
                          </h3>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-600" />
                          <h3 className="font-semibold text-red-700 dark:text-red-400">
                            Incorrect
                          </h3>
                        </>
                      )}
                    </div>

                    {!isCorrect && (
                      <p className="mt-2 text-sm">
                        <span className="font-medium">
                          Correct answer:
                        </span>{' '}
                        {
                          currentQuestion.options[
                            currentQuestion.correctAnswer
                          ]
                        }
                      </p>
                    )}

                    <div className="mt-3">
                      <p className="text-sm font-medium">
                        Explanation
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  {!answered ? (
                    <p className="text-sm text-muted-foreground">
                      Select an answer to continue.
                    </p>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
                    >
                      Next Question
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Practice as long as you want. There is no timer or
                question limit.
              </p>
            </>
          ) : !selectedCategory ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold">
                  Aptitude
                </h1>

                <p className="mt-2 text-muted-foreground">
                  Choose a topic and practice at your own pace.
                </p>
              </div>

              <h2 className="mb-4 text-xl font-semibold">
                What would you like to practice?
              </h2>

              <div className="grid gap-5 md:grid-cols-3">
                {practiceCategories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <button
                      key={category.name}
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedTopic(null);
                      }}
                      className="group rounded-2xl border bg-card p-6 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                    >
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>

                      <h3 className="text-lg font-semibold">
                        {category.name}
                      </h3>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {category.description}
                      </p>

                      <div className="mt-5 flex items-center gap-1 text-sm font-medium text-primary">
                        Choose topic
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={handleChangeCategory}
                className="mb-5 text-sm font-medium text-primary hover:underline"
              >
                ← Choose another category
              </button>

              <div className="mb-6 rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">
                  {selectedCategory.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Select a topic to start practicing.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {selectedCategory.topics.map((topic) => {
                  const selected = selectedTopic === topic;

                  return (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                        selected
                          ? 'border-primary bg-primary/5'
                          : 'bg-card hover:bg-muted/50'
                      }`}
                    >
                      <span
                        className={`font-medium ${
                          selected ? 'text-primary' : ''
                        }`}
                      >
                        {topic}
                      </span>

                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}