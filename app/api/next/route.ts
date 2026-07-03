import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  computeMastery, computeBreadth, type AttemptLite, type Difficulty, type Outcome,
} from "@/lib/scoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Next-problem recommendation (DESIGN.md §10):
// 1) due redos, most overdue first
// 2) else an unattempted problem in the lowest min(breadth, mastery) pattern,
//    avoiding the most-recent pattern unless its score is critically low.
export async function GET() {
  const now = new Date();
  const [patterns, problems, attempts] = await Promise.all([
    prisma.pattern.findMany({ orderBy: { order: "asc" } }),
    prisma.problem.findMany({
      select: { id: true, title: true, patternId: true, difficulty: true },
    }),
    prisma.attempt.findMany({
      orderBy: { createdAt: "asc" },
      include: { problem: { select: { patternId: true, difficulty: true } } },
    }),
  ]);

  const latestByProblem = new Map<string, (typeof attempts)[number]>();
  for (const a of attempts) latestByProblem.set(a.problemId, a);

  // 1) Due reviews.
  const due = problems
    .map((p) => latestByProblem.get(p.id))
    .filter((a): a is NonNullable<typeof a> => !!a && !!a.nextReviewAt && a.nextReviewAt <= now)
    .sort((a, b) => a.nextReviewAt!.getTime() - b.nextReviewAt!.getTime());
  if (due.length > 0) {
    const top = due[0];
    const p = problems.find((x) => x.id === top.problemId)!;
    return NextResponse.json({
      problemId: p.id,
      title: p.title,
      patternId: p.patternId,
      reason: "due for review",
      dueSince: top.nextReviewAt,
    });
  }

  // 2) Lowest-coverage pattern with an unattempted problem.
  const acceptedByPattern = new Map<string, Set<string>>();
  const attemptsByPattern = new Map<string, AttemptLite[]>();
  for (const a of attempts) {
    const pid = a.problem.patternId;
    if (a.verdict === "accepted") {
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

  const lastPattern = attempts.length
    ? attempts[attempts.length - 1].problem.patternId
    : null;
  const diffRank = { E: 0, M: 1, H: 2 } as const;

  const scored = patterns
    .map((pat) => {
      const unattempted = problems
        .filter((p) => p.patternId === pat.id && !latestByProblem.has(p.id))
        .sort((a, b) =>
          diffRank[a.difficulty as Difficulty] - diffRank[b.difficulty as Difficulty] ||
          a.title.localeCompare(b.title),
        );
      const breadth = computeBreadth(acceptedByPattern.get(pat.id)?.size ?? 0, pat.targetCount);
      const mastery = computeMastery(attemptsByPattern.get(pat.id) ?? [], now);
      return { pat, unattempted, score: Math.min(breadth, mastery) };
    })
    .filter((r) => r.unattempted.length > 0)
    .sort((a, b) => a.score - b.score);

  if (scored.length === 0) {
    return NextResponse.json({ problemId: null, reason: "all problems attempted — clear the review queue" });
  }

  // Avoid repeating the most-recent pattern unless it's critically low (<30).
  let pick = scored[0];
  if (pick.pat.id === lastPattern && pick.score >= 30 && scored.length > 1) {
    pick = scored[1];
  }
  const p = pick.unattempted[0];
  return NextResponse.json({
    problemId: p.id,
    title: p.title,
    patternId: pick.pat.id,
    reason: `lowest coverage/mastery pattern (${pick.pat.name}, score ${pick.score})`,
  });
}
