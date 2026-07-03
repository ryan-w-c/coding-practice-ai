// Seed the authored (non-vendored) problems under authored/<slug>/index.ts —
// the tries / math-geometry / bit-manipulation patterns the vendor never had.
// Same pipeline as prisma/seed.ts: the index.ts header comment carries the
// statement, and the reference solution's bodies are blanked for the fallback
// starter (the editor actually serves manifest-generated starters).
//
// Run with: bun prisma/seed-authored.ts   (idempotent upserts)

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { PrismaClient, Difficulty } from "@prisma/client";
import { deriveStarterCode, parseHeader } from "../lib/starter";

const prisma = new PrismaClient();
const ROOT = join(import.meta.dir, "..");
const AUTHORED = join(ROOT, "authored");

const PATTERN_BY_SLUG: Record<string, string> = {
  "implement-prefix-tree": "tries",
  "design-word-search-data-structure": "tries",
  "word-search-ii": "tries",
  "rotate-image": "math-geometry",
  "spiral-matrix": "math-geometry",
  "set-matrix-zeroes": "math-geometry",
  "happy-number": "math-geometry",
  "plus-one": "math-geometry",
  "pow-x-n": "math-geometry",
  "multiply-strings": "math-geometry",
  "detect-squares": "math-geometry",
  "single-number": "bit-manipulation",
  "number-of-one-bits": "bit-manipulation",
  "counting-bits": "bit-manipulation",
  "reverse-bits": "bit-manipulation",
  "missing-number": "bit-manipulation",
  "sum-of-two-integers": "bit-manipulation",
  "reverse-integer": "bit-manipulation",
  "valid-sudoku": "arrays-hashing",
  "minimum-window-substring": "sliding-window",
  "sliding-window-maximum": "sliding-window",
  "largest-rectangle-in-histogram": "stack",
  "median-of-two-sorted-arrays": "binary-search",
  "reverse-nodes-in-k-group": "linked-list",
  "find-median-in-a-data-stream": "heap-priority-queue",
  "reconstruct-itinerary": "advanced-graphs",
  "min-cost-to-connect-points": "advanced-graphs",
  "network-delay-time": "advanced-graphs",
  "swim-in-rising-water": "advanced-graphs",
  "alien-dictionary": "advanced-graphs",
  "house-robber": "1d-dp",
  "decode-ways": "1d-dp",
  "maximum-product-subarray": "1d-dp",
  "word-break": "1d-dp",
  "longest-increasing-subsequence": "1d-dp",
  "partition-equal-subset-sum": "1d-dp",
  "unique-paths": "2d-dp",
  "target-sum": "2d-dp",
  "interleaving-string": "2d-dp",
  "longest-increasing-path-in-a-matrix": "2d-dp",
  "distinct-subsequences": "2d-dp",
  "edit-distance": "2d-dp",
  "burst-balloons": "2d-dp",
  "regular-expression-matching": "2d-dp",
  "gas-station": "greedy",
  "hand-of-straights": "greedy",
  "merge-triplets-to-form-target": "greedy",
  "partition-labels": "greedy",
  "minimum-interval-to-include-each-query": "intervals",
};

async function main() {
  let seeded = 0;
  for (const slug of readdirSync(AUTHORED).filter((n) =>
    statSync(join(AUTHORED, n)).isDirectory(),
  )) {
    const patternId = PATTERN_BY_SLUG[slug];
    if (!patternId) {
      console.warn(`! authored/${slug} has no pattern mapping — skipping.`);
      continue;
    }
    const solutionPath = join(AUTHORED, slug, "index.ts");
    if (!existsSync(solutionPath)) continue;
    const manifestPath = join(ROOT, "judging", "problems", `${slug}.json`);
    if (!existsSync(manifestPath)) {
      console.warn(`! authored/${slug} has no case file — skipping (judging would be impossible).`);
      continue;
    }

    const source = readFileSync(solutionPath, "utf8");
    const header = parseHeader(source);
    const data = {
      title: header.title ?? slug,
      url: header.url ?? `https://leetcode.com/problems/${slug}/`,
      difficulty: (header.difficulty ?? "M") as Difficulty,
      patternId,
      dir: relative(ROOT, join(AUTHORED, slug)),
      solutionFile: "index.ts",
      starterCode: deriveStarterCode(source, "index.ts"),
      judged: false, // no legacy bun-test suite; judging runs via the manifest
    };
    await prisma.problem.upsert({
      where: { id: slug },
      create: { id: slug, ...data },
      update: data,
    });
    seeded++;
    console.log(`  ✓ ${slug} (${patternId}, ${data.difficulty})`);
  }
  console.log(`Seeded ${seeded} authored problems.`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
