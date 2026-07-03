import { canJump } from './index';
import { describe, test, expect } from "bun:test";

describe("Jump Game", () => {
    test("Example 1", () => {
        expect(canJump([1, 2, 0, 1, 0])).toBe(true);
    });

    test("Example 2", () => {
        expect(canJump([3, 2, 1, 0, 4])).toBe(false);
    });

    test("Edge Case: Single element", () => {
        expect(canJump([0])).toBe(true);
    });

    test("Edge Case: Large jump at beginning", () => {
        expect(canJump([10, 1, 1, 1, 1])).toBe(true);
    });

    test("Edge Case: Zero at the beginning", () => {
        expect(canJump([0, 1])).toBe(false);
    });

    test("Edge Case: High values", () => {
        expect(canJump([100, 0, 0, 0, 0])).toBe(true);
    });
});
