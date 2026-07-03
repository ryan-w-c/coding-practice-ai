import { describe, test, expect } from "bun:test";
import { countSubstrings } from "./index";

describe("Palindromic Substrings", () => {
    // test("Example 1", () => {
    //     const s = "abc";
    //     const result = countSubstrings(s);
    //     expect(result).toBe(3); // "a", "b", "c"
    // });

    // test("Example 2", () => {
    //     const s = "aaa";
    //     const result = countSubstrings(s);
    //     expect(result).toBe(6); // "a", "a", "a", "aa", "aa", "aaa"
    // });

    // test("Single character string", () => {
    //     const s = "a";
    //     const result = countSubstrings(s);
    //     expect(result).toBe(1); // "a"
    // });

    // test("No palindromic substrings except single characters", () => {
    //     const s = "abcd";
    //     const result = countSubstrings(s);
    //     expect(result).toBe(4); // "a", "b", "c", "d"
    // });

    test("Mixed palindromes", () => {
        const s = "abccba";
        const result = countSubstrings(s);
        expect(result).toBe(9); // "a", "b", "c", "c", "b", "a", "cc", "bccb", "abccba"
    });
});
