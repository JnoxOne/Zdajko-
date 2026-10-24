import { EXAM_MAX, EXAM_PASS, toExamScale } from "../game/round";
import type { RoundResult } from "./Game";

interface Props {
  result: RoundResult;
  mistakesCount: number;
  onAgain: () => void;
  onReview: () => void;
  onHome: () => void;
}

export function Results({ result, mistakesCount, onAgain, onReview, onHome }: Props) {
  const exam = toExamScale(result.score, result.max);
  return (
    <div className="result">
      <h2>{exam.passed ? "Zdane!" : "Jeszcze trochę"}</h2>
      <div className="verdict">
        <span className={`pill ${exam.passed ? "pass" : "fail"}`}>{exam.passed ? "Wynik pozytywny" : "Wynik negatywny"}</span>
        <div className="big">{exam.points}<small> / {EXAM_MAX} pkt</small></div>
        <p>
          Przeliczone na skalę egzaminu (próg {EXAM_PASS}). W tej rundzie: {result.score} z {result.max} pkt,{" "}
          {result.correct} z {result.total} dobrze, najdłuższa seria {result.bestStreak}.
        </p>
      </div>
      <button className="primary" onClick={onAgain}>Zagraj jeszcze raz</button>
      {mistakesCount > 0 && <button className="ghost" onClick={onReview}>Powtórz błędy ({mistakesCount})</button>}
      <button className="link" onClick={onHome}>Wróć do menu</button>
    </div>
  );
}
