/**
 * Subsets - Medium
 *
 * https://neetcode.io/problems/subsets
 */



export function subsets(nums: number[]): number[][] {
    // Step 0: Initialize result array to store subsets
    const result: number[][] = [];

    // Step 1: Define the backtracking function
    function backtrack(path: number[], start: number): void {
        // 1.1: Store the current path as a subset
        result.push([...path]);

        // Step 2: Iterate over all possible options starting from `start`
        for (let i = start; i < nums.length; i++) {
            // 2.1: Make a choice - include nums[i] in the subset
            path.push(nums[i]);

            // 2.2: Recur to explore further choices
            backtrack(path, i + 1);

            // 2.3: Undo the choice (backtrack)
            path.pop();
        }
    }

    // Step 3: Start backtracking from an empty path and index 0
    backtrack([], 0);

    return result;
}