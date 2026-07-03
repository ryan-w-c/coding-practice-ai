import type { Rng } from "./_rng";
import { intervals } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const ivs = intervals(rng, rng.int(1, 60), 1, 100, 25);
    const queries = rng.ints(rng.int(1, 30), 1, 120);
    out.push({ name: `random #${i}`, args: [ivs, queries] });
  }
  return out;
}

export function stress(rng: Rng) {
  // per-query linear scan is O(q * n)
  return [{ name: "n=50000 q=50000", args: [intervals(rng, 50_000, 1, 10_000_000, 10_000), rng.ints(50_000, 1, 10_000_000)] }];
}

export function brute(ivs: number[][], queries: number[]): number[] {
  return queries.map((q) => {
    let best = -1;
    for (const [l, r] of ivs) {
      if (l <= q && q <= r) {
        const size = r - l + 1;
        if (best === -1 || size < best) best = size;
      }
    }
    return best;
  });
}
