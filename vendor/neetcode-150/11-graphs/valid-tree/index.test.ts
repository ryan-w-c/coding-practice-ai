import { describe, test, expect } from "bun:test";
import { validTree } from "./index";

describe("Valid Tree", () => {
    test("Example 1", () => {
        const n = 5;
        const edges = [[0, 1], [0, 2], [0, 3], [1, 4]];
        expect(validTree(n, edges)).toBe(true);
    });

    test("Example 2", () => {
        const n = 5;
        const edges = [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]];
        expect(validTree(n, edges)).toBe(false);
    });

    test("Single node tree", () => {
        const n = 1;
        const edges: number[][] = [];
        expect(validTree(n, edges)).toBe(true);
    });

    test("Disconnected graph", () => {
        const n = 4;
        const edges = [[0, 1], [2, 3]];
        expect(validTree(n, edges)).toBe(false);
    });
});
