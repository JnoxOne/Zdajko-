import type { Question } from "../data/questions";

export const EXAM_MAX = 74;
export const EXAM_PASS = 68;

export interface RoundOptions {
  size: number;
  /** Every n-th card is an A/B/C question, like the specialist part of the exam. */
  abcEvery: number;
  /** Question ids to put first, e.g. earlier mistakes. */
  focus?: string[];
  random?: () => number;
}

export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildRound(questions: Question[], { size, abcEvery, focus = [], random = Math.random }: RoundOptions): Question[] {
  const focused = new Set(focus);
  // Focused questions go first in each pool, the rest is shuffled behind them.
  const pool = (type: Question["type"]) => {
    const all = questions.filter(q => q.type === type);
    return [...shuffle(all.filter(q => focused.has(q.id)), random), ...shuffle(all.filter(q => !focused.has(q.id)), random)];
  };
  const yn = pool("yn");
  const abc = pool("abc");
  const out: Question[] = [];
  let y = 0;
  let a = 0;
  while (out.length < size && (y < yn.length || a < abc.length)) {
    const wantAbc = (out.length + 1) % abcEvery === 0;
    if ((wantAbc && a < abc.length) || y >= yn.length) out.push(abc[a++]);
    else out.push(yn[y++]);
  }
  return out;
}

export function isCorrect(q: Question, answer: boolean | number): boolean {
  return q.type === "yn" ? answer === q.answer : answer === q.answer;
}

/** Converts a round score to the 74-point exam scale. */
export function toExamScale(score: number, max: number): { points: number; passed: boolean } {
  const points = max > 0 ? Math.round((score / max) * EXAM_MAX) : 0;
  return { points, passed: points >= EXAM_PASS };
}
