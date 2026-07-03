import type { Rng } from "./_rng";

function input(rng: Rng, n: number): number[] {
  const missing = rng.int(0, n);
  return rng.shuffle(Array.from({ length: n + 1 }, (_, i) => i).filter((v) => v !== missing));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [input(rng, rng.int(1, 300))] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=300000", args: [input(rng, 300_000)] }];
}

export function brute(nums: number[]): number {
  const have = new Set(nums);
  for (let i = 0; i <= nums.length; i++) if (!have.has(i)) return i;
  return -1;
}
