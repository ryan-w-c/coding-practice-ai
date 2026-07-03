import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deriveOutcome, schedule, type Verdict } from "@/lib/scoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Log a submission as an append-only Attempt (DESIGN.md §7). Outcome and the
// spaced-repetition schedule are derived server-side.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.problemId !== "string" || typeof body.verdict !== "string") {
    return NextResponse.json({ error: "Missing 'problemId' or 'verdict'." }, { status: 400 });
  }

  const problem = await prisma.problem.findUnique({ where: { id: body.problemId } });
  if (!problem) return NextResponse.json({ error: "Unknown problem." }, { status: 404 });

  // "Used AI" = the tutor produced at least one reply for this problem.
  const aiReplies = await prisma.chatMessage.count({
    where: { problemId: problem.id, role: "assistant" },
  });
  const usedAi = aiReplies > 0;

  const outcome = deriveOutcome(body.verdict as Verdict, usedAi);
  const prev = await prisma.attempt.findFirst({
    where: { problemId: problem.id },
    orderBy: { createdAt: "desc" },
  });
  const now = new Date();
  const { interval, nextReviewAt } = schedule(outcome, prev?.interval ?? 0, now);

  const attempt = await prisma.attempt.create({
    data: {
      problemId: problem.id,
      verdict: body.verdict as Verdict,
      passed: Number(body.passed) || 0,
      total: Number(body.total) || 0,
      failingTests: Array.isArray(body.failingTests) ? body.failingTests : [],
      outcome,
      code: typeof body.code === "string" ? body.code : "",
      language: typeof body.language === "string" ? body.language : "typescript",
      confidence: typeof body.confidence === "number" ? body.confidence : null,
      timeSpentMin: typeof body.timeSpentMin === "number" ? body.timeSpentMin : null,
      notes: typeof body.notes === "string" ? body.notes : null,
      interval,
      nextReviewAt,
    },
  });

  return NextResponse.json({
    ok: true,
    attemptId: attempt.id,
    outcome,
    usedAi,
    interval,
    nextReviewAt,
  });
}

// Update a logged attempt with self-reported fields (confidence / outcome / notes).
export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.attemptId !== "string") {
    return NextResponse.json({ error: "Missing 'attemptId'." }, { status: 400 });
  }
  const data: { confidence?: number; notes?: string; outcome?: string } = {};
  if (typeof body.confidence === "number") {
    data.confidence = Math.max(1, Math.min(5, Math.round(body.confidence)));
  }
  if (typeof body.notes === "string") data.notes = body.notes;
  if (
    typeof body.outcome === "string" &&
    ["clean", "hinted", "solution", "failed"].includes(body.outcome)
  ) {
    data.outcome = body.outcome;
  }
  try {
    const updated = await prisma.attempt.update({ where: { id: body.attemptId }, data });
    return NextResponse.json({ ok: true, confidence: updated.confidence, outcome: updated.outcome });
  } catch {
    return NextResponse.json({ error: "Attempt not found." }, { status: 404 });
  }
}

// History for a problem (newest first) — for the future dashboard drill-in.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const problemId = searchParams.get("problemId");
  const attempts = await prisma.attempt.findMany({
    where: problemId ? { problemId } : undefined,
    orderBy: { createdAt: "desc" },
    take: problemId ? 200 : 500,
  });
  return NextResponse.json({ attempts });
}
