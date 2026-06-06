Confidence indicator — shows how sure the model is. Two styles: a thin track or 5 signal-bars.

```jsx
<ConfidenceMeter level="high" variant="bars" />        // high | medium | low
<ConfidenceMeter value={82} variant="track" />          // explicit 0–100
```

- Every AI card carries one — it's core to the "trustworthy / transparent" principle. `bars` reads compactly in card footers; `track` suits detail views.
