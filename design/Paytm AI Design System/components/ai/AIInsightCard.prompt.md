Generated insight card — surfaces a spending / usage / revenue / trend finding with a headline metric, optional delta, mini sparkline, confidence and a "Why this?" link.

```jsx
<AIInsightCard
  title="Food spends are up this month"
  value="₹8,420"
  delta={{ dir: "up", text: "18% vs last month" }}
  trend={[5, 7, 6, 9, 8, 12, 14]}
  category="insight"   // insight | save | growth | risk → left accent rail
  confidence="high"    // high | medium | low
  onWhy={() => openExplain()}
/>
```

- `value` is pre-formatted (you format the ₹). `trend` renders a bar sparkline with the peak highlighted.
- Always pair the `onWhy` link with an `AIExplainabilityPanel` so the insight stays transparent.
