import type { Points, Question } from "./questions";

/** One row of public/bank/questions.json, written by scripts/import_bank.py. */
interface BankRow {
  id: number;
  q: string;
  ok: "T" | "N" | "A" | "B" | "C";
  p: number;
  c: string[];
  o?: [string, string, string];
  m?: string;
}

const BANK_URL = `${import.meta.env.BASE_URL}bank/`;

export function fromBankRow(r: BankRow): Question {
  const base = {
    id: String(r.id),
    question: r.q,
    points: (Math.min(3, Math.max(1, r.p)) as Points),
    categories: r.c,
    image: r.m ? `${BANK_URL}img/${r.m}` : undefined
  };
  if (r.o && (r.ok === "A" || r.ok === "B" || r.ok === "C")) {
    return { ...base, type: "abc", category: "Specjalistyczne", options: r.o, answer: "ABC".indexOf(r.ok) as 0 | 1 | 2 };
  }
  return { ...base, type: "yn", category: "Podstawowe", answer: r.ok === "T" };
}

/** Loads the official bank; resolves to null when it hasn't been imported yet. */
export async function loadBank(): Promise<Question[] | null> {
  try {
    const res = await fetch(`${BANK_URL}questions.json`);
    if (!res.ok) return null;
    const rows: BankRow[] = await res.json();
    return rows.map(fromBankRow);
  } catch {
    return null;
  }
}
