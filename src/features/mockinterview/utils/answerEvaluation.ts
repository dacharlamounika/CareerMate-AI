import type {
  EvaluationResult,
  InterviewQuestion,
  QuestionCategory,
} from '../types/mockInterviewTypes';

const stopWords = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'as',
  'and', 'or', 'but', 'if', 'then', 'else', 'when', 'while', 'this',
  'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'my', 'your', 'our', 'their', 'me', 'him', 'her', 'us', 'them',
  'from', 'into', 'out', 'up', 'down', 'over', 'under', 'again',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'can',
  'could', 'should', 'may', 'might', 'must', 'shall', 'not', 'no',
  'so', 'than', 'too', 'very', 'just', 'also', 'only', 'such', 'because',
  'what', 'which', 'who', 'whom', 'whose', 'how', 'why', 'where',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 0 && !stopWords.has(t));
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number): number {
  return Math.round(value);
}

function wordCount(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
}

function sentenceCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  return Math.max(sentences.length, 1);
}

// ---------------------------------------------------------------------------
// Individual metric evaluators
// ---------------------------------------------------------------------------

function relevanceScore(answer: string, question: InterviewQuestion): number {
  if (!answer.trim()) return 0;
  const tokens = new Set(tokenize(answer));
  let matched = 0;
  question.keywords.forEach((kw) => {
    const kwTokens = tokenize(kw);
    const hit = kwTokens.length > 0 && kwTokens.some((t) => tokens.has(t));
    if (hit) matched += 1;
  });
  const ratio = question.keywords.length === 0 ? 0 : matched / question.keywords.length;
  return clamp(ratio * 100);
}

function completenessScore(answer: string, question: InterviewQuestion): number {
  if (!answer.trim()) return 0;
  const answerTokens = new Set(tokenize(answer));
  const modelTokens = new Set(tokenize(question.modelAnswer));
  let matched = 0;
  modelTokens.forEach((t) => {
    if (answerTokens.has(t)) matched += 1;
  });
  const ratio = modelTokens.size === 0 ? 0 : matched / modelTokens.size;
  const lengthBonus = answer.length >= question.modelAnswer.length * 0.4 ? 10 : 0;
  return clamp(ratio * 90 + lengthBonus);
}

function clarityScore(answer: string): number {
  const trimmed = answer.trim();
  if (!trimmed) return 0;
  const sentences = sentenceCount(trimmed);
  const words = wordCount(trimmed);
  if (words === 0) return 0;
  const avgSentenceLength = words / Math.max(sentences, 1);
  let score = 60;
  if (avgSentenceLength >= 8 && avgSentenceLength <= 28) score += 25;
  else if (avgSentenceLength < 8) score -= 5;
  else if (avgSentenceLength > 40) score -= 20;
  else score -= 5;
  if (/^(first|second|third|finally|in conclusion|to summar|for example|however|therefore|additionally|moreover|overall|in summary)/im.test(trimmed)) {
    score += 15;
  }
  const longWords = trimmed.split(/\s+/).filter((w) => w.length > 12).length;
  if (longWords / words > 0.25) score -= 10;
  if (sentences >= 3) score += 5;
  return clamp(score);
}

function lengthScore(answer: string, question: InterviewQuestion): number {
  const wc = wordCount(answer);
  if (wc === 0) return 0;

  const isHr = question.category === 'HR' || question.category === 'Behavioral';
  const isProject = question.category === 'Project-Based';
  const isTechnical = question.category === 'Technical' || question.category === 'Role-Specific';

  let minWords = 40;
  let idealMin = 60;
  let idealMax = 180;

  if (isHr) {
    minWords = 30;
    idealMin = 50;
    idealMax = 150;
  } else if (isProject) {
    minWords = 50;
    idealMin = 80;
    idealMax = 220;
  } else if (isTechnical) {
    minWords = 40;
    idealMin = 60;
    idealMax = 160;
  }

  if (wc < minWords) {
    return clamp(Math.round((wc / minWords) * 50));
  }
  if (wc >= idealMin && wc <= idealMax) return 100;
  if (wc < idealMin) {
    return clamp(50 + Math.round(((wc - minWords) / (idealMin - minWords)) * 50));
  }
  // Over ideal: slight penalty for verbosity
  const excess = wc - idealMax;
  return clamp(100 - Math.min(excess * 0.3, 25));
}

