/**
 * Min Cost Climbing Stairs - Easy
 *
 * https://neetcode.io/problems/min-cost-climbing-stairs
 */

export function minCostClimbingStairs(cost: number[]): number {
    // Step 1: Define the state table to store the minimum cost to reach each step
    const dp = new Array(cost.length + 1).fill(0);

    // Step 2: Fill the state table according to the state transition function
    // The base case is to start from either index 0 or index 1
    for (let i = 2; i <= cost.length; i++) {
        // Calculate the minimum cost to reach step i from either step i-1 or step i-2
        dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
    }

    // Step 3: Return the cost to reach the top (which is just beyond the last index)
    return dp[cost.length];
}
