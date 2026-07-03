import { describe, it, expect } from "bun:test";
import { threeSum } from "./index";

describe("Three Sum", () => {
    it("should return the correct triplets for the first test case", () => {
        const nums = [-1, 0, 1, 2, -1, -4];
        const result = threeSum(nums);
        const expected = [
            [-1, -1, 2],
            [-1, 0, 1]
        ];
        expect(result).toEqual(expected);
    });

    it("should return an empty array if no triplets sum to zero", () => {
        const nums = [0, 1, 1];
        const result = threeSum(nums);
        expect(result).toEqual([]);
    });

    it("should return one triplet if all elements are zero", () => {
        const nums = [0, 0, 0];
        const result = threeSum(nums);
        expect(result).toEqual([[0, 0, 0]]);
    });

    it("should handle arrays with no possible combinations", () => {
        const nums = [1, 2, 3];
        const result = threeSum(nums);
        expect(result).toEqual([]);
    });

    it("should handle larger inputs correctly", () => {
        const nums = [-2, 0, 1, 1, 2];
        const result = threeSum(nums);
        const expected = [
            [-2, 0, 2],
            [-2, 1, 1]
        ];
        expect(result).toEqual(expected);
    });
});
