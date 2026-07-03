import { describe, it, expect } from "bun:test";
import { search } from "./index";

/**
 * Find Target in Rotated Sorted Array - Medium
 * 
 * https://neetcode.io/problems/find-target-in-rotated-sorted-array
 */

describe("Find Target in Rotated Sorted Array", () => {
    it("should return the correct index for target in the rotated sorted array", () => {
        expect(search([3, 4, 5, 6, 1, 2], 1)).toBe(4);
        expect(search([3, 5, 6, 0, 1, 2], 4)).toBe(-1);
        expect(search([1], 1)).toBe(0);
        expect(search([4, 5, 6, 7, 0, 1, 2], 0)).toBe(4);
    });

    it("should handle cases with two elements", () => {
        expect(search([5, 1], 5)).toBe(0);
        expect(search([5, 1], 1)).toBe(1);
    });

    it("should handle cases where the array is not rotated", () => {
        expect(search([1, 2, 3, 4, 5], 3)).toBe(2);
        expect(search([1, 2, 3, 4, 5], 6)).toBe(-1);
    });

    it("should handle cases where the target is the first or last element", () => {
        expect(search([6, 7, 1, 2, 3, 4, 5], 6)).toBe(0);
        expect(search([6, 7, 1, 2, 3, 4, 5], 5)).toBe(6);
    });

    it("should handle a large array that has been rotated", () => {
        const largeArray = [...Array(1000).keys()].map(i => i + 1);
        const rotatedArray = largeArray.slice(500).concat(largeArray.slice(0, 500));
        expect(search(rotatedArray, 1000)).toBe(499);
        expect(search(rotatedArray, 501)).toBe(0);
    });
});
