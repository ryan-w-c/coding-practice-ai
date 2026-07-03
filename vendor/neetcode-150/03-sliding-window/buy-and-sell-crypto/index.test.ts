import { describe, it, expect } from "bun:test";
import { maxProfit } from "./index";

describe("Buy and Sell Crypto", () => {
    it("should return the maximum profit for a normal price list", () => {
        const prices = [10, 1, 5, 6, 7, 1];
        const result = maxProfit(prices);
        expect(result).toBe(6); // Buy at 1, sell at 7
    });

    it("should return 0 if no profitable transactions can be made", () => {
        const prices = [10, 8, 7, 5, 2];
        const result = maxProfit(prices);
        expect(result).toBe(0); // Prices only decrease, no profit possible
    });

    it("should return the maximum profit for increasing prices", () => {
        const prices = [1, 2, 3, 4, 5];
        const result = maxProfit(prices);
        expect(result).toBe(4); // Buy at 1, sell at 5
    });

    it("should handle a single price", () => {
        const prices = [5];
        const result = maxProfit(prices);
        expect(result).toBe(0); // No transaction can be made
    });

    it("should handle two prices where profit is possible", () => {
        const prices = [5, 10];
        const result = maxProfit(prices);
        expect(result).toBe(5); // Buy at 5, sell at 10
    });

    it("should handle two prices where profit is not possible", () => {
        const prices = [10, 5];
        const result = maxProfit(prices);
        expect(result).toBe(0); // Prices decrease, no profit possible
    });
});
