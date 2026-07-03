import { describe, test, expect } from "bun:test";
import { fillLandWithDistanceToTreasure } from "./index";

describe("Islands and Treasure", () => {
    test("Example 1", () => {
        const grid = [
            [2147483647, -1, 0, 2147483647],
            [2147483647, 2147483647, 2147483647, -1],
            [2147483647, -1, 2147483647, -1],
            [0, -1, 2147483647, 2147483647]
        ];
        fillLandWithDistanceToTreasure(grid);
        expect(grid).toEqual([
            [3, -1, 0, 1],
            [2, 2, 1, -1],
            [1, -1, 2, -1],
            [0, -1, 3, 4]
        ]);
    });

    test("Example 2", () => {
        const grid = [
            [0, -1],
            [2147483647, 2147483647]
        ];
        fillLandWithDistanceToTreasure(grid);
        expect(grid).toEqual([
            [0, -1],
            [1, 2]
        ]);
    });
});
