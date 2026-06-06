---
name: paytm-design
description: Use this skill to generate well-branded interfaces and assets for Paytm and the Paytm AI design language — production code or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, reusable AI components (Insight, Recommendation, Risk Alert, Explainability, Action, Copilot chat, Voice assistant) and full UI kits for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill first — it is the full design guide
(content fundamentals, visual foundations, iconography, and a manifest of every
file). Then explore the other files:

- `styles.css` + `tokens/` — the design tokens (colors, type, spacing, radius,
  elevation, AI tokens) and fonts. Link `styles.css` to inherit everything.
- `components/` — reusable React primitives (`core/`) and the AI extension
  components (`ai/`, `copilot/`, `voice/`). Each has a `.d.ts` (props) and a
  `.prompt.md` (what/when + usage example) — read those before using a component.
- `guidelines/` — foundation specimen cards.
- `ui_kits/consumer/` and `ui_kits/merchant/` — full interactive screen
  recreations showing the components in real Paytm context.
- `assets/` — the Paytm logo and icon PNGs.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets
out and produce static/standalone HTML for the user to view — the UI kits show
the self-contained pattern (inline the component source so the file runs anywhere).
If working on production code, copy assets and follow the rules here to design
natively in the Paytm AI language.

Core rules to honour: flat white cards with a 1px hairline border (not blurred
shadows); the Paytm blue family with cyan `#00BAF2` / navy `#002970`; Inter type;
pill buttons; and the AI restraint — introduce AI with the sparkle mark, always
show a confidence indicator, and use the cyan→blue→navy sheen gradient ONLY on the
AI avatar, Copilot FAB and voice orb. No generic AI-SaaS neon, no chat clones.

If the user invokes this skill without other guidance, ask what they want to build
or design, ask a few focused questions, then act as an expert Paytm designer who
outputs HTML artifacts *or* production code depending on the need.
