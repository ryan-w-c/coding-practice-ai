import { NextResponse } from "next/server";
import { join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { prisma } from "@/lib/db";
import { judge, judgeHarness } from "@/lib/executor";
import {
  loadManifest,
  isHiddenCase,
  jsonPreview,
  HARNESS_LANGUAGES,
  type Manifest,
} from "@/lib/judging";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnyCase = {
  name: string;
  args?: unknown[];
  expected?: unknown;
  steps?: unknown;
  data?: unknown;
};

// Expected value for a user-supplied custom input: run the reference solution
// (prisma/refs override, else the extractor-verified vendored solution) through
// the TS harness and read back what it returned.
async function computeRefExpected(
  problemId: string,
  problemDir: string,
  manifest: Manifest,
  args: unknown[],
): Promise<unknown> {
  const override = join(process.cwd(), "prisma", "refs", `${problemId}.ts`);
  const vendored = join(process.cwd(), problemDir, "index.ts");
  const refPath = existsSync(override) ? override : existsSync(vendored) ? vendored : null;
  if (!refPath) return undefined;
  const probe = { ...manifest, cases: [{ name: "probe", args, expected: null }] };
  const r = await judgeHarness({
    harnessLanguage: "typescript",
    manifest: probe,
    solutionCode: readFileSync(refPath, "utf8"),
    timeoutMs: 10_000,
  });
  const t = r.tests?.[0];
  if (!t || t.status === "error" || r.timedOut) return undefined;
  return t.got;
}

function inputPreview(manifest: Manifest, c: AnyCase): string {
  if (manifest.kind === "sequence") return jsonPreview(c.steps);
  if (manifest.kind === "roundtrip") return jsonPreview(c.data);
  return jsonPreview(c.args);
}

function expectedPreview(manifest: Manifest, c: AnyCase): string | undefined {
  if (manifest.kind === "sequence") return undefined; // per-step, shown on failure
  if (manifest.kind === "roundtrip") return jsonPreview(c.data);
  return jsonPreview(c.expected);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.code !== "string" || typeof body.problemId !== "string") {
    return NextResponse.json(
      { error: "Missing 'problemId' or 'code'." },
      { status: 400 },
    );
  }

  const problem = await prisma.problem.findUnique({ where: { id: body.problemId } });
  if (!problem) {
    return NextResponse.json({ error: "Unknown problem." }, { status: 404 });
  }

  const language: string = body.language ?? "typescript";
  const mode: "run" | "submit" = body.mode === "run" ? "run" : "submit";
  const timeoutMs = Math.min(Math.max(Number(body.timeoutMs) || 10_000, 1_000), 30_000);
  const manifest = loadManifest(problem.id);

  // Harness path: any language we ship a harness for, if the problem has a case file.
  if (manifest && (HARNESS_LANGUAGES as readonly string[]).includes(language)) {
    // Run = fast feedback on the visible sample cases (+ custom input);
    // Submit = the full suite including hidden generated/stress cases.
    let cases = manifest.cases as AnyCase[];
    if (mode === "run") cases = cases.filter((c) => !isHiddenCase(c.name));

    // User-supplied custom inputs (function problems only). Expected comes from
    // the reference solution; without one the case is shown as info-only.
    const noExpected = new Set<string>();
    if (mode === "run" && manifest.kind === "function" && Array.isArray(body.custom)) {
      let n = 0;
      for (const args of (body.custom as unknown[]).slice(0, 5)) {
        if (!Array.isArray(args)) continue;
        const name = `custom: input ${++n}`;
        const expected = await computeRefExpected(problem.id, problem.dir, manifest, args);
        if (expected === undefined) noExpected.add(name);
        cases = [...cases, { name, args, expected: expected === undefined ? null : expected }];
      }
    }

    const result = await judgeHarness({
      harnessLanguage: language as "typescript" | "python" | "java",
      manifest: { ...manifest, cases },
      solutionCode: body.code,
      timeoutMs,
    });

    // Enrich per-case results with input/expected/got previews (cases are
    // emitted by the harness in manifest order, so index-align them).
    let { passed, total } = result;
    const tests = result.tests.map((t, i) => {
      const c = cases[i];
      let status = t.status;
      if (c && noExpected.has(c.name) && status === "fail") {
        status = "info"; // nothing to compare against — show the output only
        total -= 1;
      }
      return {
        name: t.name,
        status,
        hidden: c ? isHiddenCase(c.name) : false,
        input: c ? inputPreview(manifest, c) : undefined,
        expected: c && status !== "info" ? expectedPreview(manifest, c) : undefined,
        got: t.got === undefined ? undefined : jsonPreview(t.got),
        message: t.message,
      };
    });
    const verdict =
      result.verdict === "tle" || result.verdict === "error"
        ? result.verdict
        : total - passed > 0
          ? "wrong"
          : "accepted";

    return NextResponse.json({
      ...result,
      verdict,
      passed,
      total,
      mode,
      tests,
      raw:
        result.raw.length > 20_000
          ? result.raw.slice(0, 20_000) + "\n… (truncated)"
          : result.raw,
    });
  }

  // Legacy path: TypeScript against the vendored bun test suite.
  if (language === "typescript" && problem.judged) {
    const extra = await prisma.generatedTest.findMany({ where: { problemId: problem.id } });
    const extraTests =
      extra.length > 0 ? extra.map((t) => t.testCode).join("\n\n") : undefined;
    const result = await judge({
      problemDir: join(process.cwd(), problem.dir),
      solutionCode: body.code,
      solutionFile: problem.solutionFile,
      extraTests,
      timeoutMs,
    });
    return NextResponse.json(result);
  }

  return NextResponse.json(
    { error: `This problem can't be judged in ${language}.` },
    { status: 400 },
  );
}