function exampleScore(answer: string, question: InterviewQuestion): number {
  const trimmed = answer.trim();
  if (!trimmed) return 0;

  const lower = trimmed.toLowerCase();

  const exampleMarkers = [
    'for example', 'for instance', 'e.g.', 'eg ', 'such as',
    'like ', 'to illustrate', 'a concrete example', 'a real example',
    'example:', 'one example', 'another example', 'case',
  ];
  let markerHits = 0;
  exampleMarkers.forEach((m) => {
    if (lower.includes(m)) markerHits += 1;
  });

  // STAR / situational language for behavioral/project questions
  const starMarkers = ['situation', 'task', 'action', 'result', 'i did', 'i built', 'i implemented', 'i created', 'i solved', 'i led', 'i worked', 'i used', 'my role', 'my contribution', 'outcome'];
  let starHits = 0;
  starMarkers.forEach((m) => {
    if (lower.includes(m)) starHits += 1;
  });

  const isHr = question.category === 'HR' || question.category === 'Behavioral';
  const isProject = question.category === 'Project-Based';

  let score = 0;
  if (markerHits > 0) score += Math.min(markerHits * 25, 50);
  if (starHits > 0) score += Math.min(starHits * 15, 50);

  // For HR/project: examples matter a lot
  if (isHr || isProject) {
    if (starHits === 0 && markerHits === 0) return clamp(score + 10);
    return clamp(score);
  }

  // For technical: examples are a bonus
  if (question.category === 'Technical' || question.category === 'Role-Specific') {
    if (markerHits === 0 && starHits === 0) {
      // Check for general elaboration beyond pure definition
      const wc = wordCount(trimmed);
      if (wc >= 80) score += 25;
      else score += 10;
    }
    return clamp(score);
  }

  return clamp(score);
}

function technicalScore(
  answer: string,
  question: InterviewQuestion,
  relevance: number,
  completeness: number
): number {
  if (!answer.trim()) return 0;
  let base: number;
  if (question.category === 'HR' || question.category === 'Behavioral') {
    base = clarityScore(answer) * 0.35 + completeness * 0.45 + exampleScore(answer, question) * 0.2;
  } else if (question.category === 'Project-Based') {
    base = relevance * 0.25 + completeness * 0.3 + exampleScore(answer, question) * 0.25 + clarityScore(answer) * 0.2;
  } else {
    base = relevance * 0.5 + completeness * 0.4 + clarityScore(answer) * 0.1;
  }
  return clamp(base);
}

// ---------------------------------------------------------------------------
// Category-specific feedback builders
// ---------------------------------------------------------------------------

function technicalFeedback(
  question: InterviewQuestion,
  relevance: number,
  technical: number,
  clarity: number,
  completeness: number,
  lengthSc: number,
  exampleSc: number,
  answer: string,
  didWell: string[],
  couldImprove: string[]
): void {
  if (relevance >= 60) {
    didWell.push('Your answer addresses the core concept the question is asking about.');
  } else if (relevance >= 30) {
    couldImprove.push('You touched on the topic, but make sure to directly address the specific concept being asked about.');
  } else {
    couldImprove.push('Your answer does not yet cover the key technical concepts expected for this question. Review the topic and try again.');
  }

  if (completeness >= 60) {
    didWell.push('You covered most of the important technical points expected in a strong answer.');
  } else {
    couldImprove.push('Your answer is missing key technical details. Aim to include the definition, how it works, and a trade-off or use case.');
  }

  if (clarity >= 70) {
    didWell.push('Your explanation is clear and easy to follow.');
  } else if (clarity < 45) {
    couldImprove.push('Structure your explanation more clearly — break it into definition, explanation, and example to improve readability.');
  }

  if (lengthSc >= 70) {
    didWell.push('Your answer has appropriate depth for a technical question.');
  } else {
    couldImprove.push('Aim for 60–160 words so you can explain the concept with enough detail to show understanding.');
  }

  // Check for technical terms from keywords
  const lower = answer.toLowerCase();
  const matchedTerms = question.keywords.filter((kw) =>
    tokenize(kw).some((t) => lower.includes(t))
  );
  if (matchedTerms.length >= 3) {
    didWell.push(`Good use of technical terminology (${matchedTerms.slice(0, 4).join(', ')}).`);
  } else if (matchedTerms.length <= 1) {
    couldImprove.push('Include more relevant technical terms to demonstrate domain knowledge.');
  }

  if (exampleSc >= 50) {
    didWell.push('You included a concrete example or real-world application.');
  } else {
    couldImprove.push('Add a concrete example or trade-off to show applied understanding, not just a definition.');
  }
}

