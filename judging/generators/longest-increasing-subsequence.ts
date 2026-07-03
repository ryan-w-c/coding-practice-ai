import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [rng.ints(rng.int(1, 150), -10_000, 10_000)] });
  }
  out.push({ name: "all equal", args: [[5, 5, 5, 5]] });
  return out;
}

export function stress(rng: Rng) {
  // O(n^2) dp TLEs; patience sorting is O(n log n)
  return [{ name: "n=50000", args: [rng.ints(50_000, -100_000, 100_000)] }];
}

// classic O(n^2) dp
export function brute(nums: number[]): number {
  const dp = new Array<number>(nums.length).fill(1);
  let best = nums.length ? 1 : 0;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++)
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    best = Math.max(best, dp[i]);
  }
  return best;
}
