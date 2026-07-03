import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    const n = rng.int(1, 250);
    out.push({ name: `random #${i} (n=${n})`, args: [rng.ints(n, -10_000, 10_000), rng.int(1, n)] });
  }
  out.push({ name: "duplicates around k", args: [[3, 3, 3, 2, 2], 3] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=200000 k=100000", args: [rng.ints(200_000, -10_000, 10_000), 100_000] }];
}

export function brute(nums: number[], k: number): number {
  return [...nums].sort((a, b) => b - a)[k - 1];
}
