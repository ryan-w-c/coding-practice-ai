import { describe, test, expect } from "bun:test";
import { solve } from "./index";

describe("Surrounded Regions", () => {
    test("Example 1", () => {
        const board = [
            ["X", "X", "X", "X"],
            ["X", "O", "O", "X"],
            ["X", "O", "O", "X"],
            ["X", "X", "X", "O"]
        ];
        solve(board);
        const expected = [
            ["X", "X", "X", "X"],
            ["X", "X", "X", "X"],
            ["X", "X", "X", "X"],
            ["X", "X", "X", "O"]
        ];
        expect(board).toEqual(expected);
    });

    test("Example 2", () => {
        const board = [
            ["X", "O", "X"],
            ["O", "O", "X"],
            ["X", "X", "O"]
        ];
        solve(board);
        const expected = [
            ["X", "O", "X"],
            ["O", "O", "X"],
            ["X", "X", "O"]
        ];
        expect(board).toEqual(expected);
    });
});
