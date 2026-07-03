import { describe, it, expect } from "bun:test";
import { twoSum } from "./index";

describe("Two Integer Sum II", () => {
    it("should return correct indices for the given example", () => {
        const numbers = [1, 2, 3, 4];
        const target = 3;
        const result = twoSum(numbers, target);
        expect(result).toEqual([1, 2]); // 1-indexed output
    });

    it("should handle negative numbers", () => {
        const numbers = [-3, -1, 0, 2, 5];
        const target = 1;
        const result = twoSum(numbers, target);
        expect(result).toEqual([2, 4]); // -1 + 2 = 1
    });

    it("should handle larger arrays", () => {
        const numbers = [1, 3, 5, 7, 9, 11];
        const target = 16;
        const result = twoSum(numbers, target);
        expect(result).toEqual([3, 6]); // 5 + 11 = 16
    });

    it("should handle an array of two elements", () => {
        const numbers = [2, 7];
        const target = 9;
        const result = twoSum(numbers, target);
        expect(result).toEqual([1, 2]);
    });

    it("should handle duplicate numbers with a unique solution", () => {
        const numbers = [1, 1, 3, 5, 7];
        const target = 6;
        const result = twoSum(numbers, target);
        expect(result).toEqual([1, 4]); // 1 + 5 = 6
    });
});
