import { describe, it, expect } from "bun:test";
import { exist } from "./index";

describe("Search for Word", () => {
    it("should return true for word 'CAT' in the given board", () => {
        const board = [
            ["A", "B", "C", "D"],
            ["S", "A", "A", "T"],
            ["A", "C", "A", "E"]
        ];
        const word = "CAT";
        expect(exist(board, word)).toBe(true);
    });

    it("should return false for word 'BAT' in the given board", () => {
        const board = [
            ["A", "B", "C", "D"],
            ["S", "A", "A", "T"],
            ["A", "C", "A", "E"]
        ];
        const word = "BAT";
        expect(exist(board, word)).toBe(false);
    });

    it("should return true for word 'ACAE' in the given board", () => {
        const board = [
            ["A", "B", "C", "D"],
            ["S", "A", "A", "T"],
            ["A", "C", "A", "E"]
        ];
        const word = "ACAE";
        expect(exist(board, word)).toBe(true);
    });

    it("should return false for an empty board", () => {
        const board: string[][] = [];
        const word = "A";
        expect(exist(board, word)).toBe(false);
    });

    it("should return true for word 'A' on a single-cell board", () => {
        const board = [["A"]];
        const word = "A";
        expect(exist(board, word)).toBe(true);
    });

    it("should return false for word 'B' on a single-cell board with 'A'", () => {
        const board = [["A"]];
        const word = "B";
        expect(exist(board, word)).toBe(false);
    });
});
