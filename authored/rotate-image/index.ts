/**
 * Rotate Image - Medium
 *
 * https://leetcode.com/problems/rotate-image/
 */

export function rotate(matrix: number[][]): void {
  const n = matrix.length;
  // transpose, then reverse each row
  for (let r = 0; r < n; r++) {
    for (let c = r + 1; c < n; c++) {
      [matrix[r][c], matrix[c][r]] = [matrix[c][r], matrix[r][c]];
    }
  }
  for (const row of matrix) row.reverse();
}
