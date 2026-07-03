import { longestPalindrome } from "./index";
import { describe, test, expect } from "bun:test";

describe("Longest Palindromic Substring", () => {
    test("Example 1", () => {
        const s = "ababd";
        const result = longestPalindrome(s);
        const expected = ["aba", "bab"]; // Both are valid
        expect(expected).toContain(result);
    });

    test("Example 2", () => {
        const s = "abbc";
        const result = longestPalindrome(s);
        const expected = ["bb"]; // Only valid answer
        expect(result).toBe(expected[0]);
    });

    test("Single character string", () => {
        const s = "a";
        const result = longestPalindrome(s);
        expect(result).toBe("a");
    });

    test("Entire string is a palindrome", () => {
        const s = "racecar";
        const result = longestPalindrome(s);
        expect(result).toBe("racecar");
    });

    test("Multiple palindromes, different lengths", () => {
        const s = "cbbd";
        const result = longestPalindrome(s);
        const expected = ["bb"]; // Longest is "bb"
        expect(result).toBe(expected[0]);
    });

    test("No palindrome longer than 1 character", () => {
        const s = "abc";
        const result = longestPalindrome(s);
        const expected = ["a", "b", "c"]; // Any single character is valid
        expect(expected).toContain(result);
    });
});
