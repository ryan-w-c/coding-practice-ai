import { describe, it, expect } from "bun:test";
import { maxAreaOfIsland } from "./index";

describe("Max Area of Island", () => {
    it("should return 6 for the given grid", () => {
        const grid = [
            [0, 1, 1, 0, 1],
            [1, 0, 1, 0, 1],
            [0, 1, 1, 0, 1],
            [0, 1, 0, 0, 1]
        ];
        expect(maxAreaOfIsland(grid)).toBe(6);
    });

    it("should return 0 for all water", () => {
        const grid = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        expect(maxAreaOfIsland(grid)).toBe(0);
    });

    it("should return 1 for a single cell island", () => {
        const grid = [
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0]
        ];
        expect(maxAreaOfIsland(grid)).toBe(1);
    });

    it("should return 5 for a grid with a larger island", () => {
        const grid = [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0]
        ];
        expect(maxAreaOfIsland(grid)).toBe(4);
    });

    it("should handle a single row grid", () => {
        const grid = [[1, 0, 1, 1]];
        expect(maxAreaOfIsland(grid)).toBe(2);
    });

    it("should handle a single column grid", () => {
        const grid = [
            [1],
            [0],
            [1],
            [1]
        ];
        expect(maxAreaOfIsland(grid)).toBe(2);
    });
});
