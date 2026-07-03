import { describe, it, expect } from "bun:test";
import { topKFrequent } from "./index";

describe("Top K Frequent Elements", () => {
    it("should return the top 2 frequent elements", () => {
        const nums = [1, 2, 2, 3, 3, 3];
        const k = 2;
        const result = topKFrequent(nums, k);
        expect(result.every(num => {
            return [3, 2].includes(num)
        }))
    });

    it("should return the top 1 frequent element", () => {
        const nums = [7, 7];
        const k = 1;
        const result = topKFrequent(nums, k);
        expect(result).toEqual([7]);
    });

    it("should handle case with only one element", () => {
        const nums = [1];
        const k = 1;
        const result = topKFrequent(nums, k);
        expect(result).toEqual([1]);
    });

    it("should return k frequent elements when all elements have the same frequency", () => {
        const nums = [1, 1, 2, 2, 3, 3];
        const k = 2;
        const result = topKFrequent(nums, k);
        expect(result.length).toBe(2);
        expect(result.every(num => {
            return [1, 2, 3].includes(num)
        }))
    });
});
