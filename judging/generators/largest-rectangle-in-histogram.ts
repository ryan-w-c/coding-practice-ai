import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const n = rng.int(1, 250);
    out.push({ name: `random #${i} (n=${n})`, args: [rng.ints(n, 0, 100)] });
  }
  out.push({ name: "mountain shape", args: [[1, 3, 5, 7, 5, 3, 1]] });
  out.push({ name: "contains zeros", args: [[3, 0, 3, 3]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=300000 random heights", args: [rng.ints(300_000, 0, 10_000)] }];
}

// O(n^2): expand a minimum from every index
export function brute(heights: number[]): number {
  let best = 0;
  for (let i = 0; i < heights.length; i++) {
    let min = heights[i];
    for (let j = i; j < heights.length; j++) {
      min = Math.min(min, heights[j]);
      best = Math.max(best, min * (j - i + 1));
    }
  }
  return best;
}
