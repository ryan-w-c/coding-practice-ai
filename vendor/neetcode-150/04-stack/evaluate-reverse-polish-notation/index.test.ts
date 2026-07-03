import { describe, it, expect } from "bun:test";
import { evalRPN } from "./index";

describe("Evaluate Reverse Polish Notation", () => {
    it("should return the correct value for a simple expression", () => {
        const tokens = ["1", "2", "+", "3", "*", "4", "-"];
        const result = evalRPN(tokens);
        expect(result).toBe(5);
    });

    it("should handle division with truncation toward zero", () => {
        const tokens = ["10", "3", "/"];
        const result = evalRPN(tokens);
        expect(result).toBe(3); // 10 / 3 = 3 (truncate towards zero)
    });

    it("should handle negative numbers correctly", () => {
        const tokens = ["-2", "3", "*", "4", "+"];
        const result = evalRPN(tokens);
        expect(result).toBe(-2); // (-2 * 3) + 4 = -6 + 4 = -2
    });

    it("should handle multiple operations", () => {
        const tokens = ["4", "13", "5", "/", "+"];
        const result = evalRPN(tokens);
        expect(result).toBe(6); // 4 + (13 / 5) = 4 + 2 = 6
    });

    it("should return the correct value for a single number", () => {
        const tokens = ["42"];
        const result = evalRPN(tokens);
        expect(result).toBe(42);
    });

    it("should handle complex expressions", () => {
        const tokens = ["5", "1", "2", "+", "4", "*", "+", "3", "-"];
        const result = evalRPN(tokens);
        expect(result).toBe(14); // 5 + ((1 + 2) * 4) - 3 = 14
    });
});
