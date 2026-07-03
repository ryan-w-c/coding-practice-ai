import { describe, it, expect } from "bun:test";
import { Solution } from "./index";  // Assuming the class is exported from index.ts



describe("Solution.hasDuplicate", () => {

    let solution: Solution = new Solution();

    it("should return true when there is a duplicate", () => {
        const nums = [1, 2, 3, 3];
        expect(solution.hasDuplicate(nums)).toBe(true);
    });

    it("should return false when there are no duplicates", () => {
        const nums = [1, 2, 3, 4];
        expect(solution.hasDuplicate(nums)).toBe(false);
    });

    it("should return false for an empty array", () => {
        const nums: number[] = [];
        expect(solution.hasDuplicate(nums)).toBe(false);
    });

    it("should return true for an array with all the same elements", () => {
        const nums = [5, 5, 5, 5, 5];
        expect(solution.hasDuplicate(nums)).toBe(true);
    });

    it("should return false for an array with a single element", () => {
        const nums = [42];
        expect(solution.hasDuplicate(nums)).toBe(false);
    });

    it("should return true for an array with multiple duplicates", () => {
        const nums = [1, 2, 2, 3, 3];
        expect(solution.hasDuplicate(nums)).toBe(true);
    });
});
