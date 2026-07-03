/**
 * Set Matrix Zeroes - Medium
 *
 * https://leetcode.com/problems/set-matrix-zeroes/
 */

export function setZeroes(matrix: number[][]): void {
  const m = matrix.length, n = matrix[0].length;
  let firstRowZero = false, firstColZero = false;
  for (let c = 0; c < n; c++) if (matrix[0][c] === 0) firstRowZero = true;
  for (let r = 0; r < m; r++) if (matrix[r][0] === 0) firstColZero = true;
  for (let r = 1; r < m; r++)
    for (let c = 1; c < n; c++)
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
  for (let r = 1; r < m; r++)
    for (let c = 1; c < n; c++)
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
  if (firstRowZero) for (let c = 0; c < n; c++) matrix[0][c] = 0;
  if (firstColZero) for (let r = 0; r < m; r++) matrix[r][0] = 0;
}
