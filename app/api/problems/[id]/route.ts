import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { loadManifest, judgeableLanguages, pythonStarter, javaStarter, tsStarter, isHiddenCase, jsonPreview } from "@/lib/judging";
import { extractStatement, stripHeaderComment } from "@/lib/starter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const problem = await prisma.problem.findUnique({
    where: { id },
    include: { pattern: { select: { id: true, name: true } } },
  });
  if (!problem) {
    return NextResponse.json({ error: "Unknown problem." }, { status: 404 });
  }

  const manifest = loadManifest(problem.id);
  const languages = judgeableLanguages(problem.id, problem.judged);

  // The statement lives in the vendored starter's header comment. Show it in the
  // Problem panel and strip it from the editor's TS starter (no duplication).
  const statement = extractStatement(problem.starterCode);

  // Starters are generated from the judging manifest (the contract the judge
  // actually calls) rather than the vendored author code, which may be buggy.
  const starters: Record<string, string> = {
    typescript: manifest ? tsStarter(manifest) : stripHeaderComment(problem.starterCode),
    javascript:
      "// JavaScript scratch — Run executes this with Bun.\n// Submit/judging is TypeScript-only.\nconsole.log(\"hello\");\n",
    python: manifest
      ? pythonStarter(manifest)
      : "# Python scratch — Run executes this with python3.\n# Submit/judging needs a case file for this problem.\nprint(\"hello\")\n",
    java: manifest
      ? javaStarter(manifest)
      : "// Java scratch — Submit/judging needs a case file for this problem.\nclass Solution {}\n",
  };

  // Run/custom-input metadata: what kind of judging this is, how many sample
  // vs hidden cases exist, and a first-sample prefill for the custom input box.
  const cases = (manifest?.cases ?? []) as { name: string; args?: unknown[] }[];
  const sampleCount = cases.filter((c) => !isHiddenCase(c.name)).length;
  const firstArgs = manifest?.kind === "function" ? cases[0]?.args : undefined;

  return NextResponse.json({
    problem: {
      ...problem,
      statement,
      judgeableLanguages: languages,
      starters,
      judgeKind: manifest?.kind ?? null,
      sampleCount,
      hiddenCount: cases.length - sampleCount,
      sampleArgs: firstArgs !== undefined ? jsonPreview(firstArgs, 2000) : null,
    },
  });
}
