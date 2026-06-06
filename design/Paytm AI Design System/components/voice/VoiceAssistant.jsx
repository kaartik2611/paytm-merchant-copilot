import React from "react";
import { Icon } from "../core/Icon.jsx";

const COPY = {
  idle:       { status: "Tap to speak", hint: "Try \"Send ₹500 to Mom\" or \"What's my balance?\"" },
  listening:  { status: "Listening…", hint: "Speak now — tap again to stop" },
  processing: { status: "Working on it…", hint: "Understanding your request" },
  responding: { status: "Here you go", hint: "" },
};

function Wave({ active }) {
  const bars = [10, 18, 26, 16, 22, 12, 20, 14];
  return (
    <div className="ai-voice__wave" aria-hidden="true">
      {bars.map((h, i) => (
        <i key={i} style={{
          height: active ? h : 4,
          transition: "height .3s var(--ease-standard)",
          opacity: active ? 1 : .4,
        }} />
      ))}
    </div>
  );
}

/**
 * VoiceAssistant — voice-first surface for both consumer (send money,
 * balance, transaction search) and merchant (sales / inventory / business
 * questions). Drives four states: idle, listening, processing, responding.
 * Uncontrolled by default — tap the orb to walk the demo cycle; pass
 * `state` + `onStateChange` to control it.
 */
export function VoiceAssistant({
  state: controlled,
  onStateChange,
  transcript,
  response,
  audience = "consumer",
  className = "",
  style = {},
}) {
  const [internal, setInternal] = React.useState("idle");
  const state = controlled || internal;
  const copy = COPY[state] || COPY.idle;

  const demoTranscript = transcript ||
    (audience === "merchant" ? "How were my sales yesterday?" : "Send ₹500 to Mom");
  const demoResponse = response ||
    (audience === "merchant"
      ? "You made ₹24,380 across 96 orders yesterday — 12% up on Tuesday."
      : "Ready to send ₹500 to Mom from your KVB account. Confirm?");

  function setState(s) {
    if (onStateChange) onStateChange(s);
    if (!controlled) setInternal(s);
  }

  function cycle() {
    const next = { idle: "listening", listening: "processing", processing: "responding", responding: "idle" }[state];
    setState(next);
    if (state === "listening") setTimeout(() => setState("responding"), 1100);
  }

  return (
    <div className={["ai-voice", className].filter(Boolean).join(" ")} style={style}>
      <button
        onClick={cycle}
        aria-label={copy.status}
        className={["ai-orb", state === "listening" ? "ai-orb--listening" : "", state === "processing" ? "ai-orb--processing" : ""].filter(Boolean).join(" ")}
        style={{ border: 0, background: "transparent", cursor: "pointer", padding: 0 }}
      >
        {state === "listening" && <><span className="ai-orb__ring" /><span className="ai-orb__ring r2" /></>}
        <span className="ai-orb__core">
          <Icon name={state === "responding" ? "check" : "mic"} size={40} strokeWidth={2} />
        </span>
      </button>

      {(state === "listening" || state === "processing") && <Wave active={state === "listening"} />}

      {(state === "listening" || state === "responding") && (
        <div className="ai-voice__transcript">
          {state === "responding" ? demoResponse : demoTranscript}
        </div>
      )}

      <div style={{ textAlign: "center" }}>
        <div className="ai-voice__status">{copy.status}</div>
        {copy.hint && <div className="ai-voice__hint" style={{ marginTop: 6 }}>{copy.hint}</div>}
      </div>
    </div>
  );
}
