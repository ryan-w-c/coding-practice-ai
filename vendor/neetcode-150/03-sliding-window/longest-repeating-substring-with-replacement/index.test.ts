import { describe, it, expect } from "bun:test";
import { characterReplacement } from "./index";

describe("Longest Repeating Substring With Replacement", () => {
    it("should return 4 for s = 'XYYX' and k = 2", () => {
        const s = "XYYX";
        const k = 2;
        const result = characterReplacement(s, k);
        expect(result).toBe(4);
    });

    it("should return 5 for s = 'AAABABB' and k = 1", () => {
        const s = "AAABABB";
        const k = 1;
        const result = characterReplacement(s, k);
        expect(result).toBe(5);
    });

    it("should return 6 for s = 'AAABABB' and k = 2", () => {
        const s = "AAABABB";
        const k = 2;
        const result = characterReplacement(s, k);
        expect(result).toBe(6);
    });

    it("should return the entire length for identical characters", () => {
        const s = "AAAAA";
        const k = 2;
        const result = characterReplacement(s, k);
        expect(result).toBe(5);
    });

    it("should return the correct length when no replacements are allowed", () => {
        const s = "AABBBACC";
        const k = 0;
        const result = characterReplacement(s, k);
        expect(result).toBe(3);
    });

    it("should handle the case where all characters need to be replaced", () => {
        const s = "ABCDE";
        const k = 4;
        const result = characterReplacement(s, k);
        expect(result).toBe(5);
    });
});
