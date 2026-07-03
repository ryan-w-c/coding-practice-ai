/**
 * Buy and Sell Crypto with Cooldown - Medium
 *
 * https://neetcode.io/problems/buy-and-sell-crypto-with-cooldown
 */


export function maxProfit(prices: number[]): number {
    const n = prices.length;
    if (n === 0) return 0;

    // Step 1: Define state table, each day has three states:
    // dp[i][0]: max profit on day i if holding a coin
    // dp[i][1]: max profit on day i if just sold 
    // dp[i][2]: max profit on day i if resting
    const dp = Array.from({ length: n }, () => [0, 0, 0]);

    // Step 2: Initialize the base cases for day 0
    dp[0][0] = -prices[0]; // Buying on the first day
    dp[0][1] = 0;          // Not possible to sell on the first day
    dp[0][2] = 0;          // Resting with no profit on the first day

    // Step 3: Fill the state table for subsequent days
    for (let i = 1; i < n; i++) {
        // State transition for holding a coin:
        // Either we continue holding from yesterday or buy today after resting
        dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][2] - prices[i]);

        // State transition for selling a coin:
        // We can only sell today if we were holding a coin yesterday
        dp[i][1] = dp[i - 1][0] + prices[i];

        // State transition for resting:
        // Either we rest from a sell yesterday or continue resting from yesterday
        dp[i][2] = Math.max(dp[i - 1][1], dp[i - 1][2]);
    }

    // Step 4: Return the maximum profit achievable on the last day
    // This can either be from having just sold or resting (since holding would imply we haven't sold)
    return Math.max(dp[n - 1][1], dp[n - 1][2]);
}
