import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const seen = new Set<string>();
  const out: { name: string; args: unknown[] }[] = [];
  let guard = 0;
  while (out.length < 12 && guard++ < 200) {
    // keep C(m+n-2, m-1) inside 32 bits
    const m = rng.int(1, 12), n = rng.int(1, 12);
    if (seen.has(`${m},${n}`)) continue;
    seen.add(`${m},${n}`);
    out.push({ name: `${m}x${n}`, args: [m, n] });
  }
  out.push({ name: "100x1 strip", args: [100, 1] });
  return out;
}

// recursive with memo (top-down vs the ref's bottom-up row dp)
export function brute(m: number, n: number): number {
  const memo = new Map<string, number>();
  const go = (r: number, c: number): number => {
    if (r === m - 1 || c === n - 1) return 1;
    const k = `${r},${c}`;
    if (!memo.has(k)) memo.set(k, go(r + 1, c) + go(r, c + 1));
    return memo.get(k)!;
  };
  return go(0, 0);
}
