/**
 * Buy and Sell Crypto - Easy
 *
 * https://neetcode.io/problems/buy-and-sell-crypto
 */

export function maxProfit(prices: number[]): number {
    let maxProfit = 0
    let minPrice = Number.POSITIVE_INFINITY

    for (let price of prices) {
        if (price < minPrice) {
            minPrice = price
        } else {
            maxProfit = Math.max(price - minPrice, maxProfit)
        }
    }

    return maxProfit;
}
