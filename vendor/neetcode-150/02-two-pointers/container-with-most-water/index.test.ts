import { describe, it, expect } from "bun:test";
import { maxArea } from "./index";

describe("Max Water Container", () => {
    it("should return the maximum area for the first example", () => {
        const height = [1, 7, 2, 5, 4, 7, 3, 6];
        const result = maxArea(height);
        expect(result).toBe(36);
    });

    it("should return the maximum area when all heights are equal", () => {
        const height = [2, 2, 2];
        const result = maxArea(height);
        expect(result).toBe(4);
    });

    it("should return the correct area for two elements", () => {
        const height = [5, 5];
        const result = maxArea(height);
        expect(result).toBe(5);
    });

    it("should handle an increasing height sequence", () => {
        const height = [1, 2, 3, 4, 5, 6];
        const result = maxArea(height);
        expect(result).toBe(9);
    });

    it("should handle a decreasing height sequence", () => {
        const height = [6, 5, 4, 3, 2, 1];
        const result = maxArea(height);
        expect(result).toBe(9);
    });

    it("should handle large values of heights", () => {
        const height = [1000, 999, 998, 997, 996, 995];
        const result = maxArea(height);
        expect(result).toBe(4975);
    });
});
