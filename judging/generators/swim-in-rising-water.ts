import type { Rng } from "./_rng";

// grid values are a permutation of 0..n^2-1
function permGrid(rng: Rng, n: number): number[][] {
  const vals = rng.shuffle(Array.from({ length: n * n }, (_, i) => i));
  return Array.from({ length: n }, (_, r) => vals.slice(r * n, (r + 1) * n));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 12; i++) {
    out.push({ name: `random #${i}`, args: [permGrid(rng, rng.int(1, 12))] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "200x200 permutation", args: [permGrid(rng, 200)] }];
}

// union cells in elevation order until start and end connect
export function brute(grid: number[][]): number {
  const n = grid.length;
  const parent = Array.from({ length: n * n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const byElevation: [number, number][] = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) byElevation[grid[r][c]] = [r, c];
  const active = new Set<number>();
  for (let t = 0; t < n * n; t++) {
    const [r, c] = byElevation[t];
    active.add(r * n + c);
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n || !active.has(nr * n + nc)) continue;
      parent[find(r * n + c)] = find(nr * n + nc);
    }
    if (active.has(0) && active.has(n * n - 1) && find(0) === find(n * n - 1)) return t;
  }
  return n * n - 1;
}
