// app — orchestrates the consumer kit: home, a sliding Copilot sheet, and
// the risky-payment flow. Mounted by index.html.

function ConsumerApp() {
  const [copilot, setCopilot] = React.useState(false);
  const [screen, setScreen] = React.useState("home"); // "home" | "pay"

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "var(--bg-page)" }}>
      {screen === "home" && (
        <ConsumerHome onOpenCopilot={() => setCopilot(true)} onPay={() => setScreen("pay")} />
      )}
      {screen === "pay" && <PayConfirm onClose={() => setScreen("home")} />}

      {/* Copilot sheet */}
      <div style={{
        position: "absolute", inset: 0, background: "rgba(10,14,26,.38)",
        opacity: copilot ? 1 : 0, pointerEvents: copilot ? "auto" : "none",
        transition: "opacity var(--dur-normal) var(--ease-standard)", zIndex: 20,
      }} onClick={() => setCopilot(false)} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: "86%",
        transform: copilot ? "translateY(0)" : "translateY(100%)",
        transition: "transform var(--dur-slow) var(--ease-out)", zIndex: 21,
        borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: "hidden",
        boxShadow: "var(--elev-3)",
      }}>
        <CopilotChat surface="mobile" onClose={() => setCopilot(false)} />
      </div>
    </div>
  );
}
