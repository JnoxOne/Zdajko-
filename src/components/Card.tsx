import { useRef, useState } from "react";
import type { Question } from "../data/questions";
import { Sign } from "./Sign";

const SWIPE_THRESHOLD = 100;
const LETTERS = ["A", "B", "C"];

interface Props {
  question: Question;
  /** null until answered; TAK/NIE as boolean, A/B/C as option index. */
  answer: boolean | number | null;
  onAnswer?: (answer: boolean | number) => void;
  under?: boolean;
  rising?: boolean;
}

export function Card({ question: q, answer, onAnswer, under, rising }: Props) {
  const [drag, setDrag] = useState({ dx: 0, dy: 0, active: false });
  const start = useRef({ x: 0, y: 0 });
  const answered = answer !== null;
  const swipeable = q.type === "yn" && !answered && !under && onAnswer;

  const onPointerDown = (e: React.PointerEvent) => {
    if (!swipeable) return;
    start.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ dx: 0, dy: 0, active: true });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.active) return;
    setDrag({ dx: e.clientX - start.current.x, dy: e.clientY - start.current.y, active: true });
  };
  const onPointerUp = () => {
    if (!drag.active) return;
    if (Math.abs(drag.dx) > SWIPE_THRESHOLD) onAnswer?.(drag.dx > 0);
    // Below the threshold the card springs back to the middle.
    setDrag({ dx: 0, dy: 0, active: false });
  };

  let transform = "";
  let className = "card";
  if (under) className += rising ? " under rising" : " under";
  if (q.type === "yn" && answered) {
    const dir = answer ? 1 : -1;
    transform = `translate(${dir * 140}%, 30px) rotate(${dir * 26}deg)`;
    className += " fly";
  } else if (drag.active) {
    transform = `translate(${drag.dx}px, ${drag.dy * 0.3}px) rotate(${drag.dx / 18}deg)`;
    className += " dragging";
  }

  const yesOpacity = q.type === "yn" && answered ? (answer ? 1 : 0) : Math.max(0, Math.min(1, drag.dx / SWIPE_THRESHOLD));
  const noOpacity = q.type === "yn" && answered ? (answer ? 0 : 1) : Math.max(0, Math.min(1, -drag.dx / SWIPE_THRESHOLD));

  return (
    <div
      className={className + (swipeable ? " swipeable" : "")}
      style={transform ? { transform } : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-hidden={under || undefined}
    >
      <div className="meta">
        <span className="cat">{q.category}</span>
        <span className="meta-right">
          {q.type === "abc" && <span className="kind">Specjalistyczne · A/B/C</span>}
          <span className="pts">{q.points} pkt</span>
        </span>
      </div>
      <div className={q.sign ? "visual" : "visual none"}>{q.sign && <Sign id={q.sign} />}</div>
      <div className="q">{q.question}</div>
      {q.type === "abc" ? (
        <div className="opts">
          {q.options.map((text, k) => {
            let cls = "opt";
            if (answered && k === q.answer) cls += " right";
            else if (answered && k === answer) cls += " wrong";
            return (
              <button key={k} className={cls} disabled={answered || under} onClick={() => onAnswer?.(k)}>
                <b>{LETTERS[k]}</b>
                <span>{text}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="hint"><span>← NIE</span><span>TAK →</span></div>
      )}
      <div className="stamp yes" style={{ opacity: yesOpacity }}>TAK</div>
      <div className="stamp no" style={{ opacity: noOpacity }}>NIE</div>
    </div>
  );
}
