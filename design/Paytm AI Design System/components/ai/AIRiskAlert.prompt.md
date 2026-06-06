Risk / fraud alert — warns about a scam, unusual activity or revenue risk with a severity level, confidence score and clear next actions.

```jsx
<AIRiskAlert
  severity="high"          // critical | high | medium | low → tint + icon
  title="This looks like a scam request"
  body="This payee was reported 14 times this week."
  confidence="high"
  primaryLabel="Block & report"
  secondaryLabel="Proceed anyway"
  onPrimary={...} onSecondary={...}
/>
```

- The tint scales with severity — never alarmist red below `high`. The primary button auto-styles danger for high+.
- Keep the body human and specific ("reported 14 times"), never vague ("suspicious activity detected").
