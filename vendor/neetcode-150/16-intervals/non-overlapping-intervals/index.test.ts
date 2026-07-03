import { describe, it, expect } from "bun:test";
import { eraseOverlapIntervals } from "./index";

describe("Non-overlapping Intervals", () => {
    it("should return 1 when removing overlapping interval", () => {
        const intervals: [number, number][] = [[1, 2], [2, 4], [1, 4]];
        const result = eraseOverlapIntervals(intervals);
        expect(result).toBe(1);
    });

    it("should return 0 when intervals are non-overlapping", () => {
        const intervals: [number, number][] = [[1, 2], [2, 4]];
        const result = eraseOverlapIntervals(intervals);
        expect(result).toBe(0);
    });

    it("should return 2 when multiple overlapping intervals exist", () => {
        const intervals: [number, number][] = [[1, 3], [2, 4], [3, 5], [1, 6]];
        const result = eraseOverlapIntervals(intervals);
        expect(result).toBe(2);
    });

    it("should return 0 when there is only one interval", () => {
        const intervals: [number, number][] = [[1, 2]];
        const result = eraseOverlapIntervals(intervals);
        expect(result).toBe(0);
    });

    it("should return 1 when the first interval overlaps with the second", () => {
        const intervals: [number, number][] = [[1, 5], [2, 3], [4, 6]];
        const result = eraseOverlapIntervals(intervals);
        expect(result).toBe(1);
    });

    it("should handle negative values in intervals", () => {
        const intervals: [number, number][] = [[-10, -5], [-3, 0], [1, 3]];
        const result = eraseOverlapIntervals(intervals);
        expect(result).toBe(0);
    });
});
