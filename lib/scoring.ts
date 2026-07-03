// Pure scoring / scheduling (DESIGN.md §9, §10). No I/O — unit-tested.

export type Difficulty = "E" | "M" | "H";
export type Outcome = "clean" | "hinted" | "solution" | "failed";
export type Verdict = "accepted" | "wrong" | "tle" | "error";

export function outcomeScore(o: Outcome): number {
  switch (o) {
    case "clean": return 1.0;
    case "hinted": return 0.6;
    case "solution": return 0.3;
    default: return 0.0; // failed
  }
}

export function difficultyWeight(d: Difficulty): number {
  return d === "H" ? 2 : d === "M" ? 1.5 : 1;
}

// A pass with no AI help is "clean"; a pass after using the tutor is "hinted".
// (We can't reliably auto-detect "solution" — that stays a manual override.)
export function deriveOutcome(verdict: Verdict, usedAi: boolean): Outcome {
  if (verdict !== "accepted") return "failed";
  return usedAi ? "hinted" : "clean";
}

export type AttemptLite = {
  difficulty: Difficulty;
  outcome: Outcome;
  createdAt: Date;
};

// Depth/mastery for a pattern: recency-weighted over the last ~5 attempts,
// difficulty-weighted, then decayed 0.85 per extra 14-day idle block. 0..100.
export function computeMastery(attempts: AttemptLite[], now: Date): number {
  if (attempts.length === 0) return 0;
  const sorted = [...attempts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
  const recent = sorted.slice(0, 5);
  const recencyW = [1, 0.8, 0.6, 0.4, 0.2];

  let num = 0;
  let den = 0;
  recent.forEach((a, i) => {
    const w = difficultyWeight(a.difficulty) * recencyW[i];
    num += outcomeScore(a.outcome) * w;
    den += w;
  });
  let mastery = den > 0 ? (num / den) * 100 : 0;

  const daysSince =
    (now.getTime() - recent[0].createdAt.getTime()) / 86_400_000;
  const idleBlocks = Math.max(0, Math.floor(daysSince / 14));
  mastery *= Math.pow(0.85, idleBlocks);

  return Math.round(mastery);
}

// Breadth for a pattern: distinct accepted problems / target, as a 0..100 %.
export function computeBreadth(acceptedDistinct: number, targetCount: number): number {
  if (targetCount <= 0) return 0;
  return Math.round(Math.min(1, acceptedDistinct / targetCount) * 100);
}

// SM-2-lite (DESIGN.md §10). Returns the new interval (days) and next review date.
export function schedule(
  outcome: Outcome,
  prevInterval: number,
  now: Date,
): { interval: number; nextReviewAt: Date } {
  let interval: number;
  if (outcome === "failed") interval = 1;
  else if (outcome === "solution") interval = 2;
  else if (outcome === "hinted") interval = 4;
  else interval = prevInterval >= 7 ? Math.min(prevInterval * 2, 60) : 7; // clean

  return {
    interval,
    nextReviewAt: new Date(now.getTime() + interval * 86_400_000),
  };
}
