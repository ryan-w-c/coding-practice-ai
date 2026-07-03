import { describe, test, expect } from "bun:test";
import { pacificAtlantic } from "./index";

describe("Pacific Atlantic Water Flow", () => {
    test("Example 1", () => {
        const heights = [
            [4, 2, 7, 3, 4],
            [7, 4, 6, 4, 7],
            [6, 3, 5, 3, 6]
        ];
        const result = pacificAtlantic(heights);
        const expected = [[0, 2], [0, 4], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0]];
        expect(result).toEqual(expect.arrayContaining(expected));
    });

    test("Example 2", () => {
        const heights = [[1], [1]];
        const result = pacificAtlantic(heights);
        const expected = [[0, 0], [1, 0]];
        expect(result).toEqual(expect.arrayContaining(expected));
    });
});
