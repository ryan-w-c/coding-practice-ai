import { describe, it, expect } from "bun:test";
import {
  outcomeScore, difficultyWeight, deriveOutcome,
  computeMastery, computeBreadth, schedule, type AttemptLite,
} from "./scoring";

const day = (n: number) => new Date(2026, 0, n); // Jan n, 2026

describe("scoring primitives", () => {
  it("outcome scores", () => {
    expect(outcomeScore("clean")).toBe(1);
    expect(outcomeScore("hinted")).toBe(0.6);
    expect(outcomeScore("solution")).toBe(0.3);
    expect(outcomeScore("failed")).toBe(0);
  });
  it("difficulty weights", () => {
    expect(difficultyWeight("E")).toBe(1);
    expect(difficultyWeight("M")).toBe(1.5);
    expect(difficultyWeight("H")).toBe(2);
  });
  it("derives outcome from verdict + AI use", () => {
    expect(deriveOutcome("accepted", false)).toBe("clean");
    expect(deriveOutcome("accepted", true)).toBe("hinted");
    expect(deriveOutcome("wrong", false)).toBe("failed");
    expect(deriveOutcome("tle", true)).toBe("failed");
  });
});

describe("computeMastery", () => {
  it("is 0 with no attempts", () => {
    expect(computeMastery([], day(10))).toBe(0);
  });
  it("all-clean recent = 100", () => {
    const a: AttemptLite[] = [
      { difficulty: "M", outcome: "clean", createdAt: day(10) },
      { difficulty: "E", outcome: "clean", createdAt: day(9) },
    ];
    expect(computeMastery(a, day(10))).toBe(100);
  });
  it("failed drags mastery down", () => {
    const a: AttemptLite[] = [
      { difficulty: "M", outcome: "failed", createdAt: day(10) },
      { difficulty: "M", outcome: "clean", createdAt: day(9) },
    ];
    const m = computeMastery(a, day(10));
    expect(m).toBeGreaterThan(0);
    expect(m).toBeLessThan(60);
  });
  it("decays after idle blocks", () => {
    const a: AttemptLite[] = [{ difficulty: "E", outcome: "clean", createdAt: day(1) }];
    const fresh = computeMastery(a, day(1));
    const stale = computeMastery(a, day(1 + 30)); // ~2 idle blocks
    expect(fresh).toBe(100);
    expect(stale).toBeLessThan(fresh);
  });
});

describe("computeBreadth", () => {
  it("ratio to target, capped at 100", () => {
    expect(computeBreadth(0, 9)).toBe(0);
    expect(computeBreadth(9, 9)).toBe(100);
    expect(computeBreadth(12, 9)).toBe(100);
    expect(computeBreadth(3, 6)).toBe(50);
  });
});

describe("schedule (SM-2-lite)", () => {
  const now = day(10);
  it("fixed intervals for failed/solution/hinted", () => {
    expect(schedule("failed", 30, now).interval).toBe(1);
    expect(schedule("solution", 30, now).interval).toBe(2);
    expect(schedule("hinted", 30, now).interval).toBe(4);
  });
  it("clean starts at 7 then doubles, capped at 60", () => {
    expect(schedule("clean", 0, now).interval).toBe(7);
    expect(schedule("clean", 7, now).interval).toBe(14);
    expect(schedule("clean", 40, now).interval).toBe(60);
  });
  it("sets nextReviewAt = now + interval days", () => {
    const r = schedule("clean", 0, now);
    expect(Math.round((r.nextReviewAt.getTime() - now.getTime()) / 86_400_000)).toBe(7);
  });
});
