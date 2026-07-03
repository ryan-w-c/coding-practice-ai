import { describe, test, expect } from "bun:test";
import { trap } from './index';

describe("Trapping Rain Water", () => {
    test("Example 1", () => {
        expect(trap([0, 2, 0, 3, 1, 0, 1, 3, 2, 1])).toBe(9);
    });

    test("Flat terrain", () => {
        expect(trap([1, 1, 1, 1, 1])).toBe(0);
    });

    test("Single peak", () => {
        expect(trap([0, 1, 0])).toBe(0);
    });

    test("Multiple peaks", () => {
        expect(trap([4, 2, 0, 3, 2, 5])).toBe(9);
    });

    test("Ascending and descending slope", () => {
        expect(trap([1, 2, 3, 4, 3, 2, 1])).toBe(0);
    });

    test("Empty array", () => {
        expect(trap([])).toBe(0);
    });
});
