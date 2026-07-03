import type { Rng } from "./_rng";
import { sortedDistinct } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 8; i++) {
    const n = rng.int(1, 6);
    out.push({ name: `random #${i} (n=${n})`, args: [rng.shuffle(sortedDistinct(rng, n, -10, 4))] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=7 (5040 permutations)", args: [rng.shuffle(sortedDistinct(rng, 7, -10, 3))] }];
}

// Heap's-algorithm-free brute: recursive insertion
export function brute(nums: number[]): number[][] {
  if (nums.length === 0) return [[]];
  const rest = brute(nums.slice(1));
  const out: number[][] = [];
  for (const p of rest) {
    for (let i = 0; i <= p.length; i++) {
      out.push([...p.slice(0, i), nums[0], ...p.slice(i)]);
    }
  }
  return out;
}
