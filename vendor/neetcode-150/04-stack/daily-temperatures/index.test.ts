import { describe, it, expect } from "bun:test";
import { dailyTemperatures } from "./index";

describe("Daily Temperatures", () => {
    it("should return correct days for a normal sequence", () => {
        const temperatures = [30, 38, 30, 36, 35, 40, 28];
        const result = dailyTemperatures(temperatures);
        expect(result).toEqual([1, 4, 1, 2, 1, 0, 0]);
    });

    it("should return all zeros for a decreasing temperature sequence", () => {
        const temperatures = [22, 21, 20];
        const result = dailyTemperatures(temperatures);
        expect(result).toEqual([0, 0, 0]);
    });

    it("should return correct result for a sequence with no future warmer day", () => {
        const temperatures = [30, 29, 31];
        const result = dailyTemperatures(temperatures);
        expect(result).toEqual([2, 1, 0]);
    });

    it("should handle a single temperature value", () => {
        const temperatures = [25];
        const result = dailyTemperatures(temperatures);
        expect(result).toEqual([0]);
    });

    it("should handle a sequence with multiple identical temperatures", () => {
        const temperatures = [30, 30, 30, 40];
        const result = dailyTemperatures(temperatures);
        expect(result).toEqual([3, 2, 1, 0]);
    });

    it("should return correct result for alternating temperatures", () => {
        const temperatures = [31, 32, 31, 32, 31];
        const result = dailyTemperatures(temperatures);
        expect(result).toEqual([1, 0, 1, 0, 0]);
    });
});
