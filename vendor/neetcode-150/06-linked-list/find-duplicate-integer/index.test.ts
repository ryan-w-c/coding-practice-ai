import { describe, it, expect } from "bun:test";
import { findDuplicate } from "./index";

/**
 * Find Duplicate Integer - Medium
 * 
 * https://neetcode.io/problems/find-duplicate-integer
 */

describe("Find Duplicate Integer", () => {
    it("should return 2 for input [1, 2, 3, 2, 2]", () => {
        const nums = [1, 2, 3, 2, 2];
        const result = findDuplicate(nums);
        expect(result).toBe(2);
    });

    it("should return 4 for input [1, 2, 3, 4, 4]", () => {
        const nums = [1, 2, 3, 4, 4];
        const result = findDuplicate(nums);
        expect(result).toBe(4);
    });

    it("should return 3 for input [3, 1, 3, 4, 2]", () => {
        const nums = [3, 1, 3, 4, 2];
        const result = findDuplicate(nums);
        expect(result).toBe(3);
    });

    it("should return 1 for input [1, 1, 2]", () => {
        const nums = [1, 1, 2];
        const result = findDuplicate(nums);
        expect(result).toBe(1);
    });

    it("should return 5 for input [5, 3, 4, 2, 1, 5]", () => {
        const nums = [5, 3, 4, 2, 1, 5];
        const result = findDuplicate(nums);
        expect(result).toBe(5);
    });
});
