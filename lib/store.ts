"use client";

// Tiny dependency-free shared store. dockview renders panels through portals, so
// instead of threading React context across them we expose one external store
// that every panel subscribes to via useSyncExternalStore.

import { useSyncExternalStore } from "react";

export type Difficulty = "E" | "M" | "H";

export type ProblemSummary = {
  id: string;
  title: string;
  difficulty: Difficulty;
  judged: boolean;
};

export type PatternWithProblems = {
  id: string;
  name: string;
  order: number;
  targetCount: number;
  problems: ProblemSummary[];
};

export type ProblemDetail = {
  id: string;
  title: string;
  url: string;
  difficulty: Difficulty;
  dir: string;
  starterCode: string;
  statement?: string;
  judged: boolean;
  pattern: { id: string; name: string };
  judgeableLanguages?: string[];
  starters?: Partial<Record<Language, string>>;
  judgeKind?: "function" | "sequence" | "roundtrip" | null;
  sampleCount?: number;
  hiddenCount?: number;
  /** First sample case's args as JSON — prefill for the custom-input box. */
  sampleArgs?: string | null;
};

export type RunResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  durationMs: number;
};

export type JudgeTest = {
  name: string;
  /** "pass" | "fail" | "error" | "info" (custom input with no reference answer) */
  status: string;
  /** True for machine-generated (gen:/stress:) cases — grouped separately in the UI. */
  hidden?: boolean;
  /** JSON previews (server-truncated). Legacy bun-test results carry none of these. */
  input?: string;
  expected?: string;
  got?: unknown;
  want?: unknown;
  message?: string;
};

export type JudgeResult = {
  verdict: "accepted" | "wrong" | "tle" | "error";
  passed: number;
  total: number;
  failingTests: string[];
  tests?: JudgeTest[];
  durationMs: number;
  timedOut: boolean;
  raw: string;
  mode?: "run" | "submit";
};

type State = {
  patterns: PatternWithProblems[];
  loadingCatalog: boolean;
  problemId: string | null;
  problem: ProblemDetail | null;
  loadingProblem: boolean;
  language: Language;
  /** Per-language editor buffers so switching language preserves edits. */
  buffers: Record<Language, string>;
  code: string;
  running: boolean;
  runResult: RunResult | null;
  /** Result of Run-against-sample-tests (harness judge, no attempt logged). */
  runTestsResult: JudgeResult | null;
  judging: boolean;
  judgeResult: JudgeResult | null;
  lastAction: "run" | "runtests" | "judge" | null;
  awaitingConfidence: boolean;
  pendingAttemptId: string | null;
  history: HistoryItem[];
  chat: ChatTurn[];
  tutorStreaming: boolean;
  view: View;
  progress: ProgressData | null;
  loadingProgress: boolean;
  recommendation: Recommendation | null;
  theme: Theme;
  gamify: boolean;
};

export type View = "dashboard" | "workspace";
export type Theme = "dark" | "light";

export type PatternProgress = {
  id: string;
  name: string;
  targetCount: number;
  accepted: number;
  breadthPct: number;
  masteryPct: number;
  attempts: number;
  dueCount: number;
  lastAttemptedAt: string | null;
};
export type ProblemProgress = {
  id: string;
  title: string;
  patternId: string;
  difficulty: Difficulty;
  attempts: number;
  accepted: boolean;
  lastVerdict: string | null;
  lastOutcome: string | null;
  lastAttemptedAt: string | null;
  lastConfidence: number | null;
  nextReviewAt: string | null;
  due: boolean;
  usedAi: boolean;
};
export type ProgressData = {
  header: {
    totalAccepted: number;
    reviewBacklog: number;
    streak: number;
    bestStreak: number;
    totalAttempts: number;
  };
  patterns: PatternProgress[];
  problems: ProblemProgress[];
};
export type Recommendation = {
  problemId: string | null;
  title?: string;
  patternId?: string;
  reason: string;
  dueSince?: string;
};

export type Language = "typescript" | "javascript" | "python" | "java";
export type ChatTurn = { role: "user" | "assistant"; content: string };

export type HistoryItem = {
  id: string;
  createdAt: string;
  verdict: string;
  outcome: string;
  passed: number;
  total: number;
  language: string;
  code: string;
  confidence: number | null;
};

export const LANGUAGES: { id: Language; label: string; judged: boolean }[] = [
  { id: "typescript", label: "TypeScript", judged: true },
  { id: "python", label: "Python", judged: false },
  { id: "java", label: "Java", judged: false },
  { id: "javascript", label: "JavaScript", judged: false },
];

const SCRATCH_STUB: Record<Language, string> = {
  typescript: "",
  javascript:
    "// JavaScript scratch — Run executes this with Bun.\nconsole.log(\"hello\");\n",
  python:
    "# Python scratch — Run executes this with python3.\nprint(\"hello\")\n",
  java: "// Java — Submit judges against the suite (Run is disabled for Java).\nclass Solution {}\n",
};

