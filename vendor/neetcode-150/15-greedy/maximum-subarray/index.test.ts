import { maxSubArray } from './index';
import { describe, test, expect } from "bun:test";

describe("Maximum Subarray", () => {
    test("Example 1", () => {
        expect(maxSubArray([2, -3, 4, -2, 2, 1, -1, 4])).toBe(8);
    });

    test("Example 2", () => {
        expect(maxSubArray([-1])).toBe(-1);
    });

    test("All negative numbers", () => {
        expect(maxSubArray([-5, -4, -3, -2, -1])).toBe(-1);
    });

    test("All positive numbers", () => {
        expect(maxSubArray([1, 2, 3, 4, 5])).toBe(15);
    });

    test("Mixed positive and negative numbers", () => {
        expect(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toBe(6);
    });

    test("Single element, positive number", () => {
        expect(maxSubArray([10])).toBe(10);
    });

    test("Single element, negative number", () => {
        expect(maxSubArray([-10])).toBe(-10);
    });
});
