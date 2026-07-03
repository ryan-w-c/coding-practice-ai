import { describe, it, expect } from "bun:test";
import { minEatingSpeed } from "./index";

describe("Eating Bananas", () => {
    it("should return the minimum eating speed for the first test case", () => {
        const piles = [1, 4, 3, 2];
        const h = 9;
        const result = minEatingSpeed(piles, h);
        expect(result).toBe(2);
    });

    it("should return the minimum eating speed for the second test case", () => {
        const piles = [25, 10, 23, 4];
        const h = 4;
        const result = minEatingSpeed(piles, h);
        expect(result).toBe(25);
    });

    it("should return 1 when there is only one hour and one pile", () => {
        const piles = [100];
        const h = 1;
        const result = minEatingSpeed(piles, h);
        expect(result).toBe(100);
    });

    it("should handle edge case of single pile", () => {
        const piles = [5];
        const h = 10;
        const result = minEatingSpeed(piles, h);
        expect(result).toBe(1);
    });

    it("should handle maximum number of bananas per pile", () => {
        const piles = [1000000000];
        const h = 1000000;
        const result = minEatingSpeed(piles, h);
        expect(result).toBe(1000);
    });
});
