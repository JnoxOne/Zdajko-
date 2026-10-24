import { useCallback, useEffect, useMemo, useState } from "react";
import { EXAMPLE_QUESTIONS, type Question } from "./data/questions";
import { loadBank } from "./data/bank";
import { loadCategory, saveCategory, type CategoryId } from "./data/categories";
import { buildRound } from "./game/round";
import { finishRound, loadProgress, mistakes, recordAnswer, saveProgress } from "./game/progress";
import { CategoryPicker } from "./components/CategoryPicker";
import { Game, type RoundResult } from "./components/Game";
import { Home } from "./components/Home";
import { Results } from "./components/Results";

const ROUND_SIZE = 16;
const ABC_EVERY = 4;

type Screen =
  | { name: "home" }
  | { name: "categories" }
  | { name: "game"; round: Question[]; key: number }
  | { name: "results"; result: RoundResult };

export function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [category, setCategory] = useState<CategoryId | null>(loadCategory);
  const [bank, setBank] = useState<Question[] | null>(null);
  const [screen, setScreen] = useState<Screen>({ name: "home" });

  useEffect(() => saveProgress(progress), [progress]);
  useEffect(() => { loadBank().then(b => setBank(b ?? EXAMPLE_QUESTIONS)); }, []);

  const questions = useMemo(() => (bank && category ? bank.filter(q => q.categories.includes(category)) : []), [bank, category]);
  const ids = useMemo(() => new Set(questions.map(q => q.id)), [questions]);
  const wrong = useMemo(() => mistakes(progress).filter(id => ids.has(id)), [progress, ids]);

  const play = useCallback((reviewOnly: boolean) => {
    const pool = reviewOnly ? questions.filter(q => wrong.includes(q.id)) : questions;
    const round = buildRound(pool, { size: ROUND_SIZE, abcEvery: ABC_EVERY, focus: wrong });
    setScreen({ name: "game", round, key: Date.now() });
  }, [questions, wrong]);

  const onAnswer = useCallback((q: Question, correct: boolean) => {
    setProgress(p => recordAnswer(p, q.id, correct, q.points));
  }, []);

  const onFinish = useCallback((result: RoundResult) => {
    setProgress(p => finishRound(p, result.bestStreak));
    setScreen({ name: "results", result });
  }, []);

  const pickCategory = (id: CategoryId) => {
    saveCategory(id);
    setCategory(id);
    setScreen({ name: "home" });
  };

  if (!category || screen.name === "categories") {
    return <div className="app"><CategoryPicker current={category} onPick={pickCategory} /></div>;
  }

  return (
    <div className="app">
      {screen.name === "home" && (
        <Home
          progress={progress}
          category={category}
          questionIds={ids}
          mistakesCount={wrong.length}
          loading={bank === null}
          onPlay={() => play(false)}
          onReview={() => play(true)}
          onChangeCategory={() => setScreen({ name: "categories" })}
        />
      )}
      {screen.name === "game" && (
        <Game key={screen.key} round={screen.round} onAnswer={onAnswer} onFinish={onFinish} onQuit={() => setScreen({ name: "home" })} />
      )}
      {screen.name === "results" && (
        <Results
          result={screen.result}
          mistakesCount={wrong.length}
          onAgain={() => play(false)}
          onReview={() => play(true)}
          onHome={() => setScreen({ name: "home" })}
        />
      )}
    </div>
  );
}
