// Pure parser for the language-agnostic harness protocol (see
// docs/multi-language-judging.md §4). Every harness — TS, Python, … — prints:
//
//   LLJUDGE {"i":0,"name":"basic","status":"pass"}
//   LLJUDGE {"i":1,"name":"neg","status":"fail","got":[],"want":[0,2]}
//   LLJUDGE-SUMMARY {"passed":1,"total":2}
//
// One parser handles all languages, unlike per-runner (bun test / pytest / go test) output.

export type HarnessCase = {
  i: number;
  name: string;
  status: "pass" | "fail" | "error";
  got?: unknown;
  want?: unknown;
  message?: string;
};

export type ParsedHarness = {
  cases: HarnessCase[];
  passed: number;
  total: number;
  failing: string[];
  /** True when a SUMMARY line was seen (i.e. the harness ran to completion). */
  parsedOk: boolean;
};

const LINE = /^LLJUDGE\s+(\{.*\})\s*$/;
const SUMMARY = /^LLJUDGE-SUMMARY\s+(\{.*\})\s*$/;

export function parseHarness(output: string): ParsedHarness {
  const cases: HarnessCase[] = [];
  let summary: { passed?: number; total?: number } | null = null;

  for (const raw of output.split(/\r?\n/)) {
    const line = raw.trim();
    const sm = SUMMARY.exec(line);
    if (sm) {
      try {
        summary = JSON.parse(sm[1]);
      } catch {
        /* ignore malformed */
      }
      continue;
    }
    const cm = LINE.exec(line);
    if (cm) {
      try {
        cases.push(JSON.parse(cm[1]) as HarnessCase);
      } catch {
        /* ignore malformed */
      }
    }
  }

  const passedFromCases = cases.filter((c) => c.status === "pass").length;
  const passed = summary?.passed ?? passedFromCases;
  const total = summary?.total ?? cases.length;
  const failing = cases
    .filter((c) => c.status !== "pass")
    .map((c) => c.name || `case ${c.i}`);

  return { cases, passed, total, failing, parsedOk: summary !== null };
}
