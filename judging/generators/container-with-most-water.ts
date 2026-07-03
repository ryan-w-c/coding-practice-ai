import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const n = rng.int(2, 300);
    out.push({ name: `random #${i} (n=${n})`, args: [rng.ints(n, 0, 1000)] });
  }
  out.push({ name: "all zero heights", args: [[0, 0, 0, 0, 0]] });
  out.push({ name: "tall walls at both ends", args: [[1000, 1, 1, 1, 1, 1000]] });
  return out;
}

export function stress(rng: Rng) {
  // 300k: O(n^2) ≈ 4.5e10 iterations TLEs even under Bun's JIT; O(n) is instant.
  return [{ name: "n=300000 random", args: [rng.ints(300_000, 1, 1_000_000)] }];
}

// O(n^2) — check every pair.
export function brute(height: number[]): number {
  let best = 0;
  for (let i = 0; i < height.length; i++)
    for (let j = i + 1; j < height.length; j++)
      best = Math.max(best, (j - i) * Math.min(height[i], height[j]));
  return best;
}
