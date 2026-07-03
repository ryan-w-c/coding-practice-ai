// Build the judging/problems/ case corpus from the committed sources:
// judging/curated/<id>.json (manifests + hand-authored cases) plus
// judging/generators/<id>.ts (random + stress cases, dual-oracle checked).
//
//   bun prisma/build-cases.ts [--force]
//
// Runs automatically before `npm run dev` / `npm start` (pre-scripts): only
// missing files are built, so a warm checkout starts instantly and a fresh
// one takes a few minutes once. --force rebuilds everything.

import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { generateFor } from "./generate-cases";

const ROOT = join(import.meta.dir, "..");
const CURATED = join(ROOT, "judging", "curated");
const PROBLEMS = join(ROOT, "judging", "problems");
const force = process.argv.includes("--force");

const slugs = readdirSync(CURATED)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));

const todo = slugs.filter((s) => force || !existsSync(join(PROBLEMS, `${s}.json`)));
if (!todo.length) {
  console.log(`case corpus up to date (${slugs.length} problems).`);
  process.exit(0);
}

console.log(`building ${todo.length}/${slugs.length} case files${force ? " (--force)" : ""}…`);
const t0 = performance.now();
let failed = 0;
for (const slug of todo) {
  if (!(await generateFor(slug))) failed++;
}
const secs = Math.round((performance.now() - t0) / 1000);
console.log(`done in ${secs}s${failed ? ` — ${failed} FAILED` : ""}.`);
process.exit(failed ? 1 : 0);
