import type { Rng } from "./_rng";

function square(rng: Rng, n: number): number[][] {
  return Array.from({ length: n }, () => rng.ints(n, -1000, 1000));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [square(rng, rng.int(1, 20))] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "300x300", args: [square(rng, 300)] }];
}

export function brute(m: number[][]): number[][] {
  const n = m.length;
  return Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => m[n - 1 - c][r]));
}
