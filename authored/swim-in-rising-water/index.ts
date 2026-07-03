/**
 * Swim in Rising Water - Hard
 *
 * https://leetcode.com/problems/swim-in-rising-water/
 */

export function swimInWater(grid: number[][]): number {
  const n = grid.length;
  const reachable = (t: number): boolean => {
    if (grid[0][0] > t) return false;
    const seen = new Set<number>([0]);
    const stack = [[0, 0]];
    while (stack.length) {
      const [r, c] = stack.pop()!;
      if (r === n - 1 && c === n - 1) return true;
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
        if (grid[nr][nc] > t || seen.has(nr * n + nc)) continue;
        seen.add(nr * n + nc);
        stack.push([nr, nc]);
      }
    }
    return false;
  };
  let lo = grid[0][0], hi = n * n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (reachable(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
