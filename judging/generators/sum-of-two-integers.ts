import type { Rng } from "./_rng";

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 16; i++) {
    out.push({ name: `random #${i}`, args: [rng.int(-1000, 1000), rng.int(-1000, 1000)] });
  }
  return out;
}

export function brute(a: number, b: number): number {
  return a + b;
}
