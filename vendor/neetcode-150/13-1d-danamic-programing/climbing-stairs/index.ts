/**
 * Climbing Stairs - Easy
 *
 * https://neetcode.io/problems/climbing-stairs
 */
export function climbStairs(n: number): number {
    // Step 1: Process the base cases
    if (n === 1) return 1;
    if (n === 2) return 2;

    // Step 2: Define the state table to store the number of ways to reach each step
    const dp = new Array(n + 1).fill(0);

    // Step 2.1: Initialize the base states
    dp[1] = 1;
    dp[2] = 2;

    // Step 3: Fill the state table according to the state transition equation
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    // Step 4: Return the number of ways to reach the nth step
    return dp[n];
}
