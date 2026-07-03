import { describe, it, expect } from "bun:test";
import { longestCommonSubsequence } from "./index";

describe("Longest Common Subsequence", () => {
    it("should return 3 for text1 = 'cat' and text2 = 'crabt'", () => {
        const text1 = "cat";
        const text2 = "crabt";
        const result = longestCommonSubsequence(text1, text2);
        expect(result).toBe(3);
    });

    it("should return 4 for text1 = 'abcd' and text2 = 'abcd'", () => {
        const text1 = "abcd";
        const text2 = "abcd";
        const result = longestCommonSubsequence(text1, text2);
        expect(result).toBe(4);
    });

    it("should return 0 for text1 = 'abcd' and text2 = 'efgh'", () => {
        const text1 = "abcd";
        const text2 = "efgh";
        const result = longestCommonSubsequence(text1, text2);
        expect(result).toBe(0);
    });

    it("should return 2 for text1 = 'abc' and text2 = 'ac'", () => {
        const text1 = "abc";
        const text2 = "ac";
        const result = longestCommonSubsequence(text1, text2);
        expect(result).toBe(2);
    });

    it("should return 1 for text1 = 'a' and text2 = 'bca'", () => {
        const text1 = "a";
        const text2 = "bca";
        const result = longestCommonSubsequence(text1, text2);
        expect(result).toBe(1);
    });
});
