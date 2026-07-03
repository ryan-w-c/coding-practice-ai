import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [rng.ints(rng.int(1, 200), -100, 100)] });
  }
  out.push({ name: "all negative", args: [[-5, -2, -8]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=300000", args: [rng.ints(300_000, -1000, 1000)] }];
}

export function brute(nums: number[]): number {
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      best = Math.max(best, sum);
    }
  }
  return best;
}
