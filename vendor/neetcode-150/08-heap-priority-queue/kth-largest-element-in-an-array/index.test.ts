import { describe, it, expect } from "bun:test";
import { findKthLargest } from "./index";

describe("Kth Largest Element in an Array", () => {
    it("should return 4 for nums = [2, 3, 1, 5, 4] and k = 2", () => {
        const nums = [2, 3, 1, 5, 4];
        const k = 2;
        expect(findKthLargest(nums, k)).toBe(4);
    });

    it("should return 4 for nums = [2, 3, 1, 1, 5, 5, 4] and k = 3", () => {
        const nums = [2, 3, 1, 1, 5, 5, 4];
        const k = 3;
        expect(findKthLargest(nums, k)).toBe(4);
    });

    it("should return 3 for nums = [3, 2, 1, 5, 6, 4] and k = 4", () => {
        const nums = [3, 2, 1, 5, 6, 4];
        const k = 4;
        expect(findKthLargest(nums, k)).toBe(3);
    });

    it("should return 1 for nums = [1, 1, 1, 1] and k = 1", () => {
        const nums = [1, 1, 1, 1];
        const k = 1;
        expect(findKthLargest(nums, k)).toBe(1);
    });

    it("should return 5 for nums = [7, 10, 4, 3, 20, 15] and k = 3", () => {
        const nums = [7, 10, 4, 3, 20, 15];
        const k = 3;
        expect(findKthLargest(nums, k)).toBe(10);
    });
});
