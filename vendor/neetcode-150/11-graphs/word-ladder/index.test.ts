import { describe, test, expect } from "bun:test";
import { ladderLength } from "./index";

describe("Word Ladder", () => {
    test("Example 1", () => {
        const beginWord = "cat";
        const endWord = "sag";
        const wordList = ["bat", "bag", "sag", "dag", "dot"];
        expect(ladderLength(beginWord, endWord, wordList)).toBe(4);
    });

    test("Example 2", () => {
        const beginWord = "cat";
        const endWord = "sag";
        const wordList = ["bat", "bag", "sat", "dag", "dot"];
        expect(ladderLength(beginWord, endWord, wordList)).toBe(0);
    });

    test("Single transformation", () => {
        const beginWord = "hit";
        const endWord = "hot";
        const wordList = ["hot"];
        expect(ladderLength(beginWord, endWord, wordList)).toBe(2);
    });

    test("No possible path", () => {
        const beginWord = "hit";
        const endWord = "cog";
        const wordList = ["hot", "dot", "dog", "lot", "log"];
        expect(ladderLength(beginWord, endWord, wordList)).toBe(0);
    });

    test("Multiple transformations", () => {
        const beginWord = "hit";
        const endWord = "cog";
        const wordList = ["hot", "dot", "dog", "lot", "log", "cog"];
        expect(ladderLength(beginWord, endWord, wordList)).toBe(5);
    });
});
