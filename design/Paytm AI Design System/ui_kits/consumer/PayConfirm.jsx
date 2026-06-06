// PayConfirm — a payment confirmation that the AI flags as risky. Shows
// the AIRiskAlert, an explainability panel and decision actions. Demonstrates
// the trust layer in a real UPI confirmation context.

function PayConfirm({ onClose, onBlocked }) {
  const [decision, setDecision] = React.useState(null); // null | "blocked" | "proceeded"

  if (decision) {
    const blocked = decision === "blocked";
    return (
      <div style={{ height: "100%", background: "#fff", display: "flex", flexDirection: "column" }}>
        <FlowHeader title="Payment" onBack={onClose} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center" }}>
          <IconCircle icon={blocked ? "shield-check" : "check-circle"} size={72}
            bg={blocked ? "var(--success-tint)" : "var(--paytm-blue-050)"}
            color={blocked ? "var(--success)" : "var(--paytm-blue)"} iconSize={36} />
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink-900)" }}>
            {blocked ? "Payment blocked" : "Payment sent"}
          </div>
          <div style={{ fontSize: 14, color: "var(--ink-600)", maxWidth: 260, lineHeight: 1.5 }}>
            {blocked
              ? "We stopped this transfer and reported the payee. Your ₹4,000 is safe."
              : "₹4,000 sent. We'll keep an eye on this payee for you."}
          </div>
          <Button variant="primary" size="lg" onClick={onClose} style={{ marginTop: 8 }}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", background: "var(--bg-page)", display: "flex", flexDirection: "column" }}>
      <FlowHeader title="Confirm payment" onBack={onClose} />
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* payee summary */}
        <div className="pt-cardshell" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar initials="RK" bg="#E75555" size={44} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>Rohit Kumar</div>
            <div style={{ fontSize: 12, color: "var(--ink-500)" }}>rohitk@paytm · new payee</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--ink-900)" }} className="tnum">₹4,000</div>
        </div>

        <AIRiskAlert
          severity="high"
          title="This looks like a scam request"
          body="This payee was reported 14 times this week. Paytm never asks you to pay to receive a refund or prize."
          confidence="high"
          primaryLabel="Block & report"
          secondaryLabel="Proceed anyway"
          onPrimary={() => setDecision("blocked")}
          onSecondary={() => setDecision("proceeded")}
        />

        <AIExplainabilityPanel
          reason="We flagged this because the payee is new to you and the request matches a known refund-scam pattern."
          factors={[
            { name: "Payee reported by others", weight: 88 },
            { name: "First time paying this number", weight: 64 },
            { name: "Matches refund-scam wording", weight: 71 },
          ]}
          confidenceLabel="Based on community reports & your history"
        />
      </div>
    </div>
  );
}

function FlowHeader({ title, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#fff", boxShadow: "0 1px 0 var(--line-200)" }}>
      <button onClick={onBack} aria-label="Back" style={{ border: 0, background: "transparent", cursor: "pointer", color: "var(--ink-800)", display: "grid", placeItems: "center" }}>
        <Icon name="arrow-left" size={22} />
      </button>
      <span style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-900)" }}>{title}</span>
    </div>
  );
}
