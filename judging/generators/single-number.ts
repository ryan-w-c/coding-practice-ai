import type { Rng } from "./_rng";
import { sortedDistinct } from "./_shared";

function input(rng: Rng, pairs: number): number[] {
  const vals = rng.shuffle(sortedDistinct(rng, pairs + 1, -10_000, 7));
  const single = vals[0];
  const out = [single];
  for (let i = 1; i <= pairs; i++) out.push(vals[i], vals[i]);
  return rng.shuffle(out);
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [input(rng, rng.int(0, 100))] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n~300000", args: [input(rng, 150_000)] }];
}

export function brute(nums: number[]): number {
  const count = new Map<number, number>();
  for (const n of nums) count.set(n, (count.get(n) ?? 0) + 1);
  for (const [v, c] of count) if (c === 1) return v;
  return -1;
}
