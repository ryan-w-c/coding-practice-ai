import { describe, it, expect } from "bun:test";
import {
  computeXp, computeLevel, xpIntoLevel, xpToNextLevel, xpForSubmission,
} from "./gamify";

describe("computeXp", () => {
  it("weights accepted problems higher than raw attempts", () => {
    expect(computeXp(0, 0)).toBe(0);
    expect(computeXp(1, 0)).toBe(60);
    expect(computeXp(0, 1)).toBe(5);
    expect(computeXp(92, 218)).toBe(92 * 60 + 218 * 5);
  });
});

describe("computeLevel / xpIntoLevel / xpToNextLevel", () => {
  it("level 1 at zero xp", () => {
    expect(computeLevel(0)).toBe(1);
    expect(xpIntoLevel(0)).toBe(0);
    expect(xpToNextLevel(0)).toBe(150);
  });
  it("levels up every 150 xp", () => {
    expect(computeLevel(149)).toBe(1);
    expect(computeLevel(150)).toBe(2);
    expect(computeLevel(299)).toBe(2);
    expect(computeLevel(300)).toBe(3);
  });
  it("tracks progress within the current level", () => {
    expect(xpIntoLevel(620)).toBe(20);
    expect(xpToNextLevel(620)).toBe(130);
  });
});

describe("xpForSubmission", () => {
  it("rewards harder problems more", () => {
    expect(xpForSubmission("E")).toBe(20);
    expect(xpForSubmission("M")).toBe(35);
    expect(xpForSubmission("H")).toBe(50);
  });
});