function freshBuffers(starter: string): Record<Language, string> {
  return {
    typescript: starter,
    javascript: SCRATCH_STUB.javascript,
    python: SCRATCH_STUB.python,
    java: SCRATCH_STUB.java,
  };
}

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.localStorage.getItem("theme") === "light" ? "light" : "dark";
}

function readInitialGamify(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem("gamify") !== "off";
}

function applyThemeToDocument(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

let state: State = {
  patterns: [],
  loadingCatalog: false,
  problemId: null,
  problem: null,
  loadingProblem: false,
  language: "typescript",
  buffers: freshBuffers(""),
  code: "",
  running: false,
  runResult: null,
  runTestsResult: null,
  judging: false,
  judgeResult: null,
  lastAction: null,
  awaitingConfidence: false,
  pendingAttemptId: null,
  history: [],
  chat: [],
  tutorStreaming: false,
  view: "dashboard",
  progress: null,
  loadingProgress: false,
  recommendation: null,
  theme: readInitialTheme(),
  gamify: readInitialGamify(),
};
applyThemeToDocument(state.theme);

const listeners = new Set<() => void>();

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function getState() {
  return state;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(getState()),
  );
}

// --- actions ---

export function setView(view: View) {
  set({ view });
}

export function setTheme(theme: Theme) {
  window.localStorage.setItem("theme", theme);
  applyThemeToDocument(theme);
  set({ theme });
}

export function toggleTheme() {
  setTheme(state.theme === "dark" ? "light" : "dark");
}

export function setGamify(gamify: boolean) {
  window.localStorage.setItem("gamify", gamify ? "on" : "off");
  set({ gamify });
}

export async function loadProgress() {
  set({ loadingProgress: true });
  try {
    const res = await fetch("/api/progress");
    set({ progress: await res.json() });
  } catch {
    /* ignore */
  } finally {
    set({ loadingProgress: false });
  }
}

export async function loadNext() {
  try {
    const res = await fetch("/api/next");
    set({ recommendation: await res.json() });
  } catch {
    /* ignore */
  }
}

export async function openProblem(id: string) {
  await selectProblem(id);
  set({ view: "workspace" });
}

export async function loadCatalog() {
  set({ loadingCatalog: true });
  try {
    const res = await fetch("/api/problems");
    const data = await res.json();
    set({ patterns: data.patterns ?? [] });
  } finally {
    set({ loadingCatalog: false });
  }
}

export async function selectProblem(id: string) {
  if (id === state.problemId) return;
  set({
    loadingProblem: true,
    problemId: id,
    runResult: null,
    runTestsResult: null,
    judgeResult: null,
    lastAction: null,
    awaitingConfidence: false,
    pendingAttemptId: null,
    history: [],
    chat: [],
  });
  try {
    const res = await fetch(`/api/problems/${id}`);
    const data = await res.json();
    const problem: ProblemDetail = data.problem;
    const buffers: Record<Language, string> = {
      typescript: problem.starters?.typescript ?? problem.starterCode,
      javascript: problem.starters?.javascript ?? SCRATCH_STUB.javascript,
      python: problem.starters?.python ?? SCRATCH_STUB.python,
      java: problem.starters?.java ?? SCRATCH_STUB.java,
    };
    set({
      problem,
      language: "typescript",
      buffers,
      code: buffers.typescript,
    });
    void loadChat(id);
    void loadHistory(id);
  } finally {
    set({ loadingProblem: false });
  }
}

export async function loadHistory(problemId: string) {
  try {
    const res = await fetch(`/api/attempts?problemId=${encodeURIComponent(problemId)}`);
    const data = await res.json();
    if (state.problemId === problemId && Array.isArray(data.attempts)) {
      set({ history: data.attempts as HistoryItem[] });
    }
  } catch {
    /* non-critical */
  }
}

// Load a past submission's code back into the editor (matching its language).
export function viewSubmission(id: string) {
  const item = state.history.find((h) => h.id === id);
  if (!item) return;
  const lang: Language = (
    ["typescript", "javascript", "python", "java"] as readonly string[]
  ).includes(item.language)
    ? (item.language as Language)
    : "typescript";
  set({
    language: lang,
    code: item.code,
    buffers: { ...state.buffers, [lang]: item.code },
  });
}

export function setCode(code: string) {
  set({ code, buffers: { ...state.buffers, [state.language]: code } });
}

export function setLanguage(language: Language) {
  if (language === state.language) return;
  // stash current edits, swap to the target language's buffer
  const buffers = { ...state.buffers, [state.language]: state.code };
  set({ language, buffers, code: buffers[language], runResult: null, runTestsResult: null });
}

export function resetCode() {
  const lang = state.language;
  const starter =
    state.problem?.starters?.[lang] ??
    (lang === "typescript" ? (state.problem?.starterCode ?? "") : SCRATCH_STUB[lang]);
  set({ code: starter, buffers: { ...state.buffers, [lang]: starter } });
}

