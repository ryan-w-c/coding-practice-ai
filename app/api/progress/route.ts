import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  computeMastery, computeBreadth, type AttemptLite, type Difficulty, type Outcome,
} from "@/lib/scoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Per-pattern + per-problem progress and header stats (DESIGN.md §11).
export async function GET() {
  const now = new Date();

  const [patterns, problems, attempts, aiRows] = await Promise.all([
    prisma.pattern.findMany({ orderBy: { order: "asc" } }),
    prisma.problem.findMany({
      select: { id: true, title: true, patternId: true, difficulty: true },
      orderBy: { title: "asc" },
    }),
    prisma.attempt.findMany({
      orderBy: { createdAt: "asc" },
      include: { problem: { select: { patternId: true, difficulty: true } } },
    }),
    prisma.chatMessage.findMany({
      where: { role: "assistant", problemId: { not: null } },
      select: { problemId: true },
    }),
  ]);

  const aiUsed = new Set(aiRows.map((r) => r.problemId));

  const latestByProblem = new Map<string, (typeof attempts)[number]>();
  const countByProblem = new Map<string, number>();
  const acceptedProblems = new Set<string>();
  const acceptedByPattern = new Map<string, Set<string>>();
  const attemptsByPattern = new Map<string, AttemptLite[]>();
  const daysWithActivity = new Set<string>();

  for (const a of attempts) {
    latestByProblem.set(a.problemId, a); // asc order → last wins
    countByProblem.set(a.problemId, (countByProblem.get(a.problemId) ?? 0) + 1);
    daysWithActivity.add(a.createdAt.toISOString().slice(0, 10));
    const pid = a.problem.patternId;
    if (a.verdict === "accepted") {
      acceptedProblems.add(a.problemId);
      const s = acceptedByPattern.get(pid) ?? new Set<string>();
      s.add(a.problemId);
      acceptedByPattern.set(pid, s);
    }
    const l = attemptsByPattern.get(pid) ?? [];
    l.push({
      difficulty: a.problem.difficulty as Difficulty,
      outcome: a.outcome as Outcome,
      createdAt: a.createdAt,
    });
    attemptsByPattern.set(pid, l);
  }

  let reviewBacklog = 0;
  const patternRows = patterns.map((pat) => {
    const accepted = acceptedByPattern.get(pat.id)?.size ?? 0;
    const ids = problems.filter((p) => p.patternId === pat.id).map((p) => p.id);
    let dueCount = 0;
    let lastAttemptedAt: Date | null = null;
    for (const id of ids) {
      const latest = latestByProblem.get(id);
      if (!latest) continue;
      if (!lastAttemptedAt || latest.createdAt > lastAttemptedAt) lastAttemptedAt = latest.createdAt;
      if (latest.nextReviewAt && latest.nextReviewAt <= now) dueCount++;
    }
    reviewBacklog += dueCount;
    return {
      id: pat.id,
      name: pat.name,
      targetCount: pat.targetCount,
      accepted,
      breadthPct: computeBreadth(accepted, pat.targetCount),
      masteryPct: computeMastery(attemptsByPattern.get(pat.id) ?? [], now),
      attempts: (attemptsByPattern.get(pat.id) ?? []).length,
      dueCount,
      lastAttemptedAt,
    };
  });

  const problemRows = problems.map((p) => {
    const latest = latestByProblem.get(p.id);
    return {
      id: p.id,
      title: p.title,
      patternId: p.patternId,
      difficulty: p.difficulty,
      attempts: countByProblem.get(p.id) ?? 0,
      accepted: acceptedProblems.has(p.id),
      lastVerdict: latest?.verdict ?? null,
      lastOutcome: latest?.outcome ?? null,
      lastAttemptedAt: latest?.createdAt ?? null,
      lastConfidence: latest?.confidence ?? null,
      nextReviewAt: latest?.nextReviewAt ?? null,
      due: !!(latest?.nextReviewAt && latest.nextReviewAt <= now),
      usedAi: aiUsed.has(p.id),
    };
  });

  const totalAccepted = acceptedProblems.size;

  let streak = 0;
  const d = new Date(now);
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (daysWithActivity.has(key)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }

  // Longest run of consecutive active days over all history (day-granularity).
  const dayNumbers = [...daysWithActivity]
    .map((k) => Date.parse(k) / 86_400_000)
    .sort((a, b) => a - b);
  let bestStreak = 0;
  let run = 0;
  for (let i = 0; i < dayNumbers.length; i++) {
    run = i > 0 && dayNumbers[i] === dayNumbers[i - 1] + 1 ? run + 1 : 1;
    if (run > bestStreak) bestStreak = run;
  }

  return NextResponse.json({
    header: {
      totalAccepted, reviewBacklog, streak, bestStreak,
      totalAttempts: attempts.length,
    },
    patterns: patternRows,
    problems: problemRows,
  });
}
