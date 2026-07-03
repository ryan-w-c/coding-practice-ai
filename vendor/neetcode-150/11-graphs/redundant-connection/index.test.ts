import { describe, test, expect } from "bun:test";
import { findRedundantConnection } from "./index";

describe("Redundant Connection", () => {
    test("Example 1", () => {
        const edges = [[1, 2], [1, 3], [3, 4], [2, 4]];
        expect(findRedundantConnection(edges)).toEqual([2, 4]);
    });

    test("Example 2", () => {
        const edges = [[1, 2], [1, 3], [1, 4], [3, 4], [4, 5]];
        expect(findRedundantConnection(edges)).toEqual([3, 4]);
    });

    test("Edge at the end forms the cycle", () => {
        const edges = [[1, 2], [2, 3], [3, 4], [1, 4], [4, 5]];
        expect(findRedundantConnection(edges)).toEqual([1, 4]);
    });

    test("Simple cycle", () => {
        const edges = [[1, 2], [2, 3], [3, 1]];
        expect(findRedundantConnection(edges)).toEqual([3, 1]);
    });
});
