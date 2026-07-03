import Anthropic from "@anthropic-ai/sdk";

// Tutor model. Claude Sonnet 5 (released 2026-06-30) — best speed/intelligence
// balance, $3/$15 per MTok (intro $2/$10 through 2026-08-31). Bump to
// "claude-opus-4-8" for maximum quality, or "claude-haiku-4-5" for cheapest.
export const TUTOR_MODEL = "claude-sonnet-5";

// Resolves credentials from the environment: ANTHROPIC_API_KEY (set in
// .env.local), then ANTHROPIC_AUTH_TOKEN, then an `ant auth login` profile.
let client: Anthropic | null = null;
export function getAnthropic(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

export type TutorMode =
  | "hint"
  | "explain_pattern"
  | "review"
  | "pick_next"
  | "chat";

export type TutorContext = {
  problem?: {
    title: string;
    difficulty: "E" | "M" | "H";
    pattern: string;
    url: string;
  } | null;
  language?: string;
  code?: string;
  judge?: {
    verdict: string;
    passed: number;
    total: number;
    failingTests: string[];
  } | null;
};

const MODE_GUIDANCE: Record<TutorMode, string> = {
  hint: "The student asked for a HINT. Nudge them toward the right approach. Do NOT give the full solution unless they explicitly insist. Escalate detail only if they ask again.",
  explain_pattern:
    "The student asked you to EXPLAIN THE PATTERN. Name the underlying technique, describe the trigger that signals it, and connect it to related patterns they likely know.",
  review:
    "The student asked for a REVIEW of their current code. Cover: correctness, time/space complexity, and the specific failing test cases if any. End with one concrete improvement.",
  pick_next:
    "The student asked WHAT TO WORK ON NEXT. Recommend a direction based on the current problem and pattern.",
  chat: "Answer the student's question as a focused coding-interview tutor.",
};

const DIFF: Record<string, string> = { E: "Easy", M: "Medium", H: "Hard" };

export function buildSystemPrompt(mode: TutorMode, ctx: TutorContext): string {
  const lines: string[] = [
    "You are an adaptive coding-interview tutor embedded in a NeetCode-150 trainer.",
    "Be concise and Socratic. Prefer leading the student to insight over dumping answers.",
    "Format code in fenced blocks. Keep responses tight — this is a side panel.",
    "",
    MODE_GUIDANCE[mode],
  ];

  if (ctx.problem) {
    lines.push(
      "",
      "## Current problem",
      `Title: ${ctx.problem.title}`,
      `Difficulty: ${DIFF[ctx.problem.difficulty] ?? ctx.problem.difficulty}`,
      `Pattern: ${ctx.problem.pattern}`,
      `Link: ${ctx.problem.url}`,
    );
  }

  if (ctx.code && ctx.code.trim()) {
    lines.push(
      "",
      `## Student's current code (${ctx.language ?? "typescript"})`,
      "```" + (ctx.language ?? "typescript"),
      ctx.code.slice(0, 8000),
      "```",
    );
  }

  if (ctx.judge) {
    lines.push(
      "",
      "## Latest judge result",
      `Verdict: ${ctx.judge.verdict} (${ctx.judge.passed}/${ctx.judge.total} passed)`,
    );
    if (ctx.judge.failingTests.length) {
      lines.push(
        "Failing cases:",
        ...ctx.judge.failingTests.slice(0, 20).map((t) => `- ${t}`),
      );
    }
  }

  return lines.join("\n");
}
