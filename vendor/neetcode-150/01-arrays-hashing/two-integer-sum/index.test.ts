import { describe, it, expect } from "bun:test";
import { Solution } from "./index";  // Assuming the Solution class is exported from index.ts

const solution = new Solution();

describe("Solution.twoSum", () => {
    it("should return [0,1] when nums = [3,4,5,6] and target = 7", () => {
        const nums = [3, 4, 5, 6];
        const target = 7;
        expect(solution.twoSum(nums, target)).toEqual([0, 1]);
    });

    it("should return [0,2] when nums = [4,5,6] and target = 10", () => {
        const nums = [4, 5, 6];
        const target = 10;
        expect(solution.twoSum(nums, target)).toEqual([0, 2]);
    });

    it("should return [0,1] when nums = [5,5] and target = 10", () => {
        const nums = [5, 5];
        const target = 10;
        expect(solution.twoSum(nums, target)).toEqual([0, 1]);
    });

    it("should return the correct indices for negative numbers", () => {
        const nums = [-3, 4, 3, 90];
        const target = 0;
        expect(solution.twoSum(nums, target)).toEqual([0, 2]);
    });

    it("should handle large numbers correctly", () => {
        const nums = [10000000, -10000000];
        const target = 0;
        expect(solution.twoSum(nums, target)).toEqual([0, 1]);
    });

    it("should return [0,1] for a minimal input of two numbers", () => {
        const nums = [1, 1];
        const target = 2;
        expect(solution.twoSum(nums, target)).toEqual([0, 1]);
    });
});
