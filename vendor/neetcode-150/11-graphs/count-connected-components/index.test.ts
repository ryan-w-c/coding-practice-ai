import { describe, test, expect } from "bun:test";
import { countComponents } from "./index";

describe("Count Connected Components", () => {
    test("Example 1", () => {
        const n = 3;
        const edges = [[0, 1], [0, 2]];
        expect(countComponents(n, edges)).toBe(1);
    });

    test("Example 2", () => {
        const n = 6;
        const edges = [[0, 1], [1, 2], [2, 3], [4, 5]];
        expect(countComponents(n, edges)).toBe(2);
    });

    test("Single node", () => {
        const n = 1;
        const edges: number[][] = [];
        expect(countComponents(n, edges)).toBe(1);
    });

    test("Disconnected nodes", () => {
        const n = 4;
        const edges: number[][] = [];
        expect(countComponents(n, edges)).toBe(4);
    });

    test("Fully connected graph", () => {
        const n = 4;
        const edges = [[0, 1], [1, 2], [2, 3]];
        expect(countComponents(n, edges)).toBe(1);
    });
});
