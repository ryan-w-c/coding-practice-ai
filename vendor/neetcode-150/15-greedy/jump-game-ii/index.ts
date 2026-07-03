/**
 * Jump Game II - Medium
 *
 * https://neetcode.io/problems/jump-game-ii
 */

export function jump(nums: number[]): number {
    // Step 1: Initialize tracking variables and jump counter
    let jumps = 0, maxReach = 0, currentEnd = 0;

    // Step 2: Traverse the array, finding the farthest reachable index within the current jump range
    for (let i = 0; i < nums.length - 1; i++) {
        // Update `maxReach` to the farthest index reachable from the current index `i`
        maxReach = Math.max(maxReach, nums[i] + i);

        // If we've reached the end of the current jump range, increment the jump count
        if (i === currentEnd) {
            jumps += 1;
            currentEnd = maxReach;

            // Early exit if `currentEnd` already reaches or exceeds the last index
            if (maxReach >= nums.length - 1) {
                return jumps;
            }
        }
    }

    // Step 3: Return the total number of jumps needed to reach the last index
    return jumps;
}
