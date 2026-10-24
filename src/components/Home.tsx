import type { CategoryId } from "../data/categories";
import type { Progress } from "../game/progress";

interface Props {
  progress: Progress;
  category: CategoryId;
  /** Questions of the chosen licence category. */
  questionIds: Set<string>;
  mistakesCount: number;
  loading: boolean;
  onPlay: () => void;
  onReview: () => void;
  onChangeCategory: () => void;
}

export function Home({ progress, category, questionIds, mistakesCount, loading, onPlay, onReview, onChangeCategory }: Props) {
  const learned = [...questionIds].filter(id => {
    const s = progress.questions[id];
    return s && s.correct > 0 && !s.lastWrong;
  }).length;
  return (
    <div className="home">
      <div className="hero">
        <h1>Zdaj<b>ko</b></h1>
        <p>Teoria na prawko w kartach. Przesuwasz w prawo, gdy TAK, w lewo, gdy NIE. Co czwarta karta to pytanie A/B/C, jak na egzaminie.</p>
      </div>
      <button className="chip" onClick={onChangeCategory}>Kategoria <b>{category}</b> · zmień</button>
      <div className="summary">
        <div><small>Zdobyte punkty</small><span>{progress.totalPoints}</span></div>
        <div><small>Opanowane</small><span>{learned}<em> / {loading ? "…" : questionIds.size}</em></span></div>
        <div><small>Najdłuższa seria</small><span>{progress.bestStreak}</span></div>
      </div>
      <div className="actions">
        <button className="primary" onClick={onPlay} disabled={loading || questionIds.size === 0}>
          {loading ? "Wczytuję pytania…" : "Graj rundę"}
        </button>
        <button className="ghost" onClick={onReview} disabled={mistakesCount === 0}>
          {mistakesCount === 0 ? "Brak błędów do powtórki" : `Powtórz błędy (${mistakesCount})`}
        </button>
      </div>
      <div className="soon">
        <h4>Wkrótce</h4>
        <p>Liga tygodnia, znajomi i wyzwania na punkty.</p>
      </div>
      <p className="fine">Pytania pochodzą z oficjalnej bazy pytań egzaminacyjnych Ministerstwa Infrastruktury (gov.pl).</p>
    </div>
  );
}
