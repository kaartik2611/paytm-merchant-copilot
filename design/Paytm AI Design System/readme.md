# Paytm AI Design System

A reusable **AI Design Extension System** for the Paytm ecosystem — a set of
foundations and components that make AI capabilities feel like a native evolution
of the existing Paytm experience, not a bolt-on. The goal: a user should never
feel they have left Paytm when they touch an AI surface.

It is designed to work across **Paytm Consumer App, UPI flows, Payments, Wallet,
Paytm Business and the Merchant Dashboard**, for both consumers and merchants.

> **Provenance & scope.** Foundations were extracted from the attached Figma file
> **"paytm (Community).fig"** (a community design reference; Page-1, 16 frames —
> home, scanner, UPI transfer, account balance, personal loan, keyboards, etc.).
> Colors, type, spacing, radii, elevation, card and list patterns and the logo
> were read from that file. The **new AI components are original work** built in
> the same visual language. Paytm is a trademark of its owner; this system is a
> design exercise built on a community reference and should not be shipped as
> official Paytm branding without authorization.

---

## Design principles (every AI surface must feel…)

- **Fast** — minimal friction, clear single actions, lightweight interactions.
- **Trustworthy** — transparent reasoning, explainable recommendations, a visible
  confidence read-out on every AI output.
- **Human** — friendly, regional-friendly language; helpful guidance, never jargon.
- **Native** — matches Paytm's current visual language. No generic AI-SaaS
  aesthetics, no chat-app clones, no futuristic neon. One restrained sheen
  gradient is the only "AI flourish".

---

## Content fundamentals (voice & tone)

How Paytm writes, distilled from the source screens ("UPI Money Transfer",
"Get upto ₹60,000 instant credit at ZERO Fee", "1 Refer = FLAT ₹100", "Activate",
"Apply Now", "Check balance"):

- **Direct & action-led.** Labels are short imperatives — *Activate, Apply Now,
  Get Now, Invest Now, View More, Check balance*. Buttons say the action, not "OK".
- **Second person, warm.** Speak to "you" / "your money". The AI greets by name
  ("Hi Sahil 👋"). Friendly but never cutesy.
- **Benefit-first, specific numbers.** Lead with the outcome and a real figure —
  *"Earn ~₹375 / year"*, *"Save ~₹450 / month"*, *"reported 14 times this week"*.
  Avoid vague phrasing ("suspicious activity"); say what and how much.
- **Title Case for titles, Sentence case for body.** Section titles are bold and
  short ("Recharge & Bill Payments"). ALL-CAPS only for micro trust labels
  ("100% SECURE PAYMENTS").
- **₹ everywhere**, with grouped Indian digits (₹2,48,500). Use tabular figures.
- **Emoji:** sparingly, only conversational (a single 👋 in chat). Never in
  product chrome, cards, or labels.
- **AI transparency copy:** always explain *why* in plain language and name the
  basis ("Based on your last 6 months of activity"). Offer an out ("Not now",
  "It's safe", "Proceed anyway") — the user is always in control.

---

## Visual foundations

**Color.** The spine is the Paytm blue family, anchored on the authentic
wordmark: signature **cyan `#00BAF2`** and **navy `#002970`**, reconciled with the
working UI blues measured from the file — accent **`#3199E4`**, header bottom
**`#2480D6`**, dark navy **`#0E467A`**, deep navy **`#132256`**, periwinkle
**`#577FCB`**, pale sky **`#B0CFEB`**. Neutrals are a cool ink ramp on a near-white
page (`#F5F7FA`). Semantic: success `#1F8A4C`, warning `#E8990F`, danger `#E75555`,
info `#2480D6`, each with a soft tint. See `tokens/colors.css`.

**Type.** **Inter** across the product (the file uses only Inter, weights 400/500/
600/700). Medium (500) carries body and list rows; Bold (700) carries section and
screen titles. Mobile-first scale: 10 / 12 / 13 / 15 / 16 / 20 / 24 / 32px.
See `tokens/typography.css`.

**Spacing.** Tight ~4px grid (2/4/8/12/16/20/24/32…). Mobile gutter ≈14px, card
padding 16px. See `tokens/spacing.css`.

**Radius.** 5px chips/inner tiles · **10px the default card** · 14px large AI
cards · 20px bottom sheets · pill (999) for buttons and tags.

**Elevation.** The signature is a **1px hairline** — `box-shadow: 0 0 0 1px
rgba(0,0,0,.1)` — not a blurred drop shadow; that's what gives Paytm cards their
flat, crisp look. Real blur is reserved for floating UI: the Copilot FAB and voice
orb use a **blue-tinted** shadow, and sheets/popovers use `elev-2/3`.

