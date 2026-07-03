/**
 * Coin Change II - Medium
 *
 * https://neetcode.io/problems/coin-change-ii
 */


export function coinChangeII(amount: number, coins: number[]): number {
    // Step 1: Initialize the state table
    // dp[i] represents the number of ways to make amount 'i' using the given coins
    const dp = Array(amount + 1).fill(0);
    dp[0] = 1; // There is one way to make amount 0 (use no coins)

    // Step 2: Fill the state table using each coin
    // Iterate over each coin and update the dp array
    for (let coin of coins) {
        for (let i = coin; i <= amount; i++) {
            // Update the number of ways to make amount 'i' by adding the current coin
            dp[i] += dp[i - coin];
        }
    }

    // Step 3: Return the number of ways to make the target amount
    return dp[amount];
}
