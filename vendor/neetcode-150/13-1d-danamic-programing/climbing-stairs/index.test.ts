import { describe, it, expect } from "bun:test";
import { climbStairs } from "./index";

describe("Climbing Stairs", () => {
    it("should return 2 for n = 2", () => {
        const n = 2;
        const result = climbStairs(n);
        expect(result).toBe(2);
    });

    it("should return 3 for n = 3", () => {
        const n = 3;
        const result = climbStairs(n);
        expect(result).toBe(3);
    });

    it("should return 5 for n = 4", () => {
        const n = 4;
        const result = climbStairs(n);
        expect(result).toBe(5);
    });

    it("should return 1 for n = 1", () => {
        const n = 1;
        const result = climbStairs(n);
        expect(result).toBe(1);
    });

    it("should return 13 for n = 6", () => {
        const n = 6;
        const result = climbStairs(n);
        expect(result).toBe(13);
    });

    it("should return 21 for n = 7", () => {
        const n = 7;
        const result = climbStairs(n);
        expect(result).toBe(21);
    });
});
