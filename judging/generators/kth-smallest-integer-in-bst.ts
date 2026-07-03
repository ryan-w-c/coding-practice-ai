import type { Rng } from "./_rng";
import { randomBst, treeValues } from "./_shared";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const arr = randomBst(rng, rng.int(1, 200));
    const n = treeValues(arr).length;
    out.push({ name: `random #${i} (n=${n})`, args: [arr, rng.int(1, n)] });
  }
  return out;
}

export function stress(rng: Rng) {
  const arr = randomBst(rng, 50_000);
  return [{ name: "n=50000 k=25000", args: [arr, 25_000] }];
}

export function brute(arr: (number | null)[], k: number): number {
  return treeValues(arr).sort((a, b) => a - b)[k - 1];
}
