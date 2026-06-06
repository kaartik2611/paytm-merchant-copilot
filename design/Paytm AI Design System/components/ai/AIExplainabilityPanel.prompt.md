Explainability panel — the transparent "why" behind a recommendation or alert: a plain-language reason, weighted supporting factors and a provenance line.

```jsx
<AIExplainabilityPanel
  reason="We flagged this because the payee is new and the amount is unusual."
  factors={[
    { name: "Payee reported by others", weight: 88 },
    { name: "First time paying this number", weight: 64 },
  ]}
  confidenceLabel="Based on your last 6 months of activity"
/>
```

- `weight` (0–100) drives each factor bar. Order factors strongest-first.
- Pair it with the card it explains (open it from an `onWhy` / "Why this?" link).
