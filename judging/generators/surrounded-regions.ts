import type { Rng } from "./_rng";

function board(rng: Rng, m: number, n: number): string[][] {
  return Array.from({ length: m }, () =>
    Array.from({ length: n }, () => (rng.next() < 0.45 ? "O" : "X")));
}

export function cases(rng: Rng) {
  const out: { name: string; args: unknown[] }[] = [];
  for (let i = 0; i < 10; i++) {
    out.push({ name: `random #${i}`, args: [board(rng, rng.int(1, 20), rng.int(1, 20))] });
  }
  return out;
}

export function stress(rng: Rng) {
  return [{ name: "300x300", args: [board(rng, 300, 300)] }];
}

export function brute(b: string[][]): string[][] {
  const m = b.length, n = b[0].length;
  const out = b.map((r) => [...r]);
  const seen = new Set<number>();
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) {
      if (b[r][c] !== "O" || seen.has(r * n + c)) continue;
      const region: number[][] = [];
      let border = false;
      const stack = [[r, c]];
      seen.add(r * n + c);
      while (stack.length) {
        const [cr, cc] = stack.pop()!;
        region.push([cr, cc]);
        if (cr === 0 || cr === m - 1 || cc === 0 || cc === n - 1) border = true;
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nr >= m || nc < 0 || nc >= n || b[nr][nc] !== "O" || seen.has(nr * n + nc)) continue;
          seen.add(nr * n + nc);
          stack.push([nr, nc]);
        }
      }
      if (!border) for (const [rr, cc] of region) out[rr][cc] = "X";
    }
  return out;
}
