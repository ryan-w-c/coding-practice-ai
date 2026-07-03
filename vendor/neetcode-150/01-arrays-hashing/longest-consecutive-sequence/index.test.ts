import { describe, it, expect } from "bun:test";
import { longestConsecutive } from "./index";

describe("Longest Consecutive Sequence", () => {
    it("should return the length of the longest consecutive sequence for example 1", () => {
        const nums = [2, 20, 4, 10, 3, 4, 5];
        const result = longestConsecutive(nums);
        expect(result).toBe(4); // Longest sequence: [2, 3, 4, 5]
    });

    it("should return the length of the longest consecutive sequence for example 2", () => {
        const nums = [0, 3, 2, 5, 4, 6, 1, 1];
        const result = longestConsecutive(nums);
        expect(result).toBe(7); // Longest sequence: [0, 1, 2, 3, 4, 5, 6]
    });

    it("should return 0 for an empty array", () => {
        const nums: number[] = [];
        const result = longestConsecutive(nums);
        expect(result).toBe(0);
    });

    it("should return 1 for an array with all identical elements", () => {
        const nums = [5, 5, 5, 5];
        const result = longestConsecutive(nums);
        expect(result).toBe(1); // Longest sequence: [5]
    });

    it("should handle an already consecutive sequence", () => {
        const nums = [1, 2, 3, 4, 5];
        const result = longestConsecutive(nums);
        expect(result).toBe(5); // Longest sequence: [1, 2, 3, 4, 5]
    });

    it("should handle a disjointed array", () => {
        const nums = [10, 30, 20, 40];
        const result = longestConsecutive(nums);
        expect(result).toBe(1); // No consecutive sequence longer than 1
    });
});