function hrFeedback(
  question: InterviewQuestion,
  relevance: number,
  technical: number,
  clarity: number,
  completeness: number,
  lengthSc: number,
  exampleSc: number,
  answer: string,
  didWell: string[],
  couldImprove: string[]
): void {
  const lower = answer.toLowerCase();

  if (relevance >= 50) {
    didWell.push('Your answer is relevant to the question and stays on topic.');
  } else {
    couldImprove.push('Make sure your answer directly responds to what is being asked — avoid generic or off-topic responses.');
  }

  if (clarity >= 70) {
    didWell.push('Your response is clearly written and easy to follow.');
  } else if (clarity < 45) {
    couldImprove.push('Use shorter, well-connected sentences. Break your answer into 2–3 distinct points.');
  }

  // Structure detection: look for signposting or multi-part answers
  const structureMarkers = ['first', 'second', 'third', 'additionally', 'also', 'finally', 'overall', 'in summary', 'to conclude'];
  const hasStructure = structureMarkers.some((m) => lower.includes(m));
  const sentences = sentenceCount(answer);
  if (hasStructure || sentences >= 3) {
    didWell.push('Your answer has a clear structure with distinct parts.');
  } else {
    couldImprove.push('Structure your answer into clear parts — e.g., introduction, main point, and conclusion.');
  }

  // Specific examples
  if (exampleSc >= 50) {
    didWell.push('You included a specific personal example, which strengthens your response.');
  } else {
    couldImprove.push('Add a specific example from your experience to make your answer more convincing and memorable.');
  }

  // Positive professional framing
  const positiveMarkers = ['learned', 'grew', 'improved', 'opportunity', 'excited', 'passionate', 'enthusiastic', 'goal', 'contribute', 'team', 'collaborate', 'achieve', 'success'];
  const negativeMarkers = ['hate', 'boring', 'lazy', 'bad', 'terrible', 'awful', 'stupid', 'can\'t', 'cannot', 'impossible', 'worst'];
  const positiveHits = positiveMarkers.filter((m) => lower.includes(m)).length;
  const negativeHits = negativeMarkers.filter((m) => lower.includes(m)).length;
  if (positiveHits >= 2 && negativeHits === 0) {
    didWell.push('Your answer is framed positively and professionally.');
  } else if (negativeHits > positiveHits) {
    couldImprove.push('Reframe your answer in a positive, professional tone — focus on growth, learning, and what you can contribute.');
  } else if (positiveHits === 0) {
    couldImprove.push('Add positive professional language — express enthusiasm, growth mindset, or what you can contribute.');
  }

  if (lengthSc >= 70) {
    didWell.push('Your answer is a good length for an HR question.');
  } else {
    couldImprove.push('Aim for 50–150 words — enough to make your point with a brief example, without rambling.');
  }
}

