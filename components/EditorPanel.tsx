"use client";

import { useEffect, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import {
  useStore,
  setCode,
  setLanguage,
  resetCode,
  doRun,
  doRunTests,
  doJudge,
  submitConfidence,
  dismissConfidence,
  viewSubmission,
  LANGUAGES,
  type Language,
  type JudgeResult,
  type JudgeTest,
} from "@/lib/store";
import { xpForSubmission } from "@/lib/gamify";

const CONFIDENCE: [number, string][] = [
  [1, "Guessed"],
  [2, "Shaky"],
  [3, "OK"],
  [4, "Confident"],
  [5, "Nailed it"],
];

function ConfidencePrompt() {
  const awaiting = useStore((s) => s.awaitingConfidence);
  if (!awaiting) return null;
  return (
    <div className="confidence-row" style={{ marginTop: 0, paddingTop: 0, borderTop: "none", marginBottom: 12 }}>
      <div className="section-title" style={{ margin: "0 0 8px" }}>How confident were you?</div>
      <div className="confidence-chips">
        {CONFIDENCE.map(([v, label]) => (
          <button key={v} className="confidence-chip" onClick={() => void submitConfidence(v)}>
            {v} {label}
          </button>
        ))}
        <button className="confidence-chip" onClick={() => dismissConfidence()} style={{ marginLeft: "auto" }}>
          skip
        </button>
      </div>
    </div>
  );
}

const VERDICT_LABEL: Record<string, string> = {
  accepted: "Accepted",
  wrong: "Wrong Answer",
  tle: "Time Limit Exceeded",
  error: "Error",
};

const MARK: Record<string, string> = { pass: "✓", fail: "✗", error: "✗", info: "•" };

// <details> whose open state is user-owned after mount (a controlled `open`
// prop would snap back on every unrelated store re-render).
function Collapsible({
  defaultOpen,
  className,
  style,
  summary,
  children,
}: {
  defaultOpen: boolean;
  className?: string;
  style?: React.CSSProperties;
  summary: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details
      className={className}
      style={style}
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      {summary}
      {children}
    </details>
  );
}

// One test case: passing rows are collapsed (expand to inspect input/expected/
// got); failing rows start expanded. Same layout either way.
function CaseRow({ t }: { t: JudgeTest }) {
  const [open, setOpen] = useState(t.status !== "pass");
  const hasDetail =
    t.input !== undefined || t.expected !== undefined || t.got !== undefined ||
    t.want !== undefined || !!t.message;
  const cls = t.status === "pass" ? "pass" : t.status === "info" ? "info" : "fail";

  if (!hasDetail) {
    return (
      <div className={`case-row ${cls}`}>
        <div className="case-summary" style={{ cursor: "default" }}>
          <span className="test-mark">{MARK[t.status] ?? "✗"}</span> {t.name}
        </div>
      </div>
    );
  }

  return (
    <details
      className={`case-row ${cls}`}
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className="case-summary">
        <span className="test-mark">{MARK[t.status] ?? "✗"}</span> {t.name}
      </summary>
      <div className="test-detail">
        {t.message && <div>{t.message}</div>}
        {t.input !== undefined && (
          <div>input <code>{t.input}</code></div>
        )}
        {t.expected !== undefined ? (
          <div>expected <code>{t.expected}</code></div>
        ) : t.want !== undefined ? (
          <div>expected <code>{shorten(JSON.stringify(t.want))}</code></div>
        ) : null}
        {t.got !== undefined && (
          <div>got <code>{typeof t.got === "string" ? t.got : shorten(JSON.stringify(t.got))}</code></div>
        )}
        {t.status === "info" && (
          <div className="muted">no reference answer for this input — output shown as-is</div>
        )}
      </div>
    </details>
  );
}

const VERDICT_MARK: Record<string, string> = { accepted: "✓", wrong: "✗", tle: "✗", error: "✗" };

function TestResultsView({ result }: { result: JudgeResult }) {
  const gamify = useStore((s) => s.gamify);
  const problem = useStore((s) => s.problem);
  const tests = result.tests ?? [];
  const sample = tests.filter((t) => !t.hidden);
  const hiddenTests = tests.filter((t) => t.hidden);
  const hiddenPassed = hiddenTests.filter((t) => t.status === "pass").length;
  const hiddenFailed = hiddenTests.length - hiddenPassed;
  // A new result object should reset every row's expanded/collapsed state.
  const runKey = `${result.mode}-${result.verdict}-${result.passed}-${result.total}-${result.durationMs}`;
  const showXp = gamify && result.mode === "submit" && result.verdict === "accepted" && problem;

  return (
    <div>
      <div className="results-head">
        <span className={`verdict-word verdict ${result.verdict}`}>
          {VERDICT_MARK[result.verdict] ?? "✗"} {VERDICT_LABEL[result.verdict] ?? result.verdict}
        </span>
        <span className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>
          {result.mode === "run" ? "sample tests · " : ""}
          {result.passed}/{result.total} passed · {result.durationMs}ms
        </span>
        {showXp && (
          <span className="xp-pill">+{xpForSubmission(problem!.difficulty)} XP</span>
        )}
      </div>

      {tests.length > 0 ? (
        <div className="case-list" key={runKey}>
          {sample.map((t, i) => (
            <CaseRow key={i} t={t} />
          ))}
          {hiddenTests.length > 0 && (
            <Collapsible
              className={`case-group ${hiddenFailed === 0 ? "pass" : "fail"}`}
              defaultOpen={hiddenFailed > 0}
              summary={
                <summary className="case-summary">
                  <span className="test-mark">{hiddenFailed === 0 ? "✓" : "✗"}</span>
                  Hidden tests · {hiddenPassed}/{hiddenTests.length} passed
                  <span className="muted" style={{ marginLeft: 6 }}>
                    (generated + large stress inputs; previews truncated)
                  </span>
                </summary>
              }
            >
              <div style={{ marginLeft: 14 }}>
                {hiddenTests.map((t, i) => (
                  <CaseRow key={i} t={t} />
                ))}
              </div>
            </Collapsible>
          )}
        </div>
      ) : result.failingTests.length > 0 ? (
        <ul className="fail-list">
          {result.failingTests.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      ) : null}

      <details style={{ marginTop: 8 }}>
        <summary className="muted" style={{ cursor: "pointer", fontSize: 12 }}>
          Raw output
        </summary>
        <pre className="output">{result.raw || "(no output)"}</pre>
      </details>
    </div>
  );
}

function JudgeResultView() {
  const judging = useStore((s) => s.judging);
  const result = useStore((s) => s.judgeResult);
  if (judging) return <p className="muted">Judging… running the full test suite.</p>;
  if (!result) return null;
  return <TestResultsView result={result} />;
}

function RunTestsResultView() {
  const running = useStore((s) => s.running);
  const result = useStore((s) => s.runTestsResult);
  if (running) return <p className="muted">Running sample tests…</p>;
  if (!result) return null;
  return <TestResultsView result={result} />;
}

function shorten(s: string, max = 140): string {
  return s.length > max ? s.slice(0, max) + "…" : s;
}

function RunResultView() {
  const running = useStore((s) => s.running);
  const result = useStore((s) => s.runResult);

  if (running) return <p className="muted">Running…</p>;
  if (!result) return null;

  const noOutput = !result.stdout && !result.stderr;

  return (
    <div>
      <div className="muted">
        exit {result.exitCode ?? "—"}
        {result.timedOut ? " · TIMED OUT" : ""} · {result.durationMs}ms
      </div>
      {result.stdout && (
        <>
          <p className="section-title">stdout</p>
          <pre className="output">{result.stdout}</pre>
        </>
      )}
      {result.stderr && (
        <>
          <p className="section-title">stderr</p>
          <pre className="output">{result.stderr}</pre>
        </>
      )}
      {noOutput && result.exitCode === 0 && (
        <p className="muted" style={{ marginTop: 8 }}>
          Ran with no output. <strong>Run</strong> executes your file top-to-bottom —
          add a <code>console.log(...)</code> / <code>print(...)</code> to inspect values.
        </p>
      )}
      {noOutput && result.exitCode !== 0 && (
        <p className="muted" style={{ marginTop: 8 }}>
          Exited with code {result.exitCode ?? "—"} and no output.
        </p>
      )}
    </div>
  );
}

export default function EditorPanel() {
  const code = useStore((s) => s.code);
  const problem = useStore((s) => s.problem);
  const language = useStore((s) => s.language);
  const history = useStore((s) => s.history);
  const running = useStore((s) => s.running);
  const judging = useStore((s) => s.judging);
  const lastAction = useStore((s) => s.lastAction);
  const theme = useStore((s) => s.theme);

  const [customText, setCustomText] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);
  useEffect(() => {
    setCustomText("");
    setCustomError(null);
  }, [problem?.id]);

  const judgeable = problem?.judgeableLanguages ?? [];
  // Only offer languages you can actually submit; fall back to TS for run-only problems.
  const offered = judgeable.length ? judgeable : ["typescript"];
  const shownLangs = LANGUAGES.filter((l) => offered.includes(l.id));
  const langJudgeable = judgeable.includes(language);
  const canSubmit = langJudgeable && !!problem && !judging;
  // Run = sample tests (harness) when judgeable, else scratch execution.
  const canRun = !!code && !running && !judging && (langJudgeable || language !== "java");
  const customEnabled = langJudgeable && problem?.judgeKind === "function";

  const runNow = () => {
    if (!canRun) return;
    if (!langJudgeable) {
      void doRun();
      return;
    }
    setCustomError(null);
    let custom: unknown[][] | undefined;
    const text = customText.trim();
    if (customEnabled && text) {
      try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error("must be a JSON array of arguments");
        custom = [parsed];
      } catch (e) {
        setCustomError(`Custom input isn't valid: ${e instanceof Error ? e.message : e}`);
        return;
      }
    }
    void doRunTests(custom);
  };
  const runNowRef = useRef(runNow);
  runNowRef.current = runNow;
  const judgeRef = useRef(() => void doJudge());
  judgeRef.current = () => void doJudge();

  const handleMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runNowRef.current();
    });
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        judgeRef.current();
      },
    );
  };

  let submitTitle = "Judge against the FULL suite incl. hidden tests — logs an attempt (⌘/Ctrl+Shift+Enter)";
  if (!problem) submitTitle = "Load a problem first";
  else if (!langJudgeable)
    submitTitle =
      judgeable.length > 0
        ? `Not judgeable in ${language}. Judgeable: ${judgeable.join(", ")}`
        : "No test suite for this problem";

  const runTitle = langJudgeable
    ? `Run the ${problem?.sampleCount ?? ""} sample tests${customEnabled ? " + custom input" : ""} — nothing is logged (⌘/Ctrl+Enter)`
    : "Run scratch code (⌘/Ctrl+Enter)";

  return (
    <div className="panel">
      <div className="toolbar">
        <select
          className="problem-select"
          style={{ width: "auto" }}
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          title="Language"
        >
          {shownLangs.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
        <button className="btn" disabled={!canRun} onClick={runNow} title={runTitle}>
          ▶ Run
        </button>
        <button
          className="btn primary"
          disabled={!canSubmit}
          onClick={() => void doJudge()}
          title={submitTitle}
        >
          ✓ Submit
        </button>
        <button
          className="btn"
          disabled={!problem}
          onClick={() => resetCode()}
          title="Reset to starter / scratch code"
        >
          ↺ Reset
        </button>
        {history.length > 0 && (
          <select
            className="problem-select"
            style={{ width: "auto" }}
            value=""
            onChange={(e) => {
              if (e.target.value) viewSubmission(e.target.value);
            }}
            title="Load a past submission's code"
          >
            <option value="">History ({history.length})</option>
            {history.map((h) => (
              <option key={h.id} value={h.id}>
                {new Date(h.createdAt).toLocaleString(undefined, {
                  month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                })}{" "}
                · {h.verdict === "accepted" ? "✓" : "✗"} {h.passed}/{h.total} · {h.language.slice(0, 2)}
              </option>
            ))}
          </select>
        )}
        {problem && !langJudgeable && (
          <span className="muted" style={{ fontSize: 12 }}>
            {judgeable.length
              ? `Run-only in ${language} · judged: ${judgeable.join(", ")}`
              : "Run-only language"}
          </span>
        )}
        <span className="muted" style={{ marginLeft: "auto" }}>
          {problem ? problem.title : "no problem loaded"}
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          theme={theme === "light" ? "vs" : "vs-dark"}
          path={`solution.${language}`}
          language={language}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          onMount={handleMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            scrollBeyondLastLine: false,
            tabSize: 2,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="results-panel">
        <ConfidencePrompt />
        {customEnabled && (
          <>
            <Collapsible
              key={problem?.id}
              className="case-group"
              style={{ marginBottom: 8 }}
              defaultOpen={false}
              summary={
                <summary className="case-summary muted" style={{ fontSize: 12 }}>
                  Custom test input{customText.trim() ? " · active (included on ▶ Run)" : ""}
                </summary>
              }
            >
              <textarea
                className="custom-input"
                rows={2}
                spellCheck={false}
                placeholder={problem?.sampleArgs ?? "[arg1, arg2, …]"}
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setCustomError(null);
                }}
              />
              <div className="muted" style={{ fontSize: 11.5 }}>
                JSON array of arguments, e.g.{" "}
                <code>{shorten(problem?.sampleArgs ?? "[[1, 2, 3], 6]", 80)}</code> — the
                expected answer is computed by the reference solution. Leave empty to skip.
              </div>
            </Collapsible>
            {customError && (
              <div style={{ color: "var(--red)", fontSize: 12, marginBottom: 8 }}>{customError}</div>
            )}
          </>
        )}
        {lastAction === "judge" ? (
          <JudgeResultView />
        ) : lastAction === "runtests" ? (
          <RunTestsResultView />
        ) : lastAction === "run" ? (
          <RunResultView />
        ) : (
          <p className="muted">
            <strong>Run</strong> checks the sample tests{customEnabled ? " (plus your custom input)" : ""} without
            recording anything. <strong>Submit</strong> judges against the full suite —
            including hidden tests — and logs the attempt.
          </p>
        )}
      </div>
    </div>
  );
}
