import type { Rng } from "./_rng";

const INF = 2147483647;

function grid(rng: Rng, m: number, n: number): number[][] {
  return Array.from({ length: m }, () =>
    Array.from({ length: n }, () => {
      const r = rng.next();
      return r < 0.12 ? 0 : r < 0.32 ? -1 : INF;
    }));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [grid(rng, rng.int(1, 20), rng.int(1, 20))] });
  }
  return out;
}

export function stress(rng: Rng) {
  // per-cell BFS instead of multi-source is O((mn)^2)
  return [{ name: "200x200", args: [grid(rng, 200, 200)] }];
}

export function brute(g: number[][]): number[][] {
  const m = g.length, n = g[0].length;
  const out = g.map((row) => [...row]);
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) {
      if (g[r][c] !== INF) continue;
      // BFS from this cell to the nearest treasure
      const dist = new Map<number, number>([[r * n + c, 0]]);
      const queue = [[r, c]];
      let found = -1;
      while (queue.length && found === -1) {
        const [cr, cc] = queue.shift()!;
        const d = dist.get(cr * n + cc)!;
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nr >= m || nc < 0 || nc >= n || g[nr][nc] === -1 || dist.has(nr * n + nc)) continue;
          if (g[nr][nc] === 0) { found = d + 1; break; }
          dist.set(nr * n + nc, d + 1);
          queue.push([nr, nc]);
        }
      }
      out[r][c] = found === -1 ? INF : found;
    }
  return out;
}
