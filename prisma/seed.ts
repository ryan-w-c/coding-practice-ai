// Idempotent seed (DESIGN.md §12). Run with: bun prisma/seed.ts
//
// 1. Seed 18 Pattern rows (full NeetCode 150 breadth targets) — even patterns
//    whose problems aren't vendored yet, so breadth denominators stay correct.
// 2. Walk vendor/neetcode-150/<NN-pattern>/<problem>/index.ts, derive starter
//    code + metadata, upsert one Problem row each.

import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { PrismaClient, Difficulty } from "@prisma/client";
import { deriveStarterCode, parseHeader } from "../lib/starter";

const prisma = new PrismaClient();

const ROOT = join(import.meta.dir, "..");
const VENDOR = join(ROOT, "vendor", "neetcode-150");

// folderNumber -> pattern definition (id, display name, breadth target)
const PATTERNS: Record<
  number,
  { id: string; name: string; targetCount: number }
> = {
  1: { id: "arrays-hashing", name: "Arrays & Hashing", targetCount: 9 },
  2: { id: "two-pointers", name: "Two Pointers", targetCount: 5 },
  3: { id: "sliding-window", name: "Sliding Window", targetCount: 6 },
  4: { id: "stack", name: "Stack", targetCount: 7 },
  5: { id: "binary-search", name: "Binary Search", targetCount: 7 },
  6: { id: "linked-list", name: "Linked List", targetCount: 11 },
  7: { id: "trees", name: "Trees", targetCount: 15 },
  8: { id: "heap-priority-queue", name: "Heap / Priority Queue", targetCount: 7 },
  9: { id: "backtracking", name: "Backtracking", targetCount: 9 },
  10: { id: "tries", name: "Tries", targetCount: 3 },
  11: { id: "graphs", name: "Graphs", targetCount: 13 },
  12: { id: "advanced-graphs", name: "Advanced Graphs", targetCount: 6 },
  13: { id: "1d-dp", name: "1-D DP", targetCount: 12 },
  14: { id: "2d-dp", name: "2-D DP", targetCount: 11 },
  15: { id: "greedy", name: "Greedy", targetCount: 8 },
  16: { id: "intervals", name: "Intervals", targetCount: 6 },
  17: { id: "math-geometry", name: "Math & Geometry", targetCount: 8 },
  18: { id: "bit-manipulation", name: "Bit Manipulation", targetCount: 7 },
};

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function dirsIn(p: string): string[] {
  if (!existsSync(p)) return [];
  return readdirSync(p).filter((n) => {
    try {
      return statSync(join(p, n)).isDirectory();
    } catch {
      return false;
    }
  });
}

async function main() {
  // --- Patterns ---
  for (const [num, def] of Object.entries(PATTERNS)) {
    const order = Number(num);
    await prisma.pattern.upsert({
      where: { id: def.id },
      create: { id: def.id, name: def.name, order, targetCount: def.targetCount },
      update: { name: def.name, order, targetCount: def.targetCount },
    });
  }
  console.log(`Seeded ${Object.keys(PATTERNS).length} patterns.`);

  // --- Problems ---
  let seeded = 0;
  let runOnly = 0;
  let noStarter = 0;
  const patternFolders = dirsIn(VENDOR).filter((f) => /^\d+-/.test(f)).sort();

  for (const folder of patternFolders) {
    const num = parseInt(folder, 10);
    const pattern = PATTERNS[num];
    if (!pattern) {
      console.warn(`! Unknown pattern folder "${folder}" — skipping.`);
      continue;
    }

    const patternPath = join(VENDOR, folder);
    for (const problemSlug of dirsIn(patternPath)) {
      const problemPath = join(patternPath, problemSlug);
      const solutionPath = join(problemPath, "index.ts");
      const testPath = join(problemPath, "index.test.ts");
      if (!existsSync(solutionPath)) continue;

      const source = readFileSync(solutionPath, "utf8");
      const header = parseHeader(source);
      const starter = deriveStarterCode(source, "index.ts");
      if (starter === source) {
        noStarter++;
        console.warn(`  · no body blanked (review starter): ${folder}/${problemSlug}`);
      }

      const hasTests = existsSync(testPath);
      if (!hasTests) runOnly++;

      const difficulty = (header.difficulty ?? "M") as Difficulty;
      const id = problemSlug;
      const data = {
        title: header.title ?? titleCase(problemSlug),
        url: header.url ?? `https://neetcode.io/problems/${problemSlug}`,
        difficulty,
        patternId: pattern.id,
        dir: relative(ROOT, problemPath),
        solutionFile: "index.ts",
        starterCode: starter,
        // "judged" means the vendored reference solution passes its own tests.
        // Confirmed by prisma/verify.ts; here we mark candidates (has a test file).
        judged: hasTests,
      };

      await prisma.problem.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      });
      seeded++;
    }
  }

  console.log(
    `Seeded ${seeded} problems (${runOnly} run-only / no tests, ${noStarter} needing starter review).`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
