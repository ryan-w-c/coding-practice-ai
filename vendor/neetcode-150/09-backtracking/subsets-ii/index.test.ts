import { describe, test, expect } from "bun:test";
import { subsetsWithDup } from './index';

// Helper function to compare two arrays of arrays without considering order
function hasSameElements(arr1: number[][], arr2: number[][]): boolean {
    if (arr1.length !== arr2.length) return false;

    const sortedArr1 = arr1.map(subArray => subArray.sort((a, b) => a - b)).sort();
    const sortedArr2 = arr2.map(subArray => subArray.sort((a, b) => a - b)).sort();

    return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2);
}

describe("Subsets II", () => {
    test("Example 1", () => {
        const nums = [1, 2, 1];
        const result = subsetsWithDup(nums);

        const expected = [[], [1], [1, 1], [1, 2], [1, 2, 1], [2]];

        // Check that result and expected have the same elements
        expect(hasSameElements(result, expected)).toBe(true);
    });


    test("Example 2", () => {
        const nums = [7, 7];
        const result = subsetsWithDup(nums);
        expect(result).toEqual([[], [7], [7, 7]]);
    });

    test("No duplicates", () => {
        const nums = [1, 2, 3];
        const result = subsetsWithDup(nums);
        expect(result).toEqual([[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]);
    });

    test("Single element", () => {
        const nums = [5];
        const result = subsetsWithDup(nums);
        expect(result).toEqual([[], [5]]);
    });

    test("All elements the same", () => {
        const nums = [4, 4, 4];
        const result = subsetsWithDup(nums);
        expect(result).toEqual([[], [4], [4, 4], [4, 4, 4]]);
    });
});
