/**
 * Longest Increasing Path in a Matrix - Hard
 *
 * https://leetcode.com/problems/longest-increasing-path-in-a-matrix/
 */

export function longestIncreasingPath(matrix: number[][]): number {
  const m = matrix.length, n = matrix[0].length;
  const memo: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  const dfs = (r: number, c: number): number => {
    if (memo[r][c]) return memo[r][c];
    let best = 1;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || matrix[nr][nc] <= matrix[r][c]) continue;
      best = Math.max(best, 1 + dfs(nr, nc));
    }
    memo[r][c] = best;
    return best;
  };
  let out = 0;
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) out = Math.max(out, dfs(r, c));
  return out;
}
