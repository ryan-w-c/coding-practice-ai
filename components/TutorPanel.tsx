"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useStore, sendTutor, type TutorMode } from "@/lib/store";

const MODES: { mode: Exclude<TutorMode, "chat">; label: string; needsProblem: boolean }[] = [
  { mode: "hint", label: "Hint", needsProblem: true },
  { mode: "explain_pattern", label: "Explain pattern", needsProblem: true },
  { mode: "review", label: "Review", needsProblem: true },
  { mode: "pick_next", label: "Pick next", needsProblem: false },
];

export default function TutorPanel() {
  const chat = useStore((s) => s.chat);
  const streaming = useStore((s) => s.tutorStreaming);
  const problem = useStore((s) => s.problem);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [chat]);

  const submit = () => {
    const t = text.trim();
    if (!t || streaming) return;
    setText("");
    void sendTutor("chat", t);
  };

  return (
    <div className="panel">
      <div className="tutor-chips">
        {MODES.map((m) => (
          <button
            key={m.mode}
            className="tutor-chip"
            disabled={streaming || (m.needsProblem && !problem)}
            onClick={() => void sendTutor(m.mode)}
            title={m.needsProblem && !problem ? "Load a problem first" : undefined}
          >
            {m.mode === "hint" ? "💡 Hint" : m.label}
          </button>
        ))}
      </div>

      <div className="panel-body" ref={scrollRef}>
        {chat.length === 0 && (
          <p className="muted">
            Ask the tutor anything, or use a mode button. It sees the current
            problem, your code, and which tests failed.
          </p>
        )}
        {chat.map((m, i) => (
          <div key={i} className="tutor-turn">
            <div
              className="tutor-turn-role"
              style={{ color: m.role === "user" ? "var(--accent)" : "var(--muted)" }}
            >
              {m.role === "user" ? "You" : "Tutor"}
            </div>
            {m.role === "assistant" ? (
              <div className="md">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content || (streaming && i === chat.length - 1 ? "…" : "")}
                </ReactMarkdown>
              </div>
            ) : (
              <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 13.5 }}>
                {m.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="tutor-composer">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask the tutor… (Enter to send, Shift+Enter for newline)"
          rows={2}
        />
        <button className="btn primary" disabled={streaming || !text.trim()} onClick={submit}>
          Send
        </button>
      </div>
    </div>
  );
}