function projectFeedback(
  question: InterviewQuestion,
  relevance: number,
  technical: number,
  clarity: number,
  completeness: number,
  lengthSc: number,
  exampleSc: number,
  answer: string,
  didWell: string[],
  couldImprove: string[]
): void {
  const lower = answer.toLowerCase();

  // Check for the five key project elements: problem, technology, implementation, contribution, result
  const problemMarkers = ['problem', 'issue', 'challenge', 'need', 'requirement', 'goal', 'objective', 'solve', 'address'];
  const techMarkers = ['technology', 'technologies', 'tech stack', 'framework', 'library', 'tool', 'language', 'react', 'node', 'python', 'java', 'django', 'flask', 'spring', 'sql', 'mongodb', 'api', 'aws', 'docker'];
  const implMarkers = ['implemented', 'built', 'developed', 'designed', 'created', 'coded', 'architected', 'structured', 'approach', 'method'];
  const contribMarkers = ['i did', 'i built', 'i implemented', 'i created', 'i designed', 'i developed', 'i solved', 'i led', 'i worked', 'my role', 'my contribution', 'i was responsible', 'i wrote', 'i integrated', 'i optimized'];
  const resultMarkers = ['result', 'outcome', 'resulted', 'achieved', 'delivered', 'launched', 'completed', 'learned', 'impact', 'improved', 'success'];

  const problemHits = problemMarkers.filter((m) => lower.includes(m)).length;
  const techHits = techMarkers.filter((m) => lower.includes(m)).length;
  const implHits = implMarkers.filter((m) => lower.includes(m)).length;
  const contribHits = contribMarkers.filter((m) => lower.includes(m)).length;
  const resultHits = resultMarkers.filter((m) => lower.includes(m)).length;

  if (problemHits > 0) didWell.push('You clearly described the problem or goal of the project.');
  else couldImprove.push('Start by clearly stating the problem or goal your project addressed.');

  if (techHits > 0) didWell.push('You mentioned the technologies or tools you used.');
  else couldImprove.push('Name the specific technologies, frameworks, or tools you used in the project.');

  if (implHits > 0) didWell.push('You described how you implemented the solution.');
  else couldImprove.push('Explain your implementation approach — how did you build it?');

  if (contribHits > 0) didWell.push('You highlighted your individual contribution to the project.');
  else couldImprove.push('Make your personal contribution clear — use "I did..." rather than "we did..." so the interviewer knows your role.');

  if (resultHits > 0) didWell.push('You shared the result or outcome of the project.');
  else couldImprove.push('End with the result or outcome — what was delivered, what you learned, or the impact it had.');

  if (clarity >= 70) didWell.push('Your description is well-organized and easy to follow.');
  else if (clarity < 45) couldImprove.push('Organize your project description more clearly — use a logical flow: problem, approach, implementation, result.');

  if (lengthSc >= 70) didWell.push('Your answer has enough detail for a project question.');
  else couldImprove.push('Aim for 80–220 words to cover all five elements: problem, technology, implementation, contribution, and result.');
}

function buildFeedback(
  question: InterviewQuestion,
  relevance: number,
  technical: number,
  clarity: number,
  completeness: number,
  lengthSc: number,
  exampleSc: number,
  answer: string
): { didWell: string[]; couldImprove: string[]; suggestedStructure: string } {
  const didWell: string[] = [];
  const couldImprove: string[] = [];

  if (question.category === 'HR' || question.category === 'Behavioral') {
    hrFeedback(question, relevance, technical, clarity, completeness, lengthSc, exampleSc, answer, didWell, couldImprove);
  } else if (question.category === 'Project-Based') {
    projectFeedback(question, relevance, technical, clarity, completeness, lengthSc, exampleSc, answer, didWell, couldImprove);
  } else {
    technicalFeedback(question, relevance, technical, clarity, completeness, lengthSc, exampleSc, answer, didWell, couldImprove);
  }

  // Ensure we always have at least one of each
  if (didWell.length === 0) {
    didWell.push('You attempted the question — that itself builds interview confidence.');
  }
  if (couldImprove.length === 0) {
    couldImprove.push('Keep refining your answer structure and adding examples for even stronger responses.');
  }

  const suggestedStructure =
    question.category === 'Behavioral' || question.category === 'HR'
      ? '1) Briefly set the situation/context. 2) State the task or challenge. 3) Describe the specific action you took. 4) Share the result and what you learned. (STAR method)'
      : question.category === 'Project-Based'
        ? '1) State the problem or goal. 2) Name the technologies you used. 3) Explain your implementation approach. 4) Highlight your individual contribution. 5) Share the result, outcome, or what you learned.'
        : '1) Define the concept clearly. 2) Explain how it works or when to use it. 3) Give a concrete example or trade-off. 4) Conclude with why it matters.';

  return { didWell, couldImprove, suggestedStructure };
}

