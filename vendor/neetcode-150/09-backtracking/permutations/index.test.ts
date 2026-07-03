import { describe, it, expect } from "bun:test";
import { permute } from "./index";

describe("Permutations", () => {
    it("should return all permutations for nums = [1, 2, 3]", () => {
        const nums = [1, 2, 3];
        const expected = [
            [1, 2, 3], [1, 3, 2], [2, 1, 3],
            [2, 3, 1], [3, 1, 2], [3, 2, 1]
        ];
        expect(permute(nums)).toEqual(expect.arrayContaining(expected));
    });

    it("should return the only permutation for nums = [7]", () => {
        const nums = [7];
        const expected = [[7]];
        expect(permute(nums)).toEqual(expect.arrayContaining(expected));
    });

    it("should return all permutations for nums = [0, 1]", () => {
        const nums = [0, 1];
        const expected = [
            [0, 1], [1, 0]
        ];
        expect(permute(nums)).toEqual(expect.arrayContaining(expected));
    });

    it("should return all permutations for nums = [1, 2]", () => {
        const nums = [1, 2];
        const expected = [
            [1, 2], [2, 1]
        ];
        expect(permute(nums)).toEqual(expect.arrayContaining(expected));
    });
});
