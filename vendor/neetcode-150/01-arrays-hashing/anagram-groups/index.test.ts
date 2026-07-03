import { describe, it, expect } from "bun:test";
import { Solution } from "./index";  // Assuming the Solution class is exported from index.ts



describe("Solution.groupAnagrams", () => {

    const solution = new Solution();


    it("should group anagrams for the input ['act','pots','tops','cat','stop','hat']", () => {
        const strs = ["act", "pots", "tops", "cat", "stop", "hat"];
        const result = solution.groupAnagrams(strs);
        const expected = [["act", "cat"], ["pots", "tops", "stop"], ["hat"]];
        expect(result).toEqual(expect.arrayContaining(expected));
    });

    it("should return [['x']] for the input ['x']", () => {
        const strs = ["x"];
        const result = solution.groupAnagrams(strs);
        expect(result).toEqual([["x"]]);
    });

    it("should return [['']] for the input ['']", () => {
        const strs = [""];
        const result = solution.groupAnagrams(strs);
        expect(result).toEqual([[""]]);
    });

    it("should handle mixed-length anagrams", () => {
        const strs = ["abc", "bca", "a", "cba"];
        const result = solution.groupAnagrams(strs);
        const expected = [["abc", "bca", "cba"], ["a"]];
        expect(result).toEqual(expect.arrayContaining(expected));
    });

    it("should handle when all strings are identical", () => {
        const strs = ["aaa", "aaa", "aaa"];
        const result = solution.groupAnagrams(strs);
        expect(result).toEqual([["aaa", "aaa", "aaa"]]);
    });

    it("should handle when no anagrams are present", () => {
        const strs = ["abc", "def", "ghi"];
        const result = solution.groupAnagrams(strs);
        const expected = [["abc"], ["def"], ["ghi"]];
        expect(result).toEqual(expect.arrayContaining(expected));
    });
});
