import { describe, it, expect } from "bun:test";
import { lengthOfLongestSubstring } from "./index";

describe("Longest Substring Without Duplicates", () => {
    it("should return the correct length for 'zxyzxyz'", () => {
        const s = "zxyzxyz";
        const result = lengthOfLongestSubstring(s);
        expect(result).toBe(3); // The longest substring is "xyz"
    });

    it("should return the correct length for 'xxxx'", () => {
        const s = "xxxx";
        const result = lengthOfLongestSubstring(s);
        expect(result).toBe(1); // The longest substring is "x"
    });

    it("should return 0 for an empty string", () => {
        const s = "";
        const result = lengthOfLongestSubstring(s);
        expect(result).toBe(0); // No characters, so length is 0
    });

    it("should return the length of the entire string when there are no duplicates", () => {
        const s = "abcdef";
        const result = lengthOfLongestSubstring(s);
        expect(result).toBe(6); // All characters are unique
    });

    it("should return the correct length for a complex mixed string", () => {
        const s = "abcabcbb";
        const result = lengthOfLongestSubstring(s);
        expect(result).toBe(3); // The longest substring is "abc"
    });

    it("should handle special characters and numbers", () => {
        const s = "a1b2c3!";
        const result = lengthOfLongestSubstring(s);
        expect(result).toBe(7); // All characters are unique
    });

    it("should return the correct length for a single character string", () => {
        const s = "a";
        const result = lengthOfLongestSubstring(s);
        expect(result).toBe(1); // Only one character
    });
});
