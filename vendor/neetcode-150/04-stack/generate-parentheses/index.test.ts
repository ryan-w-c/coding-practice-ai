

import { describe, it, expect } from "bun:test";
import { generateParenthesis } from "./index";

describe("Generate Parentheses", () => {
    it("should return correct parentheses combinations for n = 1", () => {
        const n = 1;
        const result = generateParenthesis(n);
        expect(result).toEqual(["()"]);
    });

    it("should return correct parentheses combinations for n = 2", () => {
        const n = 2;
        const result = generateParenthesis(n);
        expect(result).toEqual(["(())", "()()"]);
    });

    it("should return correct parentheses combinations for n = 3", () => {
        const n = 3;
        const result = generateParenthesis(n);
        const expected = ["((()))", "(()())", "(())()", "()(())", "()()()"];
        expect(result.sort()).toEqual(expected.sort()); // Sorting to compare without considering order
    });

    it("should return correct parentheses combinations for n = 4", () => {
        const n = 4;
        const result = generateParenthesis(n);
        expect(result.length).toBe(14); // There are 14 possible combinations for n = 4
    });

    it("should handle the maximum constraint for n = 7", () => {
        const n = 7;
        const result = generateParenthesis(n);
        expect(result.length).toBeGreaterThan(0); // Just verifying that it runs and produces some output
    });
});
