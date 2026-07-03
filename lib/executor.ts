// Local subprocess executor (DESIGN.md §6). Runs ONLY my own code on my own
// machine — no sandbox (see §2). Spawns `bun run` (scratch) or `bun test` (judge).

import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile, cp } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { join } from "node:path";
import { parseBunTest } from "./bunparse";
import { parseHarness } from "./harnessparse";

export type Verdict = "accepted" | "wrong" | "tle" | "error";

let cachedBun: string | null = null;
function resolveBun(): string {
  if (cachedBun) return cachedBun;
  const fromEnv = process.env.BUN_BIN?.trim();
  if (fromEnv && (fromEnv === "bun" || existsSync(fromEnv))) {
    return (cachedBun = fromEnv);
  }
  const homeBun = join(homedir(), ".bun", "bin", "bun");
  cachedBun = existsSync(homeBun) ? homeBun : "bun";
  return cachedBun;
}

type SpawnResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  durationMs: number;
};

function spawnCapture(
  cmd: string,
  args: string[],
  opts: { cwd?: string; stdin?: string; timeoutMs: number },
): Promise<SpawnResult> {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(cmd, args, {
      cwd: opts.cwd,
      env: process.env,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let settled = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL"); // capture partial output already buffered below
    }, opts.timeoutMs);

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    const finish = (exitCode: number | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        stdout,
        stderr,
        exitCode,
        timedOut,
        durationMs: Date.now() - start,
      });
    };

    child.on("error", (err) => {
      stderr += `\n[executor] failed to spawn ${cmd}: ${err.message}`;
      finish(null);
    });
    child.on("close", (code) => finish(code));

    if (opts.stdin !== undefined) {
      child.stdin.end(opts.stdin);
    } else {
      child.stdin.end();
    }
  });
}

