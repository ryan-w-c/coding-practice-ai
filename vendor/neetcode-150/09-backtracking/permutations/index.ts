/**
 * Permutations - Medium
 *
 * https://neetcode.io/problems/permutations
 */

export function permute(nums: number[]): number[][] {
    // Step 0: Initialize result array to store permutations
    const result: number[][] = [];
    // Step 1: Define a backtracking function
    function backtrack(path: number[], used: Set<number>): void {
        // Step 1.1: Base case - if the path length equals nums length, a full permutation is found
        if (path.length === nums.length) {
            result.push([...path]);  // Store a copy of the current path as a permutation
            return;
        }

        // Step 2: Iterate over all elements to find the next unused element
        for (let i = 0; i < nums.length; i++) {
            if (used.has(i)) continue;  // Skip already used elements

            // Step 2.1: Make a choice - use nums[i] in the current permutation
            path.push(nums[i]);
            used.add(i);  // Mark the element as used

            // Step 2.2: Recur to explore further choices
            backtrack(path, used);

            // Step 2.3: Undo the choice (backtrack)
            path.pop();
            used.delete(i);  // Mark the element as unused
        }
    }

    // Step 3: Start backtracking from an empty path and an empty Set
    backtrack([], new Set());

    return result;
}
