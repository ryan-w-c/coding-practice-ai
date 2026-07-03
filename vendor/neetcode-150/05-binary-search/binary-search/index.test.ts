import { describe, it, expect } from "bun:test";
import { binarySearch } from "./index";

describe("Binary Search", () => {
    it("should return the correct index when target is present", () => {
        const nums1 = [-1, 0, 2, 4, 6, 8];
        const target1 = 4;
        expect(binarySearch(nums1, target1)).toBe(3); // 4 is at index 3

        const nums2 = [-10, -5, 0, 3, 5, 9, 12];
        const target2 = -10;
        expect(binarySearch(nums2, target2)).toBe(0); // -10 is at index 0
    });

    it("should return -1 when target is not present", () => {
        const nums = [-1, 0, 2, 4, 6, 8];
        const target = 3;
        expect(binarySearch(nums, target)).toBe(-1); // 3 is not in the array
    });

    it("should return -1 for an empty array", () => {
        const nums: number[] = [];
        const target = 3;
        expect(binarySearch(nums, target)).toBe(-1);
    });

    it("should handle single element arrays", () => {
        const nums1 = [5];
        expect(binarySearch(nums1, 5)).toBe(0); // Single element is the target
        expect(binarySearch(nums1, 1)).toBe(-1); // Single element but target not found
    });
});
