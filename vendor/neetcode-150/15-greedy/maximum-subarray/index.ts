/**
 * Maximum Subarray - Medium
 *
 * https://neetcode.io/problems/maximum-subarray
 */

export function maxSubArray(nums: number[]): number {
    // Step 1: Initialize maxSum and currentSum with the first element
    let currentSum = nums[0];
    let maxSum = currentSum;

    // Step 2: Traverse the array, updating maxSum and currentSum
    for (let i = 1; i < nums.length; i++) {
        // 2.1: Update currentSum to either continue with nums[i] or start fresh from nums[i]
        currentSum = Math.max(currentSum + nums[i], nums[i]);

        // 2.2: Update maxSum if currentSum is greater than the current maxSum
        maxSum = Math.max(currentSum, maxSum);
    }

    // Step 3: Return the maximum subarray sum
    return maxSum;
}

