/**
 * Search for Word - Medium
 *
 * https://neetcode.io/problems/search-for-word
 */

export function exist(board: string[][], word: string): boolean {
    // Step 0: Check if the board is empty
    if (board.length === 0) return false;

    // Step 1: Get the number of rows and columns in the board
    const rows = board.length;
    const cols = board[0].length;

    // Step 2: Define a backtracking function to explore all possible paths
    function backtrack(r: number, c: number, wordIdx: number): boolean {
        // Step 2: Result and boundary checks
        // 2.1: Check if the current index matches the word length
        if (wordIdx === word.length) return true;

        // 2.2: Boundary conditions and character match check
        if (r < 0 || c < 0 || r >= rows || c >= cols || board[r][c] !== word[wordIdx]) {
            return false;
        }

        // Step 3: Backtracking steps
        // 3.1: Make Choice - Mark the current cell as visited by replacing the character temporarily
        const temp = board[r][c];
        board[r][c] = '#';

        // 3.2: Explore - Recursively explore all four possible directions (up, down, left, right)
        const found = (
            backtrack(r + 1, c, wordIdx + 1) ||  // Move down
            backtrack(r - 1, c, wordIdx + 1) ||  // Move up
            backtrack(r, c + 1, wordIdx + 1) ||  // Move right
            backtrack(r, c - 1, wordIdx + 1)     // Move left
        );

        // 3.3: Undo the Choice - Restore the original character in the current cell
        board[r][c] = temp;

        return found;
    }

    // Step 4: Iterate over each cell in the board to find the starting point of the word
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (backtrack(r, c, 0)) {
                return true;
            }
        }
    }

    // If no path is found that matches the word
    return false;
}
