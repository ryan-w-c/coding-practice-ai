"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useStore, loadProgress, loadNext, openProblem, toggleTheme,
  type ProblemProgress,
} from "@/lib/store";
import { computeXp, computeLevel, xpIntoLevel, xpToNextLevel } from "@/lib/gamify";

const DIFF: Record<string, string> = { E: "Easy", M: "Med", H: "Hard" };
const DIFF_LONG: Record<string, string> = { E: "Easy", M: "Medium", H: "Hard" };

const VERDICT_LABEL: Record<string, string> = {
  accepted: "✓ Accepted",
  wrong: "✗ Wrong",
  tle: "✗ TLE",
};

function masteryColor(v: number): string {
  if (v >= 70) return "var(--green)";
  if (v >= 45) return "var(--amber)";
  return "var(--red)";
}

function fmtDate(s: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function Bar({ pct, color, size }: { pct: number; color: string; size: "stat" | "pattern" }) {
  return (
    <div className={`bar-track ${size}`} title={`${pct}%`}>
      <div className="bar-fill" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
    </div>
  );
}

export default function Dashboard() {
  const progress = useStore((s) => s.progress);
  const loading = useStore((s) => s.loadingProgress);
  const rec = useStore((s) => s.recommendation);
  const theme = useStore((s) => s.theme);
  const gamify = useStore((s) => s.gamify);
  const [q, setQ] = useState("");
  const [patternFilter, setPatternFilter] = useState<string | null>(null);
  const [problemFilter, setProblemFilter] = useState<"all" | "due" | "attempted">("all");

  useEffect(() => {
    void loadProgress();
    void loadNext();
  }, []);

  const patternName = useMemo(() => {
    const m = new Map<string, string>();
    progress?.patterns.forEach((p) => m.set(p.id, p.name));
    return m;
  }, [progress]);

  const rows = useMemo(() => {
    let list: ProblemProgress[] = progress?.problems ?? [];
    if (patternFilter) list = list.filter((p) => p.patternId === patternFilter);
    if (problemFilter === "due") list = list.filter((p) => p.due);
    if (problemFilter === "attempted") list = list.filter((p) => p.attempts > 0);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(s));
    }
    return [...list].sort((a, b) => {
      if (a.due !== b.due) return a.due ? -1 : 1;
      const at = a.lastAttemptedAt ? Date.parse(a.lastAttemptedAt) : 0;
      const bt = b.lastAttemptedAt ? Date.parse(b.lastAttemptedAt) : 0;
      if (at !== bt) return bt - at;
      return a.title.localeCompare(b.title);
    });
  }, [progress, patternFilter, problemFilter, q]);

  const h = progress?.header;
  const totalTarget = progress?.patterns.reduce((n, p) => n + p.targetCount, 0) || 150;
  const acceptedPct = h ? Math.round((h.totalAccepted / totalTarget) * 100) : 0;
  const acceptanceRate = h && h.totalAttempts > 0 ? Math.round((h.totalAccepted / h.totalAttempts) * 100) : 0;

  const xp = h ? computeXp(h.totalAccepted, h.totalAttempts) : 0;
  const level = computeLevel(xp);
  const levelPct = Math.round((xpIntoLevel(xp) / 150) * 100);

  const recRow = rec?.problemId ? progress?.problems.find((p) => p.id === rec.problemId) : undefined;

  return (
    <div className="dash">
      <div className="appbar">
        <div className="appbar-brand">
          <div className="appbar-logo">‹›</div>
          <span className="appbar-title">Interview Trainer</span>
          <span className="appbar-pill">NeetCode 150</span>
        </div>
        <div className="appbar-actions">
          <div className="streak-pill">
            <span className="flame">🔥</span>
            <b>{h?.streak ?? 0}</b>
            <span>day streak</span>
          </div>
          <button className="pill-btn" onClick={() => toggleTheme()}>
            <span>◐</span>{theme === "dark" ? "Light" : "Dark"}
          </button>
          <div className="avatar">🙂</div>
        </div>
      </div>

      <div className="dash-body">
        <div className="hero-grid">
          <div className="hero-card">
            <div className="hero-glow" />
            <div className="hero-content">
              <div className="hero-eyebrow">
                <span className="dot" />
                {rec?.problemId ? (rec.dueSince ? "Up next · review due" : "Up next") : "Up next"}
              </div>
              {rec?.problemId ? (
                <>
                  <div className="hero-title">{rec.title}</div>
                  <div className="hero-badges">
                    {recRow && <span className={`diff-chip ${recRow.difficulty}`}>{DIFF_LONG[recRow.difficulty]}</span>}
                    <span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
                      {rec.patternId ? patternName.get(rec.patternId) : ""}
                    </span>
                  </div>
                  <div className="hero-desc">{rec.reason}</div>
                  <div className="hero-cta-row">
                    <button className="hero-cta" onClick={() => void openProblem(rec.problemId!)}>
                      Start solving →
                    </button>
                    {recRow && recRow.attempts > 0 && (
                      <span className="hero-meta">
                        {recRow.attempts} attempt{recRow.attempts === 1 ? "" : "s"}
                        {recRow.lastOutcome ? ` · last verdict ${VERDICT_LABEL[recRow.lastVerdict ?? ""] ?? recRow.lastOutcome}` : ""}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="hero-desc" style={{ marginTop: 10 }}>{rec?.reason ?? "Loading…"}</div>
              )}
            </div>
          </div>

          {gamify && (
            <div className="level-card">
              <div className="level-ring" style={{ background: `conic-gradient(var(--accent) ${levelPct}%, var(--surface-3) 0)` }}>
                <div className="level-ring-inner">
                  <div className="level-ring-label">LEVEL</div>
                  <div className="level-ring-number">{level}</div>
                </div>
              </div>
              <div className="level-xp">
                <b>{xpIntoLevel(xp)}</b> / 150 XP
                <div className="level-xp-sub">{xpToNextLevel(xp)} XP to Level {level + 1}</div>
              </div>
            </div>
          )}
        </div>

        <div className="stat-grid">
          <div className="stat-chip">
            <div className="stat-chip-label">Accepted</div>
            <div className="stat-chip-value">
              <span className="n">{h?.totalAccepted ?? 0}</span>
              <span className="of">/ {totalTarget}</span>
            </div>
            <Bar pct={acceptedPct} color="var(--green)" size="stat" />
          </div>
          <div className="stat-chip">
            <div className="stat-chip-label">Current streak</div>
            <div className="stat-chip-value">
              <span className="n" style={{ color: "var(--streak)" }}>{h?.streak ?? 0}</span>
              <span className="flame">🔥</span>
            </div>
            <div className="stat-chip-sub">Best: {h?.bestStreak ?? 0} days</div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip-label">Due for review</div>
            <div className="stat-chip-value">
              <span className="n" style={{ color: "var(--amber)" }}>{h?.reviewBacklog ?? 0}</span>
              <span className="of">problems</span>
            </div>
            <div className="stat-chip-sub">Spaced repetition</div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip-label">Total attempts</div>
            <div className="stat-chip-value">
              <span className="n">{h?.totalAttempts ?? 0}</span>
            </div>
            <div className="stat-chip-sub">{acceptanceRate}% acceptance</div>
          </div>
        </div>

        <div className="section-head">
          <span className="section-head-title">Patterns</span>
          <div className="legend">
            <span className="legend-item"><span className="legend-dot" style={{ background: "var(--accent)" }} />Breadth</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: "var(--green)" }} />Mastery</span>
          </div>
        </div>
        <div className="card patterns-card">
          <div className="grid-row-head">
            <span>Pattern</span><span>Breadth</span><span>Mastery</span><span style={{ textAlign: "right" }}>Due</span>
          </div>
          {progress?.patterns.map((p) => (
            <div
              key={p.id}
              className="pattern-row"
              onClick={() => setPatternFilter(patternFilter === p.id ? null : p.id)}
              style={patternFilter === p.id ? { background: "var(--surface-2)" } : undefined}
            >
              <div className="name">{p.name} <span className="ratio">{p.accepted}/{p.targetCount}</span></div>
              <Bar pct={p.breadthPct} color="var(--accent)" size="pattern" />
              <Bar pct={p.masteryPct} color={masteryColor(p.masteryPct)} size="pattern" />
              <div style={{ textAlign: "right", fontSize: 12.5, fontWeight: 700, color: p.dueCount ? "var(--amber)" : "var(--faint)" }}>
                {p.dueCount || ""}
              </div>
            </div>
          ))}
        </div>

        <div className="section-head">
          <span className="section-head-title">Problems</span>
          <div className="search-box">
            <span>⌕</span>
            <input placeholder="Search problems…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {patternFilter && (
            <button className="btn" onClick={() => setPatternFilter(null)}>
              clear filter: {patternName.get(patternFilter)}
            </button>
          )}
          {loading && <span className="muted">refreshing…</span>}
          <div className="filter-pills">
            <span className={`filter-pill ${problemFilter === "all" ? "active" : ""}`} onClick={() => setProblemFilter("all")}>All</span>
            <span className={`filter-pill ${problemFilter === "due" ? "active" : ""}`} onClick={() => setProblemFilter("due")}>
              Due {h?.reviewBacklog ?? 0}
            </span>
            <span className={`filter-pill ${problemFilter === "attempted" ? "active" : ""}`} onClick={() => setProblemFilter("attempted")}>Attempted</span>
          </div>
        </div>
        <div className="card problems-card">
          <div className="grid-row-head">
            <span>Problem</span><span>Diff</span><span style={{ textAlign: "right" }}>Tries</span>
            <span>Last result</span><span style={{ textAlign: "center" }}>AI</span><span>Attempted</span><span>Next</span>
          </div>
          {rows.map((p) => (
            <div key={p.id} className="problem-row" onClick={() => void openProblem(p.id)}>
              <div className="title">{p.title} <span className="pattern-tag">· {patternName.get(p.patternId)}</span></div>
              <div><span className={`diff-chip ${p.difficulty}`}>{DIFF[p.difficulty]}</span></div>
              <div style={{ textAlign: "right", color: "var(--muted)", fontWeight: 600 }}>{p.attempts || ""}</div>
              <div>
                {p.lastOutcome ? (
                  <span className={`verdict-chip ${p.accepted ? "accepted" : p.lastVerdict}`}>
                    {p.accepted ? "✓ " + p.lastOutcome : "✗ " + p.lastVerdict}
                  </span>
                ) : <span className="verdict-chip none">—</span>}
              </div>
              <div style={{ textAlign: "center" }}>{p.usedAi ? "🤖" : ""}</div>
              <div className="muted" style={{ fontSize: 12, fontWeight: 600 }}>{fmtDate(p.lastAttemptedAt)}</div>
              <div>
                {p.due ? <span className="next-due due">due</span> : <span className="next-due">{fmtDate(p.nextReviewAt)}</span>}
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="muted" style={{ padding: 18 }}>No problems match.</div>
          )}
        </div>
      </div>
    </div>
  );
}
