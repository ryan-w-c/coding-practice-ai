import { describe, it, expect } from "bun:test";
import { checkInclusion } from "./index";

describe("Permutation String", () => {
    it("should return true for s1 = 'abc' and s2 = 'lecabee'", () => {
        const s1 = "abc";
        const s2 = "lecabee";
        const result = checkInclusion(s1, s2);
        expect(result).toBe(true); // "cab" is a permutation of "abc"
    });

    it("should return false for s1 = 'abc' and s2 = 'lecaabee'", () => {
        const s1 = "abc";
        const s2 = "lecaabee";
        const result = checkInclusion(s1, s2);
        expect(result).toBe(false); // No permutation of "abc" in s2
    });

    it("should return true for s1 = 'a' and s2 = 'a'", () => {
        const s1 = "a";
        const s2 = "a";
        const result = checkInclusion(s1, s2);
        expect(result).toBe(true); // "a" is a permutation of itself
    });

    it("should return false for s1 = 'abcd' and s2 = 'abc'", () => {
        const s1 = "abcd";
        const s2 = "abc";
        const result = checkInclusion(s1, s2);
        expect(result).toBe(false); // s1 is longer than s2
    });

    it("should return true for s1 = 'adc' and s2 = 'dcda'", () => {
        const s1 = "adc";
        const s2 = "dcda";
        const result = checkInclusion(s1, s2);
        expect(result).toBe(true); // "cda" is a permutation of "adc"
    });

    it("should return false for s1 = 'hello' and s2 = 'ooolleoooleh'", () => {
        const s1 = "hello";
        const s2 = "ooolleoooleh";
        const result = checkInclusion(s1, s2);
        expect(result).toBe(false); // No permutation of "hello" in s2
    });

    it("should return true for s1 = 'bao' and s2 = 'eidbaooo'", () => {
        const s1 = "bao";
        const s2 = "eidbaooo";
        const result = checkInclusion(s1, s2);
        expect(result).toBe(true); // "baooo" contains a permutation "bao"
    });

});
