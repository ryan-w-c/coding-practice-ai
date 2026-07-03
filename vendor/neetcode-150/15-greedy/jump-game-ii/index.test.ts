import { describe, test, expect } from "bun:test";
import { jump } from './index';

describe("Jump Game II", () => {
    test("Example 1", () => {
        expect(jump([2, 4, 1, 1, 1, 1])).toBe(2);
    });

    test("Example 2", () => {
        expect(jump([2, 1, 2, 1, 0])).toBe(2);
    });

    test("Single element", () => {
        expect(jump([0])).toBe(0);
    });

    test("Multiple large jumps", () => {
        expect(jump([5, 9, 3, 2, 1, 0, 2, 3, 3, 1, 0, 0])).toBe(3);
    });

    test("All steps are 1", () => {
        expect(jump([1, 1, 1, 1, 1])).toBe(4);
    });

    test("Larger range values", () => {
        expect(jump([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1])).toBe(1);
    });
});
