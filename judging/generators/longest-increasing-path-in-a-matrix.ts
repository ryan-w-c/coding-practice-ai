import type { Rng } from "./_rng";

function grid(rng: Rng, m: number, n: number, hi: number): number[][] {
  return Array.from({ length: m }, () => rng.ints(n, 0, hi));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [grid(rng, rng.int(1, 8), rng.int(1, 8), rng.int(3, 30))] });
  }
  return out;
}

export function stress(rng: Rng) {
  // memo-less DFS is exponential on gradient-heavy grids
  return [{ name: "150x150", args: [grid(rng, 150, 150, 1_000_000)] }];
}

// per-cell DFS without memo (cases stay tiny)
export function brute(matrix: number[][]): number {
  const m = matrix.length, n = matrix[0].length;
  const walk = (r: number, c: number): number => {
    let best = 1;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || matrix[nr][nc] <= matrix[r][c]) continue;
      best = Math.max(best, 1 + walk(nr, nc));
    }
    return best;
  };
  let out = 0;
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) out = Math.max(out, walk(r, c));
  return out;
}
