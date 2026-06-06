# Merchant Dashboard — UI kit

A high-fidelity **Paytm for Business** web dashboard with the AI extension layer,
in a browser frame. Demonstrates the AI system on the merchant / business surface
and the **web** form of the Copilot + Voice assistant.

`index.html` is **self-contained and interactive** (design-system components are
inlined so it runs anywhere).

## Flow
- **Dashboard** — "for Business" top bar, today's collections / orders / avg-order
  / settlement stats, and an **"AI for your business"** grid: a growth
  `AIInsightCard` (peak day), two `AIRecommendationCard`s (reorder stock, run a
  combo offer) and a medium `AIRiskAlert` (delayed settlements).
- **Copilot panel** — "Ask Paytm AI" docks the `CopilotChat` web panel on the
  right with business-specific prompts.
- **Voice** — "Ask by voice" opens the merchant `VoiceAssistant` overlay.

## Files
- `MerchantDashboard.jsx` — top bar, stat cards, AI business grid
- `app.jsx` — dashboard + docked Copilot panel + voice overlay
- `index.html` — compiled, runnable kit