// Scratch run: execute the file top-to-bottom (console playground). Used for
// languages/problems that can't be judged (e.g. JavaScript).
export async function doRun(stdin?: string) {
  if (state.running || state.language === "java") return; // Java: harness only
  set({ running: true, runResult: null, lastAction: "run" });
  try {
    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: state.code, stdin, language: state.language }),
    });
    set({ runResult: await res.json() });
  } catch (e) {
    set({
      runResult: {
        stdout: "",
        stderr: String(e),
        exitCode: null,
        timedOut: false,
        durationMs: 0,
      },
    });
  } finally {
    set({ running: false });
  }
}

// Run against the sample test cases (+ optional custom inputs). Same judge as
// Submit but hidden cases are skipped and NO attempt is logged.
export async function doRunTests(custom?: unknown[][]) {
  if (state.running || !state.problemId) return;
  set({ running: true, runTestsResult: null, lastAction: "runtests" });
  try {
    const res = await fetch("/api/judge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        problemId: state.problemId,
        code: state.code,
        language: state.language,
        mode: "run",
        custom,
      }),
    });
    set({ runTestsResult: await res.json() });
  } catch (e) {
    set({
      runTestsResult: {
        verdict: "error",
        passed: 0,
        total: 0,
        failingTests: [],
        durationMs: 0,
        timedOut: false,
        raw: String(e),
        mode: "run",
      },
    });
  } finally {
    set({ running: false });
  }
}

export async function doJudge() {
  if (state.judging || !state.problemId) return;
  set({
    judging: true,
    judgeResult: null,
    lastAction: "judge",
    awaitingConfidence: false,
    pendingAttemptId: null,
  });
  try {
    const res = await fetch("/api/judge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        problemId: state.problemId,
        code: state.code,
        language: state.language,
      }),
    });
    const result: JudgeResult = await res.json();
    set({ judgeResult: result });

    // Log the submission as an Attempt (append-only), then invite a confidence
    // rating that patches onto it. Logging is not lost if the rating is skipped.
    if (result && result.verdict) {
      try {
        const ar = await fetch("/api/attempts", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            problemId: state.problemId,
            verdict: result.verdict,
            passed: result.passed,
            total: result.total,
            failingTests: result.failingTests,
            code: state.code,
            language: state.language,
          }),
        });
        const data = await ar.json();
        if (data?.attemptId) {
          set({ awaitingConfidence: true, pendingAttemptId: data.attemptId });
        }
        if (state.problemId) void loadHistory(state.problemId);
      } catch {
        /* logging is best-effort */
      }
    }
  } catch (e) {
    set({
      judgeResult: {
        verdict: "error",
        passed: 0,
        total: 0,
        failingTests: [],
        durationMs: 0,
        timedOut: false,
        raw: String(e),
      },
    });
  } finally {
    set({ judging: false });
  }
}

export async function submitConfidence(confidence: number) {
  const id = state.pendingAttemptId;
  set({ awaitingConfidence: false, pendingAttemptId: null });
  if (!id) return;
  try {
    await fetch("/api/attempts", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ attemptId: id, confidence }),
    });
  } catch {
    /* best-effort */
  }
}

export function dismissConfidence() {
  set({ awaitingConfidence: false, pendingAttemptId: null });
}

// --- tutor ---

export type TutorMode =
  | "hint"
  | "explain_pattern"
  | "review"
  | "pick_next"
  | "chat";

const MODE_PROMPT: Record<Exclude<TutorMode, "chat">, string> = {
  hint: "Can I get a hint for this problem? Please don't reveal the full solution yet.",
  explain_pattern:
    "Explain the pattern behind this problem and how to recognize when to use it.",
  review: "Please review my current solution.",
  pick_next: "What should I work on next?",
};

export async function loadChat(problemId: string) {
  try {
    const res = await fetch(`/api/chat?problemId=${encodeURIComponent(problemId)}`);
    const data = await res.json();
    // Only adopt history if we're still on the same problem.
    if (state.problemId === problemId && Array.isArray(data.messages)) {
      set({
        chat: data.messages.map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      });
    }
  } catch {
    /* non-critical */
  }
}

export async function sendTutor(mode: TutorMode, text?: string) {
  if (state.tutorStreaming) return;
  const content = mode === "chat" ? (text ?? "").trim() : MODE_PROMPT[mode];
  if (!content) return;

  const baseChat: ChatTurn[] = [...state.chat, { role: "user", content }];
  set({ chat: [...baseChat, { role: "assistant", content: "" }], tutorStreaming: true });

  const problem = state.problem
    ? {
        title: state.problem.title,
        difficulty: state.problem.difficulty,
        pattern: state.problem.pattern.name,
        url: state.problem.url,
      }
    : null;

  try {
    const res = await fetch("/api/tutor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        mode,
        problemId: state.problemId,
        problem,
        language: state.language,
        code: state.code,
        judgeResult: state.judgeResult,
        conversation: baseChat,
      }),
    });

    if (!res.body) {
      throw new Error(`tutor request failed (${res.status})`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let acc = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      acc += decoder.decode(value, { stream: true });
      set({ chat: [...baseChat, { role: "assistant", content: acc }] });
    }
  } catch (e) {
    set({
      chat: [...baseChat, { role: "assistant", content: `[tutor error: ${String(e)}]` }],
    });
  } finally {
    set({ tutorStreaming: false });
  }
}
