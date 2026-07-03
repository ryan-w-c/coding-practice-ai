/**
 * Count Number of Islands - Medium
 *
 * https://neetcode.io/problems/count-number-of-islands
 */

export function numIslands(grid: string[][]): number {
    if (grid.length === 0) return 0

    let count = 0
    const rows = grid.length
    const cols = grid[0] ? grid[0].length : 0

    const dfs = (row: number, col: number) => {
        if (row < 0 || col < 0 || row >= rows || col >= cols || grid[row][col] === '0') {
            return
        }

        grid[row][col] = '0'
        dfs(row - 1, col)  //up
        dfs(row + 1, col)  //down
        dfs(row, col + 1)  //down
        dfs(row, col - 1)  //down
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                dfs(r, c)
                count += 1
            }
        }
    }


    return count
}
