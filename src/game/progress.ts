export interface QuestionStats {
  seen: number;
  correct: number;
  /** True when the most recent answer was wrong, so the question waits in the review pile. */
  lastWrong: boolean;
}

export interface Progress {
  totalPoints: number;
  rounds: number;
  bestStreak: number;
  questions: Record<string, QuestionStats>;
}

export const emptyProgress = (): Progress => ({ totalPoints: 0, rounds: 0, bestStreak: 0, questions: {} });

export function recordAnswer(p: Progress, id: string, correct: boolean, points: number): Progress {
  const prev = p.questions[id] ?? { seen: 0, correct: 0, lastWrong: false };
  return {
    ...p,
    totalPoints: p.totalPoints + (correct ? points : 0),
    questions: { ...p.questions, [id]: { seen: prev.seen + 1, correct: prev.correct + (correct ? 1 : 0), lastWrong: !correct } }
  };
}

export function finishRound(p: Progress, bestStreak: number): Progress {
  return { ...p, rounds: p.rounds + 1, bestStreak: Math.max(p.bestStreak, bestStreak) };
}

export const mistakes = (p: Progress) => Object.keys(p.questions).filter(id => p.questions[id].lastWrong);

/** A question counts as learned once it was answered right and is not waiting for review. */
export const learnedCount = (p: Progress) => Object.values(p.questions).filter(s => s.correct > 0 && !s.lastWrong).length;

const KEY = "zdajko.progress.v1";

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...emptyProgress(), ...JSON.parse(raw) } : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Private mode or blocked storage: the app still works, progress just isn't kept.
  }
}
