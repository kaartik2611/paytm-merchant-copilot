import React from "react";
import { AIAvatar } from "../ai/AIAvatar.jsx";
import { Icon } from "../core/Icon.jsx";
import { Chip } from "../core/Chip.jsx";

function Typing() {
  return <span className="ai-typing"><i /><i /><i /></span>;
}

/**
 * CopilotChat — the Paytm AI Copilot conversation surface. Works as a
 * full-height mobile sheet or a web side-panel (`surface`). Renders
 * conversation history, a typing indicator, suggested prompts and the
 * composer. Replies are simulated via `getReply` (swap for a real call).
 */
export function CopilotChat({
  title = "Paytm AI",
  subtitle = "Your money assistant",
  surface = "mobile",                 // "mobile" | "web"
  initialMessages,
  suggestedPrompts = [
    "Where did my money go this month?",
    "Pay my electricity bill",
    "Did I get my refund?",
  ],
  quickActions = [
    { icon: "scan", label: "Scan" },
    { icon: "indian-rupee", label: "Pay" },
    { icon: "wallet", label: "Balance" },
  ],
  getReply,
  onClose,
  className = "",
  style = {},
}) {
  const [messages, setMessages] = React.useState(
    initialMessages || [
      { from: "assistant", text: "Hi Sahil 👋 I can help you pay, track spending or spot anything unusual. What's on your mind?" },
    ]
  );
  const [draft, setDraft] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const streamRef = React.useRef(null);

  React.useEffect(() => {
    const el = streamRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const fallbackReply = (q) =>
    "Here's what I found. You spent ₹8,420 on food this month — about 18% more than last month. Want me to set a budget?";

  function send(text) {
    const t = (text != null ? text : draft).trim();
    if (!t) return;
    setMessages((m) => [...m, { from: "user", text: t }]);
    setDraft("");
    setThinking(true);
    const reply = getReply ? getReply(t) : fallbackReply(t);
    setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, { from: "assistant", text: reply }]);
    }, 900);
  }

  return (
    <div className={["ai-chat", className].filter(Boolean).join(" ")} style={{ borderRadius: surface === "web" ? "var(--r-lg)" : 0, overflow: "hidden", ...style }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "#fff", boxShadow: "0 1px 0 var(--line-200)" }}>
        <AIAvatar size={36} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "var(--fs-md)", fontWeight: 700, color: "var(--ink-900)", lineHeight: 1.2 }}>{title}</div>
          <div style={{ fontSize: "var(--fs-xs)", color: "var(--success)", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} /> {subtitle}
          </div>
        </div>
        <button onClick={onClose} aria-label="Close" style={{ border: 0, background: "var(--line-100)", width: 32, height: 32, borderRadius: "50%", display: "grid", placeItems: "center", cursor: "pointer", color: "var(--ink-600)" }}>
          <Icon name="x" size={18} />
        </button>
      </div>

      {/* stream */}
      <div className="ai-chat__stream" ref={streamRef}>
        {messages.map((m, i) =>
          m.from === "assistant" ? (
            <div className="ai-bubble__row" key={i}>
              <AIAvatar size={26} soft />
              <div className="ai-bubble ai-bubble--assistant">{m.text}</div>
            </div>
          ) : (
            <div className="ai-bubble ai-bubble--user" key={i}>{m.text}</div>
          )
        )}
        {thinking && (
          <div className="ai-bubble__row">
            <AIAvatar size={26} soft />
            <div className="ai-bubble ai-bubble--assistant"><Typing /></div>
          </div>
        )}
      </div>

      {/* suggested prompts */}
      {messages.length <= 1 && (
        <div className="ai-chat__prompts">
          {suggestedPrompts.map((p, i) => (
            <Chip key={i} variant="ai" icon={i === 0 ? "sparkle" : undefined} onClick={() => send(p)}>{p}</Chip>
          ))}
        </div>
      )}

      {/* composer */}
      <div className="ai-chat__composer">
        <button aria-label="Voice" style={{ border: 0, background: "transparent", color: "var(--paytm-blue)", cursor: "pointer", display: "grid", placeItems: "center", width: 28 }}>
          <Icon name="mic" size={22} />
        </button>
        <input
          className="ai-chat__input"
          placeholder="Ask Paytm AI anything…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        />
        <button className="ai-chat__send" disabled={!draft.trim()} onClick={() => send()} aria-label="Send">
          <Icon name="arrow-up-right" size={20} />
        </button>
      </div>
    </div>
  );
}
