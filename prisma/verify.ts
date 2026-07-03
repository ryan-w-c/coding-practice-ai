// Spot-check (DESIGN.md §15): run each vendored reference solution through our
// judge pipeline (executor + bunparse). A problem is only trustworthy as
// "judged" if its own reference solution passes its tests in our runner.
// Updates Problem.judged accordingly and prints any gaps.
//
// Run with: bun prisma/verify.ts

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { judge } from "../lib/executor";

const prisma = new PrismaClient();
const ROOT = join(import.meta.dir, "..");

async function main() {
  const problems = await prisma.problem.findMany({ orderBy: { id: "asc" } });
  const withTests = problems.filter((p) => p.judged);
  console.log(`Verifying ${withTests.length} problems with test suites…\n`);

  let ok = 0;
  const failures: { id: string; verdict: string; passed: number; total: number }[] =
    [];

  for (const p of withTests) {
    const dir = join(ROOT, p.dir);
    const reference = readFileSync(join(dir, p.solutionFile), "utf8");
    const res = await judge({
      problemDir: dir,
      solutionCode: reference,
      solutionFile: p.solutionFile,
      timeoutMs: 15_000,
    });

    if (res.verdict === "accepted" && res.total > 0) {
      ok++;
    } else {
      failures.push({
        id: p.id,
        verdict: res.verdict,
        passed: res.passed,
        total: res.total,
      });
      await prisma.problem.update({
        where: { id: p.id },
        data: { judged: false },
      });
      console.log(
        `  ✗ ${p.id}: ${res.verdict} (${res.passed}/${res.total})`,
      );
    }
  }

  console.log(
    `\n${ok}/${withTests.length} reference solutions pass in our runner.`,
  );
  if (failures.length) {
    console.log(
      `${failures.length} demoted to run-only (reference did not pass).`,
    );
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
