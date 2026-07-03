import { describe, it, expect } from "bun:test";
import { findMin } from "./index";

/**
 * Find Minimum in Rotated Sorted Array - Medium
 * 
 * https://neetcode.io/problems/find-minimum-in-rotated-sorted-array
 */

describe("Find Minimum in Rotated Sorted Array", () => {
    it("should return the minimum element for various rotated arrays", () => {
        expect(findMin([3, 4, 5, 6, 1, 2])).toBe(1);
        expect(findMin([4, 5, 0, 1, 2, 3])).toBe(0);
        expect(findMin([4, 5, 6, 7])).toBe(4);
        expect(findMin([2, 3, 4, 5, 6, 1])).toBe(1);
    });

    it("should handle arrays with two elements", () => {
        expect(findMin([5, 1])).toBe(1);
        expect(findMin([1, 5])).toBe(1);
    });

    it("should handle cases where the array is not rotated", () => {
        expect(findMin([1, 2, 3, 4, 5])).toBe(1);
    });

    it("should handle a single element array", () => {
        expect(findMin([3])).toBe(3);
    });

    it("should handle a large rotated array", () => {
        const largeArray = [...Array(1000).keys()].map(i => i + 1);
        const rotatedArray = largeArray.slice(500).concat(largeArray.slice(0, 500));
        expect(findMin(rotatedArray)).toBe(1);
    });
});
