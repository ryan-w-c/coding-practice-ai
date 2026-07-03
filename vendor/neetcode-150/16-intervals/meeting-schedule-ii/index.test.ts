import { describe, it, expect } from "bun:test";
import { minMeetingDays } from "./index";

describe("Meeting Schedule II", () => {
    it("should return 2 for intervals [(0,40),(5,10),(15,20)]", () => {
        const intervals: [number, number][] = [[0, 40], [5, 10], [15, 20]];
        const result = minMeetingDays(intervals);
        expect(result).toBe(2);
    });

    it("should return 1 for intervals [(4,9)]", () => {
        const intervals: [number, number][] = [[4, 9]];
        const result = minMeetingDays(intervals);
        expect(result).toBe(1);
    });

    it("should return 1 for non-overlapping intervals [(0,5),(5,10),(10,15)]", () => {
        const intervals: [number, number][] = [[0, 5], [5, 10], [10, 15]];
        const result = minMeetingDays(intervals);
        expect(result).toBe(1);
    });

    it("should return 3 for overlapping intervals [(1,10), (2,6), (5,8), (15,20)]", () => {
        const intervals: [number, number][] = [[1, 10], [2, 6], [5, 8], [15, 20]];
        const result = minMeetingDays(intervals);
        expect(result).toBe(3);
    });

    it("should return 1 for intervals with exact touching points [(1,5), (5,10), (10,20)]", () => {
        const intervals: [number, number][] = [[1, 5], [5, 10], [10, 20]];
        const result = minMeetingDays(intervals);
        expect(result).toBe(1);
    });

    it("should return 2 for intervals [(0, 30), (15, 25), (35, 50)]", () => {
        const intervals: [number, number][] = [[0, 30], [15, 25], [35, 50]];
        const result = minMeetingDays(intervals);
        expect(result).toBe(2);
    });
});
