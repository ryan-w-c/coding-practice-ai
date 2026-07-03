import { describe, it, expect } from "bun:test";
import { checkValidString } from "./index";

describe("Valid Parenthesis String", () => {
    it("should return true for s = '((**)'", () => {
        const s = "((**)";
        const result = checkValidString(s);
        expect(result).toBe(true);
    });

    it("should return false for s = '(((*)'", () => {
        const s = "(((*)";
        const result = checkValidString(s);
        expect(result).toBe(false);
    });

    it("should return true for s = '(*))'", () => {
        const s = "(*))";
        const result = checkValidString(s);
        expect(result).toBe(true);
    });

    it("should return true for s = ''", () => {
        const s = "";
        const result = checkValidString(s);
        expect(result).toBe(true);
    });

    it("should return false for s = ')('", () => {
        const s = ")(";
        const result = checkValidString(s);
        expect(result).toBe(false);
    });

    it("should return true for s = '(*()'", () => {
        const s = "(*()";
        const result = checkValidString(s);
        expect(result).toBe(true);
    });
});
