export function pacificAtlantic(heights: number[][]): number[][] {
  const m = heights.length, n = heights[0]?.length ?? 0;
  if (!m || !n) return [];
  const mk = () => Array.from({ length: m }, () => new Array<boolean>(n).fill(false));
  const pac = mk(), atl = mk();
  const dfs = (r: number, c: number, seen: boolean[][]) => {
    seen[r][c] = true;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (seen[nr][nc] || heights[nr][nc] < heights[r][c]) continue;
      dfs(nr, nc, seen);
    }
  };
  for (let r = 0; r < m; r++) {
    dfs(r, 0, pac);
    dfs(r, n - 1, atl);
  }
  for (let c = 0; c < n; c++) {
    dfs(0, c, pac);
    dfs(m - 1, c, atl);
  }
  const out: number[][] = [];
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) if (pac[r][c] && atl[r][c]) out.push([r, c]);
  return out;
}
