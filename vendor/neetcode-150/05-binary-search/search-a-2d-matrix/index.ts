/**
 * Search a 2D Matrix - Medium
 *
 * https://neetcode.io/problems/search-a-2d-matrix
 */

export function searchMatrix(matrix: number[][], target: number): boolean {
    if (matrix.length === 0 || matrix[0].length === 0) return false

    const m = matrix.length
    const n = matrix[0].length

    /**
      [  
        [ 1,  2,  4,  8],
        [10, 11, 12, 13],
        [14, 20, 30, 40]
      ]
      treat matrix as 1-D Array 
      [1, 2, 4, 8, 10, 11, 12, 13, 14, 20, 30, 40]
     */
    let left = 0;
    let right = m * n - 1

    while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        const rowIdx = Math.floor(mid / n)
        const colId = mid % n
        const midValue = matrix[rowIdx][colId]

        if (midValue === target) {
            return true
        } else if (midValue > target) {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }

    return false;
}
