import { rob } from './index';
import { describe, it, expect } from "bun:test";

describe("House Robber II", () => {
    it("should return the maximum money that can be robbed from a linear array of houses arranged in a circle", () => {
        const nums = [3, 4, 3];
        expect(rob(nums)).toBe(4);
    });

    it("should return the correct maximum for a larger array", () => {
        const nums = [2, 9, 8, 3, 6];
        expect(rob(nums)).toBe(15);
    });

    it("should handle a single house", () => {
        const nums = [10];
        expect(rob(nums)).toBe(10);
    });

    it("should handle two houses", () => {
        const nums = [1, 2];
        expect(rob(nums)).toBe(2);
    });

    it("should handle three houses with distinct values", () => {
        const nums = [2, 7, 9];
        expect(rob(nums)).toBe(9);
    });
});
