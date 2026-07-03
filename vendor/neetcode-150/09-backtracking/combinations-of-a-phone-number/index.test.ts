import { describe, test, expect } from "bun:test";
import { letterCombinations } from './index';

describe("Combinations of a Phone Number", () => {
    test("Example 1: digits = '34'", () => {
        const digits = "34";
        const result = letterCombinations(digits);
        const expected = ["dg", "dh", "di", "eg", "eh", "ei", "fg", "fh", "fi"];
        expected.forEach(combination => {
            expect(result).toContain(combination);
        });
        expect(result.length).toBe(expected.length);
    });

    test("Example 2: digits = ''", () => {
        const digits = "";
        const result = letterCombinations(digits);
        expect(result).toEqual([]);
    });

    test("Example 3: digits = '2'", () => {
        const digits = "2";
        const result = letterCombinations(digits);
        const expected = ["a", "b", "c"];
        expect(result).toEqual(expected);
    });

    test("Example 4: digits = '23'", () => {
        const digits = "23";
        const result = letterCombinations(digits);
        const expected = [
            "ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"
        ];
        expected.forEach(combination => {
            expect(result).toContain(combination);
        });
        expect(result.length).toBe(expected.length);
    });
});
