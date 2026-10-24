import type { Progress } from "../game/progress";
import { learnedCount, mistakes } from "../game/progress";

interface Props {
  progress: Progress;
  totalQuestions: number;
  onPlay: () => void;
  onReview: () => void;
}

export function Home({ progress, totalQuestions, onPlay, onReview }: Props) {
  const learned = learnedCount(progress);
  const toReview = mistakes(progress).length;
  return (
    <div className="home">
      <div className="hero">
        <h1>Zdaj<b>ko</b></h1>
        <p>Teoria na prawko w kartach. Przesuwasz w prawo, gdy TAK, w lewo, gdy NIE. Co czwarta karta to pytanie A/B/C, jak na egzaminie.</p>
      </div>
      <div className="summary">
        <div><small>Zdobyte punkty</small><span>{progress.totalPoints}</span></div>
        <div><small>Opanowane</small><span>{learned}<em> / {totalQuestions}</em></span></div>
        <div><small>Najdłuższa seria</small><span>{progress.bestStreak}</span></div>
      </div>
      <div className="actions">
        <button className="primary" onClick={onPlay}>Graj rundę</button>
        <button className="ghost" onClick={onReview} disabled={toReview === 0}>
          {toReview === 0 ? "Brak błędów do powtórki" : `Powtórz błędy (${toReview})`}
        </button>
      </div>
      <div className="soon">
        <h4>Wkrótce</h4>
        <p>Liga tygodnia, znajomi i wyzwania na punkty.</p>
      </div>
      <p className="fine">Pytania w tej wersji są przykładowe, napisane na podstawie przepisów. Docelowo aplikacja użyje oficjalnej bazy pytań egzaminacyjnych.</p>
    </div>
  );
}
