Decision actions — a set of clear choices in response to AI output (block / proceed / contact support / accept recommendation).

```jsx
<AIActionCard actions={[
  { title: "Block this transaction", sub: "Recommended", icon: "shield-alert", tone: "danger" },
  { title: "Proceed anyway", icon: "arrow-right" },
  { title: "Talk to Paytm support", sub: "Get help in 2 mins", icon: "headset", tone: "primary" },
]} />
```

- One `tone:"primary"` (filled blue) max; `tone:"danger"` tints red on hover. Pass `row` to lay actions side-by-side.
