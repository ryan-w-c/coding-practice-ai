import type { Rng } from "./_rng";
import { intervals } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [intervals(rng, rng.int(0, 60), 0, 100, 20)] });
  }
  out.push({ name: "end equals start reuses room", args: [[[0, 10], [10, 20]]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000", args: [intervals(rng, 100_000, 0, 1_000_000, 500)] }];
}

// max concurrent meetings: count overlap at every meeting start (O(n^2))
export function brute(ivs: number[][]): number {
  let best = 0;
  for (const [s] of ivs) {
    let c = 0;
    for (const [a, b] of ivs) if (a <= s && s < b) c++;
    best = Math.max(best, c);
  }
  return best;
}
