import { describe, it, expect } from "bun:test";
import { canAttendAllMeetings } from "./index";

describe("Meeting Schedule", () => {
    it("should return false for intervals [(0,30),(5,10),(15,20)]", () => {
        const intervals: [number, number][] = [[0, 30], [5, 10], [15, 20]];
        const result = canAttendAllMeetings(intervals);
        expect(result).toBe(false);
    });

    it("should return true for intervals [(5,8),(9,15)]", () => {
        const intervals: [number, number][] = [[5, 8], [9, 15]];
        const result = canAttendAllMeetings(intervals);
        expect(result).toBe(true);
    });

    it("should return true for empty intervals", () => {
        const intervals: [number, number][] = [];
        const result = canAttendAllMeetings(intervals);
        expect(result).toBe(true);
    });

    it("should return true for non-overlapping consecutive intervals [(0, 5), (5, 10), (10, 15)]", () => {
        const intervals: [number, number][] = [[0, 5], [5, 10], [10, 15]];
        const result = canAttendAllMeetings(intervals);
        expect(result).toBe(true);
    });

    it("should return false for overlapping intervals [(1, 5), (2, 6)]", () => {
        const intervals: [number, number][] = [[1, 5], [2, 6]];
        const result = canAttendAllMeetings(intervals);
        expect(result).toBe(false);
    });

    it("should return true for intervals that just touch [(1, 3), (3, 6), (6, 8)]", () => {
        const intervals: [number, number][] = [[1, 3], [3, 6], [6, 8]];
        const result = canAttendAllMeetings(intervals);
        expect(result).toBe(true);
    });
});
