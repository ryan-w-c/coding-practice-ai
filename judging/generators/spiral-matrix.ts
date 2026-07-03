import type { Rng } from "./_rng";

function grid(rng: Rng, m: number, n: number): number[][] {
  return Array.from({ length: m }, () => rng.ints(n, -100, 100));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [grid(rng, rng.int(1, 15), rng.int(1, 15))] });
  }
  out.push({ name: "tall single column", args: [grid(rng, 8, 1)] });
  out.push({ name: "wide single row", args: [grid(rng, 1, 8)] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "300x300", args: [grid(rng, 300, 300)] }];
}

// walk with direction turns + visited marks
export function brute(matrix: number[][]): number[] {
  const m = matrix.length, n = matrix[0].length;
  const seen = new Set<number>();
  const out: number[] = [];
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let r = 0, c = 0, d = 0;
  for (let k = 0; k < m * n; k++) {
    out.push(matrix[r][c]);
    seen.add(r * n + c);
    const nr = r + dirs[d][0], nc = c + dirs[d][1];
    if (nr < 0 || nr >= m || nc < 0 || nc >= n || seen.has(nr * n + nc)) d = (d + 1) % 4;
    r += dirs[d][0];
    c += dirs[d][1];
  }
  return out;
}
