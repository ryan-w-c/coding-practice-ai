"use client";

import { useStore, selectProblem } from "@/lib/store";

const DIFF_LABEL: Record<string, string> = { E: "Easy", M: "Medium", H: "Hard" };

// Render the plain-text statement with formatted Examples (Input/Output) and
// Constraints. Description lines are reflowed into paragraphs.
function StatementView({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) {
      out.push(<p key={out.length} className="st-p">{para.join(" ")}</p>);
      para = [];
    }
  };
  for (const raw of text.split("\n")) {
    const t = raw.trim();
    if (!t) { flush(); continue; }
    if (/^example\s*\d*\s*:?$/i.test(t)) {
      flush();
      out.push(<div key={out.length} className="st-title">{t.replace(/:$/, "")}</div>);
      continue;
    }
    const io = t.match(/^(Input|Output|Explanation)\s*:\s*(.*)$/i);
    if (io) {
      flush();
      out.push(
        <div key={out.length} className="st-io">
          <span className="st-io-label">{io[1]}</span>
          {io[2] ? <code>{io[2]}</code> : null}
        </div>,
      );
      continue;
    }
    if (/^constraints\s*:?$/i.test(t)) {
      flush();
      out.push(<div key={out.length} className="st-title">Constraints</div>);
      continue;
    }
    const b = t.match(/^[-*•]\s+(.*)$/);
    if (b) {
      flush();
      out.push(<div key={out.length} className="st-bullet">{b[1]}</div>);
      continue;
    }
    para.push(t);
  }
  flush();
  return <div className="statement">{out}</div>;
}

export default function ProblemPanel() {
  const patterns = useStore((s) => s.patterns);
  const problem = useStore((s) => s.problem);
  const problemId = useStore((s) => s.problemId);
  const loading = useStore((s) => s.loadingProblem);

  return (
    <div className="panel">
      <div className="toolbar">
        <select
          className="problem-select"
          value={problemId ?? ""}
          onChange={(e) => selectProblem(e.target.value)}
        >
          <option value="" disabled>
            Select a problem…
          </option>
          {patterns.map((p) => (
            <optgroup
              key={p.id}
              label={`${p.name} (${p.problems.length}/${p.targetCount})`}
            >
              {p.problems.map((pr) => (
                <option key={pr.id} value={pr.id}>
                  {pr.title} · {DIFF_LABEL[pr.difficulty]}
                  {pr.judged ? "" : " · run-only"}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="panel-body">
        {!problem && !loading && (
          <p className="muted">
            Pick a problem to load its starter code into the editor.
          </p>
        )}
        {loading && <p className="muted">Loading…</p>}
        {problem && (
          <>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
              <span className={`diff-chip ${problem.difficulty}`}>
                {DIFF_LABEL[problem.difficulty]}
              </span>
              <span className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>{problem.pattern.name}</span>
              {!problem.judged && (
                <span className="badge run-only">run-only (no test suite)</span>
              )}
            </div>
            <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>{problem.title}</h2>

            {problem.statement ? (
              <StatementView text={problem.statement} />
            ) : (
              <p className="muted" style={{ marginTop: 0 }}>
                The full prose statement lives on the source site.
              </p>
            )}
            <p style={{ marginTop: 10 }}>
              <a href={problem.url} target="_blank" rel="noreferrer">
                Open problem statement ↗
              </a>
            </p>

            <div className="judging-note">
              <p className="section-title" style={{ margin: "0 0 6px" }}>How judging works</p>
              <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>
                {problem.judged ? (
                  <>
                    <strong style={{ color: "var(--text)" }}>Submit</strong> copies the vendored test suite, injects
                    your code, and runs <code>bun test</code> for a true pass/fail
                    verdict including edge cases.
                  </>
                ) : (
                  <>
                    This problem has no vendored test suite, so <strong style={{ color: "var(--text)" }}>Submit</strong>{" "}
                    can&apos;t judge it. Use <strong style={{ color: "var(--text)" }}>Run</strong> to execute scratch
                    code.
                  </>
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
