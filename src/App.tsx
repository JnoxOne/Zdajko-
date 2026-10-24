import { useCallback, useEffect, useState } from "react";
import { QUESTIONS } from "./data/questions";
import type { Question } from "./data/questions";
import { buildRound } from "./game/round";
import { finishRound, loadProgress, mistakes, recordAnswer, saveProgress } from "./game/progress";
import { Game, type RoundResult } from "./components/Game";
import { Home } from "./components/Home";
import { Results } from "./components/Results";

const ROUND_SIZE = 16;
const ABC_EVERY = 4;

type Screen =
  | { name: "home" }
  | { name: "game"; round: Question[]; key: number }
  | { name: "results"; result: RoundResult };

export function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [screen, setScreen] = useState<Screen>({ name: "home" });

  useEffect(() => saveProgress(progress), [progress]);

  const play = useCallback((reviewOnly: boolean) => {
    const wrong = mistakes(progress);
    const pool = reviewOnly ? QUESTIONS.filter(q => wrong.includes(q.id)) : QUESTIONS;
    const round = buildRound(pool, { size: ROUND_SIZE, abcEvery: ABC_EVERY, focus: wrong });
    setScreen({ name: "game", round, key: Date.now() });
  }, [progress]);

  const onAnswer = useCallback((q: Question, correct: boolean) => {
    setProgress(p => recordAnswer(p, q.id, correct, q.points));
  }, []);

  const onFinish = useCallback((result: RoundResult) => {
    setProgress(p => finishRound(p, result.bestStreak));
    setScreen({ name: "results", result });
  }, []);

  return (
    <div className="app">
      {screen.name === "home" && (
        <Home progress={progress} totalQuestions={QUESTIONS.length} onPlay={() => play(false)} onReview={() => play(true)} />
      )}
      {screen.name === "game" && (
        <Game key={screen.key} round={screen.round} onAnswer={onAnswer} onFinish={onFinish} onQuit={() => setScreen({ name: "home" })} />
      )}
      {screen.name === "results" && (
        <Results
          result={screen.result}
          mistakesCount={mistakes(progress).length}
          onAgain={() => play(false)}
          onReview={() => play(true)}
          onHome={() => setScreen({ name: "home" })}
        />
      )}
    </div>
  );
}
