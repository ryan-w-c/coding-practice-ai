import { describe, it, expect } from "bun:test";
import { isValid } from "./index";

describe("Validate Parentheses", () => {
    it("should return true for a simple valid case", () => {
        const s = "[]";
        const result = isValid(s);
        expect(result).toBe(true);
    });

    it("should return true for nested valid brackets", () => {
        const s = "([{}])";
        const result = isValid(s);
        expect(result).toBe(true);
    });

    it("should return false for incorrect order", () => {
        const s = "[(])";
        const result = isValid(s);
        expect(result).toBe(false);
    });

    it("should return false for unmatched opening bracket", () => {
        const s = "[";
        const result = isValid(s);
        expect(result).toBe(false);
    });

    it("should return false for unmatched closing bracket", () => {
        const s = "}";
        const result = isValid(s);
        expect(result).toBe(false);
    });

    it("should return true for multiple independent pairs", () => {
        const s = "{}[]()";
        const result = isValid(s);
        expect(result).toBe(true);
    });

    it("should return false for partially correct nesting", () => {
        const s = "([)]";
        const result = isValid(s);
        expect(result).toBe(false);
    });
});
