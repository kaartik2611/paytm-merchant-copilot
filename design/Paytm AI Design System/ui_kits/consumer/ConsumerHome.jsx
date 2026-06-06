// ConsumerHome — Paytm consumer app home with the AI layer woven in.
// Recreates the real Paytm home language (gradient header, UPI money-
// transfer card, service tiles, hairline cards) and adds an "AI for you"
// section + a Copilot FAB. Uses the brand asset PNGs copied from the
// source Figma file. Component primitives are in global scope.

function HomeHeader({ onSearch }) {
  return (
    <div style={{ background: "linear-gradient(180deg, var(--paytm-header-from), var(--paytm-header-to))", padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
      <Avatar initials="SR" bg="#F26464" size={34} />
      <img src="../../assets/paytm-logo.png" alt="Paytm" style={{ height: 22, filter: "brightness(0) invert(1)", margin: "0 auto" }} />
      <button onClick={onSearch} aria-label="Search" style={{ border: 0, background: "rgba(255,255,255,.25)", width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", color: "#fff", cursor: "pointer" }}>
        <Icon name="search" size={17} />
      </button>
      <span style={{ background: "rgba(255,255,255,.25)", width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", color: "#fff" }}>
        <Icon name="message-circle" size={17} />
      </span>
    </div>
  );
}

function MoneyTransfer() {
  const items = [
    { icon: "scan", label: "Scan & Pay" },
    { icon: "indian-rupee", label: "To Mobile" },
    { icon: "user", label: "To Self" },
    { icon: "wallet", label: "To Bank" },
  ];
  return (
    <div className="pt-cardshell" style={{ padding: 14, marginBottom: 12 }}>
      <SectionHeader title="UPI Money Transfer" action="History" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 14 }}>
        {items.map((it) => (
          <div key={it.label} style={{ textAlign: "center" }}>
            <IconCircle icon={it.icon} size={46} bg="var(--paytm-blue-050)" color="var(--paytm-navy-800)" style={{ boxShadow: "inset 0 0 0 1px var(--paytm-blue-100)" }} />
            <div style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-800)", marginTop: 6 }}>{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConsumerHome({ onOpenCopilot, onPay }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg-page)" }}>
      <HomeHeader onSearch={onOpenCopilot} />
      <div style={{ flex: 1, overflowY: "auto", padding: 14, paddingBottom: 80 }}>
        <MoneyTransfer />

        {/* AI for you */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 2px 12px" }}>
          <AIAvatar size={24} soft />
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-900)" }}>AI for you</span>
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "var(--paytm-blue)" }}>See all</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <AIInsightCard
            title="Food spends are up this month"
            value="₹8,420"
            delta={{ dir: "up", text: "18% vs last month" }}
            trend={[5, 7, 6, 9, 8, 12, 14]}
            confidence="high"
            onWhy={onOpenCopilot}
          />
          <AIRecommendationCard
            icon="piggy-bank"
            title="Move ₹5,000 to a Fixed Deposit"
            body="Your balance has stayed above ₹20,000 for 3 months. Earn more without locking everything in."
            impact="Earn ~₹375 / year"
            confidence="medium"
            acceptLabel="Open FD"
            onAccept={onPay}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <button onClick={onPay} className="pt-btn pt-btn--secondary pt-btn--md pt-btn--block">
            <Icon name="indian-rupee" size={16} /> Simulate a risky payment
          </button>
        </div>
      </div>

      {/* Copilot FAB */}
      <button onClick={onOpenCopilot} aria-label="Open Paytm AI" style={{ position: "absolute", right: 16, bottom: 74, width: 56, height: 56, borderRadius: "50%", border: 0, background: "var(--ai-sheen)", boxShadow: "var(--elev-fab)", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer" }}>
        <Icon name="sparkles" size={26} />
      </button>

      {/* Bottom nav */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 58, background: "#fff", boxShadow: "0 -1px 0 var(--line-200)", display: "grid", gridTemplateColumns: "repeat(4,1fr)", alignItems: "center" }}>
        {[["wallet", "Balance"], ["scan", "Scan"], ["bar-chart", "History"], ["user", "Profile"]].map(([ic, l], i) => (
          <div key={l} style={{ textAlign: "center", color: i === 0 ? "var(--paytm-blue)" : "var(--ink-500)" }}>
            <Icon name={ic} size={20} />
            <div style={{ fontSize: 10, fontWeight: 600, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
