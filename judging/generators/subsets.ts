import type { Rng } from "./_rng";
import { sortedDistinct } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 8; i++) {
    const n = rng.int(0, 10);
    out.push({ name: `random #${i} (n=${n})`, args: [rng.shuffle(sortedDistinct(rng, n, -20, 5))] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=14 (16384 subsets)", args: [rng.shuffle(sortedDistinct(rng, 14, -20, 3))] }];
}

// bitmask enumeration
export function brute(nums: number[]): number[][] {
  const out: number[][] = [];
  for (let mask = 0; mask < 1 << nums.length; mask++) {
    const sub: number[] = [];
    for (let i = 0; i < nums.length; i++) if (mask & (1 << i)) sub.push(nums[i]);
    out.push(sub);
  }
  return out;
}
