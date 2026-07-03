export function searchMatrix(matrix: number[][], target: number): boolean {
  const m = matrix.length, n = matrix[0]?.length ?? 0;
  let lo = 0, hi = m * n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const v = matrix[(mid / n) | 0][mid % n];
    if (v === target) return true;
    if (v < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}
