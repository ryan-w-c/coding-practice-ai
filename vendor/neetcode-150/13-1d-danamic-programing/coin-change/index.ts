/**
 * Coin Change - Medium
 *
 * https://neetcode.io/problems/coin-change
 */

export function coinChange(coins: number[], amount: number): number {
    // Step 1: Initialize state table
    // 1.1: Define the state table with the size of `amount + 1`
    const dp = new Array(amount + 1).fill(Infinity);
    // 1.2: Base case - to reach amount `0`, we need `0` coins
    dp[0] = 0;

    // Step 2: Fill the state table by iterating through each coin and each amount
    for (let coin of coins) {
        // 2.1: Iterate through each amount starting from the value of the current coin
        for (let i = coin; i <= amount; i++) {
            // 2.2: Update dp[i] as the minimum number of coins needed to reach `i`
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }

    // Step 3: Return the result - if `dp[amount]` is Infinity, it means it's not possible to form `amount` with given coins
    return dp[amount] === Infinity ? -1 : dp[amount];
}