async function withTempDir<T>(
  prefix: string,
  fn: (dir: string) => Promise<T>,
): Promise<T> {
  const dir = await mkdtemp(join(tmpdir(), prefix));
  try {
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

export type RunResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  durationMs: number;
};

export type RunLanguage = "typescript" | "javascript" | "python";

// How to execute each language for a scratch Run. Judging stays TS-only (§1).
function runtimeFor(language: RunLanguage): {
  cmd: string;
  args: (file: string) => string[];
  ext: string;
} {
  switch (language) {
    case "python":
      return { cmd: "python3", args: (f) => [f], ext: "py" };
    case "javascript":
      return { cmd: resolveBun(), args: (f) => ["run", f], ext: "js" };
    case "typescript":
    default:
      return { cmd: resolveBun(), args: (f) => ["run", f], ext: "ts" };
  }
}

/** Quick loop: write my code to a temp file and execute it. No verdict. */
export async function run({
  code,
  stdin,
  language = "typescript",
  timeoutMs = 10_000,
}: {
  code: string;
  stdin?: string;
  language?: RunLanguage;
  timeoutMs?: number;
}): Promise<RunResult> {
  return withTempDir("ll-run-", async (dir) => {
    const { cmd, args, ext } = runtimeFor(language);
    const file = join(dir, `scratch.${ext}`);
    await writeFile(file, code, "utf8");
    const r = await spawnCapture(cmd, args(file), {
      cwd: dir,
      stdin,
      timeoutMs,
    });
    return r;
  });
}

export type JudgeTest = {
  name: string;
  status: string; // "pass" | "fail" | "skip" | "error" | ...
  got?: unknown;
  want?: unknown;
  message?: string;
};

export type JudgeResult = {
  verdict: Verdict;
  passed: number;
  total: number;
  failingTests: string[];
  tests: JudgeTest[];
  durationMs: number;
  timedOut: boolean;
  raw: string;
};

/**
 * The real judge: copy the pristine problem dir to a temp working dir, inject my
 * solution, `bun test`, parse the result. (§5)
 */
export async function judge({
  problemDir,
  solutionCode,
  solutionFile = "index.ts",
  extraTests,
  timeoutMs = 10_000,
}: {
  problemDir: string;
  solutionCode: string;
  solutionFile?: string;
  extraTests?: string;
  timeoutMs?: number;
}): Promise<JudgeResult> {
  if (!existsSync(problemDir)) {
    return {
      verdict: "error",
      passed: 0,
      total: 0,
      failingTests: [],
      tests: [],
      durationMs: 0,
      timedOut: false,
      raw: `[executor] problem dir not found: ${problemDir}`,
    };
  }

  return withTempDir("ll-judge-", async (dir) => {
    await cp(problemDir, dir, { recursive: true });
    await writeFile(join(dir, solutionFile), solutionCode, "utf8");
    if (extraTests) {
      await writeFile(join(dir, "generated.test.ts"), extraTests, "utf8");
    }

    const r = await spawnCapture(resolveBun(), ["test", dir], {
      cwd: dir,
      timeoutMs,
    });

    const combined = `${r.stdout}\n${r.stderr}`;
    const parsed = parseBunTest(combined);

    let verdict: Verdict;
    if (r.timedOut) {
      verdict = "tle";
    } else if (!parsed.parsedOk || (parsed.total === 0 && r.exitCode !== 0)) {
      verdict = "error"; // compile/runtime error before tests ran
    } else if (parsed.failed > 0) {
      verdict = "wrong";
    } else {
      verdict = "accepted";
    }

    return {
      verdict,
      passed: parsed.passed,
      total: parsed.total,
      failingTests: parsed.failing,
      tests: parsed.tests.map((t) => ({ name: t.name, status: t.status })),
      durationMs: r.durationMs,
      timedOut: r.timedOut,
      raw: combined.trim(),
    };
  });
}

// Multi-language judge via the neutral case file + per-language harness
// (docs/multi-language-judging.md). Works for any language with a harness.
export async function judgeHarness({
  harnessLanguage,
  manifest,
  solutionCode,
  timeoutMs = 10_000,
}: {
  harnessLanguage: "typescript" | "python" | "java";
  manifest: unknown;
  solutionCode: string;
  timeoutMs?: number;
}): Promise<JudgeResult> {
  const harnessDir = join(process.cwd(), "harnesses", harnessLanguage);
  if (!existsSync(harnessDir)) {
    return {
      verdict: "error",
      passed: 0,
      total: 0,
      failingTests: [],
      tests: [],
      durationMs: 0,
      timedOut: false,
      raw: `[executor] no harness for language: ${harnessLanguage}`,
    };
  }

  const mf = manifest as { kind?: string; class?: string };
  let solutionFile: string;
  let cmd: string;
  let args: string[];
  if (harnessLanguage === "python") {
    solutionFile = "solution.py";
    cmd = "python3";
    args = ["harness.py", "case.json"];
  } else if (harnessLanguage === "java") {
    solutionFile =
      (mf?.kind === "sequence" || mf?.kind === "roundtrip") && mf.class
        ? `${mf.class}.java`
        : "Solution.java";
    cmd = "java";
    args = ["Harness", "case.json"];
  } else {
    solutionFile = "solution.ts";
    cmd = resolveBun();
    args = ["run", "harness.ts", "case.json"];
  }

  return withTempDir("ll-harness-", async (dir) => {
    await cp(harnessDir, dir, { recursive: true });
    await writeFile(join(dir, solutionFile), solutionCode, "utf8");
    await writeFile(join(dir, "case.json"), JSON.stringify(manifest), "utf8");

    // Java needs a compile step before running.
    if (harnessLanguage === "java") {
      const javaFiles = readdirSync(dir).filter((f) => f.endsWith(".java"));
      const comp = await spawnCapture("javac", javaFiles, { cwd: dir, timeoutMs });
      if (comp.exitCode !== 0) {
        return {
          verdict: "error",
          passed: 0,
          total: 0,
          failingTests: [],
          tests: [],
          durationMs: comp.durationMs,
          timedOut: comp.timedOut,
          raw: `compile error:\n${comp.stdout}\n${comp.stderr}`.trim(),
        };
      }
    }

    const r = await spawnCapture(cmd, args, { cwd: dir, timeoutMs });
    const combined = `${r.stdout}\n${r.stderr}`;
    const parsed = parseHarness(combined);

    let verdict: Verdict;
    if (r.timedOut) verdict = "tle";
    else if (!parsed.parsedOk) verdict = "error";
    else if (parsed.total - parsed.passed > 0) verdict = "wrong";
    else verdict = "accepted";

    return {
      verdict,
      passed: parsed.passed,
      total: parsed.total,
      failingTests: parsed.failing,
      tests: parsed.cases.map((c) => ({
        name: c.name, status: c.status, got: c.got, want: c.want, message: c.message,
      })),
      durationMs: r.durationMs,
      timedOut: r.timedOut,
      raw: combined.trim(),
    };
  });
}
