import { describe, it, expect } from "bun:test";
import { insertInterval } from "./index";

describe("Insert New Interval", () => {
    it("should merge overlapping intervals correctly", () => {
        const intervals: [number, number][] = [[1, 3], [4, 6]];
        const newInterval: [number, number] = [2, 5];
        const result = insertInterval(intervals, newInterval);
        expect(result).toEqual([[1, 6]]);
    });

    it("should add new interval without merging", () => {
        const intervals: [number, number][] = [[1, 2], [3, 5], [9, 10]];
        const newInterval: [number, number] = [6, 7];
        const result = insertInterval(intervals, newInterval);
        expect(result).toEqual([[1, 2], [3, 5], [6, 7], [9, 10]]);
    });

    it("should add new interval at the beginning", () => {
        const intervals: [number, number][] = [[5, 7], [9, 11]];
        const newInterval: [number, number] = [1, 4];
        const result = insertInterval(intervals, newInterval);
        expect(result).toEqual([[1, 4], [5, 7], [9, 11]]);
    });

    it("should add new interval at the end", () => {
        const intervals: [number, number][] = [[1, 2], [3, 5]];
        const newInterval: [number, number] = [6, 8];
        const result = insertInterval(intervals, newInterval);
        expect(result).toEqual([[1, 2], [3, 5], [6, 8]]);
    });

    it("should merge all intervals into one", () => {
        const intervals: [number, number][] = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]];
        const newInterval: [number, number] = [4, 13];
        const result = insertInterval(intervals, newInterval);
        expect(result).toEqual([[1, 2], [3, 16]]);
    });

    it("should handle an empty intervals array", () => {
        const intervals: [number, number][] = [];
        const newInterval: [number, number] = [5, 7];
        const result = insertInterval(intervals, newInterval);
        expect(result).toEqual([[5, 7]]);
    });
});
