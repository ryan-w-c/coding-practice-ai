import type { Rng } from "./_rng";

function pairs(rng: Rng, n: number): [number, number | null][] {
  return Array.from({ length: n }, (_, i) => [
    rng.int(-100, 100),
    rng.next() < 0.3 ? null : rng.int(0, Math.max(0, n - 1)),
  ] as [number, number | null]);
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [pairs(rng, rng.int(0, 200))] });
  }
  out.push({ name: "all random to self", args: [[[1, 0], [2, 1], [3, 2]]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=50000", args: [pairs(rng, 50_000)] }];
}

// a correct deep copy serializes identically to its input
export function brute(p: [number, number | null][]): [number, number | null][] {
  return p;
}
