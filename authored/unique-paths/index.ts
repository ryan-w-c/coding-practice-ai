/**
 * Unique Paths - Medium
 *
 * https://leetcode.com/problems/unique-paths/
 */

export function uniquePaths(m: number, n: number): number {
  let row = new Array<number>(n).fill(1);
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) row[c] += row[c - 1];
  }
  return row[n - 1];
}
