// Pure parser for `bun test` output. No I/O — unit-tested in bunparse.test.ts.
//
// Bun's reporter emits, per test:
//   (pass) <describe> > <it> [0.70ms]
//   (fail) <describe> > <it> [0.04ms]
// and a summary:
//    6 pass
//    0 fail
//   Ran 6 tests across 1 file. [9.00ms]
//
// Test names themselves may contain bracketed text like "[3,4,5,6]", so we
// only strip a trailing timing token of the shape " [<number>ms]" / " [<number>s]".

export type ParsedTest = {
  status: "pass" | "fail" | "skip" | "todo";
  name: string;
};

export type ParsedRun = {
  tests: ParsedTest[];
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  /** True when we found a recognizable test summary (counts and/or "Ran N tests"). */
  parsedOk: boolean;
  /** Failing test names, in order. */
  failing: string[];
};

const RESULT_LINE = /^\((pass|fail|skip|todo)\)\s+(.*)$/;
const TRAILING_TIME = /\s+\[\d+(?:\.\d+)?(?:ms|s|m)\]\s*$/;
const SUMMARY_COUNT = /^\s*(\d+)\s+(pass|fail|skip|todo)\b/;
const RAN_LINE = /\bRan\s+(\d+)\s+tests?\b/;

export function parseBunTest(output: string): ParsedRun {
  const lines = output.split(/\r?\n/);

  const tests: ParsedTest[] = [];
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let sawSummaryCount = false;
  let ranTotal: number | null = null;

  for (const raw of lines) {
    const line = raw.replace(/\[[0-9;]*m/g, ""); // strip ANSI color

    const result = RESULT_LINE.exec(line.trimStart());
    if (result) {
      const status = result[1] as ParsedTest["status"];
      const name = result[2].replace(TRAILING_TIME, "").trim();
      tests.push({ status, name });
      continue;
    }

    const count = SUMMARY_COUNT.exec(line);
    if (count) {
      const n = parseInt(count[1], 10);
      switch (count[2]) {
        case "pass":
          passed = n;
          sawSummaryCount = true;
          break;
        case "fail":
          failed = n;
          sawSummaryCount = true;
          break;
        case "skip":
          skipped = n;
          sawSummaryCount = true;
          break;
      }
      continue;
    }

    const ran = RAN_LINE.exec(line);
    if (ran) ranTotal = parseInt(ran[1], 10);
  }

  // Prefer summary counts; fall back to per-test tallies if the summary is absent.
  if (!sawSummaryCount && tests.length > 0) {
    passed = tests.filter((t) => t.status === "pass").length;
    failed = tests.filter((t) => t.status === "fail").length;
    skipped = tests.filter((t) => t.status === "skip").length;
  }

  const total = ranTotal ?? passed + failed + skipped;
  const parsedOk = sawSummaryCount || ranTotal !== null || tests.length > 0;
  const failing = tests.filter((t) => t.status === "fail").map((t) => t.name);

  return { tests, passed, failed, skipped, total, parsedOk, failing };
}
