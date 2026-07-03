import { describe, it, expect } from "bun:test";
import { combinationSum2 } from "./index";

describe("Combination Target Sum II", () => {
    it("should return correct combinations for candidates [9,2,2,4,6,1,5] and target 8", () => {
        const candidates = [9, 2, 2, 4, 6, 1, 5];
        const target = 8;
        const output = [
            [1, 2, 5],
            [2, 2, 4],
            [2, 6]
        ];
        expect(combinationSum2(candidates, target)).toEqual(expect.arrayContaining(output));
    });

    it("should return correct combinations for candidates [1,2,3,4,5] and target 7", () => {
        const candidates = [1, 2, 3, 4, 5];
        const target = 7;
        const output = [
            [1, 2, 4],
            [2, 5],
            [3, 4]
        ];
        expect(combinationSum2(candidates, target)).toEqual(expect.arrayContaining(output));
    });

    it("should return an empty list if no combinations are possible", () => {
        const candidates = [10, 12, 15];
        const target = 5;
        expect(combinationSum2(candidates, target)).toEqual([]);
    });

    it("should return a list containing a single combination when there is only one possible solution", () => {
        const candidates = [5];
        const target = 5;
        expect(combinationSum2(candidates, target)).toEqual([[5]]);
    });

    it("should handle duplicate candidates and not return duplicate combinations", () => {
        const candidates = [1, 1, 1, 2, 2];
        const target = 3;
        const output = [
            [1, 2]
        ];
        expect(combinationSum2(candidates, target)).toEqual(expect.arrayContaining(output));
    });
});
