import { describe, it, expect } from "bun:test";
import { productExceptSelf } from "./index";

describe("Products of Array Except Self", () => {
    it("should return correct product array for [1,2,4,6]", () => {
        const nums = [1, 2, 4, 6];
        const result = productExceptSelf(nums);
        expect(result).toEqual([48, 24, 12, 8]);
    });

    it("should handle array with zero correctly", () => {
        const nums = [-1, 0, 1, 2, 3];
        const answer = [0, -6, 0, 0, 0]
        const result = productExceptSelf(nums);
        result.forEach((num, idx) => {
            expect(num).toBeCloseTo(answer[idx]);
        })
    });

    it("should handle array of length 2", () => {
        const nums = [3, 5];
        const result = productExceptSelf(nums);
        expect(result).toEqual([5, 3]);
    });

    it("should handle all negative numbers", () => {
        const nums = [-1, -2, -3];
        const result = productExceptSelf(nums);
        expect(result).toEqual([6, 3, 2]);
    });

    it("should handle array with all elements as 1", () => {
        const nums = [1, 1, 1, 1];
        const result = productExceptSelf(nums);
        expect(result).toEqual([1, 1, 1, 1]);
    });
});
