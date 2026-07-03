import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [rng.ints(rng.int(2, 20), 0, 999)] });
  }
  out.push({ name: "two steps", args: [[10, 15]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000", args: [rng.ints(100_000, 0, 999)] }];
}

export function brute(cost: number[]): number {
  const from = (i: number): number =>
    i >= cost.length ? 0 : cost[i] + Math.min(from(i + 1), from(i + 2));
  return Math.min(from(0), from(1));
}