**Cards.** White, 10px radius, hairline border. Section title (13/bold) top-left,
content below. List rows separated by `rgba(0,0,0,.08)` dividers, a leading icon
circle, label, and a trailing chevron or blue action link.

**Backgrounds.** Flat white surfaces on a near-white page. **No gradient
backgrounds** anywhere except the app-bar header gradient (`#98B9D8 → #2480D6`,
top→bottom) and the single AI sheen. No textures, no patterns, no full-bleed
imagery in chrome.

**Buttons & states.** Pill buttons. Hover = one step darker (primary →
`#2480D6`) or a faint blue wash (secondary/ghost). Press = `scale(0.97)`. Focus =
3px blue ring. Disabled = 45% opacity. Quick & calm — `140–320ms`, standard
ease; no bounces on functional UI.

**Motion.** Fades and short slides. The only looping animation is the voice orb
(slow breathe / pulse rings), and it honours `prefers-reduced-motion`.

**The AI identity.** AI surfaces sit on a faint blue wash (`--ai-surface`
`#F4F9FE`), are introduced by the **sparkle mark** (`AIAvatar`), and always show
a confidence read-out. The **one sanctioned gradient** — cyan→blue→navy
(`--ai-sheen`) — appears only on the AIAvatar, the Copilot FAB and the voice orb.
Everything else stays in flat brand blue. This is what keeps it "Paytm with AI"
rather than a generic AI product.

---

## Iconography

- **System:** clean **line icons in the Lucide style** — 24×24, ~2px stroke,
  round caps — matching the thin navy glyphs in the source file (its search /
  message / book icons). Shipped as the `Icon` component (`components/core/Icon.jsx`)
  with a curated set (sparkles, shield-check/alert, trending-up/down, wallet,
  indian-rupee, scan, mic, send, headset, package, …). Inherits `currentColor`.
  > Substitution flag: the source file's per-feature service icons are colorful
  > raster PNGs, not a reusable line set, so the UI glyph system uses Lucide-style
  > strokes (the closest match to Paytm's own thin-stroke icons). Consumers can
  > also pull Lucide from CDN. Swap in official Paytm icons when available.
- **Service icons:** the original colorful PNG service icons (wallet, mobile,
  card, flight, insurance, QR…) are copied into `assets/` and used in the UI kits.
- **The logo** (`assets/paytm-logo.png`) is the authentic wordmark — navy "Pay" +
  cyan "tm". On the gradient header it's knocked out to white.
- **Emoji / unicode:** not used as icons. A lone conversational emoji (👋) may
  appear in chat copy only. The ₹ glyph is typographic, not an icon.

---

## Index / manifest

**Root**
- `styles.css` — the single entry point consumers link (`@import`s only).
- `readme.md` — this guide. · `SKILL.md` — Agent-Skill wrapper.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`
(spacing · radius · elevation · motion), `ai.css` (AI surfaces, confidence,
severity, the sheen), `base.css` (reset + helpers).

**`guidelines/`** — foundation specimen cards shown in the Design System tab:
color (brand / tints / neutrals / semantic / AI), type (scale / weights),
spacing (scale / radius / elevation), brand (logo & app bar / card & list patterns).

**`components/core/`** — `Button`, `Badge`, `Chip`, `IconCircle`, `Avatar`,
`SectionHeader`, `Icon`.

**`components/ai/`** — `AIInsightCard`, `AIRecommendationCard`, `AIRiskAlert`,
`AIExplainabilityPanel`, `AIActionCard`, `ConfidenceMeter`, `AIAvatar`.

**`components/copilot/`** — `CopilotChat` (mobile sheet + web panel).

**`components/voice/`** — `VoiceAssistant` (idle / listening / processing /
responding; consumer + merchant).

**`ui_kits/consumer/`** — Paytm consumer home + Copilot sheet + fraud-flagged
payment flow (interactive phone).

**`ui_kits/merchant/`** — Paytm for Business web dashboard + Copilot panel + voice
(interactive browser).

**`assets/`** — `paytm-logo.png` and service / UI icon PNGs from the source file.

### Using the components
In `@dsCard` HTML, load the compiled bundle and read components off the namespace:
```html
<script src="../../_ds_bundle.js"></script>
<script type="text/babel">
  const { AIInsightCard, CopilotChat } = window.PaytmAIDesignSystem_ea0928;
</script>
```
The UI kits instead **inline** the component source so they run as standalone,
interactive HTML anywhere (the bundle only serves inside the Design System tab).
