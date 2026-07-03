const INF = 2147483647;

export function fillLandWithDistanceToTreasure(grid: number[][]): void {
  const m = grid.length, n = grid[0]?.length ?? 0;
  const queue: [number, number][] = [];
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) if (grid[r][c] === 0) queue.push([r, c]);
  let head = 0;
  while (head < queue.length) {
    const [r, c] = queue[head++];
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (grid[nr][nc] !== INF) continue;
      grid[nr][nc] = grid[r][c] + 1;
      queue.push([nr, nc]);
    }
  }
}
