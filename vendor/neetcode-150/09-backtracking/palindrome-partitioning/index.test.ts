import { describe, test, expect } from "bun:test";
import { partition } from './index';

describe("Palindrome Partitioning", () => {
    test("Example 1", () => {
        const s = "aab";
        const result = partition(s);
        expect(result).toEqual([["a", "a", "b"], ["aa", "b"]]);
    });

    test("Example 2", () => {
        const s = "a";
        const result = partition(s);
        expect(result).toEqual([["a"]]);
    });

    test("Single character repeated", () => {
        const s = "aaa";
        const result = partition(s);
        expect(result).toEqual([["a", "a", "a"], ["a", "aa"], ["aa", "a"], ["aaa"]]);
    });

    test("No palindromic splits", () => {
        const s = "abc";
        const result = partition(s);
        expect(result).toEqual([["a", "b", "c"]]);
    });

    test("Mixed characters", () => {
        const s = "racecar";
        const result = partition(s);
        expect(result).toEqual([
            ["r", "a", "c", "e", "c", "a", "r"],
            ["r", "a", "cec", "a", "r"],
            ["r", "aceca", "r"],
            ["racecar"]
        ]);
    });
});
