/**
 * Combination Target Sum II - Medium
 *
 * https://neetcode.io/problems/combination-target-sum-ii
 */


export function combinationSum2(candidates: number[], target: number): number[][] {
    // Step 0: Sort the candidates to handle duplicates easily
    candidates.sort((a, b) => a - b);

    // Step 1: Initialize result array to store combinations
    const result: number[][] = [];

    // Step 2: Define the backtracking function
    function backtrack(start: number, path: number[], targetSum: number): void {
        // Step 2.1: Base case - if the target sum is zero, add the current path as a valid combination
        if (targetSum === 0) {
            result.push([...path]);
            return;
        }

        // Step 3: Iterate and Make Choices
        for (let i = start; i < candidates.length; i++) {
            // Step 3.0: Check boundary conditions
            // 3.0.1: Skip duplicate elements
            if (i > start && candidates[i] === candidates[i - 1]) {
                continue;
            }

            // 3.0.2: Break if the current candidate exceeds the target sum
            if (candidates[i] > targetSum) {
                break;
            }

            // Step 3.1: Make a choice - add the current candidate to the path
            path.push(candidates[i]);

            // Step 3.2: Explore - recursively call backtrack with updated target sum and next index
            backtrack(i + 1, path, targetSum - candidates[i]);

            // Step 3.3: Undo the choice (backtrack) - remove the last added element from the path
            path.pop();
        }
    }

    // Step 4: Start backtracking from index 0 with an empty path and the target sum
    backtrack(0, [], target);

    return result;
}

/**

candidates = [1, 2, 2, 3], target = 5

Root [start: 0, path: [], targetSum: 8]                     <- Initial state, empty path, full target sum
|
|-- i = 0 [start: 1, path: [1], targetSum: 7]
|   |
|   |-- i = 1 [start: 2, path: [1, 2], targetSum: 5]
|   |   |
|   |   |-- i = 2 [start: 3, path: [1, 2, 2], targetSum: 3]
|   |   |   |
|   |   |   |-- Breaking out: i = 3, candidates[3] = 4 is greater than targetSum = 3
|   |   |   <- Backtrack, remove 2 from path
|   |   |
|   |   |-- i = 3 [start: 4, path: [1, 2, 4], targetSum: 1]
|   |   |   |
|   |   |   |-- Breaking out: i = 4, candidates[4] = 5 is greater than targetSum = 1
|   |   |   <- Backtrack, remove 4 from path
|   |   |
|   |   |-- i = 4 [start: 5, path: [1, 2, 5], targetSum: 0]  <- Found valid combination: [1, 2, 5]
|   |   |   <- Backtrack, remove 5 from path
|   |   |
|   |   |-- Breaking out: i = 5, candidates[5] = 6 is greater than targetSum = 5
|   |   <- Backtrack, remove 2 from path
|   |
|   |-- Skipping duplicate: i = 2, candidates[2] = 2
|   |
|   |-- i = 3 [start: 4, path: [1, 4], targetSum: 3]
|   |   |
|   |   |-- Breaking out: i = 4, candidates[4] = 5 is greater than targetSum = 3
|   |   <- Backtrack, remove 4 from path
|   |
|   |-- i = 4 [start: 5, path: [1, 5], targetSum: 2]
|   |   |
|   |   |-- Breaking out: i = 5, candidates[5] = 6 is greater than targetSum = 2
|   |   <- Backtrack, remove 5 from path
|   |
|   |-- i = 5 [start: 6, path: [1, 6], targetSum: 1]
|   |   |
|   |   |-- Breaking out: i = 6, candidates[6] = 9 is greater than targetSum = 1
|   |   <- Backtrack, remove 6 from path
|   |
|   |-- Breaking out: i = 6, candidates[6] = 9 is greater than targetSum = 7
|   <- Backtrack, remove 1 from path
|
|-- i = 1 [start: 2, path: [2], targetSum: 6]
|   |
|   |-- i = 2 [start: 3, path: [2, 2], targetSum: 4]
|   |   |
|   |   |-- i = 3 [start: 4, path: [2, 2, 4], targetSum: 0]  <- Found valid combination: [2, 2, 4]
|   |   <- Backtrack, remove 4 from path
|   |
|   |-- Breaking out: i = 4, candidates[4] = 5 is greater than targetSum = 4
|   <- Backtrack, remove 2 from path
|   |
|   |-- i = 3 [start: 4, path: [2, 4], targetSum: 2]
|   |   |
|   |   |-- Breaking out: i = 4, candidates[4] = 5 is greater than targetSum = 2
|   |   <- Backtrack, remove 4 from path
|   |
|   |-- i = 4 [start: 5, path: [2, 5], targetSum: 1]
|   |   |
|   |   |-- Breaking out: i = 5, candidates[5] = 6 is greater than targetSum = 1
|   |   <- Backtrack, remove 5 from path
|   |
|   |-- i = 5 [start: 6, path: [2, 6], targetSum: 0]  <- Found valid combination: [2, 6]
|   <- Backtrack, remove 6 from path
|   |
|   |-- Breaking out: i = 6, candidates[6] = 9 is greater than targetSum = 6
|   <- Backtrack, remove 2 from path
|
|-- Skipping duplicate: i = 2, candidates[2] = 2
|
|-- i = 3 [start: 4, path: [4], targetSum: 4]
|   |
|   |-- Breaking out: i = 4, candidates[4] = 5 is greater than targetSum = 4
|   <- Backtrack, remove 4 from path
|
|-- i = 4 [start: 5, path: [5], targetSum: 3]
|   |
|   |-- Breaking out: i = 5, candidates[5] = 6 is greater than targetSum = 3
|   <- Backtrack, remove 5 from path
|
|-- i = 5 [start: 6, path: [6], targetSum: 2]
|   |
|   |-- Breaking out: i = 6, candidates[6] = 9 is greater than targetSum = 2
|   <- Backtrack, remove 6 from path
|
|-- Breaking out: i = 6, candidates[6] = 9 is greater than targetSum = 8

*/