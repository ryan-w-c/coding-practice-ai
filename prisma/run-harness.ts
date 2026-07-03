// Run one solution through a language harness against a neutral case file.
// Usage: bun prisma/run-harness.ts <typescript|python|java> <case.json> <solutionFile>
// Prints the JudgeResult verdict + per-case lines; exits 0 iff accepted.

import { readFileSync } from "node:fs";
import { judgeHarness } from "../lib/executor";

const [lang, casePath, solutionPath] = process.argv.slice(2);
if (!lang || !casePath || !solutionPath) {
  console.error("usage: bun prisma/run-harness.ts <language> <case.json> <solution>");
  process.exit(2);
}

const manifest = JSON.parse(readFileSync(casePath, "utf8"));
const solutionCode = readFileSync(solutionPath, "utf8");

const r = await judgeHarness({
  harnessLanguage: lang as "typescript" | "python" | "java",
  manifest,
  solutionCode,
  timeoutMs: 20_000,
});

console.log(`${r.verdict} ${r.passed}/${r.total}`);
for (const t of r.tests) {
  if (t.status !== "pass") {
    console.log(`  ✗ ${t.name}: ${t.status} got=${JSON.stringify(t.got)} want=${JSON.stringify(t.want)} ${t.message ?? ""}`);
  }
}
if (r.verdict !== "accepted" && r.tests.length === 0) console.log(r.raw.slice(0, 2000));
process.exit(r.verdict === "accepted" ? 0 : 1);
