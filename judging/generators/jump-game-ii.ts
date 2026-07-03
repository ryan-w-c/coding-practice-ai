import type { Rng } from "./_rng";

// guaranteed reachable: every value >= 1
export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [rng.ints(rng.int(1, 150), 1, 6)] });
  }
  out.push({ name: "single element zero jumps", args: [[3]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000", args: [rng.ints(100_000, 1, 5)] }];
}

// O(n^2) BFS-style dp
export function brute(nums: number[]): number {
  const dp = new Array<number>(nums.length).fill(Infinity);
  dp[0] = 0;
  for (let i = 0; i < nums.length; i++)
    for (let j = 1; j <= nums[i] && i + j < nums.length; j++)
      dp[i + j] = Math.min(dp[i + j], dp[i] + 1);
  return dp[nums.length - 1];
}
