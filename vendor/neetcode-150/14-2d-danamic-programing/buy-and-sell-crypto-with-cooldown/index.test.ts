import { describe, it, expect } from "bun:test";
import { maxProfit } from "./index";

describe("Buy and Sell Crypto with Cooldown", () => {
    it("should return 6 for prices = [1,3,4,0,4]", () => {
        const prices = [1, 3, 4, 0, 4];
        const result = maxProfit(prices);
        expect(result).toBe(6);
    });

    it("should return 0 for prices = [1]", () => {
        const prices = [1];
        const result = maxProfit(prices);
        expect(result).toBe(0);
    });

    it("should return 3 for prices = [1, 2, 3, 0, 2]", () => {
        const prices = [1, 2, 3, 0, 2];
        const result = maxProfit(prices);
        expect(result).toBe(3);
    });

    it("should return 0 for prices = [2, 1]", () => {
        const prices = [2, 1];
        const result = maxProfit(prices);
        expect(result).toBe(0);
    });

    it("should return 4 for prices = [1, 3, 2, 8]", () => {
        const prices = [1, 3, 2, 8];
        const result = maxProfit(prices);
        expect(result).toBe(7);
    });
});
