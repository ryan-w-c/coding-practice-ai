import type { Rng } from "./_rng";

function points(rng: Rng, n: number): number[][] {
  const seen = new Set<string>();
  const out: number[][] = [];
  let guard = 0;
  while (out.length < n && guard++ < n * 30) {
    const x = rng.int(-1000, 1000), y = rng.int(-1000, 1000);
    if (seen.has(`${x},${y}`)) continue;
    seen.add(`${x},${y}`);
    out.push([x, y]);
  }
  return out;
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [points(rng, rng.int(1, 60))] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "n=800 points", args: [points(rng, 800)] }];
}

// Kruskal over all pairs (independent of the ref's Prim)
export function brute(pts: number[][]): number {
  const n = pts.length;
  const edges: [number, number, number][] = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      edges.push([Math.abs(pts[i][0] - pts[j][0]) + Math.abs(pts[i][1] - pts[j][1]), i, j]);
  edges.sort((a, b) => a[0] - b[0]);
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  let total = 0, used = 0;
  for (const [w, u, v] of edges) {
    const ru = find(u), rv = find(v);
    if (ru === rv) continue;
    parent[ru] = rv;
    total += w;
    if (++used === n - 1) break;
  }
  return total;
}
