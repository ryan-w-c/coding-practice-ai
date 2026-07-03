import { describe, it, expect } from "bun:test";
import { rottingFruit } from "./index";

describe("Rotting Fruit", () => {
    it("should return 4 for grid [[1,1,0],[0,1,1],[0,1,2]]", () => {
        const grid = [
            [1, 1, 0],
            [0, 1, 1],
            [0, 1, 2]
        ];
        expect(rottingFruit(grid)).toBe(4);
    });

    it("should return -1 for grid [[1,0,1],[0,2,0],[1,0,1]]", () => {
        const grid = [
            [1, 0, 1],
            [0, 2, 0],
            [1, 0, 1]
        ];
        expect(rottingFruit(grid)).toBe(-1);
    });

    it("should return 0 for grid [[0, 0], [0, 0]] (no fruits)", () => {
        const grid = [
            [0, 0],
            [0, 0]
        ];
        expect(rottingFruit(grid)).toBe(0);
    });

    it("should return 1 for grid [[2, 1, 0]]", () => {
        const grid = [
            [2, 1, 0]
        ];
        expect(rottingFruit(grid)).toBe(1);
    });

    it("should return -1 for grid [[1, 1, 1], [1, 0, 1], [1, 1, 1]] (no rotten fruit to start)", () => {
        const grid = [
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1]
        ];
        expect(rottingFruit(grid)).toBe(-1);
    });
});
