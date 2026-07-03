import type { Rng } from "./_rng";

function grid(rng: Rng, m: number, n: number): number[][] {
  return Array.from({ length: m }, () => rng.ints(n, 0, 50));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [grid(rng, rng.int(1, 20), rng.int(1, 20))] });
  }
  out.push({ name: "uniform heights (all cells)", args: [grid(rng, 3, 3).map((r) => r.map(() => 7))] });
  return out;
}

export function stress(rng: Rng) {
  // per-cell reachability DFS is O((mn)^2)
  return [{ name: "200x200", args: [grid(rng, 200, 200)] }];
}

export function brute(h: number[][]): number[][] {
  const m = h.length, n = h[0].length;
  const reaches = (sr: number, sc: number, pacific: boolean): boolean => {
    const seen = new Set<number>([sr * n + sc]);
    const stack = [[sr, sc]];
    while (stack.length) {
      const [r, c] = stack.pop()!;
      if (pacific ? r === 0 || c === 0 : r === m - 1 || c === n - 1) return true;
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n || seen.has(nr * n + nc) || h[nr][nc] > h[r][c]) continue;
        seen.add(nr * n + nc);
        stack.push([nr, nc]);
      }
    }
    return false;
  };
  const out: number[][] = [];
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (reaches(r, c, true) && reaches(r, c, false)) out.push([r, c]);
  return out;
}
