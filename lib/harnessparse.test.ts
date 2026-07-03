import { describe, it, expect } from "bun:test";
import { parseHarness } from "./harnessparse";

describe("parseHarness", () => {
  it("parses passes and the summary", () => {
    const out = [
      'LLJUDGE {"i":0,"name":"basic","status":"pass"}',
      'LLJUDGE {"i":1,"name":"neg","status":"pass"}',
      'LLJUDGE-SUMMARY {"passed":2,"total":2}',
    ].join("\n");
    const r = parseHarness(out);
    expect(r.passed).toBe(2);
    expect(r.total).toBe(2);
    expect(r.parsedOk).toBe(true);
    expect(r.failing).toEqual([]);
  });

  it("collects failing case names", () => {
    const out = [
      'LLJUDGE {"i":0,"name":"basic","status":"pass"}',
      'LLJUDGE {"i":1,"name":"neg","status":"fail","got":[],"want":[0,2]}',
      'LLJUDGE-SUMMARY {"passed":1,"total":2}',
    ].join("\n");
    const r = parseHarness(out);
    expect(r.passed).toBe(1);
    expect(r.failing).toEqual(["neg"]);
  });

  it("flags a crash (no summary line) as not parseable", () => {
    const out = "Traceback (most recent call last):\n  ImportError: boom";
    const r = parseHarness(out);
    expect(r.parsedOk).toBe(false);
    expect(r.total).toBe(0);
  });

  it("ignores non-protocol noise interleaved with results", () => {
    const out = [
      "some stray print from user code",
      'LLJUDGE {"i":0,"name":"a","status":"pass"}',
      "more noise",
      'LLJUDGE-SUMMARY {"passed":1,"total":1}',
    ].join("\n");
    const r = parseHarness(out);
    expect(r.passed).toBe(1);
    expect(r.total).toBe(1);
    expect(r.parsedOk).toBe(true);
  });
});
