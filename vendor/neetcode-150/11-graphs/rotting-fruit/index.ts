/**
 * Rotting Fruit - Medium
 *
 * https://neetcode.io/problems/rotting-fruit
 */

export function rottingFruit(grid: number[][]): number {
    const rows = grid.length;
    const cols = grid[0].length;
    const queue: [number, number][] = [];
    let freshCount = 0;
    const directions = [
        [0, 1],  // right
        [0, -1], // left
        [1, 0],  // down
        [-1, 0]  // up
    ];

    // Step 1: Initialize the queue with all rotten fruits and count fresh fruits
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 1) {
                freshCount++;
            } else if (grid[r][c] === 2) {
                queue.push([r, c]);
            }
        }
    }

    // Step 2: Perform BFS from each initially rotten fruit to rot adjacent fresh fruits
    let minutes = 0;
    while (queue.length > 0 && freshCount > 0) {
        const size = queue.length;

        // Process each fruit in the current level
        for (let i = 0; i < size; i++) {
            const [currentRow, currentCol] = queue.shift()!;
            for (const [dr, dc] of directions) {
                const newRow = currentRow + dr;
                const newCol = currentCol + dc;

                // Check if the new cell is within bounds and contains a fresh fruit
                if (
                    newRow >= 0 && newRow < rows &&
                    newCol >= 0 && newCol < cols &&
                    grid[newRow][newCol] === 1
                ) {
                    grid[newRow][newCol] = 2; // Rot the fresh fruit
                    freshCount--;
                    queue.push([newRow, newCol]); // Add the newly rotten fruit to the queue
                }
            }
        }

        // Increment the time after processing each level
        minutes++;
    }

    // Step 3: Return the result - either the total time or -1 if there are remaining fresh fruits
    return freshCount === 0 ? minutes : -1;
}
