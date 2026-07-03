import { describe, it, expect } from "bun:test";
import { lastStoneWeight } from "./index";

describe("Last Stone Weight", () => {
    it("should return 1 for Example 1", () => {
        const stones = [2, 3, 6, 2, 4];
        expect(lastStoneWeight(stones)).toBe(1);
    });

    it("should return 1 for Example 2", () => {
        const stones = [1, 2];
        expect(lastStoneWeight(stones)).toBe(1);
    });

    it("should return 0 for all stones of equal weight", () => {
        const stones = [2, 2, 2, 2];
        expect(lastStoneWeight(stones)).toBe(0);
    });

    it("should return the correct result for a single stone", () => {
        const stones = [5];
        expect(lastStoneWeight(stones)).toBe(5);
    });

    it("should return 2 for stones [3, 7, 2]", () => {
        const stones = [3, 7, 2];
        expect(lastStoneWeight(stones)).toBe(2);
    });

    it("should return 1 for stones [7, 6, 7]", () => {
        const stones = [7, 6, 7];
        expect(lastStoneWeight(stones)).toBe(6);
    });
});
