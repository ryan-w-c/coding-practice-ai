import { describe, it, expect } from "bun:test";
import { searchMatrix } from "./index";

describe("Search 2D Matrix", () => {
    it("should return true if target exists in matrix", () => {
        const matrix = [
            [1, 2, 4, 8],
            [10, 11, 12, 13],
            [14, 20, 30, 40],
        ];
        const target = 10;
        expect(searchMatrix(matrix, target)).toBe(true);
    });

    it("should return false if target does not exist in matrix", () => {
        const matrix = [
            [1, 2, 4, 8],
            [10, 11, 12, 13],
            [14, 20, 30, 40],
        ];
        const target = 15;
        expect(searchMatrix(matrix, target)).toBe(false);
    });

    it("should return true for target at the beginning", () => {
        const matrix = [
            [1, 2, 4, 8],
            [10, 11, 12, 13],
            [14, 20, 30, 40],
        ];
        const target = 1;
        expect(searchMatrix(matrix, target)).toBe(true);
    });

    it("should return true for target at the end", () => {
        const matrix = [
            [1, 2, 4, 8],
            [10, 11, 12, 13],
            [14, 20, 30, 40],
        ];
        const target = 40;
        expect(searchMatrix(matrix, target)).toBe(true);
    });

    it("should return false for an empty matrix", () => {
        const matrix: number[][] = [];
        const target = 5;
        expect(searchMatrix(matrix, target)).toBe(false);
    });
});
