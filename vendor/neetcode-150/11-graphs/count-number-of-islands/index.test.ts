import { describe, it, expect } from "bun:test";
import { numIslands } from "./index";

describe("Count Number of Islands", () => {
    it("should return 1 for a single island", () => {
        const grid = [
            ["0", "1", "1", "1", "0"],
            ["0", "1", "0", "1", "0"],
            ["1", "1", "0", "0", "0"],
            ["0", "0", "0", "0", "0"]
        ];
        expect(numIslands(grid)).toBe(1);
    });

    it("should return 4 for multiple separate islands", () => {
        const grid = [
            ["1", "1", "0", "0", "1"],
            ["1", "1", "0", "0", "1"],
            ["0", "0", "1", "0", "0"],
            ["0", "0", "0", "1", "1"]
        ];
        expect(numIslands(grid)).toBe(4);
    });

    it("should return 0 for all water", () => {
        const grid = [
            ["0", "0", "0"],
            ["0", "0", "0"],
            ["0", "0", "0"]
        ];
        expect(numIslands(grid)).toBe(0);
    });

    it("should return 1 for a grid with all land", () => {
        const grid = [
            ["1", "1", "1"],
            ["1", "1", "1"],
            ["1", "1", "1"]
        ];
        expect(numIslands(grid)).toBe(1);
    });

    it("should handle a single row grid", () => {
        const grid = [["1", "0", "1", "1"]];
        expect(numIslands(grid)).toBe(2);
    });

    it("should handle a single column grid", () => {
        const grid = [
            ["1"],
            ["0"],
            ["1"],
            ["1"]
        ];
        expect(numIslands(grid)).toBe(2);
    });
});
