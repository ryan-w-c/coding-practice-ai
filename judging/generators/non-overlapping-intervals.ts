import type { Rng } from "./_rng";
import { intervals } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [intervals(rng, rng.int(1, 100), 0, 60, 12)] });
  }
  out.push({ name: "identical intervals", args: [[[1, 3], [1, 3], [1, 3]]] });
  return out;
}

export function stress(rng: Rng) {
  // O(n^2) dp TLEs in python; greedy-by-end is n log n
  return [{ name: "n=100000", args: [intervals(rng, 100_000, 0, 10_000_000, 200)] }];
}

// keep = longest chain of non-overlapping (O(n^2) dp); erase = n - keep
export function brute(ivs: number[][]): number {
  const s = [...ivs].sort((a, b) => a[1] - b[1]);
  const dp = new Array<number>(s.length).fill(1);
  let keep = s.length ? 1 : 0;
  for (let i = 1; i < s.length; i++) {
    for (let j = 0; j < i; j++) if (s[j][1] <= s[i][0]) dp[i] = Math.max(dp[i], dp[j] + 1);
    keep = Math.max(keep, dp[i]);
  }
  return ivs.length - keep;
}
