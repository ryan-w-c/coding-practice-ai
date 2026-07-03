import { describe, it, expect } from "bun:test";
import { isPalindrome } from "./index";

describe("Is Palindrome", () => {
    it("should return true for a palindrome with mixed case and punctuation", () => {
        const input = "Was it a car or a cat I saw?";
        const result = isPalindrome(input);
        expect(result).toBe(true);
    });

    it("should return false for a non-palindrome string", () => {
        const input = "tab a cat";
        const result = isPalindrome(input);
        expect(result).toBe(false);
    });

    it("should return true for a simple palindrome", () => {
        const input = "A man, a plan, a canal, Panama";
        const result = isPalindrome(input);
        expect(result).toBe(true);
    });

    it("should return true for an empty string", () => {
        const input = "";
        const result = isPalindrome(input);
        expect(result).toBe(true); // An empty string is considered a palindrome
    });

    it("should return true for a single character", () => {
        const input = "a";
        const result = isPalindrome(input);
        expect(result).toBe(true);
    });

    it("should return false for a string with spaces that is not a palindrome", () => {
        const input = "Hello world";
        const result = isPalindrome(input);
        expect(result).toBe(false);
    });
});
