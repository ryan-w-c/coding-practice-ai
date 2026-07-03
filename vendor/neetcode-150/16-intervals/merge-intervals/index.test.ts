import { describe, it, expect } from "bun:test";
import { mergeIntervals } from "./index";

describe("Merge Intervals", () => {
    it("should merge overlapping intervals correctly", () => {
        const intervals: [number, number][] = [[1, 3], [1, 5], [6, 7]];
        const result = mergeIntervals(intervals);
        expect(result).toEqual([[1, 5], [6, 7]]);
    });

    it("should merge touching intervals", () => {
        const intervals: [number, number][] = [[1, 2], [2, 3]];
        const result = mergeIntervals(intervals);
        expect(result).toEqual([[1, 3]]);
    });

    it("should handle no overlapping intervals", () => {
        const intervals: [number, number][] = [[1, 2], [3, 4], [5, 6]];
        const result = mergeIntervals(intervals);
        expect(result).toEqual([[1, 2], [3, 4], [5, 6]]);
    });

    it("should handle all intervals overlapping into one", () => {
        const intervals: [number, number][] = [[1, 4], [2, 5], [3, 6]];
        const result = mergeIntervals(intervals);
        expect(result).toEqual([[1, 6]]);
    });

    it("should handle a single interval", () => {
        const intervals: [number, number][] = [[1, 10]];
        const result = mergeIntervals(intervals);
        expect(result).toEqual([[1, 10]]);
    });

    it("should handle non-overlapping intervals in non-sorted order", () => {
        const intervals: [number, number][] = [[5, 6], [1, 2], [3, 4]];
        const result = mergeIntervals(intervals);
        expect(result).toEqual([[1, 2], [3, 4], [5, 6]]);
    });
});
