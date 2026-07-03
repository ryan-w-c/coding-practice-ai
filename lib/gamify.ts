// Pure gamification display math — derived entirely from existing progress
// header stats, no persisted XP/level state. No I/O — unit-tested.

const XP_PER_LEVEL = 150;

export function computeXp(totalAccepted: number, totalAttempts: number): number {
  return totalAccepted * 60 + totalAttempts * 5;
}

export function computeLevel(xp: number): number {
  return 1 + Math.floor(xp / XP_PER_LEVEL);
}

export function xpIntoLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - xpIntoLevel(xp);
}

// XP awarded for a single accepted submission — cosmetic reward toast only,
// not persisted anywhere.
export function xpForSubmission(difficulty: "E" | "M" | "H"): number {
  return difficulty === "H" ? 50 : difficulty === "M" ? 35 : 20;
}
