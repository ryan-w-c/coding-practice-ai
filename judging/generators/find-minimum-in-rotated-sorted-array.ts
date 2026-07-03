import type { Rng } from "./_rng";

function rotatedDistinct(rng: Rng, n: number): number[] {
  const a: number[] = [];
  let v = rng.int(-10_000, 0);
  for (let i = 0; i < n; i++) {
    v += rng.int(1, 20);
    a.push(v);
  }
  const r = rng.int(0, n - 1);
  return [...a.slice(r), ...a.slice(0, r)];
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    const n = rng.int(1, 200);
    out.push({ name: `random rotation #${i} (n=${n})`, args: [rotatedDistinct(rng, n)] });
  }
  out.push({ name: "not rotated", args: [[1, 2, 3, 4, 5]] });
  out.push({ name: "rotated by one", args: [[5, 1, 2, 3, 4]] });
  out.push({ name: "two elements swapped", args: [[2, 1]] });
  out.push({ name: "single element", args: [[42]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=100000 rotated", args: [rotatedDistinct(rng, 100_000)] }];
}

export function brute(nums: number[]): number {
  return Math.min(...nums);
}
