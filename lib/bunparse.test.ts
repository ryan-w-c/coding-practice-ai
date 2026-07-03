import { describe, it, expect } from "bun:test";
import { parseBunTest } from "./bunparse";

const PASS_OUTPUT = `bun test v1.3.14 (0d9b296a)

 6 pass
 0 fail
 6 expect() calls
Ran 6 tests across 1 file. [26.00ms]`;

const FAIL_OUTPUT = `bun test v1.3.14 (0d9b296a)

(fail) Solution.twoSum > should return [0,1] when nums = [3,4,5,6] and target = 7 [0.70ms]
(fail) Solution.twoSum > should return [0,2] when nums = [4,5,6] and target = 10 [0.05ms]
(pass) Solution.twoSum > should handle large numbers correctly [0.04ms]

 1 pass
 2 fail
 3 expect() calls
Ran 3 tests across 1 file. [9.00ms]`;

const ERROR_OUTPUT = `bun test v1.3.14 (0d9b296a)

error: Expected ";" but found "twoSum"
SyntaxError: Unexpected token`;

describe("parseBunTest", () => {
  it("parses an all-pass run", () => {
    const r = parseBunTest(PASS_OUTPUT);
    expect(r.passed).toBe(6);
    expect(r.failed).toBe(0);
    expect(r.total).toBe(6);
    expect(r.parsedOk).toBe(true);
    expect(r.failing).toEqual([]);
  });

  it("parses failing tests and keeps bracketed names intact", () => {
    const r = parseBunTest(FAIL_OUTPUT);
    expect(r.passed).toBe(1);
    expect(r.failed).toBe(2);
    expect(r.total).toBe(3);
    expect(r.failing).toEqual([
      "Solution.twoSum > should return [0,1] when nums = [3,4,5,6] and target = 7",
      "Solution.twoSum > should return [0,2] when nums = [4,5,6] and target = 10",
    ]);
  });

  it("flags compile/runtime errors as not parseable into a test summary", () => {
    const r = parseBunTest(ERROR_OUTPUT);
    expect(r.parsedOk).toBe(false);
    expect(r.total).toBe(0);
  });

  it("falls back to per-test tally when summary counts are absent", () => {
    const out = `(pass) a > b [0.1ms]\n(fail) a > c [0.1ms]`;
    const r = parseBunTest(out);
    expect(r.passed).toBe(1);
    expect(r.failed).toBe(1);
    expect(r.total).toBe(2);
    expect(r.parsedOk).toBe(true);
  });
});
