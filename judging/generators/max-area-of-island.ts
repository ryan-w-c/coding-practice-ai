import type { Rng } from "./_rng";

function grid(rng: Rng, m: number, n: number, landPct: number): number[][] {
  return Array.from({ length: m }, () =>
    Array.from({ length: n }, () => (rng.next() < landPct ? 1 : 0)));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [grid(rng, rng.int(1, 25), rng.int(1, 25), rng.next() * 0.7 + 0.15)] });
  }
  out.push({ name: "all water", args: [grid(rng, 4, 4, 0)] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "500x500", args: [grid(rng, 500, 500, 0.55)] }];
}

export function brute(g: number[][]): number {
  const m = g.length, n = g[0].length;
  const seen = new Set<number>();
  let best = 0;
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) {
      if (g[r][c] !== 1 || seen.has(r * n + c)) continue;
      let area = 0;
      const stack = [[r, c]];
      seen.add(r * n + c);
      while (stack.length) {
        const [cr, cc] = stack.pop()!;
        area++;
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nr >= m || nc < 0 || nc >= n || g[nr][nc] !== 1 || seen.has(nr * n + nc)) continue;
          seen.add(nr * n + nc);
          stack.push([nr, nc]);
        }
      }
      best = Math.max(best, area);
    }
  return best;
}
