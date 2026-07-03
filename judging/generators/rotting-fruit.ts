import type { Rng } from "./_rng";

function grid(rng: Rng, m: number, n: number): number[][] {
  return Array.from({ length: m }, () =>
    Array.from({ length: n }, () => {
      const r = rng.next();
      return r < 0.15 ? 2 : r < 0.6 ? 1 : 0;
    }));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [grid(rng, rng.int(1, 20), rng.int(1, 20))] });
  }
  out.push({ name: "isolated fresh orange", args: [[[2, 0, 1]]] });
  out.push({ name: "no oranges at all", args: [[[0, 0], [0, 0]]] });
  out.push({ name: "already all rotten", args: [[[2, 2], [2, 2]]] });
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "300x300", args: [grid(rng, 300, 300)] }];
}

// literal minute-by-minute simulation
export function brute(g: number[][]): number {
  const m = g.length, n = g[0].length;
  let cur = g.map((r) => [...r]);
  let minutes = 0;
  for (;;) {
    let fresh = 0, changed = false;
    const next = cur.map((r) => [...r]);
    for (let r = 0; r < m; r++)
      for (let c = 0; c < n; c++) {
        if (cur[r][c] !== 1) continue;
        const rotten = ([[1, 0], [-1, 0], [0, 1], [0, -1]] as const).some(([dr, dc]) => {
          const nr = r + dr, nc = c + dc;
          return nr >= 0 && nr < m && nc >= 0 && nc < n && cur[nr][nc] === 2;
        });
        if (rotten) { next[r][c] = 2; changed = true; }
        else fresh++;
      }
    if (!changed) return fresh === 0 ? minutes : -1;
    cur = next;
    minutes++;
  }
}
