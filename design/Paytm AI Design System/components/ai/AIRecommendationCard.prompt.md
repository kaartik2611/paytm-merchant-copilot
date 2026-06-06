Suggested-action card — a benefit-led recommendation (save money, improve cash flow, increase sales, optimize inventory) with projected impact and accept / dismiss.

```jsx
<AIRecommendationCard
  icon="piggy-bank"
  iconBg="var(--success-tint)" iconColor="var(--success)"
  title="Move ₹5,000 to a Fixed Deposit"
  body="Your balance has stayed above ₹20,000 for 3 months."
  impact="Earn ~₹375 / year"
  confidence="medium"
  acceptLabel="Open FD"
  onAccept={...} onDismiss={...}
/>
```

- Lead with the benefit, not the product. `impact` is the green outcome pill.
- Tint the icon to the category (save = success/green, growth = cyan, ops = warning/amber).