function shortFeedbackLabel(
  overall: number,
  question: InterviewQuestion
): string {
  const cat = question.category;
  if (overall >= 80) {
    if (cat === 'HR' || cat === 'Behavioral') return 'Strong, well-structured response — great job!';
    if (cat === 'Project-Based') return 'Excellent project description with all key elements covered!';
    return 'Strong technical answer — well explained!';
  }
  if (overall >= 60) {
    if (cat === 'HR' || cat === 'Behavioral') return 'Good response with room to add more specific examples.';
    if (cat === 'Project-Based') return 'Good project overview — add more detail on your contribution and results.';
    return 'Good technical answer — add an example to make it stronger.';
  }
  if (overall >= 40) {
    if (cat === 'HR' || cat === 'Behavioral') return 'Partial response — needs more structure and a concrete example.';
    if (cat === 'Project-Based') return 'Partial description — make sure to cover problem, tech, implementation, contribution, and result.';
    return 'Partial answer — needs more depth, technical detail, and structure.';
  }
  if (overall > 0) return 'This answer needs significant improvement — review the suggested structure below.';
  return 'No answer submitted.';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function evaluateAnswer(
  question: InterviewQuestion,
  answer: string,
  skipped: boolean
): EvaluationResult {
  if (skipped || !answer.trim()) {
    return {
      overallScore: 0,
      relevanceScore: 0,
      technicalScore: 0,
      clarityScore: 0,
      completenessScore: 0,
      lengthScore: 0,
      exampleScore: 0,
      shortFeedback: skipped ? 'Question was skipped.' : 'No answer submitted.',
      didWell: [],
      couldImprove: ['Attempt every question, even with a brief answer, to maximise practice value.'],
      suggestedStructure:
        question.category === 'HR' || question.category === 'Behavioral'
          ? '1) Situation/context. 2) Task or challenge. 3) Action you took. 4) Result and what you learned. (STAR)'
          : question.category === 'Project-Based'
            ? '1) Problem. 2) Technologies used. 3) Implementation approach. 4) Your contribution. 5) Result/outcome.'
            : '1) Define the concept. 2) Explain how it works. 3) Give an example. 4) Why it matters.',
    };
  }

  const relevance = relevanceScore(answer, question);
  const completeness = completenessScore(answer, question);
  const clarity = clarityScore(answer);
  const lengthSc = lengthScore(answer, question);
  const exampleSc = exampleScore(answer, question);
  const technical = technicalScore(answer, question, relevance, completeness);

  // Overall: weight varies by category
  let overall: number;
  if (question.category === 'HR' || question.category === 'Behavioral') {
    overall =
      relevance * 0.15 +
      technical * 0.2 +
      clarity * 0.2 +
      completeness * 0.15 +
      lengthSc * 0.1 +
      exampleSc * 0.2;
  } else if (question.category === 'Project-Based') {
    overall =
      relevance * 0.15 +
      technical * 0.15 +
      clarity * 0.15 +
      completeness * 0.15 +
      lengthSc * 0.1 +
      exampleSc * 0.3;
  } else {
    overall =
      relevance * 0.25 +
      technical * 0.3 +
      clarity * 0.1 +
      completeness * 0.2 +
      lengthSc * 0.1 +
      exampleSc * 0.05;
  }

  const { didWell, couldImprove, suggestedStructure } = buildFeedback(
    question,
    relevance,
    technical,
    clarity,
    completeness,
    lengthSc,
    exampleSc,
    answer
  );

  return {
    overallScore: round(overall),
    relevanceScore: round(relevance),
    technicalScore: round(technical),
    clarityScore: round(clarity),
    completenessScore: round(completeness),
    lengthScore: round(lengthSc),
    exampleScore: round(exampleSc),
    shortFeedback: shortFeedbackLabel(round(overall), question),
    didWell,
    couldImprove,
    suggestedStructure,
  };
}

export function aggregateSession(
  answers: { question: InterviewQuestion; answer: string; skipped: boolean; evaluation: EvaluationResult }[]
): {
  overallScore: number;
  attempted: number;
  skipped: number;
  averageScore: number;
  categoryPerformance: Record<QuestionCategory, number>;
  strengths: string[];
  areasToImprove: string[];
} {
  const attempted = answers.filter((a) => !a.skipped && a.answer.trim()).length;
  const skipped = answers.length - attempted;
  const evaluated = answers.filter((a) => !a.skipped && a.answer.trim());
  const overallScore =
    evaluated.length === 0
      ? 0
      : round(evaluated.reduce((sum, a) => sum + a.evaluation.overallScore, 0) / evaluated.length);
  const averageScore = overallScore;

  const categories: QuestionCategory[] = [
    'Technical',
    'HR',
    'Role-Specific',
    'Project-Based',
    'Behavioral',
  ];
  const categoryPerformance = {} as Record<QuestionCategory, number>;
  categories.forEach((cat) => {
    const inCat = evaluated.filter((a) => a.question.category === cat);
    categoryPerformance[cat] =
      inCat.length === 0
        ? 0
        : round(inCat.reduce((s, a) => s + a.evaluation.overallScore, 0) / inCat.length);
  });

  const strengths: string[] = [];
  const areasToImprove: string[] = [];
  categories.forEach((cat) => {
    const score = categoryPerformance[cat];
    const present = evaluated.some((a) => a.question.category === cat);
    if (!present) return;
    if (score >= 70) strengths.push(`${cat} questions — averaged ${score}/100`);
    else if (score < 50) areasToImprove.push(`${cat} questions — averaged ${score}/100`);
  });

  const avgRelevance = evaluated.length
    ? round(evaluated.reduce((s, a) => s + a.evaluation.relevanceScore, 0) / evaluated.length)
    : 0;
  const avgClarity = evaluated.length
    ? round(evaluated.reduce((s, a) => s + a.evaluation.clarityScore, 0) / evaluated.length)
    : 0;
  const avgExample = evaluated.length
    ? round(evaluated.reduce((s, a) => s + a.evaluation.exampleScore, 0) / evaluated.length)
    : 0;
  const avgLength = evaluated.length
    ? round(evaluated.reduce((s, a) => s + a.evaluation.lengthScore, 0) / evaluated.length)
    : 0;

  if (avgRelevance >= 70) strengths.push('Staying on topic and addressing the question directly');
  else if (avgRelevance < 50) areasToImprove.push('Focusing answers on the specific question asked');

  if (avgClarity >= 70) strengths.push('Clear and readable sentence structure');
  else if (avgClarity < 50) areasToImprove.push('Improving clarity with shorter, well-structured sentences');

  if (avgExample >= 60) strengths.push('Including concrete examples to support your answers');
  else if (avgExample < 35) areasToImprove.push('Adding specific examples to make answers more convincing');

  if (avgLength >= 70) strengths.push('Writing answers with appropriate depth and length');
  else if (avgLength < 45) areasToImprove.push('Writing more detailed answers — aim for at least 50-60 words');

  if (strengths.length === 0) strengths.push('Completing the practice session — consistency builds skill.');
  if (areasToImprove.length === 0) areasToImprove.push('Aim to add more concrete examples to deepen your answers.');

  return {
    overallScore,
    attempted,
    skipped,
    averageScore,
    categoryPerformance,
    strengths,
    areasToImprove,
  };
}

export function readinessSummary(overallScore: number): string {
  if (overallScore >= 80)
    return 'You are demonstrating strong interview readiness. Continue practising to maintain consistency and tackle harder questions.';
  if (overallScore >= 60)
    return 'You are on the right track. With more depth and structure in your answers, you will be well prepared for real interviews.';
  if (overallScore >= 40)
    return 'You have a foundation to build on. Focus on structuring your answers and adding concrete examples before your next session.';
  return 'This is a starting point. Practise regularly, review the suggested answer structures, and aim to attempt every question.';
}
