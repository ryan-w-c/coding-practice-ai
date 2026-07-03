import type { Rng } from "./_rng";
import { intervals } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    // mix: sparse (often attendable) and dense
    out.push({ name: `random #${i}`, args: [intervals(rng, rng.int(0, 40), 0, rng.pick([50, 2000]), 10)] });
  }
  out.push({ name: "back-to-back is fine", args: [[[1, 5], [5, 8]]] });
  out.push({ name: "empty schedule", args: [[]] });
  return out;
}

export function stress(rng: Rng) {
  // O(n^2) pairwise check TLEs
  const sparse: number[][] = [];
  let at = 0;
  for (let i = 0; i < 100_000; i++) {
    const s = at + rng.int(1, 5);
    sparse.push([s, s + rng.int(0, 3)]);
    at = s + 3;
  }
  return [{ name: "n=100000 attendable", args: [rng.shuffle(sparse)] }];
}

export function brute(ivs: number[][]): boolean {
  for (let i = 0; i < ivs.length; i++)
    for (let j = i + 1; j < ivs.length; j++) {
      if (ivs[i][0] < ivs[j][1] && ivs[j][0] < ivs[i][1]) return false;
    }
  return true;
}
