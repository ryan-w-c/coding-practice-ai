import { describe, test, expect } from "bun:test";
import { solveNQueens } from './index';

describe("N-Queens", () => {
    test("Example 1: n = 4", () => {
        const n = 4;
        const result = solveNQueens(n);
        const expected = [[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]];

        expected.forEach(solution => {
            expect(result).toContainEqual(solution);
        });
        expect(result.length).toBe(expected.length);
    });

    test("Example 2: n = 1", () => {
        const n = 1;
        const result = solveNQueens(n);
        const expected = [["Q"]];
        expect(result).toEqual(expected);
    });

    test("Example 3: n = 2 (no solution)", () => {
        const n = 2;
        const result = solveNQueens(n);
        expect(result).toEqual([]);
    });

    test("Example 4: n = 3 (no solution)", () => {
        const n = 3;
        const result = solveNQueens(n);
        expect(result).toEqual([]);
    });
});
