/**
 * Jump Game - Medium
 *
 * https://neetcode.io/problems/jump-game
 */

export function canJump(nums: number[]): boolean {
    // Step 1: Initialize the maximum reachable index as zero
    let maxReachIdx = 0;

    // Step 2: Traverse the array to determine if the last index can be reached
    for (let i = 0; i < nums.length; i++) {
        // If the current index is beyond the maximum reachable index, return false (end is unreachable)
        if (i > maxReachIdx) return false;

        // Update the maximum reachable index based on the current position and jump length
        maxReachIdx = Math.max(maxReachIdx, i + nums[i]);

        // If maxReachIdx reaches or exceeds the last index, return true (end is reachable)
        if (maxReachIdx >= nums.length - 1) return true;
    }

    // Step 3: Return false if the end of the array is not reachable
    return false;
}
