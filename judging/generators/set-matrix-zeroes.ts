import type { Rng } from "./_rng";

function grid(rng: Rng, m: number, n: number, zeroPct: number): number[][] {
  return Array.from({ length: m }, () =>
    Array.from({ length: n }, () => (rng.next() < zeroPct ? 0 : rng.int(1, 100))));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [grid(rng, rng.int(1, 15), rng.int(1, 15), rng.next() * 0.3)] });
  }
  out.push({ name: "no zeros unchanged", args: [grid(rng, 4, 4, 0)] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "400x400", args: [grid(rng, 400, 400, 0.02)] }];
}

export function brute(matrix: number[][]): number[][] {
  const rows = new Set<number>(), cols = new Set<number>();
  matrix.forEach((row, r) => row.forEach((v, c) => {
    if (v === 0) { rows.add(r); cols.add(c); }
  }));
  return matrix.map((row, r) => row.map((v, c) => (rows.has(r) || cols.has(c) ? 0 : v)));
}
