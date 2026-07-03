import { describe, it, expect } from "bun:test";
import { Solution } from "./index";  // Assuming the class is exported from index.ts

const solution = new Solution();

describe("Solution.isAnagram", () => {
    it("should return true when the two strings are anagrams", () => {
        const s = "racecar";
        const t = "carrace";
        expect(solution.isAnagram(s, t)).toBe(true);
    });

    it("should return false when the two strings are not anagrams", () => {
        const s = "jar";
        const t = "jam";
        expect(solution.isAnagram(s, t)).toBe(false);
    });

    it("should return false when the two strings have different lengths", () => {
        const s = "listen";
        const t = "silentt";
        expect(solution.isAnagram(s, t)).toBe(false);
    });

    it("should return true for anagrams with repeated characters", () => {
        const s = "aabbcc";
        const t = "baccab";
        expect(solution.isAnagram(s, t)).toBe(true);
    });

    it("should return false when the two strings are not the same length", () => {
        const s = "";
        const t = "a";
        expect(solution.isAnagram(s, t)).toBe(false);
    });

    it("should return true when both strings are empty", () => {
        const s = "";
        const t = "";
        expect(solution.isAnagram(s, t)).toBe(true);
    });

    it("should return true for single character strings that are the same", () => {
        const s = "a";
        const t = "a";
        expect(solution.isAnagram(s, t)).toBe(true);
    });

    it("should return false for single character strings that are different", () => {
        const s = "a";
        const t = "b";
        expect(solution.isAnagram(s, t)).toBe(false);
    });
});
