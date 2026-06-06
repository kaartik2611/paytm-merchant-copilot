// MerchantDashboard — "Paytm for Business" web dashboard with the AI layer.
// Shows today's collections, AI business insights & recommendations, a voice
// query, and a docked Copilot web panel. Demonstrates the AI system on the
// merchant / business surface. Component primitives are in global scope.

function TopBar({ onVoice }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 22px", height: 58, background: "#fff", boxShadow: "0 1px 0 var(--line-200)" }}>
      <img src="../../assets/paytm-logo.png" alt="Paytm" style={{ height: 22 }} />
      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-700)", borderLeft: "1px solid var(--line-200)", paddingLeft: 14 }}>for Business</span>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        <Button variant="secondary" size="md" icon="mic" onClick={onVoice}>Ask by voice</Button>
        <Avatar initials="BK" bg="#E75555" size={34} />
      </div>
    </div>
  );
}

function Stat({ label, value, delta, dir }) {
  return (
    <div className="pt-cardshell" style={{ padding: 16, flex: 1 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-500)" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "var(--ink-900)", marginTop: 6 }} className="tnum">{value}</div>
      {delta && (
        <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: dir === "up" ? "var(--success)" : "var(--danger)", display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name={dir === "up" ? "trending-up" : "trending-down"} size={14} strokeWidth={2.4} /> {delta}
        </div>
      )}
    </div>
  );
}

function MerchantDashboard({ onOpenCopilot, onVoice }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg-page)" }}>
      <TopBar onVoice={onVoice} />
      <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--ink-900)" }}>Good morning, Burger King</div>
            <div style={{ fontSize: 13, color: "var(--ink-500)" }}>Connaught Place · Today, 5 Jun</div>
          </div>
          <Button variant="primary" size="md" icon="sparkles" onClick={onOpenCopilot} style={{ marginLeft: "auto" }}>Ask Paytm AI</Button>
        </div>

        {/* stats */}
        <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
          <Stat label="Today's collections" value="₹24,380" delta="12% vs Tue" dir="up" />
          <Stat label="Orders" value="96" delta="9% vs Tue" dir="up" />
          <Stat label="Avg. order" value="₹254" delta="3% vs Tue" dir="down" />
          <Stat label="Settlement" value="₹1,18,900" />
        </div>

        {/* AI grid */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 2px 12px" }}>
          <AIAvatar size={24} soft />
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-900)" }}>AI for your business</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <AIInsightCard
            eyebrow="Business insight"
            title="Fridays are your peak — staff up"
            value="₹38,200"
            delta={{ dir: "up", text: "Fri avg vs ₹24k weekday" }}
            trend={[6, 7, 8, 7, 12, 14, 9]}
            category="growth"
            confidence="high"
            onWhy={onOpenCopilot}
          />
          <AIRecommendationCard
            icon="package"
            iconBg="var(--warning-tint)"
            iconColor="var(--warning)"
            title="Reorder buns before the weekend"
            body="At current pace you'll run out of buns by Saturday lunch — your busiest slot."
            impact="Avoid ~₹6,000 in missed orders"
            confidence="high"
            acceptLabel="Add to reorder"
          />
          <AIRecommendationCard
            icon="trending-up"
            iconBg="var(--success-tint)"
            iconColor="var(--success)"
            title="Run a combo offer at 7–9 PM"
            body="Evening footfall is high but average order dips. A combo could lift it."
            impact="Lift avg order ~₹40"
            confidence="medium"
            acceptLabel="Create offer"
          />
          <AIRiskAlert
            severity="medium"
            title="3 settlements are delayed"
            body="₹18,400 across 3 orders is pending from your bank longer than usual. We're tracking it."
            confidence="medium"
            primaryLabel="View details"
            secondaryLabel="Remind me later"
          />
        </div>
      </div>
    </div>
  );
}
