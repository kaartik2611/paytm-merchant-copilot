# Consumer App — UI kit

A high-fidelity recreation of the **Paytm consumer app home** with the AI
extension layer woven in, built on the real Paytm visual language (gradient
header, UPI money-transfer card, hairline service cards) using brand assets
copied from the source Figma file.

`index.html` is a **self-contained interactive phone** (it inlines the design-
system components so it runs anywhere, not just the Design System tab). The
factored source lives alongside it.

## Flow
- **Home** — gradient header (Paytm logo, avatar, search, chat), UPI transfer
  tiles, and an **"AI for you"** section with `AIInsightCard` + `AIRecommendationCard`.
- **Copilot sheet** — tap the floating sparkle FAB (or search) to slide up the
  `CopilotChat` mobile sheet. Type a message to get a simulated reply.
- **Risky payment** — "Simulate a risky payment" opens a UPI confirmation that
  the AI flags with an `AIRiskAlert` + `AIExplainabilityPanel`; Block or Proceed
  resolves to a result screen.

## Files
- `ConsumerHome.jsx` — header, money-transfer tiles, AI section, FAB, bottom nav
- `PayConfirm.jsx` — the fraud-flagged payment flow + result states
- `app.jsx` — screen + sheet orchestration
- `index.html` — compiled, runnable kit (regenerate by re-inlining the sources)
