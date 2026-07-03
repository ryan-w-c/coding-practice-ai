import { describe, it, expect } from "bun:test";
import { subsets } from "./index";

describe("Subsets", () => {
    it("should return all subsets for nums = [1, 2, 3]", () => {
        const nums = [1, 2, 3];
        const expected = [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]];
        expect(subsets(nums)).toEqual(expect.arrayContaining(expected));
    });

    it("should return all subsets for nums = [7]", () => {
        const nums = [7];
        const expected = [[], [7]];
        expect(subsets(nums)).toEqual(expect.arrayContaining(expected));
    });

    it("should return all subsets for nums = [0, 1]", () => {
        const nums = [0, 1];
        const expected = [[], [0], [1], [0, 1]];
        expect(subsets(nums)).toEqual(expect.arrayContaining(expected));
    });

    it("should return all subsets for an empty array", () => {
        const nums: number[] = [];
        const expected = [[]];
        expect(subsets(nums)).toEqual(expect.arrayContaining(expected));
    });
});
