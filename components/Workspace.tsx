"use client";

import {
  DockviewReact,
  type DockviewReadyEvent,
  type DockviewTheme,
  type IDockviewPanelHeaderProps,
  type IDockviewPanelProps,
} from "dockview";
import ProblemPanel from "@/components/ProblemPanel";
import EditorPanel from "@/components/EditorPanel";
import TutorPanel from "@/components/TutorPanel";
import { useStore, setView, loadProgress, toggleTheme, LANGUAGES, type Language } from "@/lib/store";

const DIFF_LONG: Record<string, string> = { E: "Easy", M: "Medium", H: "Hard" };

const components = {
  problem: (_props: IDockviewPanelProps) => <ProblemPanel />,
  editor: (_props: IDockviewPanelProps) => <EditorPanel />,
  tutor: (_props: IDockviewPanelProps) => <TutorPanel />,
};

const PANEL_DOT: Record<string, string> = {
  problem: "var(--amber)",
  editor: "var(--green)",
  tutor: "var(--accent)",
};

function PanelHeader(props: IDockviewPanelHeaderProps) {
  const language = useStore((s) => s.language);
  const id = props.api.id;
  const langLabel = LANGUAGES.find((l) => l.id === (language as Language))?.label ?? language;
  const title = id === "problem" ? "Problem" : id === "tutor" ? "AI Tutor" : `Solution · ${langLabel}`;
  return (
    <div className="panel-header">
      <span className="grip">⋮⋮</span>
      <span className="dot" style={{ background: PANEL_DOT[id] ?? "var(--muted)" }} />
      <span className="title">{title}</span>
    </div>
  );
}

const interviewTheme: DockviewTheme = {
  name: "interview",
  className: "dockview-theme-interview",
  gap: 12,
};

function onReady(event: DockviewReadyEvent) {
  const editor = event.api.addPanel({ id: "editor", component: "editor", title: "Editor" });
  event.api.addPanel({
    id: "problem", component: "problem", title: "Problem",
    position: { referencePanel: editor, direction: "left" },
  });
  event.api.addPanel({
    id: "tutor", component: "tutor", title: "Tutor",
    position: { referencePanel: editor, direction: "right" },
  });
  event.api.getPanel("problem")?.api.setSize({ width: 380 });
  event.api.getPanel("tutor")?.api.setSize({ width: 360 });
}

export default function Workspace() {
  const problem = useStore((s) => s.problem);
  const theme = useStore((s) => s.theme);

  return (
    <div className="ws-shell">
      <div className="ws-appbar">
        <button
          className="pill-btn"
          onClick={() => {
            setView("dashboard");
            void loadProgress();
          }}
        >
          ← Dashboard
        </button>
        <div className="ws-title-group">
          <span className="ws-title">{problem ? problem.title : "Select a problem"}</span>
          {problem && <span className={`diff-chip ${problem.difficulty}`}>{DIFF_LONG[problem.difficulty]}</span>}
        </div>
        <div className="appbar-actions">
          <span className="ws-helper">drag panel headers to rearrange · drag dividers to resize</span>
          <button className="icon-btn" onClick={() => toggleTheme()} title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
            ◐
          </button>
        </div>
      </div>
      <div className="ws-panels-row">
        <DockviewReact
          components={components}
          defaultTabComponent={PanelHeader}
          onReady={onReady}
          theme={interviewTheme}
        />
      </div>
    </div>
  );
}
