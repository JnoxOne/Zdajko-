import { useCallback, useEffect, useRef, useState } from "react";
import type { Question } from "../data/questions";
import { isCorrect } from "../game/round";
import { Card } from "./Card";

export interface RoundResult {
  score: number;
  max: number;
  correct: number;
  total: number;
  bestStreak: number;
}

interface Props {
  round: Question[];
  onAnswer: (q: Question, correct: boolean) => void;
  onFinish: (result: RoundResult) => void;
  onQuit: () => void;
}

const LETTERS = ["A", "B", "C"];

export function Game({ round, onAnswer, onFinish, onQuit }: Props) {
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<boolean | number | null>(null);
  const [stats, setStats] = useState({ score: 0, max: 0, correct: 0, streak: 0, best: 0 });
  const nextBtn = useRef<HTMLButtonElement>(null);

  const q = round[i];
  const next = round[i + 1];
  const answered = answer !== null;
  const ok = answered && isCorrect(q, answer);

  const answerWith = useCallback((value: boolean | number) => {
    if (answer !== null) return;
    const correct = isCorrect(q, value);
    setAnswer(value);
    setStats(s => {
      const streak = correct ? s.streak + 1 : 0;
      return { score: s.score + (correct ? q.points : 0), max: s.max + q.points, correct: s.correct + (correct ? 1 : 0), streak, best: Math.max(s.best, streak) };
    });
    onAnswer(q, correct);
  }, [answer, q, onAnswer]);

  const goNext = useCallback(() => {
    if (answer === null) return;
    if (i + 1 >= round.length) {
      onFinish({ score: stats.score, max: stats.max, correct: stats.correct, total: round.length, bestStreak: stats.best });
      return;
    }
    setAnswer(null);
    setI(i + 1);
  }, [answer, i, round.length, stats, onFinish]);

  useEffect(() => { if (answered) nextBtn.current?.focus({ preventScroll: true }); }, [answered]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (answer !== null) {
        if (["Enter", " ", "ArrowRight", "ArrowLeft"].includes(e.key)) { e.preventDefault(); goNext(); }
        return;
      }
      if (q.type === "yn") {
        if (e.key === "ArrowRight") answerWith(true);
        if (e.key === "ArrowLeft") answerWith(false);
      } else {
        const k = ({ a: 0, b: 1, c: 2, "1": 0, "2": 1, "3": 2 } as Record<string, number>)[e.key.toLowerCase()];
        if (k !== undefined) answerWith(k);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, q, answerWith, goNext]);

  const correctLabel = q.type === "yn" ? (q.answer ? "TAK" : "NIE") : `${LETTERS[q.answer]}. ${q.options[q.answer]}`;

  return (
    <>
      <div className="topbar">
        <button className="link" onClick={onQuit} aria-label="Wróć do menu">← Menu</button>
        <div className="stats">
          <div className="stat"><small>Punkty</small><span key={stats.score} className="bump">{stats.score}</span></div>
          <div className="stat streak"><small>Seria</small><span key={`s${stats.streak}`} className="bump">{stats.streak}</span></div>
        </div>
      </div>
      <div className="progress">
        <div className="bar"><i style={{ width: `${((i + (answered ? 1 : 0)) / round.length) * 100}%` }} /></div>
        <span>{i + 1} / {round.length}</span>
      </div>
      <div className="deck">
        {next && <Card key={next.id + "-under"} question={next} answer={null} under rising={answered} />}
        <Card key={q.id} question={q} answer={answer} onAnswer={answerWith} />
      </div>
      <div>
        <div className="controls">
          <button className="btn no" aria-label="Nie" disabled={q.type !== "yn" || answered} onClick={() => answerWith(false)}>
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /></svg>
            <small>NIE</small>
          </button>
          <button className="btn yes" aria-label="Tak" disabled={q.type !== "yn" || answered} onClick={() => answerWith(true)}>
            <svg width="28" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <small>TAK</small>
          </button>
        </div>
        <div className="keys">
          {q.type === "yn" ? "Przesuń kartę: w prawo TAK, w lewo NIE" : "Wybierz odpowiedź A, B lub C"}
        </div>
      </div>
      <div className={`sheet${answered ? " show" : ""}${answered ? (ok ? " good" : " bad") : ""}`} role="status" aria-live="polite">
        {answered && (
          <>
            <h3>{ok ? `Dobrze! +${q.points} pkt` : "Pudło"}</h3>
            <div className="sq">{ok ? q.question : `Poprawna odpowiedź: ${correctLabel}`}</div>
            <p>{q.explanation}</p>
          </>
        )}
        <button ref={nextBtn} className="next" onClick={goNext} tabIndex={answered ? 0 : -1}>
          {i + 1 >= round.length ? "Zobacz wynik" : "Dalej"}
        </button>
      </div>
    </>
  );
}
