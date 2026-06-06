// app — merchant kit orchestration: dashboard with a docked Copilot web
// panel and a voice-query overlay. Mounted by index.html.

function MerchantApp() {
  const [copilot, setCopilot] = React.useState(false);
  const [voice, setVoice] = React.useState(false);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", display: "flex" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <MerchantDashboard onOpenCopilot={() => setCopilot(true)} onVoice={() => setVoice(true)} />
      </div>

      {/* Docked Copilot web panel */}
      <div style={{
        width: copilot ? 380 : 0,
        transition: "width var(--dur-slow) var(--ease-out)",
        overflow: "hidden", flex: "none",
        boxShadow: copilot ? "-8px 0 24px rgba(20,51,102,.10)" : "none",
        background: "#fff",
      }}>
        <div style={{ width: 380, height: "100%" }}>
          <CopilotChat
            surface="web"
            title="Paytm AI"
            subtitle="Business assistant"
            onClose={() => setCopilot(false)}
            suggestedPrompts={["How were sales this week?", "Which item is running low?", "Show pending settlements"]}
            initialMessages={[{ from: "assistant", text: "Hi! Ask me about your sales, settlements or inventory and I'll pull it up." }]}
            getReply={(q) => "Sales this week: ₹1,84,200 across 612 orders — up 9% on last week. Fridays are your peak day; evenings are your peak hours."}
          />
        </div>
      </div>

      {/* Voice overlay */}
      <div onClick={() => setVoice(false)} style={{
        position: "absolute", inset: 0, background: "rgba(10,14,26,.4)", zIndex: 30,
        display: voice ? "grid" : "none", placeItems: "center",
      }}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: 380, background: "#fff", borderRadius: 20, boxShadow: "var(--elev-3)", padding: "8px 8px 24px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setVoice(false)} aria-label="Close" style={{ border: 0, background: "var(--line-100)", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", color: "var(--ink-600)", display: "grid", placeItems: "center", margin: 8 }}>
              <Icon name="x" size={18} />
            </button>
          </div>
          <VoiceAssistant audience="merchant" />
        </div>
      </div>
    </div>
  );
}
