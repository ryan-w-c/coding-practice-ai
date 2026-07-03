/**
 * Max Area of Island - Medium
 *
 * https://neetcode.io/problems/max-area-of-island
 */

export function maxAreaOfIsland(grid: number[][]): number {
    // Step 1: Initialize max area variable
    let maxArea = 0
    const rows = grid.length;
    const cols = grid[0] ? grid[0].length : 0

    // Step 2: Define a helper function for Depth First Search (DFS)
    const dfs = (row: number, col: number) => {
        // 2.1: Boundary check and check if the cell is '0' (water)
        if (row < 0 || col < 0 || row >= rows || col >= cols || grid[row][col] === 0) {
            return 0
        }

        // 2.2: Mark the cell as visited (change '1' to '0') and initialize area
        grid[row][col] = 0

        // 2.3: Visit all adjacent cells (up, down, left, right) and accumulate the area
        let area = 1
        area += dfs(row + 1, col)
        area += dfs(row - 1, col)
        area += dfs(row, col + 1)
        area += dfs(row, col - 1)

        return area
    }

    // Step 3: Iterate through all cells in the grid
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // 3.1: If the cell is '1' (land), perform DFS and update max area if necessary
            if (grid[r][c] === 1) {
                const area = dfs(r, c)
                maxArea = Math.max(area, maxArea)
            }
        }
    }

    return maxArea
}
