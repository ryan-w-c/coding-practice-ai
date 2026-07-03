import type { Rng } from "./_rng";
import { word } from "./_shared";

// float-exact dp used to reject inputs whose count exceeds 32 bits
function count(s: string, t: string): number {
  const dp = new Array<number>(t.length + 1).fill(0);
  dp[0] = 1;
  for (const c of s)
    for (let j = t.length; j >= 1; j--) if (t[j - 1] === c) dp[j] += dp[j - 1];
  return dp[t.length];
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  let guard = 0;
  while (out.length < 12 && guard++ < 400) {
    const s = word(rng, 1, 25, "abc");
    const t = word(rng, 1, 6, "abc");
    if (count(s, t) > 2 ** 31 - 1) continue;
    out.push({ name: `random #${out.length}`, args: [s, t] });
  }
  return out;
}

export function stress(rng: Rng) {
  // rejection-sample until the count is positive but fits 32 bits — huge counts
  // are float-inexact in TS and diverge from Python's exact big ints
  for (let tries = 0; tries < 500; tries++) {
    const s = word(rng, 500, 500, "abcdefgh");
    const t = word(rng, 45, 45, "abcdefgh");
    const c = count(s, t);
    if (c > 0 && c <= 2 ** 31 - 1) return [{ name: "|s|=500 |t|=45", args: [s, t] }];
  }
  return []; // no suitable instance found — skip the stress case
}

export function brute(s: string, t: string): number {
  const memo = new Map<string, number>();
  const go = (i: number, j: number): number => {
    if (j === t.length) return 1;
    if (i === s.length) return 0;
    const k = `${i},${j}`;
    if (!memo.has(k)) {
      let ways = go(i + 1, j);
      if (s[i] === t[j]) ways += go(i + 1, j + 1);
      memo.set(k, ways);
    }
    return memo.get(k)!;
  };
  return go(0, 0);
}
