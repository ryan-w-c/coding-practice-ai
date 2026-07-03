import type { Rng } from "./_rng";

const sorted = (rng: Rng, n: number) => rng.ints(n, -1000, 1000).sort((a, b) => a - b);

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 8; i++) {
    out.push({ name: `random #${i}`, args: [sorted(rng, rng.int(0, 200)), sorted(rng, rng.int(0, 200))] });
  }
  out.push({ name: "both empty", args: [[], []] });
  out.push({ name: "one empty", args: [[], [1, 2]] });
  out.push({ name: "interleaved", args: [[1, 3, 5], [2, 4, 6]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=50000 each", args: [sorted(rng, 50_000), sorted(rng, 50_000)] }];
}

export function brute(a: number[], b: number[]): number[] {
  return [...a, ...b].sort((x, y) => x - y);
}
