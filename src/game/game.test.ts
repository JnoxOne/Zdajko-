import { describe, expect, it } from "vitest";
import { QUESTIONS } from "../data/questions";
import { buildRound, toExamScale } from "./round";
import { emptyProgress, learnedCount, mistakes, recordAnswer } from "./progress";

const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe("buildRound", () => {
  it("puts an A/B/C question on every 4th card", () => {
    const round = buildRound(QUESTIONS, { size: 16, abcEvery: 4, random: seeded(1) });
    expect(round).toHaveLength(16);
    round.forEach((q, i) => expect(q.type).toBe((i + 1) % 4 === 0 ? "abc" : "yn"));
    expect(new Set(round.map(q => q.id)).size).toBe(16);
  });

  it("puts earlier mistakes first", () => {
    const round = buildRound(QUESTIONS, { size: 8, abcEvery: 4, focus: ["yn-phone", "abc-alcohol"], random: seeded(2) });
    expect(round[0].id).toBe("yn-phone");
    expect(round[3].id).toBe("abc-alcohol");
  });

  it("stops when the bank runs out", () => {
    expect(buildRound(QUESTIONS.slice(0, 3), { size: 16, abcEvery: 4 })).toHaveLength(3);
  });
});

describe("scoring", () => {
  it("uses the 68 of 74 pass mark", () => {
    expect(toExamScale(37, 37)).toEqual({ points: 74, passed: true });
    expect(toExamScale(34, 37)).toEqual({ points: 68, passed: true });
    expect(toExamScale(33, 37)).toEqual({ points: 66, passed: false });
  });
});

describe("progress", () => {
  it("moves a question in and out of the review pile", () => {
    let p = recordAnswer(emptyProgress(), "yn-phone", false, 1);
    expect(mistakes(p)).toEqual(["yn-phone"]);
    p = recordAnswer(p, "yn-phone", true, 1);
    expect(mistakes(p)).toEqual([]);
    expect(learnedCount(p)).toBe(1);
    expect(p.totalPoints).toBe(1);
  });
});
