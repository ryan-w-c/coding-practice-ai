import { describe, test, expect } from "bun:test";
import { combinationSum } from './index';

describe("Combination Target Sum", () => {
    test("Example 1", () => {
        const nums = [2, 5, 6, 9];
        const target = 9;
        const result = combinationSum(nums, target);
        const expected = [[2, 2, 5], [9]];

        // Check that each expected subset is in the result
        expected.forEach(subset => {
            expect(result).toContainEqual(subset);
        });

        // Check that there are no extra subsets in the result
        expect(result.length).toBe(expected.length);
    });

    test("Example 2", () => {
        const nums = [3, 4, 5];
        const target = 16;
        const result = combinationSum(nums, target);
        const expected = [[3, 3, 3, 3, 4], [3, 3, 5, 5], [4, 4, 4, 4], [3, 4, 4, 5]];

        // Check that each expected subset is in the result
        expected.forEach(subset => {
            expect(result).toContainEqual(subset);
        });

        // Check that there are no extra subsets in the result
        expect(result.length).toBe(expected.length);
    });

    test("No solutions", () => {
        const nums = [3];
        const target = 5;
        const result = combinationSum(nums, target);
        const expected: number[][] = [];

        // Check that the result matches the expected output
        expect(result).toEqual(expected);
    });

    test("Single element equal to target", () => {
        const nums = [7];
        const target = 7;
        const result = combinationSum(nums, target);
        const expected = [[7]];

        expected.forEach(subset => {
            expect(result).toContainEqual(subset);
        });

        expect(result.length).toBe(expected.length);
    });
});
