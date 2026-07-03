import { describe, it, expect } from "bun:test";
import { minCostClimbingStairs } from "./index";

describe("Min Cost Climbing Stairs", () => {
    it("should return 2 for cost = [1, 2, 3]", () => {
        const cost = [1, 2, 3];
        const result = minCostClimbingStairs(cost);
        expect(result).toBe(2);
    });

    it("should return 4 for cost = [1, 2, 1, 2, 1, 1, 1]", () => {
        const cost = [1, 2, 1, 2, 1, 1, 1];
        const result = minCostClimbingStairs(cost);
        expect(result).toBe(4);
    });

    it("should return 0 for cost = [0, 0]", () => {
        const cost = [0, 0];
        const result = minCostClimbingStairs(cost);
        expect(result).toBe(0);
    });

    it("should return 15 for cost = [10, 15, 20]", () => {
        const cost = [10, 15, 20];
        const result = minCostClimbingStairs(cost);
        expect(result).toBe(15);
    });
});
